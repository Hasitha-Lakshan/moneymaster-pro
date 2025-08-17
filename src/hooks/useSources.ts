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

export interface SourceFormData {
  name: string;
  type:
    | "Bank Account"
    | "Credit Card"
    | "Cash"
    | "Digital Wallet"
    | "Other"
    | "Investment";
  currency: string;
  initial_balance?: number;
  notes?: string;
  credit_limit?: number;
  interest_rate?: number;
  billing_cycle_start?: number;
}

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
  });

  const { requestConfirmation, ConfirmationModalComponent } = useConfirmation();

  // Fetch sources on mount
  useEffect(() => {
    dispatch(fetchSources());
  }, [dispatch]);

  // Handlers
  const handleAddClick = () => {
    setEditingSourceId(null);
    setFormData({
      name: "",
      type: "Bank Account",
      currency: "USD",
      initial_balance: 0,
      notes: "",
    });
    setShowForm(true);
  };

  const handleEditClick = (source: Source) => {
    setEditingSourceId(source.id);
    setFormData({
      name: source.name,
      type: source.type,
      currency: source.currency,
      initial_balance: source.initial_balance,
      notes: source.notes ?? "",
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (data: SourceFormData) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not logged in");

      // Ensure initial_balance is a number and set current_balance for new sources
      const safeData = {
        ...data,
        initial_balance: data.initial_balance ?? 0,
        current_balance: data.initial_balance ?? 0,
      };

      if (editingSourceId) {
        // ------------------------
        // UPDATE EXISTING SOURCE
        // ------------------------
        const { error } = await supabase
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

        if (error) throw error;

        // Map to Redux type
        const updatedSource: Source = {
          id: editingSourceId,
          name: safeData.name,
          type: safeData.type,
          currency: safeData.currency,
          balance: safeData.initial_balance, // keep balance as-is, do not overwrite current_balance
          initial_balance: safeData.initial_balance,
          notes: safeData.notes,
          credit_limit: data.credit_limit,
          interest_rate: data.interest_rate,
          billing_cycle_start: data.billing_cycle_start,
          available_credit:
            data.type === "Credit Card"
              ? data.credit_limit! - (safeData.initial_balance ?? 0)
              : undefined,
        };

        dispatch(updateSource(updatedSource));
        toast.success("Source updated successfully!");
      } else {
        // ------------------------
        // ADD NEW SOURCE
        // ------------------------
        const { data: newSource, error } = await supabase
          .from("sources")
          .insert([{ ...safeData, created_by: user.id }])
          .select(
            `
          *,
          credit_card_details (
            credit_limit,
            interest_rate,
            billing_cycle_start
          )
        `
          )
          .single();

        if (error) throw error;

        const cc = newSource.credit_card_details ?? null;

        const mappedSource: Source = {
          id: newSource.id,
          name: newSource.name,
          type: newSource.type,
          currency: newSource.currency,
          balance: Number(
            newSource.current_balance ?? newSource.initial_balance ?? 0
          ),
          initial_balance: Number(newSource.initial_balance ?? 0),
          credit_limit: cc ? Number(cc.credit_limit) : data.credit_limit,
          interest_rate: cc ? Number(cc.interest_rate) : data.interest_rate,
          billing_cycle_start:
            cc?.billing_cycle_start ?? data.billing_cycle_start,
          available_credit:
            newSource.type === "Credit Card"
              ? cc
                ? Number(cc.credit_limit) -
                  Number(newSource.current_balance ?? 0)
                : Number(data.credit_limit ?? 0) -
                  Number(newSource.current_balance ?? 0)
              : undefined,
          notes: newSource.notes,
        };

        dispatch(addSource(mappedSource));
        toast.success("Source added successfully!");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        toast.error(err.message || "Failed to save source");
      } else {
        console.error(err);
        toast.error("An unexpected error occurred while saving the source");
      }
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
