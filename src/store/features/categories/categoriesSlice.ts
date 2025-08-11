import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense" | "investment" | "transfer" | string;
}

export interface SubCategory {
  id: string;
  category_id: string;
  name: string;
}

interface CategoriesState {
  categories: Category[];
  subCategories: SubCategory[];
}

const initialState: CategoriesState = {
  categories: [
    { id: "1", name: "Salary", type: "income" },
    { id: "2", name: "Groceries", type: "expense" },
    { id: "3", name: "Stocks", type: "investment" },
  ],
  subCategories: [
    { id: "1", category_id: "2", name: "Supermarket" },
    { id: "2", category_id: "2", name: "Farmers Market" },
    { id: "3", category_id: "3", name: "Tech Stocks" },
  ],
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    addCategory(state, action: PayloadAction<Category>) {
      state.categories.push(action.payload);
    },
    updateCategory(state, action: PayloadAction<Category>) {
      const index = state.categories.findIndex(
        (c) => c.id === action.payload.id
      );
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    deleteCategory(state, action: PayloadAction<string>) {
      state.categories = state.categories.filter(
        (c) => c.id !== action.payload
      );
      // Also remove subcategories belonging to deleted category
      state.subCategories = state.subCategories.filter(
        (sc) => sc.category_id !== action.payload
      );
    },
    addSubCategory(state, action: PayloadAction<SubCategory>) {
      state.subCategories.push(action.payload);
    },
    updateSubCategory(state, action: PayloadAction<SubCategory>) {
      const index = state.subCategories.findIndex(
        (sc) => sc.id === action.payload.id
      );
      if (index !== -1) {
        state.subCategories[index] = action.payload;
      }
    },
    deleteSubCategory(state, action: PayloadAction<string>) {
      state.subCategories = state.subCategories.filter(
        (sc) => sc.id !== action.payload
      );
    },
  },
});

export const {
  addCategory,
  updateCategory,
  deleteCategory,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
