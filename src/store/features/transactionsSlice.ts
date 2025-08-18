import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabaseClient";

// -------------------------
// Transaction Type
// -------------------------
export interface Transaction {
  id: string;
  date: string;
  type_id: string;
  category_id?: string;
  subcategory_id?: string;
  source_id?: string;
  destination_source_id?: string;
  amount: number;
  notes?: string;
}

// -------------------------
// RPC Transfer Response Type
// -------------------------
interface RpcTransaction {
  transaction_id: string;
  transaction_date: string;
  transaction_type_id: string;
  transaction_category_id?: string | null;
  transaction_subcategory_id?: string | null;
  transaction_source_id?: string | null;
  destination_source_id?: string | null;
  transaction_amount: number;
  transaction_notes?: string | null;
}

// -------------------------
// Helper to convert RPC response to frontend Transaction
// -------------------------
const convertRpcToTransaction = (data: RpcTransaction[]): Transaction[] => {
  return data.map((item) => ({
    id: item.transaction_id,
    date: item.transaction_date,
    type_id: item.transaction_type_id,
    category_id: item.transaction_category_id || undefined,
    subcategory_id: item.transaction_subcategory_id || undefined,
    source_id: item.transaction_source_id || undefined,
    destination_source_id: item.destination_source_id || undefined,
    amount: item.transaction_amount,
    notes: item.transaction_notes || undefined,
  }));
};

// -------------------------
// Async Thunks
// -------------------------

// Fetch all transactions
export const fetchTransactions = createAsyncThunk<Transaction[]>(
  "transactions/fetchTransactions",
  async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false });

    if (error) throw error;
    return data as Transaction[];
  }
);

// Create transaction
export const createTransaction = createAsyncThunk<
  Transaction[],
  Omit<Transaction, "id">
>("transactions/createTransaction", async (payload) => {
  if (payload.destination_source_id) {
    // Transfer → call RPC
    const { data, error } = await supabase.rpc("create_transfer", {
      p_source_id: payload.source_id,
      p_destination_id: payload.destination_source_id,
      p_amount: payload.amount,
      p_date: payload.date,
      p_type_id: payload.type_id,
      p_category_id: payload.category_id,
      p_subcategory_id: payload.subcategory_id,
      p_notes: payload.notes,
    });
    if (error) throw error;

    return convertRpcToTransaction(data || []);
  } else {
    // Normal transaction → omit destination_source_id
    const normalPayload = { ...payload };
    delete normalPayload.destination_source_id;

    const { data, error } = await supabase
      .from("transactions")
      .insert([normalPayload])
      .select();

    if (error) throw error;
    return data as Transaction[];
  }
});

// Update transaction
export const updateTransaction = createAsyncThunk<Transaction[], Transaction>(
  "transactions/updateTransaction",
  async (payload) => {
    if (payload.destination_source_id) {
      // Transfer → call update_transfer RPC
      const transferCheck = await supabase
        .from("transfers")
        .select("id")
        .or(`transaction_from.eq.${payload.id},transaction_to.eq.${payload.id}`)
        .single();

      if (transferCheck.error) throw transferCheck.error;

      const { data, error } = await supabase.rpc("update_transfer", {
        p_transfer_id: transferCheck.data.id,
        p_amount: payload.amount,
        p_date: payload.date,
        p_type_id: payload.type_id,
        p_category_id: payload.category_id,
        p_subcategory_id: payload.subcategory_id,
        p_notes: payload.notes,
      });
      if (error) throw error;

      return convertRpcToTransaction(data || []);
    } else {
      // Normal transaction → omit destination_source_id
      const updatePayload = { ...payload };
      delete updatePayload.destination_source_id;

      const { data, error } = await supabase
        .from("transactions")
        .update(updatePayload)
        .eq("id", payload.id)
        .select();

      if (error) throw error;
      return data as Transaction[];
    }
  }
);

// Remove transaction (handles transfer or normal)
export const removeTransaction = createAsyncThunk<string[], string>(
  "transactions/removeTransaction",
  async (id) => {
    // First check if it's a transfer
    const transferCheck = await supabase
      .from("transfers")
      .select("id")
      .or(`transaction_from.eq.${id},transaction_to.eq.${id}`)
      .maybeSingle(); // <-- change here

    if (transferCheck.data) {
      // Transfer → call delete_transfer RPC
      const { data, error } = await supabase.rpc("delete_transfer", {
        p_transfer_id: transferCheck.data.id,
      });
      if (error) throw error;

      return (data || []).map(
        (row: { transaction_id: string }) => row.transaction_id
      );
    } else {
      // Normal transaction
      const { data, error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id)
        .select("id");
      if (error) throw error;

      return data.map((t) => t.id);
    }
  }
);

// -------------------------
// Slice
// -------------------------
interface TransactionsState {
  items: Transaction[];
  loading: boolean;
  error?: string;
}

const initialState: TransactionsState = {
  items: [],
  loading: false,
};

export const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        fetchTransactions.fulfilled,
        (state, action: PayloadAction<Transaction[]>) => {
          state.items = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        createTransaction.fulfilled,
        (state, action: PayloadAction<Transaction[]>) => {
          state.items = [...action.payload, ...state.items];
          state.loading = false;
        }
      )
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update
      .addCase(updateTransaction.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        updateTransaction.fulfilled,
        (state, action: PayloadAction<Transaction[]>) => {
          action.payload.forEach((updatedTxn) => {
            const index = state.items.findIndex((t) => t.id === updatedTxn.id);
            if (index !== -1) state.items[index] = updatedTxn;
          });
          state.loading = false;
        }
      )
      .addCase(updateTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete
      .addCase(removeTransaction.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        removeTransaction.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          state.items = state.items.filter(
            (t) => !action.payload.includes(t.id)
          );
          state.loading = false;
        }
      )
      .addCase(removeTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default transactionsSlice.reducer;
