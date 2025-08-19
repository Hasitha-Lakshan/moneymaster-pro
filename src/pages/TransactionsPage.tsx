// pages/TransactionsPage.tsx
import { Toast } from "../components/shared/Toast";
import { TransactionsForm } from "../components/transactions/TransactionsForm";
import { TransactionsTable } from "../components/transactions/TransactionsTable";
import { useTransactions } from "../hooks/useTransactions";

export const TransactionsPage = () => {
  const {
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
  } = useTransactions();

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

      <h1 className="text-3xl font-bold mb-6">Transactions</h1>

      <TransactionsForm
        formData={formData}
        editId={editId}
        isTransfer={isTransfer}
        darkMode={darkMode}
        selectedTypeName={selectedTypeName}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
        onCancelEdit={handleCancelEdit}
      />

      <TransactionsTable
        transactions={transactions}
        darkMode={darkMode}
        onEdit={handleEdit}
        isLoading={isLoading}
      />
    </div>
  );
};
