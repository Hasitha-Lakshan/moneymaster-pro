import React from "react";
import { X } from "react-feather";

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
              {editingSubCategoryId ? "Save Changes" : "Add Sub-category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
