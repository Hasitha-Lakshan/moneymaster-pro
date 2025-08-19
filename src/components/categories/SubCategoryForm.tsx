import React from "react";
import { Plus, Save, X, XCircle } from "react-feather";

type SubCategoryFormProps = {
  darkMode: boolean;
  visible: boolean;
  onClose: () => void;
  subCategoryName: string;
  setSubCategoryName: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  editingSubCategoryId: string | null;
};

export const SubCategoryForm: React.FC<SubCategoryFormProps> = ({
  darkMode,
  visible,
  onClose,
  subCategoryName,
  setSubCategoryName,
  onSubmit,
  editingSubCategoryId,
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
            {editingSubCategoryId ? "Edit Sub-category" : "Add Sub-category"}
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
            placeholder="Sub-category name"
            value={subCategoryName}
            onChange={(e) => setSubCategoryName(e.target.value)}
            className={`w-full px-3 py-2 mb-4 border rounded-md ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
            required
          />
          <div className="flex gap-3">
            {/* Cancel Button */}
            <button
              type="button"
              onClick={onClose}
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
              {editingSubCategoryId ? (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save</span>
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
