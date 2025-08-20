import React from "react";
import type { SourceFormData } from "../../types/sources";
import { Plus, RefreshCw, XCircle, X } from "react-feather";

interface SourceFormModalProps {
  visible: boolean;
  darkMode: boolean;
  formData: SourceFormData;
  onChange: (data: SourceFormData) => void;
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div
        className={`${
          darkMode ? "bg-gray-800/95" : "bg-white/95"
        } rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto backdrop-blur-sm`}
      >
        {/* Header with Title + Close Button */}
        <div className="flex justify-between items-center mb-4">
          <h3
            className={`text-lg font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {formData.id ? "Edit Source" : "Add Source"}
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
            {/* Source Name */}
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

            {/* Source Type */}
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
                disabled={!!formData.id}
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
              value={formData.notes ?? ""}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Optional notes"
              className={`w-full px-3 py-2 border rounded-md ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {/* Cancel Button */}
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

            {/* Submit Button */}
            <button
              type="submit"
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium shadow-md transition-all duration-200
      ${
        darkMode
          ? "bg-blue-600 text-white hover:bg-blue-500 active:scale-95"
          : "bg-blue-500 text-white hover:bg-blue-600 active:scale-95"
      }`}
            >
              {formData.name ? (
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
