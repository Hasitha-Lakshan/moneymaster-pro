import { Plus } from "react-feather";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { RestoreDefaultsButton } from "../components/RestoreDefaultsButton";
import { useCategories } from "../hooks/useCategories";
import { CategoryList } from "../components/categories/CategoryList";
import { CategoryForm } from "../components/categories/CategoryForm";
import { SubCategoryForm } from "../components/categories/SubCategoryForm";
import type { Category, SubCategory } from "../types/categories";
import { LoadingSpinner } from "../components/shared/LoadingSpinner";

export const CategoriesPage = () => {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

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
      <div className="p-6">
        <div
          className={`text-center ${darkMode ? "text-white" : "text-gray-900"}`}
        >
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2
          className={`text-3xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Categories
        </h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={openAddCategoryForm}
            className={`group flex items-center gap-2 px-4 py-2 rounded-xl shadow-md transition-all
    ${
      darkMode
        ? "bg-gray-800 hover:bg-gray-700 text-white"
        : "bg-blue-600 hover:bg-blue-700 text-white"
    }`}
          >
            <Plus className="h-5 w-5 transition-transform group-hover:rotate-90 group-hover:scale-110" />
            {/* Hide text on small screens, show from md and up */}
            <span className="hidden md:inline font-medium">Add Category</span>
          </button>
          <RestoreDefaultsButton />
        </div>
      </div>

      <CategoryList
        categories={categoriesSlice.categories}
        darkMode={darkMode}
        expandedCategories={expandedCategories}
        toggleCategory={toggleCategory}
        getCategorySubCategories={getCategorySubCategories}
        openEditCategoryForm={openEditCategoryForm}
        handleDeleteCategory={handleDeleteCategory}
        openAddSubCategoryForm={openAddSubCategoryForm}
        openEditSubCategoryForm={openEditSubCategoryForm}
        handleDeleteSubCategory={handleDeleteSubCategory}
      />

      <CategoryForm
        darkMode={darkMode}
        visible={showAddCategoryForm}
        onClose={() => setShowAddCategoryForm(false)}
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        onSubmit={handleCategorySubmit}
        editingCategoryId={editingCategoryId}
      />

      <SubCategoryForm
        darkMode={darkMode}
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
