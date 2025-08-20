import React from "react";
import type { SourceFormData } from "../../types/sources";
import { Plus, RefreshCw, XCircle, X } from "react-feather";

interface SourceFormModalProps {
  visible: boolean;
  formData: SourceFormData;
  onChange: (data: SourceFormData) => void;
  onCancel: () => void;
  onSubmit: (data: SourceFormData) => void | Promise<void>;
}

export const SourceFormModal: React.FC<SourceFormModalProps> = ({
  visible,
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-card border-2 border-border rounded-2xl p-6 w-full max-w-4xl shadow-2xl transform transition-all duration-300 scale-95 hover:scale-100 mx-auto my-auto">
        {/* Header with Title + Close Button */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-card-foreground">
            {formData.id ? "Edit Source" : "Add Source"}
          </h3>
          <button
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-destructive/20 transition-all duration-200 hover:scale-110 group"
          >
            <X className="w-5 h-5 text-muted-foreground group-hover:text-destructive transition-colors" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Source Name */}
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Source name"
                className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl text-card-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                required
                autoFocus
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
            </div>

            {/* Source Type */}
            <div className="relative">
              <select
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="relative z-10 w-full px-4 py-3 pr-12 bg-background border-2 border-border rounded-xl text-card-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 select-with-arrow appearance-none"
                required
              >
                <option value="Bank Account">Bank Account</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Cash">Cash</option>
                <option value="Digital Wallet">Digital Wallet</option>
                <option value="Investment">Investment</option>
                <option value="Other">Other</option>
              </select>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
            </div>

            {/* Currency */}
            <div className="relative">
              <input
                type="text"
                value={formData.currency}
                onChange={(e) =>
                  handleInputChange("currency", e.target.value.toUpperCase())
                }
                placeholder="Currency (e.g., USD)"
                maxLength={3}
                className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl text-card-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                required
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
            </div>

            {/* Initial Balance */}
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={formData.initial_balance ?? ""}
                onChange={(e) =>
                  handleInputChange("initial_balance", e.target.value)
                }
                placeholder="Initial balance"
                className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl text-card-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 disabled:opacity-50"
                disabled={!!formData.id}
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
            </div>

            {/* Credit Card Fields */}
            {formData.type === "Credit Card" && (
              <>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={formData.credit_limit ?? ""}
                    onChange={(e) =>
                      handleInputChange("credit_limit", e.target.value)
                    }
                    placeholder="Credit limit"
                    className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl text-card-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={formData.interest_rate ?? ""}
                    onChange={(e) =>
                      handleInputChange("interest_rate", e.target.value)
                    }
                    placeholder="Interest rate (%)"
                    className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl text-card-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={formData.billing_cycle_start ?? ""}
                    onChange={(e) =>
                      handleInputChange("billing_cycle_start", e.target.value)
                    }
                    placeholder="Billing cycle start day"
                    className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl text-card-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                </div>
              </>
            )}
          </div>

          {/* Notes */}
          <div className="relative">
            <textarea
              value={formData.notes ?? ""}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Notes (optional)"
              className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl text-card-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none"
              rows={2}
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            {/* Cancel Button */}
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold border-2 border-border hover:border-destructive/50 bg-background text-muted-foreground hover:text-destructive transition-all duration-200 hover:scale-105 group"
            >
              <XCircle className="w-5 h-5 text-muted-foreground group-hover:text-destructive transition-colors" />
              <span>Cancel</span>
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-primary text-primary-foreground shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group relative overflow-hidden"
            >
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-100 group-hover:opacity-90 transition-opacity" />

              {/* Content */}
              <span className="relative z-10 flex items-center gap-2">
                {formData.id ? (
                  <>
                    <RefreshCw className="w-5 h-5 text-primary-foreground group-hover:scale-110 transition-transform" />
                    <span>Update</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 text-primary-foreground group-hover:scale-110 transition-transform" />
                    <span>Add</span>
                  </>
                )}
              </span>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </button>
          </div>
        </form>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-primary/10 rounded-full -translate-x-10 -translate-y-10 blur-xl" />
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-accent/10 rounded-full translate-x-8 translate-y-8 blur-xl" />
      </div>
    </div>
  );
};
