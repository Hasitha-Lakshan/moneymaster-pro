import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabaseClient";

// Type
export interface Source {
  id: string;
  name: string;
  type: "Bank Account" | "Credit Card" | "Cash" | "Digital Wallet" | "Other";
  currency: string;
  initial_balance: number;
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

// Async thunk to fetch sources
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

    const { data, error } = await supabase
      .from("sources")
      .select("*")
      .eq("created_by", user.id)
      .order("name");

    if (error) throw error;

    return data as Source[];
  } catch (err) {
    const error = err as Error;
    return thunkAPI.rejectWithValue(error.message || "Failed to fetch sources");
  }
});

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
