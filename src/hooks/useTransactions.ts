// hooks/useTransactions.ts
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import {
  createTransaction,
  fetchTransactions,
  updateTransaction,
  removeTransaction,
  type Transaction,
} from "../store/features/transactionsSlice";
import { fetchCategories } from "../store/features/categoriesSlice";
import { fetchTransactionTypes } from "../store/features/transactionTypesSlice";
import { fetchSources } from "../store/features/sourcesSlice";
import { useConfirmation } from "./useConfirmation";

export const useTransactions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { requestConfirmation, ConfirmationModalComponent } = useConfirmation();

  const { items: transactions, loading: txnLoading } = useSelector(
    (state: RootState) => state.transactions
  );
  const { types: transactionTypes, loading: typeLoading } = useSelector(
    (state: RootState) => state.transactionTypes
  );
  const { loading: catLoading } = useSelector(
    (state: RootState) => state.categories
  );
  const { loading: sourcesLoading } = useSelector(
    (state: RootState) => state.sources
  );
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  // Local state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    type_id: "",
    category_id: "",
    subcategory_id: "",
    source_id: "",
    destination_source_id: "",
    amount: "",
    notes: "",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string>("");

  // Fetch all data on mount
  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchCategories());
    dispatch(fetchTransactionTypes());
    dispatch(fetchSources());
  }, [dispatch]);

  const selectedTypeName =
    transactionTypes
      .find((t) => t.id.toString() === formData.type_id)
      ?.name.toLowerCase() || "";

  const isTransfer = selectedTypeName === "transfer";

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset subcategory when category changes
      ...(name === "category_id" ? { subcategory_id: "" } : {}),
    }));
  };

  // Add / Update transaction
  const handleSubmit = () => {
    if (!formData.type_id || !formData.amount) {
      setToastMessage("Type and amount are required.");
      return;
    }

    if (
      isTransfer &&
      (!formData.destination_source_id ||
        formData.destination_source_id === formData.source_id)
    ) {
      setToastMessage("Please select a valid destination for the transfer.");
      return;
    }

    const payload: Omit<Transaction, "id"> = {
      date: formData.date,
      type_id: formData.type_id,
      category_id: isTransfer ? undefined : formData.category_id,
      subcategory_id: isTransfer
        ? undefined
        : formData.subcategory_id || undefined,
      source_id: formData.source_id || undefined,
      destination_source_id: formData.destination_source_id || undefined,
      amount: Number(formData.amount),
      notes: formData.notes,
    };

    if (editId) {
      dispatch(updateTransaction({ id: editId, ...payload }));
      setToastMessage("Transaction updated successfully!");
      setEditId(null);
    } else {
      dispatch(createTransaction(payload));
      setToastMessage("Transaction added successfully!");
    }

    resetForm();
  };

  const handleEdit = (txn: Transaction) => {
    const txnTypeName =
      transactionTypes
        .find((t) => t.id.toString() === txn.type_id)
        ?.name.toLowerCase() || "";
    setEditId(txn.id);
    setFormData({
      date: txn.date,
      type_id: txn.type_id || "",
      category_id: txnTypeName === "transfer" ? "" : txn.category_id || "",
      subcategory_id:
        txnTypeName === "transfer" ? "" : txn.subcategory_id || "",
      source_id: txn.source_id || "",
      destination_source_id: txn.destination_source_id || "",
      amount: txn.amount.toString(),
      notes: txn.notes || "",
    });
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      type_id: "",
      category_id: "",
      subcategory_id: "",
      source_id: "",
      destination_source_id: "",
      amount: "",
      notes: "",
    });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    resetForm();
  };

  // --- Hook-based delete ---
  const handleDeleteTransaction = async (txnId: string) => {
    const confirmed = await requestConfirmation({
      message:
        "Are you sure you want to delete this transaction? This action cannot be undone.",
    });
    if (!confirmed) return;

    dispatch(removeTransaction(txnId));
  };

  const isLoading = txnLoading || catLoading || typeLoading || sourcesLoading;

  return {
    transactions,
    formData,
    editId,
    toastMessage,
    setToastMessage,
    isTransfer,
    selectedTypeName,
    isLoading,
    darkMode,
    handleFormChange,
    handleSubmit,
    handleEdit,
    handleCancelEdit,
    resetForm,
    handleDeleteTransaction,
    ConfirmationModalComponent,
  };
};
