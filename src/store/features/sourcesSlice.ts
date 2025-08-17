import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabaseClient";

// -------------------------
// Types
// -------------------------
export interface Source {
  id: string;
  name: string;
  type:
    | "Bank Account"
    | "Credit Card"
    | "Cash"
    | "Digital Wallet"
    | "Investment"
    | "Other";
  currency: string;
  balance?: number; // for UI display
  credit_limit?: number;
  total_outstanding?: number;
  available_credit?: number;
  interest_rate?: number;
  billing_cycle_start?: number;
  notes?: string;
}

interface SourcesState {
  sources: Source[];
  loading: boolean;
  error?: string | null;
}

const initialState: SourcesState = {
  sources: [],
  loading: false,
  error: null,
};

// -------------------------
interface SupabaseSource {
  id: string;
  name: string;
  type:
    | "Bank Account"
    | "Credit Card"
    | "Cash"
    | "Digital Wallet"
    | "Investment"
    | "Other";
  currency: string;
  current_balance?: string | number;
  notes?: string;
  credit_card_details?: {
    credit_limit?: string | number;
    interest_rate?: string | number;
    billing_cycle_start?: number;
  } | null;
}

// Async Thunk to fetch sources
// -------------------------
export const fetchSources = createAsyncThunk<
  Source[],
  void,
  { rejectValue: string }
>("sources/fetchSources", async (_, thunkAPI) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not logged in");

    // Fetch sources + credit card details
    const { data, error } = await supabase
      .from("sources")
      .select(
        `
        *,
        credit_card_details (
          credit_limit,
          interest_rate,
          billing_cycle_start
        )
      `
      )
      .eq("created_by", user.id)
      .order("name");

    if (error) throw error;

    // Map response to Source[]
    const mappedSources: Source[] = ((data as SupabaseSource[]) || []).map(
      (s) => {
        const cc = s.credit_card_details ?? null; // null if no details
        return {
          id: s.id,
          name: s.name,
          type: s.type,
          currency: s.currency,
          balance: Number(s.current_balance || 0),
          credit_limit: cc ? Number(cc.credit_limit) : undefined,
          interest_rate: cc ? Number(cc.interest_rate) : undefined,
          billing_cycle_start: cc ? cc.billing_cycle_start : undefined,
          available_credit:
            s.type === "Credit Card"
              ? cc
                ? Number(cc.credit_limit) - Number(s.current_balance || 0)
                : 0
              : undefined,
          notes: s.notes,
        };
      }
    );

    return mappedSources;
  } catch (err) {
    const error = err as Error;
    return thunkAPI.rejectWithValue(error.message || "Failed to fetch sources");
  }
});

// -------------------------
// Slice
// -------------------------
const sourcesSlice = createSlice({
  name: "sources",
  initialState,
  reducers: {
    addSource(state, action: PayloadAction<Source>) {
      state.sources.push(action.payload);
    },
    updateSource(state, action: PayloadAction<Source>) {
      const index = state.sources.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) state.sources[index] = action.payload;
    },
    deleteSource(state, action: PayloadAction<string>) {
      state.sources = state.sources.filter((s) => s.id !== action.payload);
    },
    setSources(state, action: PayloadAction<Source[]>) {
      state.sources = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSources.fulfilled, (state, action) => {
        state.loading = false;
        state.sources = action.payload;
      })
      .addCase(fetchSources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { addSource, updateSource, deleteSource, setSources } =
  sourcesSlice.actions;
export default sourcesSlice.reducer;
