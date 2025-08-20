import { useState } from "react";
import { Toast } from "../components/shared/Toast";
import { TransactionFormModal } from "../components/transactions/TransactionFormModal";
import { TransactionsTable } from "../components/transactions/TransactionsTable";
import { useTransactions } from "../hooks/useTransactions";
import type { Transaction } from "../store/features/transactionsSlice";
import { Plus } from "react-feather";
import { LoadingSpinner } from "../components/shared/LoadingSpinner";

export const TransactionsPage = () => {
  const {
    transactions,
    formData,
    editId,
    toastMessage,
    setToastMessage,
    isTransfer,
    isLoading,
    darkMode,
    handleFormChange,
    handleSubmit,
    handleEdit,
    handleDeleteTransaction,
    handleCancelEdit,
    resetForm,
    ConfirmationModalComponent,
  } = useTransactions();

  const [showModal, setShowModal] = useState(false);

  const handleFormDataUpdate = (newFormData: typeof formData) => {
    // Update all form fields at once
    Object.entries(newFormData).forEach(([field, value]) => {
      handleFormChange({
        target: {
          name: field as keyof typeof formData,
          value: value,
        },
      } as React.ChangeEvent<HTMLInputElement>);
    });
  };

  const handleModalSubmit = (data: typeof formData) => {
    handleFormDataUpdate(data);
    handleSubmit();
    setShowModal(false);
  };

  const handleAddClick = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEditClick = (txn: Transaction) => {
    handleEdit(txn);
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-muted-foreground mt-4">
            Loading your transactions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-background text-foreground">
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage("")}
        />
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-card-foreground">
          Transactions
        </h1>
        <button
          onClick={handleAddClick}
          className="btn-primary px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
        >
          <Plus className="h-5 w-5 transition-transform group-hover:rotate-90 group-hover:scale-110" />
          <span>Add Transaction</span>
        </button>
      </div>

      <TransactionFormModal
        visible={showModal}
        darkMode={darkMode}
        formData={formData}
        isTransfer={isTransfer}
        editId={editId}
        onChange={handleFormDataUpdate}
        onCancel={() => {
          handleCancelEdit();
          setShowModal(false);
        }}
        onSubmit={handleModalSubmit}
      />

      <TransactionsTable
        handleDeleteTransaction={handleDeleteTransaction}
        transactions={transactions}
        darkMode={darkMode}
        onEdit={handleEditClick}
        isLoading={false} // Now handled in parent component
      />

      {ConfirmationModalComponent}
    </div>
  );
};
