import React from "react";
import type { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { Plus, RefreshCw, XCircle, X } from "react-feather";

type FormInputElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;
interface TransactionFormData {
  date: string;
  type_id: string;
  category_id: string;
  subcategory_id: string;
  source_id: string;
  destination_source_id: string;
  amount: string;
  notes: string;
}

interface TransactionFormModalProps {
  visible: boolean;
  darkMode: boolean;
  formData: TransactionFormData;
  isTransfer: boolean;
  editId: string | null;
  onChange: (data: TransactionFormData) => void;
  onCancel: () => void;
  onSubmit: (data: TransactionFormData) => void;
}

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  visible,
  darkMode,
  formData,
  isTransfer,
  editId,
  onChange,
  onCancel,
  onSubmit,
}) => {
  const { categories, subCategories } = useSelector(
    (state: RootState) => state.categories
  );
  const { types: transactionTypes } = useSelector(
    (state: RootState) => state.transactionTypes
  );
  const { sources } = useSelector((state: RootState) => state.sources);

  if (!visible) return null;

  const handleInputChange = (e: React.ChangeEvent<FormInputElement>) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    // Reset subcategory when category changes
    if (name === "category_id") {
      updatedFormData.subcategory_id = "";
    }

    // Update transfer fields when type changes
    if (name === "type_id") {
      const typeName = transactionTypes
        .find((t) => t.id === Number(value))
        ?.name.toLowerCase();
      if (typeName === "transfer") {
        updatedFormData.category_id = "";
        updatedFormData.subcategory_id = "";
      }
    }

    onChange(updatedFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div
        className={`${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        } rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl transition-all duration-200`}
      >
        {/* Header with Title + Close Button */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {editId ? "Edit Transaction" : "Add Transaction"}
          </h3>
          <button
            onClick={onCancel}
            className={`p-1 rounded ${
              darkMode
                ? "text-gray-400 hover:text-white"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                required
              />
            </div>

            {/* Type */}
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Type *
              </label>
              <select
                name="type_id"
                value={formData.type_id}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                required
              >
                <option value="">Select Type</option>
                {transactionTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category & Subcategory */}
            {!isTransfer && (
              <>
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Category *
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    required={!isTransfer}
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Subcategory
                  </label>
                  <select
                    name="subcategory_id"
                    value={formData.subcategory_id}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    disabled={!formData.category_id}
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
                </div>
              </>
            )}

            {/* Source */}
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Source *
              </label>
              <select
                name="source_id"
                value={formData.source_id}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                required
              >
                <option value="">Select Source</option>
                {sources.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination */}
            {isTransfer && (
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Destination *
                </label>
                <select
                  name="destination_source_id"
                  value={formData.destination_source_id}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  required={isTransfer}
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
              </div>
            )}

            {/* Amount */}
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Amount *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-md ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
                required
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Optional notes"
                className={`w-full px-3 py-2 border rounded-md ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
                rows={3}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all duration-200
      ${
        darkMode
          ? "border border-gray-600 text-gray-300 hover:bg-gray-700 active:scale-95"
          : "border border-gray-300 text-gray-700 hover:bg-gray-100 active:scale-95"
      }`}
            >
              <XCircle className="w-4 h-4" />
              <span>Cancel</span>
            </button>

            <button
              type="submit"
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium shadow-md transition-all duration-200
      ${
        darkMode
          ? "bg-blue-600 text-white hover:bg-blue-500 active:scale-95"
          : "bg-blue-500 text-white hover:bg-blue-600 active:scale-95"
      }`}
            >
              {editId ? (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Update</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
