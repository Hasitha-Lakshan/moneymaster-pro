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
      <div className="bg-card rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-pastel border-2 border-border transition-all duration-300">
        {/* Header with Title + Close Button */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-card-foreground">
            {editId ? "Edit Transaction" : "Add Transaction"}
          </h3>
          <button
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-destructive/20 transition-all duration-200 hover:scale-110 group"
          >
            <X className="h-5 w-5 text-muted-foreground group-hover:text-destructive transition-colors" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Date */}
            <div className="relative">
              <label className="block text-sm font-semibold mb-2 text-card-foreground">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-border rounded-xl bg-background text-card-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                required
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
            </div>

            {/* Type */}
            <div className="relative">
              <label className="block text-sm font-semibold mb-2 text-card-foreground">
                Type *
              </label>
              <select
                name="type_id"
                value={formData.type_id}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-border rounded-xl bg-background text-card-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 select-with-arrow"
                required
              >
                <option value="">Select Type</option>
                {transactionTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
            </div>

            {/* Category & Subcategory */}
            {!isTransfer && (
              <>
                <div className="relative">
                  <label className="block text-sm font-semibold mb-2 text-card-foreground">
                    Category *
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-border rounded-xl bg-background text-card-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 select-with-arrow"
                    required={!isTransfer}
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold mb-2 text-card-foreground">
                    Subcategory
                  </label>
                  <select
                    name="subcategory_id"
                    value={formData.subcategory_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-border rounded-xl bg-background text-card-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 select-with-arrow"
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
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                </div>
              </>
            )}

            {/* Source */}
            <div className="relative">
              <label className="block text-sm font-semibold mb-2 text-card-foreground">
                Source *
              </label>
              <select
                name="source_id"
                value={formData.source_id}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-border rounded-xl bg-background text-card-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 select-with-arrow"
                required
              >
                <option value="">Select Source</option>
                {sources.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
            </div>

            {/* Destination */}
            {isTransfer && (
              <div className="relative">
                <label className="block text-sm font-semibold mb-2 text-card-foreground">
                  Destination *
                </label>
                <select
                  name="destination_source_id"
                  value={formData.destination_source_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-border rounded-xl bg-background text-card-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 select-with-arrow"
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
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
              </div>
            )}

            {/* Amount */}
            <div className="relative">
              <label className="block text-sm font-semibold mb-2 text-card-foreground">
                Amount *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                className="w-full px-4 py-3 border-2 border-border rounded-xl bg-background text-card-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                required
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
            </div>

            {/* Notes */}
            <div className="md:col-span-2 relative">
              <label className="block text-sm font-semibold mb-2 text-card-foreground">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Optional notes"
                className="w-full px-4 py-3 border-2 border-border rounded-xl bg-background text-card-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none"
                rows={3}
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold border-2 border-border hover:border-destructive/50 bg-background text-muted-foreground hover:text-destructive transition-all duration-200 hover:scale-105 group"
            >
              <XCircle className="h-5 w-5 text-muted-foreground group-hover:text-destructive transition-colors" />
              <span>Cancel</span>
            </button>

            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-primary text-primary-foreground shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group relative overflow-hidden"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-100 group-hover:opacity-90 transition-opacity" />

              {/* Content */}
              <span className="relative z-10 flex items-center gap-2">
                {editId ? (
                  <>
                    <RefreshCw className="h-5 w-5 text-primary-foreground group-hover:scale-110 transition-transform" />
                    <span>Update Transaction</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 text-primary-foreground group-hover:scale-110 transition-transform" />
                    <span>Add Transaction</span>
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
