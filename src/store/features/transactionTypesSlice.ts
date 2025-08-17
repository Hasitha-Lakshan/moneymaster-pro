import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabaseClient";
import type { RootState } from "../store";

export interface TransactionType {
  id: number;
  name: string;
}

interface TransactionTypesState {
  types: TransactionType[];
  loading: boolean;
  error?: string | null;
}

const initialState: TransactionTypesState = {
  types: [],
  loading: false,
  error: null,
};

// Async thunk to fetch transaction types from Supabase
export const fetchTransactionTypes = createAsyncThunk<
  TransactionType[],
  void,
  { rejectValue: string }
>("transactionTypes/fetchTransactionTypes", async (_, thunkAPI) => {
  try {
    const { data, error } = await supabase
      .from("transaction_types")
      .select("*")
      .order("name");

    if (error) throw error;

    return data as TransactionType[];
  } catch (err) {
    const error = err as Error;
    return thunkAPI.rejectWithValue(
      error.message || "Failed to fetch transaction types"
    );
  }
});

const transactionTypesSlice = createSlice({
  name: "transactionTypes",
  initialState,
  reducers: {
    addTransactionType(state, action: PayloadAction<TransactionType>) {
      state.types.push(action.payload);
    },
    updateTransactionType(state, action: PayloadAction<TransactionType>) {
      const index = state.types.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) state.types[index] = action.payload;
    },
    deleteTransactionType(state, action: PayloadAction<number>) {
      state.types = state.types.filter((t) => t.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.types = action.payload;
      })
      .addCase(fetchTransactionTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      });
  },
});

export const {
  addTransactionType,
  updateTransactionType,
  deleteTransactionType,
} = transactionTypesSlice.actions;

export const selectTransactionTypes = (state: RootState) =>
  state.transactionTypes;

export default transactionTypesSlice.reducer;
