import React from "react";
import type {
  Category,
  SubCategory,
} from "../../store/features/categoriesSlice";
import { CategoryItem } from "./CategoryItem";

type CategoryListProps = {
  categories: Category[];
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
      <div className="text-center py-12 text-muted-foreground italic">
        <div className="text-4xl mb-4">✨</div>
        <p className="text-lg">No categories found.</p>
        <p className="text-sm">
          Click "Add Category" to create your first category.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          subCategories={getCategorySubCategories(category.id)}
          isExpanded={expandedCategories.has(category.id)}
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
