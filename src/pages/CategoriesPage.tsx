import { Plus } from "react-feather";
import { RestoreDefaultsButton } from "../components/RestoreDefaultsButton";
import { useCategories } from "../hooks/useCategories";
import { CategoryList } from "../components/categories/CategoryList";
import { CategoryForm } from "../components/categories/CategoryForm";
import { SubCategoryForm } from "../components/categories/SubCategoryForm";
import type { Category, SubCategory } from "../types/categories";
import { LoadingSpinner } from "../components/shared/LoadingSpinner";

export const CategoriesPage = () => {
  const {
    categoriesSlice,
    expandedCategories,
    toggleCategory,
    getCategorySubCategories,
    showAddCategoryForm,
    setShowAddCategoryForm,
    editingCategoryId,
    setEditingCategoryId,
    categoryName,
    setCategoryName,
    handleCategorySubmit,
    handleDeleteCategory,
    showAddSubCategoryForm,
    setShowAddSubCategoryForm,
    setSelectedCategoryForSub,
    editingSubCategoryId,
    setEditingSubCategoryId,
    subCategoryName,
    setSubCategoryName,
    handleSubCategorySubmit,
    handleDeleteSubCategory,
    ConfirmationModalComponent,
  } = useCategories();

  const openAddCategoryForm = () => {
    setEditingCategoryId(null);
    setCategoryName("");
    setShowAddCategoryForm(true);
  };

  const openEditCategoryForm = (category: Category) => {
    setEditingCategoryId(category.id);
    setCategoryName(category.name);
    setShowAddCategoryForm(true);
  };

  const openAddSubCategoryForm = (categoryId: string) => {
    setSelectedCategoryForSub(categoryId);
    setEditingSubCategoryId(null);
    setSubCategoryName("");
    setShowAddSubCategoryForm(true);
  };

  const openEditSubCategoryForm = (subCategory: SubCategory) => {
    setSelectedCategoryForSub(subCategory.category_id);
    setEditingSubCategoryId(subCategory.id);
    setSubCategoryName(subCategory.name);
    setShowAddSubCategoryForm(true);
  };

  if (categoriesSlice.loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-muted-foreground mt-4">
            Loading your categories...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-card-foreground">Categories</h2>
        <div className="flex items-center space-x-4">
          {/* Add Category Button */}
          <button
            onClick={openAddCategoryForm}
            className="group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-primary text-primary-foreground shadow-pastel hover:shadow-lg transform hover:scale-105 transition-all duration-200 relative overflow-hidden"
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-100 group-hover:opacity-90 transition-opacity" />

            {/* Content */}
            <span className="relative z-10 flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary-foreground group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline font-medium">Add Category</span>
            </span>

            {/* Hover effect */}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </button>

          <RestoreDefaultsButton />
        </div>
      </div>

      {/* Category List */}
      <CategoryList
        categories={categoriesSlice.categories}
        expandedCategories={expandedCategories}
        toggleCategory={toggleCategory}
        getCategorySubCategories={getCategorySubCategories}
        openEditCategoryForm={openEditCategoryForm}
        handleDeleteCategory={handleDeleteCategory}
        openAddSubCategoryForm={openAddSubCategoryForm}
        openEditSubCategoryForm={openEditSubCategoryForm}
        handleDeleteSubCategory={handleDeleteSubCategory}
      />

      {/* Forms */}
      <CategoryForm
        visible={showAddCategoryForm}
        onClose={() => setShowAddCategoryForm(false)}
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        onSubmit={handleCategorySubmit}
        editingCategoryId={editingCategoryId}
      />

      <SubCategoryForm
        visible={showAddSubCategoryForm}
        onClose={() => setShowAddSubCategoryForm(false)}
        subCategoryName={subCategoryName}
        setSubCategoryName={setSubCategoryName}
        onSubmit={handleSubCategorySubmit}
        editingSubCategoryId={editingSubCategoryId}
      />

      {ConfirmationModalComponent}
    </div>
  );
};
