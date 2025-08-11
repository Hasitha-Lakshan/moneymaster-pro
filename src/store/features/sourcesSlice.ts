import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface Source {
  id: string;
  name: string;
  type: "bank" | "credit_card" | "cash" | "investment" | string;
  credit_limit?: number;
  total_outstanding?: number;
  balance?: number;
  available_credit?: number;
}

interface SourcesState {
  sources: Source[];
}

const initialState: SourcesState = {
  sources: [
    // Example seed data
    {
      id: "1",
      name: "Chase Checking",
      type: "bank",
      balance: 3500,
    },
    {
      id: "2",
      name: "Visa Credit Card",
      type: "credit_card",
      credit_limit: 5000,
      total_outstanding: 850,
      available_credit: 4150,
    },
  ],
};

const sourcesSlice = createSlice({
  name: "sources",
  initialState,
  reducers: {
    addSource(state, action: PayloadAction<Source>) {
      state.sources.push(action.payload);
    },
    updateSource(state, action: PayloadAction<Source>) {
      const index = state.sources.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.sources[index] = action.payload;
      }
    },
    deleteSource(state, action: PayloadAction<string>) {
      state.sources = state.sources.filter((s) => s.id !== action.payload);
    },
  },
});

export const { addSource, updateSource, deleteSource } = sourcesSlice.actions;

export default sourcesSlice.reducer;
