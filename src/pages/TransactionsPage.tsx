import { useState } from "react";
import { Toast } from "../components/shared/Toast";
import { TransactionFormModal } from "../components/transactions/TransactionFormModal";
import { TransactionsTable } from "../components/transactions/TransactionsTable";
import { useTransactions } from "../hooks/useTransactions";
import type { Transaction } from "../store/features/transactionsSlice";
import { Plus } from "react-feather";

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

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } min-h-screen p-6`}
    >
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage("")}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <button
          onClick={handleAddClick}
          className={`group flex items-center gap-2 px-4 py-2 rounded-xl shadow-md transition-all
    ${
      darkMode
        ? "bg-gray-800 hover:bg-gray-700 text-white"
        : "bg-blue-600 hover:bg-blue-700 text-white"
    }`}
        >
          <Plus className="h-5 w-5 transition-transform group-hover:rotate-90 group-hover:scale-110" />
          <span className="hidden md:inline font-medium">Add Transaction</span>
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
        isLoading={isLoading}
      />
      {ConfirmationModalComponent}
    </div>
  );
};
