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
  toggleCategory,
  openEditCategoryForm,
  handleDeleteCategory,
  openAddSubCategoryForm,
  openEditSubCategoryForm,
  handleDeleteSubCategory,
}) => {
  return (
    <div className="border-border border-2 rounded-xl bg-card shadow-pastel hover:shadow-lg transition-all duration-300">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-3">
            <button
              onClick={() => toggleCategory(category.id)}
              className="p-1 md:p-2 rounded-full hover:bg-accent/30 transition-all duration-200 hover:scale-105"
            >
              <RefreshCw
                className={`h-4 w-4 md:h-5 md:w-5 transition-all duration-300 ${
                  isExpanded
                    ? "rotate-90 text-primary"
                    : "text-muted-foreground"
                }`}
              />
            </button>
            <h3 className="font-bold text-base md:text-lg text-card-foreground">
              {category.name}
            </h3>
            <span className="text-xs px-2 py-1 md:px-3 md:py-1 rounded-full bg-secondary text-secondary-foreground font-medium">
              {subCategories.length} sub
            </span>
          </div>
          <div className="flex space-x-1 md:space-x-2">
            <button
              onClick={() => openEditCategoryForm(category)}
              className="p-1 md:p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-all duration-200 hover:scale-110 group"
            >
              <Edit2 className="h-4 w-4 md:h-5 md:w-5 text-primary group-hover:text-primary-foreground transition-colors" />
            </button>
            <button
              onClick={() => handleDeleteCategory(category.id)}
              className="p-1 md:p-2 rounded-full bg-destructive/10 hover:bg-destructive/20 transition-all duration-200 hover:scale-110 group"
            >
              <Trash2 className="h-4 w-4 md:h-5 md:w-5 text-destructive group-hover:text-destructive-foreground transition-colors" />
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-3 pl-8 md:pl-10 border-l-2 border-accent/30">
            {subCategories.length === 0 && (
              <div className="flex items-center justify-center py-4">
                <p className="text-muted-foreground italic text-center text-sm md:text-base">
                  ✨ No sub-categories yet. Add your first one!
                </p>
              </div>
            )}
            {subCategories.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-secondary/10 to-accent/10 hover:from-secondary/20 hover:to-accent/20 transition-all duration-200 border border-border/50"
              >
                <span className="font-medium text-card-foreground text-sm md:text-base">
                  {sub.name}
                </span>
                <div className="flex space-x-1 md:space-x-2">
                  <button
                    onClick={() => openEditSubCategoryForm(sub)}
                    className="p-1 md:p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-all duration-200 hover:scale-110 group"
                  >
                    <Edit2 className="h-3 w-3 md:h-4 md:w-4 text-primary group-hover:text-primary-foreground transition-colors" />
                  </button>
                  <button
                    onClick={() => handleDeleteSubCategory(sub.id)}
                    className="p-1 md:p-2 rounded-full bg-destructive/10 hover:bg-destructive/20 transition-all duration-200 hover:scale-110 group"
                  >
                    <Trash2 className="h-3 w-3 md:h-4 md:w-4 text-destructive group-hover:text-destructive-foreground transition-colors" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() => openAddSubCategoryForm(category.id)}
              className="flex items-center space-x-2 px-3 py-2 md:px-4 md:py-3 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 transition-all duration-200 border border-primary/20 hover:border-primary/30 group w-full"
            >
              <div className="p-1 rounded-full bg-primary group-hover:bg-primary-foreground transition-colors">
                <Plus className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground group-hover:text-primary transition-colors" />
              </div>
              <span className="font-semibold text-primary group-hover:text-accent transition-colors text-sm md:text-base">
                Add Sub-category
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
