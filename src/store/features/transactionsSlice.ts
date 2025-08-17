// src/store/features/transactionsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { supabase } from "../../lib/supabaseClient";

// -------------------------
// Transaction Type
// -------------------------
export interface Transaction {
  id: string;
  date: string; // ISO string
  type_id: number;
  category_id?: string | null;
  subcategory_id?: string | null;
  source_id?: string | null;
  destination_source_id?: string | null;
  amount: number;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

// -------------------------
// State Type
// -------------------------
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

// -------------------------
// Thunks
// -------------------------

// Fetch all transactions
export const fetchTransactions = createAsyncThunk<
  Transaction[],
  void,
  { rejectValue: string }
>("transactions/fetchTransactions", async (_, thunkAPI) => {
  try {
    const { data, error } = await supabase.from("transactions").select("*");
    if (error) throw error;
    return data as Transaction[];
  } catch (err: unknown) {
    if (err instanceof Error) return thunkAPI.rejectWithValue(err.message);
    return thunkAPI.rejectWithValue("Failed to fetch transactions");
  }
});

// Create a transaction (supports transfers)
export const createTransaction = createAsyncThunk<
  Transaction[],
  Omit<Transaction, "id" | "created_at" | "updated_at" | "created_by">,
  { rejectValue: string }
>("transactions/createTransaction", async (newTxn, thunkAPI) => {
  try {
    let inserted: Transaction[] = [];

    if (newTxn.destination_source_id) {
      // Insert two transactions for transfer: debit + credit
      const { data, error } = await supabase
        .from("transactions")
        .insert([
          {
            date: newTxn.date,
            type_id: newTxn.type_id,
            category_id: newTxn.category_id ?? null,
            subcategory_id: newTxn.subcategory_id ?? null,
            source_id: newTxn.source_id ?? null,
            destination_source_id: newTxn.destination_source_id,
            amount: newTxn.amount,
            notes: newTxn.notes ?? null,
          },
          {
            date: newTxn.date,
            type_id: newTxn.type_id,
            category_id: newTxn.category_id ?? null,
            subcategory_id: newTxn.subcategory_id ?? null,
            source_id: newTxn.destination_source_id,
            destination_source_id: newTxn.source_id ?? null,
            amount: newTxn.amount,
            notes: newTxn.notes ?? null,
          },
        ])
        .select();

      if (error) throw error;
      inserted = data as Transaction[];
    } else {
      // Regular single transaction
      const { data, error } = await supabase
        .from("transactions")
        .insert([
          {
            date: newTxn.date,
            type_id: newTxn.type_id,
            category_id: newTxn.category_id ?? null,
            subcategory_id: newTxn.subcategory_id ?? null,
            source_id: newTxn.source_id ?? null,
            destination_source_id: null,
            amount: newTxn.amount,
            notes: newTxn.notes ?? null,
          },
        ])
        .select();

      if (error) throw error;
      inserted = data as Transaction[];
    }

    return inserted;
  } catch (err: unknown) {
    if (err instanceof Error) return thunkAPI.rejectWithValue(err.message);
    return thunkAPI.rejectWithValue("Failed to create transaction");
  }
});

// Update a transaction
export const updateTransaction = createAsyncThunk<
  Transaction,
  Transaction,
  { rejectValue: string }
>("transactions/updateTransaction", async (txn, thunkAPI) => {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .update({
        date: txn.date,
        type_id: txn.type_id,
        category_id: txn.category_id ?? null,
        subcategory_id: txn.subcategory_id ?? null,
        source_id: txn.source_id ?? null,
        destination_source_id: txn.destination_source_id ?? null,
        amount: txn.amount,
        notes: txn.notes ?? null,
      })
      .eq("id", txn.id)
      .select()
      .single();

    if (error) throw error;
    return data as Transaction;
  } catch (err: unknown) {
    if (err instanceof Error) return thunkAPI.rejectWithValue(err.message);
    return thunkAPI.rejectWithValue("Failed to update transaction");
  }
});

// Delete a transaction
export const removeTransaction = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("transactions/removeTransaction", async (id, thunkAPI) => {
  try {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) throw error;
    return id;
  } catch (err: unknown) {
    if (err instanceof Error) return thunkAPI.rejectWithValue(err.message);
    return thunkAPI.rejectWithValue("Failed to delete transaction");
  }
});

// -------------------------
// Slice
// -------------------------
export const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
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
        state.error = action.payload ?? "Failed to fetch transactions";
      })

      // Create
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(...action.payload);
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create transaction";
      })

      // Update
      .addCase(updateTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update transaction";
      })

      // Delete
      .addCase(removeTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((t) => t.id !== action.payload);
      })
      .addCase(removeTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to delete transaction";
      });
  },
});

// -------------------------
// Exports
// -------------------------
export const selectTransactions = (state: RootState) => state.transactions;
export default transactionsSlice.reducer;
