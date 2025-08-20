import React from "react";
import { Plus, Save, X, XCircle } from "react-feather";

type CategoryFormProps = {
  visible: boolean;
  onClose: () => void;
  categoryName: string;
  setCategoryName: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  editingCategoryId: string | null;
};

export const CategoryForm: React.FC<CategoryFormProps> = ({
  visible,
  onClose,
  categoryName,
  setCategoryName,
  onSubmit,
  editingCategoryId,
}) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-card border-2 border-border rounded-2xl p-6 w-full max-w-md shadow-2xl transform transition-all duration-300 scale-95 hover:scale-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-card-foreground">
            {editingCategoryId ? "Edit Category" : "Add Category"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-destructive/20 transition-all duration-200 hover:scale-110 group"
          >
            <X className="w-5 h-5 text-muted-foreground group-hover:text-destructive transition-colors" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Input Field */}
          <div className="relative">
            <input
              type="text"
              placeholder="Enter category name..."
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl text-card-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              required
              autoFocus
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            {/* Cancel Button */}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold border-2 border-border hover:border-destructive/50 bg-background text-muted-foreground hover:text-destructive transition-all duration-200 hover:scale-105 group"
            >
              <XCircle className="w-5 h-5 text-muted-foreground group-hover:text-destructive transition-colors" />
              <span>Cancel</span>
            </button>

            {/* Submit Button - Much more visible! */}
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-primary text-primary-foreground shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group relative overflow-hidden"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-100 group-hover:opacity-90 transition-opacity" />

              {/* Content */}
              <span className="relative z-10 flex items-center gap-2">
                {editingCategoryId ? (
                  <>
                    <Save className="w-5 h-5 text-primary-foreground group-hover:scale-110 transition-transform" />
                    <span>Save</span>
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
