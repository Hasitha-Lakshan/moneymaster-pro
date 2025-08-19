// components/transactions/TransactionsTable.tsx
import { Edit, Edit2, Trash2 } from "react-feather";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import type { Transaction } from "../../store/features/transactionsSlice";
import type { RootState } from "../../store/store";
import { useSelector } from "react-redux";

interface TransactionsTableProps {
  transactions: Transaction[];
  darkMode: boolean;
  onEdit: (txn: Transaction) => void;
  handleDeleteTransaction: (txnId: string) => void;
  isLoading: boolean;
}

export const TransactionsTable = ({
  transactions,
  darkMode,
  onEdit,
  handleDeleteTransaction,
  isLoading,
}: TransactionsTableProps) => {
  const transactionTypes = useSelector(
    (state: RootState) => state.transactionTypes.types
  );
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const subCategories = useSelector(
    (state: RootState) => state.categories.subCategories
  );
  const sources = useSelector((state: RootState) => state.sources.sources);

  if (isLoading) return <LoadingSpinner />;

  const getAmountStyle = (txn: Transaction) => {
    if (txn.destination_source_id) return "text-blue-500"; // transfer
    const typeName =
      transactionTypes.find((t) => t.id.toString() === txn.type_id)?.name || "";
    return typeName.toLowerCase().includes("income")
      ? "text-green-500 font-semibold"
      : "text-red-500 font-semibold";
  };

  return (
    <div>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table
          className={`w-full border-collapse shadow-md rounded-xl overflow-hidden ${
            darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
          }`}
        >
          <thead>
            <tr className={`${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
              <th className="p-3 text-left text-sm font-semibold">Date</th>
              <th className="p-3 text-left text-sm font-semibold">Type</th>
              <th className="p-3 text-left text-sm font-semibold">Category</th>
              <th className="p-3 text-left text-sm font-semibold">
                Subcategory
              </th>
              <th className="p-3 text-left text-sm font-semibold">Source</th>
              {/* Only show Destination column if at least one transfer exists */}
              {transactions.some((txn) => txn.destination_source_id) && (
                <th className="p-3 text-left text-sm font-semibold">
                  Destination
                </th>
              )}
              <th className="p-3 text-left text-sm font-semibold">Amount</th>
              <th className="p-3 text-left text-sm font-semibold">Notes</th>
              <th className="p-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => {
              const typeName =
                transactionTypes.find((t) => t.id.toString() === txn.type_id)
                  ?.name || "-";
              const isTxnTransfer = !!txn.destination_source_id;

              return (
                <tr
                  key={txn.id}
                  className={`border-t transition-colors ${
                    darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="p-3 text-sm">{txn.date}</td>
                  <td className="p-3 text-sm">
                    {isTxnTransfer ? "Transfer" : typeName}
                  </td>
                  <td className="p-3 text-sm">
                    {categories.find((c) => c.id === txn.category_id)?.name ||
                      "-"}
                  </td>
                  <td className="p-3 text-sm">
                    {subCategories.find((s) => s.id === txn.subcategory_id)
                      ?.name || "-"}
                  </td>
                  <td className="p-3 text-sm">
                    {sources.find((s) => s.id === txn.source_id)?.name}
                  </td>

                  {/* Only render destination if transfer */}
                  {transactions.some((t) => t.destination_source_id) && (
                    <td className="p-3 text-sm">
                      {isTxnTransfer
                        ? sources.find(
                            (s) => s.id === txn.destination_source_id
                          )?.name
                        : "-"}
                    </td>
                  )}

                  <td className={`p-3 text-sm ${getAmountStyle(txn)}`}>
                    {txn.amount.toFixed(2)}
                  </td>
                  <td className="p-3 text-sm">{txn.notes || "-"}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => onEdit(txn)}
                      className="p-1.5 rounded-lg hover:bg-yellow-100 dark:hover:bg-gray-700 transition"
                    >
                      <Edit size={16} className="text-yellow-500" />
                    </button>
                    <button
                      onClick={() => handleDeleteTransaction(txn.id)}
                      className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-gray-700 transition"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="grid gap-4 md:hidden">
        {transactions.map((txn) => {
          const typeName =
            transactionTypes.find((t) => t.id.toString() === txn.type_id)
              ?.name || "-";
          const isTxnTransfer = !!txn.destination_source_id;

          return (
            <div
              key={txn.id}
              className={`p-4 rounded-lg border transition hover:shadow-md ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3
                    className={`text-base font-semibold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {isTxnTransfer ? "Transfer" : typeName}
                  </h3>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {txn.date}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(txn)}
                    className={`p-1 rounded ${
                      darkMode
                        ? "text-blue-400 hover:bg-gray-700"
                        : "text-blue-600 hover:bg-gray-100"
                    }`}
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTransaction(txn.id)}
                    className={`p-1 rounded ${
                      darkMode
                        ? "text-red-400 hover:bg-gray-700"
                        : "text-red-600 hover:bg-gray-100"
                    }`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Category
                  </span>
                  <span className="font-medium">
                    {categories.find((c) => c.id === txn.category_id)?.name ||
                      "-"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Subcategory
                  </span>
                  <span className="font-medium">
                    {subCategories.find((s) => s.id === txn.subcategory_id)
                      ?.name || "-"}
                  </span>
                </div>

                {/* Source */}
                <div className="flex justify-between">
                  <span
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Source
                  </span>
                  <span className="font-medium">
                    {sources.find((s) => s.id === txn.source_id)?.name}
                  </span>
                </div>

                {/* Destination → only for transfers */}
                {txn.destination_source_id && (
                  <div className="flex justify-between">
                    <span
                      className={`${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Destination
                    </span>
                    <span className="font-medium">
                      {
                        sources.find((s) => s.id === txn.destination_source_id)
                          ?.name
                      }
                    </span>
                  </div>
                )}

                <div className="flex justify-between border-t pt-2 mt-2">
                  <span
                    className={`font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Amount
                  </span>
                  <span
                    className={`text-lg font-bold ${
                      isTxnTransfer
                        ? "text-blue-500"
                        : typeName.toLowerCase().includes("income")
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {txn.amount.toFixed(2)}
                  </span>
                </div>

                {txn.notes && (
                  <p
                    className={`mt-2 text-xs italic ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {txn.notes}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
