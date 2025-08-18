import React from "react";

// Matches new database schema for `sources`
export interface SourceFormData {
  name: string;
  type:
    | "Bank Account"
    | "Credit Card"
    | "Cash"
    | "Digital Wallet"
    | "Investment"
    | "Other";
  currency: string;
  initial_balance?: number;
  notes?: string;

  // Extra fields for Credit Card type
  credit_limit?: number;
  interest_rate?: number;
  billing_cycle_start?: number;
}

interface SourceFormModalProps {
  visible: boolean;
  darkMode: boolean;
  formData: SourceFormData; // fully controlled
  onChange: (data: SourceFormData) => void; // propagate changes back to parent
  onCancel: () => void;
  onSubmit: (data: SourceFormData) => void | Promise<void>;
}

export const SourceFormModal: React.FC<SourceFormModalProps> = ({
  visible,
  darkMode,
  formData,
  onChange,
  onCancel,
  onSubmit,
}) => {
  if (!visible) return null;

  const handleInputChange = (
    key: keyof SourceFormData,
    value: string | number
  ) => {
    onChange({ ...formData, [key]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert numeric fields
    const dataToSubmit: SourceFormData = {
      ...formData,
      initial_balance: Number(formData.initial_balance ?? 0),
      credit_limit: Number(formData.credit_limit ?? 0),
      interest_rate: Number(formData.interest_rate ?? 0),
      billing_cycle_start: Number(formData.billing_cycle_start ?? 1),
    };

    onSubmit(dataToSubmit);
  };

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
          {formData.name ? "Edit Source" : "Add Source"}
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
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
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
              value={formData.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
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
              <option value="Investment">Investment</option>
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
              value={formData.currency}
              onChange={(e) =>
                handleInputChange("currency", e.target.value.toUpperCase())
              }
              placeholder="USD"
              maxLength={3}
              className={`w-full px-3 py-2 border rounded-md uppercase ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
              required
            />
          </div>

          {/* Initial Balance */}
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
              value={formData.initial_balance ?? ""}
              onChange={(e) =>
                handleInputChange("initial_balance", e.target.value)
              }
              placeholder="1000.00"
              className={`w-full px-3 py-2 border rounded-md ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
              disabled={!!formData.initial_balance} // disable if it exists
            />
          </div>

          {/* Credit Card Fields */}
          {formData.type === "Credit Card" && (
            <>
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Credit Limit
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.credit_limit ?? ""}
                  onChange={(e) =>
                    handleInputChange("credit_limit", e.target.value)
                  }
                  placeholder="5000.00"
                  className={`w-full px-3 py-2 border rounded-md ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.interest_rate ?? ""}
                  onChange={(e) =>
                    handleInputChange("interest_rate", e.target.value)
                  }
                  placeholder="15.5"
                  className={`w-full px-3 py-2 border rounded-md ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Billing Cycle Start (Day of Month)
                </label>
                <input
                  type="number"
                  min={1}
                  max={31}
                  value={formData.billing_cycle_start ?? ""}
                  onChange={(e) =>
                    handleInputChange("billing_cycle_start", e.target.value)
                  }
                  placeholder="1"
                  className={`w-full px-3 py-2 border rounded-md ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>
            </>
          )}

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
              value={formData.notes ?? ""}
              onChange={(e) => handleInputChange("notes", e.target.value)}
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
              {formData.name ? "Update" : "Add"} Source
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
