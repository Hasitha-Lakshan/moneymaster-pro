import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { supabase } from "../../lib/supabaseClient";

// -------------------------
// Transaction Type (Updated to match database response)
// -------------------------
export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category_id?: string;
  type_id: string;
  subcategory_id?: string;
  source_id?: string;
  destination_source_id?: string; // frontend reference for transfers
  notes?: string;
}

// Database response type for transfers
interface TransferResponse {
  transaction_id: string;
  transaction_date: string;
  transaction_amount: number;
  transaction_category_id?: string;
  transaction_type_id: string;
  transaction_subcategory_id?: string;
  transaction_source_id?: string;
  transaction_notes?: string;
  transaction_created_at: string;
  transaction_updated_at: string;
  transaction_created_by: string;
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

// Helper function to convert database response to frontend format
const convertTransferResponse = (transferData: TransferResponse[]): Transaction[] => {
  return transferData.map(item => ({
    id: item.transaction_id,
    date: item.transaction_date,
    amount: item.transaction_amount,
    category_id: item.transaction_category_id || undefined,
    type_id: item.transaction_type_id,
    subcategory_id: item.transaction_subcategory_id || undefined,
    source_id: item.transaction_source_id || undefined,
    notes: item.transaction_notes || undefined,
  }));
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
    return thunkAPI.rejectWithValue("An unknown error occurred");
  }
});

// Create transaction (regular or transfer)
export const createTransaction = createAsyncThunk<
  Transaction[],
  Omit<Transaction, "id">,
  { rejectValue: string }
>("transactions/createTransaction", async (newTxn, thunkAPI) => {
  try {
    // ---------------------
    // Handle Transfer
    // ---------------------
    if (newTxn.destination_source_id) {
      const { data, error } = await supabase.rpc("create_transfer", {
        p_source_id: newTxn.source_id,
        p_destination_id: newTxn.destination_source_id,
        p_amount: newTxn.amount,
        p_date: newTxn.date,
        p_type_id: newTxn.type_id,
        p_category_id: newTxn.category_id ?? null,
        p_subcategory_id: newTxn.subcategory_id ?? null,
        p_notes: newTxn.notes ?? null,
      });
      if (error) throw error;

      // Convert database response format to frontend format
      return convertTransferResponse(data as TransferResponse[]);
    }

    // ---------------------
    // Regular transaction
    // ---------------------
    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          date: newTxn.date,
          type_id: newTxn.type_id,
          category_id: newTxn.category_id,
          subcategory_id: newTxn.subcategory_id,
          source_id: newTxn.source_id,
          amount: newTxn.amount,
          notes: newTxn.notes,
        },
      ])
      .select();
    if (error) throw error;

    return data as Transaction[];
  } catch (err: unknown) {
    if (err instanceof Error) return thunkAPI.rejectWithValue(err.message);
    return thunkAPI.rejectWithValue("Failed to create transaction");
  }
});

// Update transaction
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
        category_id: txn.category_id,
        subcategory_id: txn.subcategory_id,
        source_id: txn.source_id,
        amount: txn.amount,
        notes: txn.notes,
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

// -------------------------
// Slice
// -------------------------
export const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    removeTransaction: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
  },
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
        // Insert all returned transactions (regular or both sides of a transfer)
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
      });
  },
});

export const { removeTransaction } = transactionsSlice.actions;
export const selectTransactions = (state: RootState) => state.transactions;
export default transactionsSlice.reducer;