import React from "react";
import { Plus, Edit2, Trash2, RefreshCw } from "react-feather";
import type {
  Category,
  SubCategory,
} from "../../store/features/categoriesSlice";

type CategoryItemProps = {
  category: Category;
  subCategories: SubCategory[];
  isExpanded: boolean;
  darkMode: boolean;
  toggleCategory: (id: string) => void;
  openEditCategoryForm: (category: Category) => void;
  handleDeleteCategory: (id: string) => void;
  openAddSubCategoryForm: (categoryId: string) => void;
  openEditSubCategoryForm: (subCategory: SubCategory) => void;
  handleDeleteSubCategory: (id: string) => void;
};

export const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  subCategories,
  isExpanded,
  darkMode,
  toggleCategory,
  openEditCategoryForm,
  handleDeleteCategory,
  openAddSubCategoryForm,
  openEditSubCategoryForm,
  handleDeleteSubCategory,
}) => {
  return (
    <div
      className={`border rounded-lg ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => toggleCategory(category.id)}
              className={`p-1 rounded ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              <RefreshCw
                className={`h-4 w-4 transition-transform ${
                  isExpanded ? "rotate-90" : ""
                } ${darkMode ? "text-gray-400" : "text-gray-600"}`}
              />
            </button>
            <h3
              className={`font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {category.name}
            </h3>
            <span className="text-xs text-gray-500">
              {subCategories.length} subcategories
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => openEditCategoryForm(category)}
              className={`p-1 rounded ${
                darkMode
                  ? "text-blue-400 hover:bg-gray-700"
                  : "text-blue-600 hover:bg-gray-100"
              }`}
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDeleteCategory(category.id)}
              className={`p-1 rounded ${
                darkMode
                  ? "text-red-400 hover:bg-gray-700"
                  : "text-red-600 hover:bg-gray-100"
              }`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-3 space-y-2 pl-8 border-l border-gray-300 dark:border-gray-600">
            {subCategories.length === 0 && (
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                No sub-categories
              </p>
            )}
            {subCategories.map((sub) => (
              <div
                key={sub.id}
                className={`flex items-center justify-between p-2 rounded ${
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <span className={darkMode ? "text-white" : "text-gray-900"}>
                  {sub.name}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditSubCategoryForm(sub)}
                    className={`p-1 rounded ${
                      darkMode
                        ? "text-blue-400 hover:bg-gray-700"
                        : "text-blue-600 hover:bg-gray-100"
                    }`}
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSubCategory(sub.id)}
                    className={`p-1 rounded ${
                      darkMode
                        ? "text-red-400 hover:bg-gray-700"
                        : "text-red-600 hover:bg-gray-100"
                    }`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() => openAddSubCategoryForm(category.id)}
              className={`flex items-center space-x-2 px-3 py-1 rounded mt-2 text-sm font-medium ${
                darkMode
                  ? "text-blue-400 hover:bg-gray-700"
                  : "text-blue-600 hover:bg-gray-100"
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>Add Sub-category</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
