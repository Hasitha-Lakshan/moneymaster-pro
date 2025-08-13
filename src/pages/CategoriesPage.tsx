import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, RefreshCw, X } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import type { Category, SubCategory } from "../store/features/categoriesSlice";

import {
  addCategory,
  updateCategory,
  deleteCategory,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
  fetchCategories,
} from "../store/features/categoriesSlice";
import { supabase } from "../lib/supabaseClient";
import { RestoreDefaultsButton } from "../components/RestoreDefaultsButton";

export const CategoriesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categoriesSlice = useSelector((state: RootState) => state.categories);
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [showAddSubCategoryForm, setShowAddSubCategoryForm] = useState(false);
  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState<
    string | null
  >(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  // For add/edit Category form
  const [categoryName, setCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );

  // For add/edit Sub-category form
  const [subCategoryName, setSubCategoryName] = useState("");
  const [editingSubCategoryId, setEditingSubCategoryId] = useState<
    string | null
  >(null);

  // Load categories and subcategories from Supabase
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Toggle expanded/collapsed categories
  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Filter subcategories by category ID
  const getCategorySubCategories = (categoryId: string) => {
    return categoriesSlice.subCategories.filter(
      (sub) => sub.category_id === categoryId
    );
  };

  // --- Category Handlers ---

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

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("You must be logged in to perform this action");
        return;
      }

      if (editingCategoryId) {
        // Update existing category
        const { data, error } = await supabase
          .from("categories")
          .update({ 
            name: categoryName.trim(),
          })
          .eq("id", editingCategoryId)
          .eq("created_by", user.id)
          .select()
          .single();

        if (error) {
          alert("Failed to update category: " + error.message);
          return;
        }

        if (data) {
          dispatch(
            updateCategory({
              id: editingCategoryId,
              name: categoryName.trim(),
              type: 'general',
            })
          );
        }
      } else {
        // Insert new category
        const { data, error } = await supabase
          .from("categories")
          .insert([{ 
            name: categoryName.trim(), 
            created_by: user.id 
          }])
          .select()
          .single();

        if (error) {
          alert("Failed to add category: " + error.message);
          return;
        }

        if (data) {
          dispatch(addCategory({
            id: data.id,
            name: data.name,
            type: 'general',
          }));
        }
      }
      setShowAddCategoryForm(false);
    } catch (error) {
      console.error('Error saving category:', error);
      alert("An error occurred while saving the category");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this category? All its sub-categories will be deleted too."
      )
    ) {
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("You must be logged in to perform this action");
        return;
      }

      // Delete from Supabase (subcategories will be deleted automatically due to CASCADE)
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId)
        .eq("created_by", user.id);

      if (error) {
        alert("Failed to delete category: " + error.message);
        return;
      }

      // Update Redux store
      dispatch(deleteCategory(categoryId));
    } catch (error) {
      console.error('Error deleting category:', error);
      alert("An error occurred while deleting the category");
    }
  };

  // --- Sub-category Handlers ---

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

  const handleSubCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subCategoryName.trim() || !selectedCategoryForSub) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("You must be logged in to perform this action");
        return;
      }

      if (editingSubCategoryId) {
        // Update existing subcategory
        const { data, error } = await supabase
          .from("subcategories")
          .update({
            name: subCategoryName.trim(),
            category_id: selectedCategoryForSub,
          })
          .eq("id", editingSubCategoryId)
          .eq("created_by", user.id)
          .select()
          .single();

        if (error) {
          alert("Failed to update sub-category: " + error.message);
          return;
        }

        if (data) {
          dispatch(
            updateSubCategory({
              id: editingSubCategoryId,
              name: subCategoryName.trim(),
              category_id: selectedCategoryForSub,
            })
          );
        }
      } else {
        // Insert new subcategory
        const { data, error } = await supabase
          .from("subcategories")
          .insert([
            { 
              name: subCategoryName.trim(), 
              category_id: selectedCategoryForSub,
              created_by: user.id 
            },
          ])
          .select()
          .single();

        if (error) {
          alert("Failed to add sub-category: " + error.message);
          return;
        }

        if (data) {
          dispatch(addSubCategory({
            id: data.id,
            name: data.name,
            category_id: data.category_id,
          }));
        }
      }
      setShowAddSubCategoryForm(false);
    } catch (error) {
      console.error('Error saving subcategory:', error);
      alert("An error occurred while saving the sub-category");
    }
  };

  const handleDeleteSubCategory = async (subCategoryId: string) => {
    if (!window.confirm("Are you sure you want to delete this sub-category?")) {
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("You must be logged in to perform this action");
        return;
      }

      // Delete from Supabase
      const { error } = await supabase
        .from("subcategories")
        .delete()
        .eq("id", subCategoryId)
        .eq("created_by", user.id);

      if (error) {
        alert("Failed to delete sub-category: " + error.message);
        return;
      }

      // Update Redux store
      dispatch(deleteSubCategory(subCategoryId));
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      alert("An error occurred while deleting the sub-category");
    }
  };

  if (categoriesSlice.loading) {
    return (
      <div className="p-6">
        <div className={`text-center ${darkMode ? "text-white" : "text-gray-900"}`}>
          Loading categories...
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
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              darkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </button>
          <RestoreDefaultsButton />
        </div>
      </div>

      <div className="space-y-4">
        {categoriesSlice.categories.length === 0 ? (
          <div
            className={`text-center py-8 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            No categories found. Click "Add Category" to create your first category.
          </div>
        ) : (
          categoriesSlice.categories.map((category: Category) => {
            const subCats = getCategorySubCategories(category.id);
            const isExpanded = expandedCategories.has(category.id);

            return (
              <div
                key={category.id}
                className={`border rounded-lg ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
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
                        {subCats.length} subcategories
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
                      {subCats.length === 0 && (
                        <p
                          className={darkMode ? "text-gray-400" : "text-gray-600"}
                        >
                          No sub-categories
                        </p>
                      )}
                      {subCats.map((sub) => (
                        <div
                          key={sub.id}
                          className={`flex items-center justify-between p-2 rounded ${
                            darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                          }`}
                        >
                          <span
                            className={darkMode ? "text-white" : "text-gray-900"}
                          >
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
          })
        )}
      </div>

      {/* Add/Edit Category Modal */}
      {showAddCategoryForm && (
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
                {editingCategoryId ? "Edit Category" : "Add Category"}
              </h3>
              <button
                onClick={() => setShowAddCategoryForm(false)}
                className={`p-1 rounded ${
                  darkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                <X />
              </button>
            </div>
            <form onSubmit={handleCategorySubmit}>
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
                  onClick={() => setShowAddCategoryForm(false)}
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
      )}

      {/* Add/Edit Sub-category Modal */}
      {showAddSubCategoryForm && (
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
                {editingSubCategoryId
                  ? "Edit Sub-category"
                  : "Add Sub-category"}
              </h3>
              <button
                onClick={() => setShowAddSubCategoryForm(false)}
                className={`p-1 rounded ${
                  darkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                <X />
              </button>
            </div>
            <form onSubmit={handleSubCategorySubmit}>
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
                  onClick={() => setShowAddSubCategoryForm(false)}
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
      )}
    </div>
  );
};