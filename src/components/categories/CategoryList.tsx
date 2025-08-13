import React from "react";
import type { Category, SubCategory } from "../../store/features/categoriesSlice";
import { CategoryItem } from "./CategoryItem";

type CategoryListProps = {
  categories: Category[];
  darkMode: boolean;
  expandedCategories: Set<string>;
  toggleCategory: (id: string) => void;
  getCategorySubCategories: (id: string) => SubCategory[];
  openEditCategoryForm: (category: Category) => void;
  handleDeleteCategory: (id: string) => void;
  openAddSubCategoryForm: (categoryId: string) => void;
  openEditSubCategoryForm: (subCategory: SubCategory) => void;
  handleDeleteSubCategory: (id: string) => void;
};

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  darkMode,
  expandedCategories,
  toggleCategory,
  getCategorySubCategories,
  openEditCategoryForm,
  handleDeleteCategory,
  openAddSubCategoryForm,
  openEditSubCategoryForm,
  handleDeleteSubCategory,
}) => {
  if (categories.length === 0) {
    return (
      <div
        className={`text-center py-8 ${
          darkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        No categories found. Click "Add Category" to create your first category.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          subCategories={getCategorySubCategories(category.id)}
          isExpanded={expandedCategories.has(category.id)}
          darkMode={darkMode}
          toggleCategory={toggleCategory}
          openEditCategoryForm={openEditCategoryForm}
          handleDeleteCategory={handleDeleteCategory}
          openAddSubCategoryForm={openAddSubCategoryForm}
          openEditSubCategoryForm={openEditSubCategoryForm}
          handleDeleteSubCategory={handleDeleteSubCategory}
        />
      ))}
    </div>
  );
};
