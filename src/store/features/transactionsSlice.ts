// src/store/features/transactionsSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { supabase } from "../../lib/supabaseClient"; // adjust path if needed

// Transaction interface matching your backend table structure (snake_case)
export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category_id: string;
  note?: string;
}

export interface TransactionsState {
  items: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunk to fetch transactions (adjust or replace with your Supabase query)
export const fetchTransactions = createAsyncThunk<
  Transaction[],
  void,
  { rejectValue: string }
>("transactions/fetchTransactions", async (_, thunkAPI) => {
  try {
    // Example fetch - replace with your Supabase query if needed
    const { data, error } = await supabase.from("transactions").select("*");
    if (error) throw error;
    return data as Transaction[];
  } catch (err: unknown) {
    if (err instanceof Error) {
      return thunkAPI.rejectWithValue(err.message);
    }
    return thunkAPI.rejectWithValue("An unknown error occurred");
  }
});

// New async thunk to create a transaction in Supabase
export const createTransaction = createAsyncThunk<
  Transaction,
  { amount: number; category_id: string; note?: string },
  { rejectValue: string }
>("transactions/createTransaction", async (newTxn, thunkAPI) => {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          amount: newTxn.amount,
          category_id: newTxn.category_id,
          note: newTxn.note,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Return the created transaction with backend-generated fields
    return data as Transaction;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return thunkAPI.rejectWithValue(err.message);
    }
    return thunkAPI.rejectWithValue("Failed to create transaction");
  }
});

export const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    removeTransaction: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.items.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      })

      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create transaction";
      });
  },
});

export const { removeTransaction, updateTransaction } = transactionsSlice.actions;

export const selectTransactions = (state: RootState) => state.transactions;

export default transactionsSlice.reducer;
