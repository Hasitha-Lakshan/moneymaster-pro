// components/transactions/TransactionsTable.tsx
import { Edit, Trash2 } from "react-feather";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import {
  removeTransaction,
  type Transaction,
} from "../../store/features/transactionsSlice";
import type { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";

interface TransactionsTableProps {
  transactions: Transaction[];
  darkMode: boolean;
  onEdit: (txn: Transaction) => void;
  isLoading: boolean;
}

export const TransactionsTable = ({
  transactions,
  darkMode,
  onEdit,
  isLoading,
}: TransactionsTableProps) => {
  const dispatch = useDispatch<AppDispatch>();
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="overflow-x-auto">
      <table
        className={`w-full border-collapse shadow rounded ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <thead>
          <tr className={`${darkMode ? "bg-gray-800" : "bg-gray-200"}`}>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Subcategory</th>
            <th className="p-3 text-left">Source</th>
            <th className="p-3 text-left">Destination</th>
            <th className="p-3 text-left">Amount</th>
            <th className="p-3 text-left">Notes</th>
            <th className="p-3 text-left">Actions</th>
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
                className={`border-t ${
                  darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
                }`}
              >
                <td className="p-2">{txn.date}</td>
                <td className="p-2">{isTxnTransfer ? "Transfer" : typeName}</td>
                <td className="p-2">
                  {categories.find((c) => c.id === txn.category_id)?.name ||
                    "-"}
                </td>
                <td className="p-2">
                  {subCategories.find((s) => s.id === txn.subcategory_id)
                    ?.name || "-"}
                </td>
                <td className="p-2">
                  {sources.find((s) => s.id === txn.source_id)?.name}
                </td>
                <td className="p-2">
                  {txn.destination_source_id
                    ? sources.find((s) => s.id === txn.destination_source_id)
                        ?.name
                    : "-"}
                </td>
                <td className="p-2">{txn.amount.toFixed(2)}</td>
                <td className="p-2">{txn.notes || "-"}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => onEdit(txn)}
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => dispatch(removeTransaction(txn.id))}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
