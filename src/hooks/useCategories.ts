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
} from "../store/features/categoriesSlice";
import { supabase } from "../lib/supabaseClient";

export const useCategories = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categoriesSlice = useSelector((state: RootState) => state.categories);

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  // Form state
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [categoryName, setCategoryName] = useState("");

  const [showAddSubCategoryForm, setShowAddSubCategoryForm] = useState(false);
  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState<
    string | null
  >(null);
  const [editingSubCategoryId, setEditingSubCategoryId] = useState<
    string | null
  >(null);
  const [subCategoryName, setSubCategoryName] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getCategorySubCategories = (categoryId: string) => {
    return categoriesSlice.subCategories.filter(
      (sub) => sub.category_id === categoryId
    );
  };

  // Category CRUD

  const handleCategorySubmit = async () => {
    if (!categoryName.trim()) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert("You must be logged in to perform this action");
        return;
      }

      if (editingCategoryId) {
        const { data, error } = await supabase
          .from("categories")
          .update({ name: categoryName.trim() })
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
              type: "general",
            })
          );
        }
      } else {
        const { data, error } = await supabase
          .from("categories")
          .insert([{ name: categoryName.trim(), created_by: user.id }])
          .select()
          .single();

        if (error) {
          alert("Failed to add category: " + error.message);
          return;
        }

        if (data) {
          dispatch(
            addCategory({
              id: data.id,
              name: data.name,
              type: "general",
            })
          );
        }
      }
      setShowAddCategoryForm(false);
      setCategoryName("");
      setEditingCategoryId(null);
    } catch (error) {
      console.error("Error saving category:", error);
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
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert("You must be logged in to perform this action");
        return;
      }

      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId)
        .eq("created_by", user.id);

      if (error) {
        alert("Failed to delete category: " + error.message);
        return;
      }

      dispatch(deleteCategory(categoryId));
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("An error occurred while deleting the category");
    }
  };

  // Subcategory CRUD

  const handleSubCategorySubmit = async () => {
    if (!subCategoryName.trim() || !selectedCategoryForSub) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert("You must be logged in to perform this action");
        return;
      }

      if (editingSubCategoryId) {
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
          alert("Failed to add sub-category: " + error.message);
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
        }
      }
      setShowAddSubCategoryForm(false);
      setSubCategoryName("");
      setEditingSubCategoryId(null);
      setSelectedCategoryForSub(null);
    } catch (error) {
      console.error("Error saving subcategory:", error);
      alert("An error occurred while saving the sub-category");
    }
  };

  const handleDeleteSubCategory = async (subCategoryId: string) => {
    if (!window.confirm("Are you sure you want to delete this sub-category?")) {
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert("You must be logged in to perform this action");
        return;
      }

      const { error } = await supabase
        .from("subcategories")
        .delete()
        .eq("id", subCategoryId)
        .eq("created_by", user.id);

      if (error) {
        alert("Failed to delete sub-category: " + error.message);
        return;
      }

      dispatch(deleteSubCategory(subCategoryId));
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      alert("An error occurred while deleting the sub-category");
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
  };
};
