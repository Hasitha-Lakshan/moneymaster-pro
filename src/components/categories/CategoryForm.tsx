import React from "react";
import { X } from "react-feather";

type CategoryFormProps = {
  darkMode: boolean;
  visible: boolean;
  onClose: () => void;
  categoryName: string;
  setCategoryName: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  editingCategoryId: string | null;
};

export const CategoryForm: React.FC<CategoryFormProps> = ({
  darkMode,
  visible,
  onClose,
  categoryName,
  setCategoryName,
  onSubmit,
  editingCategoryId,
}) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg p-6 w-full max-w-md`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3
            className={`text-lg font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {editingCategoryId ? "Edit Category" : "Add Category"}
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded ${
              darkMode
                ? "text-gray-400 hover:text-white"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <X />
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Category name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className={`w-full px-3 py-2 mb-4 border rounded-md ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
            required
          />
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
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
              {editingCategoryId ? "Save Changes" : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
