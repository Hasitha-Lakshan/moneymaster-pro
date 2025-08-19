import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-toastify";
import { useConfirmation } from "./useConfirmation";
import {
  addSource,
  updateSource,
  deleteSource,
  fetchSources,
  type Source,
} from "../store/features/sourcesSlice";
import type { SourceFormData } from "../types/sources";

export const useSources = () => {
  const dispatch = useDispatch<AppDispatch>();
  const sourcesSlice = useSelector((state: RootState) => state.sources);

  const [showForm, setShowForm] = useState(false);
  const [editingSourceId, setEditingSourceId] = useState<string | null>(null);
  const [formData, setFormData] = useState<SourceFormData>({
    name: "",
    type: "Bank Account",
    currency: "USD",
    initial_balance: 0,
    notes: "",
    credit_limit: 0,
    interest_rate: 0,
    billing_cycle_start: 1,
  });

  const { requestConfirmation, ConfirmationModalComponent } = useConfirmation();

  // Fetch sources on mount
  useEffect(() => {
    dispatch(fetchSources());
  }, [dispatch]);

  // -------------------------
  // Handlers
  // -------------------------
  const handleAddClick = () => {
    setEditingSourceId(null);
    setFormData({
      name: "",
      type: "Bank Account",
      currency: "USD",
      initial_balance: 0,
      notes: "",
      credit_limit: 0,
      interest_rate: 0,
      billing_cycle_start: 1,
    });
    setShowForm(true);
  };

  const handleEditClick = (source: Source) => {
    setEditingSourceId(source.id);
    // Populate all fields including credit card details
    setFormData({
      id: source.id,
      name: source.name,
      type: source.type,
      currency: source.currency,
      initial_balance: source.initial_balance,
      notes: source.notes ?? "",
      credit_limit: source.credit_limit,
      interest_rate: source.interest_rate,
      billing_cycle_start: source.billing_cycle_start,
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (data: SourceFormData) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not logged in");

      // Ensure numeric fields
      const safeData = {
        ...data,
        initial_balance: data.initial_balance ?? 0,
        current_balance: data.initial_balance ?? 0,
        credit_limit: data.credit_limit ?? 0,
        interest_rate: data.interest_rate ?? 0,
        billing_cycle_start: data.billing_cycle_start ?? 1,
      };

      if (editingSourceId) {
        // ------------------------
        // UPDATE EXISTING SOURCE
        // ------------------------
        const { error: updateSourceError } = await supabase
          .from("sources")
          .update({
            name: safeData.name,
            type: safeData.type,
            currency: safeData.currency,
            initial_balance: safeData.initial_balance,
            notes: safeData.notes,
          })
          .eq("id", editingSourceId)
          .eq("created_by", user.id);

        if (updateSourceError) throw updateSourceError;

        // Update credit card details if needed
        if (safeData.type === "Credit Card") {
          const { error: ccError } = await supabase
            .from("credit_card_details")
            .upsert({
              source_id: editingSourceId,
              credit_limit: safeData.credit_limit,
              interest_rate: safeData.interest_rate,
              billing_cycle_start: safeData.billing_cycle_start,
            });
          if (ccError) throw ccError;
        }

        const updatedSource: Source = {
          id: editingSourceId,
          name: safeData.name,
          type: safeData.type,
          currency: safeData.currency,
          balance: safeData.initial_balance,
          initial_balance: safeData.initial_balance,
          notes: safeData.notes,
          credit_limit: safeData.credit_limit,
          interest_rate: safeData.interest_rate,
          billing_cycle_start: safeData.billing_cycle_start,
          available_credit:
            safeData.type === "Credit Card"
              ? safeData.credit_limit - safeData.initial_balance
              : undefined,
        };

        dispatch(updateSource(updatedSource));
        toast.success("Source updated successfully!");
      } else {
        // ------------------------
        // ADD NEW SOURCE (atomic)
        // ------------------------

        // Step 1: Insert into 'sources' table (only valid columns)
        const sourceInsertData = {
          name: safeData.name,
          type: safeData.type,
          currency: safeData.currency,
          initial_balance: safeData.initial_balance,
          current_balance: safeData.current_balance,
          notes: safeData.notes,
          created_by: user.id,
        };

        const { data: newSource, error: insertSourceError } = await supabase
          .from("sources")
          .insert([sourceInsertData])
          .select("*")
          .single();

        if (insertSourceError || !newSource) throw insertSourceError;

        // Step 2: Insert credit card details if Credit Card
        if (safeData.type === "Credit Card") {
          const { error: ccInsertError } = await supabase
            .from("credit_card_details")
            .insert({
              source_id: newSource.id,
              credit_limit: safeData.credit_limit,
              interest_rate: safeData.interest_rate,
              billing_cycle_start: safeData.billing_cycle_start,
            });
          if (ccInsertError) {
            // Rollback source insert
            await supabase.from("sources").delete().eq("id", newSource.id);
            throw new Error(
              "Failed to insert credit card details. Source creation rolled back."
            );
          }
        }

        // Step 3: Fetch combined source with credit card details
        const { data: fetchedSource, error: fetchError } = await supabase
          .from("sources")
          .select(
            `*, credit_card_details (
              credit_limit,
              interest_rate,
              billing_cycle_start
            )`
          )
          .eq("id", newSource.id)
          .single();

        if (fetchError || !fetchedSource) throw fetchError;

        const cc = fetchedSource.credit_card_details ?? null;

        const mappedSource: Source = {
          id: fetchedSource.id,
          name: fetchedSource.name,
          type: fetchedSource.type,
          currency: fetchedSource.currency,
          balance: Number(
            fetchedSource.current_balance ?? fetchedSource.initial_balance ?? 0
          ),
          initial_balance: Number(fetchedSource.initial_balance ?? 0),
          credit_limit: cc ? Number(cc.credit_limit) : safeData.credit_limit,
          interest_rate: cc ? Number(cc.interest_rate) : safeData.interest_rate,
          billing_cycle_start:
            cc?.billing_cycle_start ?? safeData.billing_cycle_start,
          available_credit:
            fetchedSource.type === "Credit Card"
              ? cc
                ? Number(cc.credit_limit) -
                  Number(fetchedSource.current_balance ?? 0)
                : safeData.credit_limit -
                  Number(fetchedSource.current_balance ?? 0)
              : undefined,
          notes: fetchedSource.notes,
        };

        dispatch(addSource(mappedSource));
        toast.success("Source added successfully!");
      }
    } catch (err: unknown) {
      if (err instanceof Error)
        toast.error(err.message || "Failed to save source");
      else toast.error("An unexpected error occurred while saving the source");
    } finally {
      setShowForm(false);
      setEditingSourceId(null);
    }
  };

  const handleDeleteClick = async (source: Source) => {
    const confirmed = await requestConfirmation({
      title: "Confirm Delete",
      message: `Are you sure you want to delete "${source.name}"?`,
    });
    if (!confirmed) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not logged in");

      // Delete credit card details first if needed
      if (source.type === "Credit Card") {
        const { error: ccError } = await supabase
          .from("credit_card_details")
          .delete()
          .eq("source_id", source.id);
        if (ccError) throw ccError;
      }

      // Delete source
      const { error } = await supabase
        .from("sources")
        .delete()
        .eq("id", source.id)
        .eq("created_by", user.id);
      if (error) throw error;

      dispatch(deleteSource(source.id));
      toast.success("Source deleted successfully!");
    } catch (err: unknown) {
      if (err instanceof Error)
        toast.error(err.message || "Failed to delete source");
      else toast.error("An unexpected error occurred");
    }
  };

  return {
    sourcesSlice,
    showForm,
    setShowForm,
    editingSourceId,
    setEditingSourceId,
    formData,
    setFormData,
    handleAddClick,
    handleEditClick,
    handleFormSubmit,
    handleDeleteClick,
    ConfirmationModalComponent,
  };
};
