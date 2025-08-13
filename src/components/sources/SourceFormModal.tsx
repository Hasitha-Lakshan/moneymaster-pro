import { useState, useEffect } from "react";

// Matches SourceFormData from useSources
export interface SourceFormData {
  name: string;
  type: "Bank Account" | "Credit Card" | "Cash" | "Digital Wallet" | "Other";
  currency: string;
  initial_balance?: number;
  notes?: string;
}

interface SourceFormModalProps {
  visible: boolean;
  darkMode: boolean;
  initialData: SourceFormData | null;
  onCancel: () => void;
  onSubmit: (data: SourceFormData) => void | Promise<void>; // allow async
}

export const SourceFormModal: React.FC<SourceFormModalProps> = ({
  visible,
  darkMode,
  initialData,
  onCancel,
  onSubmit,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [type, setType] = useState<SourceFormData["type"]>(
    initialData?.type || "Bank Account"
  );
  const [currency, setCurrency] = useState(initialData?.currency || "USD");
  const [initialBalance, setInitialBalance] = useState(
    initialData?.initial_balance?.toString() || ""
  );
  const [notes, setNotes] = useState(initialData?.notes || "");

  // Reset form when modal opens/closes
  useEffect(() => {
    setName(initialData?.name || "");
    setType(initialData?.type || "Bank Account");
    setCurrency(initialData?.currency || "USD");
    setInitialBalance(initialData?.initial_balance?.toString() || "");
    setNotes(initialData?.notes || "");
  }, [initialData, visible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData: SourceFormData = {
      name,
      type,
      currency,
      initial_balance: parseFloat(initialBalance || "0"),
      notes,
    };

    onSubmit(formData);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto`}
      >
        <h3
          className={`text-lg font-semibold mb-4 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {initialData ? "Edit Source" : "Add Source"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Source Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Chase Checking, Visa Card"
              className={`w-full px-3 py-2 border rounded-md ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
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
              Source Type *
            </label>
            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value as SourceFormData["type"])
              }
              className={`w-full px-3 py-2 border rounded-md ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              required
            >
              <option value="Bank Account">Bank Account</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Cash">Cash</option>
              <option value="Digital Wallet">Digital Wallet</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Currency */}
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Currency *
            </label>
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              placeholder="e.g., USD, LKR"
              className={`w-full px-3 py-2 border rounded-md ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
              required
            />
          </div>

          {/* Initial Balance */}
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Initial Balance
            </label>
            <input
              type="number"
              step="0.01"
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
              placeholder="1000.00"
              className={`w-full px-3 py-2 border rounded-md ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>

          {/* Notes */}
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes"
              className={`w-full px-3 py-2 border rounded-md ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className={`flex-1 px-4 py-2 border rounded-md transition-colors ${
                darkMode
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {initialData ? "Update" : "Add"} Source
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
