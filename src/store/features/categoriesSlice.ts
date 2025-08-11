import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabaseClient";
import type { PayloadAction } from "@reduxjs/toolkit";

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
  loading: boolean;
  error?: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  subCategories: [],
  loading: false,
  error: null,
};

// ✅ Async thunk to fetch categories & subcategories from Supabase
export const fetchCategories = createAsyncThunk<
  { categories: Category[]; subCategories: SubCategory[] }, // return type
  void, // argument type
  { rejectValue: string } // rejection payload type
>("categories/fetchCategories", async (_, thunkAPI) => {
  try {
    const { data: categoriesData, error: categoriesError } = await supabase
      .from("categories")
      .select("*");

    if (categoriesError) throw categoriesError;

    const { data: subCategoriesData, error: subCategoriesError } =
      await supabase.from("sub_categories").select("*");

    if (subCategoriesError) throw subCategoriesError;

    return {
      categories: (categoriesData ?? []) as Category[],
      subCategories: (subCategoriesData ?? []) as SubCategory[],
    };
  } catch (err) {
    const error = err as Error;
    return thunkAPI.rejectWithValue(
      error.message || "Failed to fetch categories"
    );
  }
});

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
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
        state.subCategories = action.payload.subCategories;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
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
