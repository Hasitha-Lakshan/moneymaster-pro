import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  addCategory,
  updateCategory,
  deleteCategory,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
  fetchCategories,
  type SubCategory,
} from "../store/features/categoriesSlice";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-toastify";
import { useConfirmation } from "./useConfirmation";

export const useCategories = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categoriesSlice = useSelector((state: RootState) => state.categories);

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  // --- Category Form State ---
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [categoryName, setCategoryName] = useState("");

  // --- Sub-category Form State ---
  const [showAddSubCategoryForm, setShowAddSubCategoryForm] = useState(false);
  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState<
    string | null
  >(null);
  const [editingSubCategoryId, setEditingSubCategoryId] = useState<
    string | null
  >(null);
  const [subCategoryName, setSubCategoryName] = useState("");

  // --- Confirmation Modal ---
  const { requestConfirmation, ConfirmationModalComponent } = useConfirmation();

  // --- Fetch categories on mount ---
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // --- Expand/collapse categories ---
  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) newExpanded.delete(categoryId);
    else newExpanded.add(categoryId);
    setExpandedCategories(newExpanded);
  };

  // --- Filter subcategories by category ---
  const getCategorySubCategories = (categoryId: string): SubCategory[] => {
    return categoriesSlice.subCategories.filter(
      (sub) => sub.category_id === categoryId
    );
  };

  // --- Category CRUD ---
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // <-- Prevent page reload
    if (!categoryName.trim()) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to perform this action");
        return;
      }

      if (editingCategoryId) {
        // Update category
        const { data, error } = await supabase
          .from("categories")
          .update({ name: categoryName.trim() })
          .eq("id", editingCategoryId)
          .eq("created_by", user.id)
          .select();

        if (error) {
          toast.error("Failed to update category: " + error.message);
          return;
        }

        if (data && data.length > 0) {
          const updatedCategory = data[0];
          dispatch(
            updateCategory({
              id: updatedCategory.id,
              name: updatedCategory.name,
              type: "general",
            })
          );
          toast.success("Category updated successfully!");
        } else {
          toast.error("Category not found or you do not have permission");
        }
      } else {
        // Add category
        const { data, error } = await supabase
          .from("categories")
          .insert([{ name: categoryName.trim(), created_by: user.id }])
          .select();

        if (error) {
          toast.error("Failed to add category: " + error.message);
          return;
        }

        if (data && data.length > 0) {
          const newCategory = data[0];
          dispatch(
            addCategory({
              id: newCategory.id,
              name: newCategory.name,
              type: "general",
            })
          );
          toast.success("Category added successfully!");
        }
      }

      // Reset form
      setShowAddCategoryForm(false);
      setCategoryName("");
      setEditingCategoryId(null);
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("An error occurred while saving the category");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const confirmed = await requestConfirmation({
      message:
        "Are you sure you want to delete this category? All its sub-categories will be deleted too.",
    });
    if (!confirmed) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to perform this action");
        return;
      }

      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId)
        .eq("created_by", user.id);

      if (error) {
        toast.error("Failed to delete category: " + error.message);
        return;
      }

      dispatch(deleteCategory(categoryId));
      toast.success("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("An error occurred while deleting the category");
    }
  };

  // --- Sub-category CRUD ---
  const handleSubCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // <-- Prevent page reload
    if (!subCategoryName.trim() || !selectedCategoryForSub) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to perform this action");
        return;
      }

      if (editingSubCategoryId) {
        // Update subcategory
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
          toast.error("Failed to update sub-category: " + error.message);
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
          toast.success("Sub-category updated successfully!");
        }
      } else {
        // Add subcategory
        const { data, error } = await supabase
          .from("subcategories")
          .insert([
            {
              name: subCategoryName.trim(),
              category_id: selectedCategoryForSub,
              created_by: user.id,
            },
          ])
          .select()
          .single();

        if (error) {
          toast.error("Failed to add sub-category: " + error.message);
          return;
        }

        if (data) {
          dispatch(
            addSubCategory({
              id: data.id,
              name: data.name,
              category_id: data.category_id,
            })
          );
          toast.success("Sub-category added successfully!");
        }
      }

      setShowAddSubCategoryForm(false);
      setSubCategoryName("");
      setEditingSubCategoryId(null);
      setSelectedCategoryForSub(null);
    } catch (error) {
      console.error("Error saving subcategory:", error);
      toast.error("An error occurred while saving the sub-category");
    }
  };

  const handleDeleteSubCategory = async (subCategoryId: string) => {
    const confirmed = await requestConfirmation({
      message: "Are you sure you want to delete this sub-category?",
    });
    if (!confirmed) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to perform this action");
        return;
      }

      const { error } = await supabase
        .from("subcategories")
        .delete()
        .eq("id", subCategoryId)
        .eq("created_by", user.id);

      if (error) {
        toast.error("Failed to delete sub-category: " + error.message);
        return;
      }

      dispatch(deleteSubCategory(subCategoryId));
      toast.success("Sub-category deleted successfully!");
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      toast.error("An error occurred while deleting the sub-category");
    }
  };

  return {
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
    selectedCategoryForSub,
    setSelectedCategoryForSub,
    editingSubCategoryId,
    setEditingSubCategoryId,
    subCategoryName,
    setSubCategoryName,
    handleSubCategorySubmit,
    handleDeleteSubCategory,

    ConfirmationModalComponent, // render this in your page
  };
};
