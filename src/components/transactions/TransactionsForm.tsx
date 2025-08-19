// components/transactions/TransactionsForm.tsx
import type { RootState } from "../../store/store";
import { useSelector } from "react-redux";

interface TransactionsFormProps {
  formData: {
    date: string;
    type_id: string;
    category_id: string;
    subcategory_id: string;
    source_id: string;
    destination_source_id: string;
    amount: string;
    notes: string;
  };
  editId: string | null;
  isTransfer: boolean;
  darkMode: boolean;
  selectedTypeName: string;
  onFormChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: () => void;
  onCancelEdit: () => void;
}

export const TransactionsForm = ({
  formData,
  editId,
  isTransfer,
  darkMode,
  onFormChange,
  onSubmit,
  onCancelEdit,
}: TransactionsFormProps) => {
  const { categories, subCategories } = useSelector(
    (state: RootState) => state.categories
  );
  const { types: transactionTypes } = useSelector(
    (state: RootState) => state.transactionTypes
  );
  const { sources } = useSelector((state: RootState) => state.sources);

  return (
    <div
      className={`p-6 rounded shadow mb-6 ${
        darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h2 className="text-xl font-semibold mb-4">
        {editId ? "Edit Transaction" : "Add Transaction"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date */}
        <input
          type="date"
          name="date"
          className={`border p-2 rounded w-full ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600 placeholder-gray-300"
              : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
          }`}
          value={formData.date}
          onChange={onFormChange}
        />

        {/* Type */}
        <select
          name="type_id"
          className={`border p-2 rounded w-full ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600 placeholder-gray-300"
              : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
          }`}
          value={formData.type_id}
          onChange={onFormChange}
        >
          <option value="">Select Type</option>
          {transactionTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        {/* Category & Subcategory only if not transfer */}
        {!isTransfer && (
          <>
            <select
              name="category_id"
              className={`border p-2 rounded w-full ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600 placeholder-gray-300"
                  : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
              }`}
              value={formData.category_id}
              onChange={onFormChange}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              name="subcategory_id"
              className={`border p-2 rounded w-full ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600 placeholder-gray-300"
                  : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
              }`}
              value={formData.subcategory_id}
              onChange={onFormChange}
            >
              <option value="">Select Subcategory</option>
              {subCategories
                .filter((s) => s.category_id === formData.category_id)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
          </>
        )}

        {/* Source */}
        <select
          name="source_id"
          className={`border p-2 rounded w-full ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600 placeholder-gray-300"
              : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
          }`}
          value={formData.source_id}
          onChange={onFormChange}
        >
          <option value="">Select Source</option>
          {sources.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Destination - only for transfer */}
        {isTransfer && (
          <select
            name="destination_source_id"
            className={`border p-2 rounded w-full ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600 placeholder-gray-300"
                : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
            }`}
            value={formData.destination_source_id}
            onChange={onFormChange}
          >
            <option value="">Select Destination</option>
            {sources
              .filter((s) => s.id !== formData.source_id)
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
          </select>
        )}

        {/* Amount */}
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          className={`border p-2 rounded w-full ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600 placeholder-gray-300"
              : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
          }`}
          value={formData.amount}
          onChange={onFormChange}
        />

        {/* Notes */}
        <input
          type="text"
          name="notes"
          placeholder="Notes"
          className={`border p-2 rounded w-full md:col-span-2 ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600 placeholder-gray-300"
              : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
          }`}
          value={formData.notes}
          onChange={onFormChange}
        />

        {/* Submit */}
        <div className="flex gap-2 md:col-span-1">
          <button
            onClick={onSubmit}
            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-4 py-2 rounded w-full"
          >
            {editId ? "Update" : "Add"}
          </button>
          {editId && (
            <button
              onClick={onCancelEdit}
              className="bg-gray-500 hover:bg-gray-600 transition-colors text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
