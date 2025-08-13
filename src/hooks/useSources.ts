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
  type: "Bank Account" | "Credit Card" | "Cash" | "Digital Wallet" | "Other";
  currency: string;
  initial_balance?: number;
  notes?: string;
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

      const safeData = {
        ...data,
        initial_balance: data.initial_balance ?? 0, // ensure number
      };

      if (editingSourceId) {
        // Update existing source
        const { error } = await supabase
          .from("sources")
          .update(safeData)
          .eq("id", editingSourceId)
          .eq("created_by", user.id);
        if (error) throw error;

        dispatch(updateSource({ ...safeData, id: editingSourceId }));
        toast.success("Source updated successfully!");
      } else {
        // Add new source
        const { data: newSource, error } = await supabase
          .from("sources")
          .insert([{ ...safeData, created_by: user.id }])
          .select()
          .single();
        if (error) throw error;

        dispatch(addSource(newSource));
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
