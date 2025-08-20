import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabaseClient";
import type {
  SourceBalance,
  LendingOutstanding,
  BorrowingOutstanding,
  MonthlySummary,
  InvestmentSummary,
} from "../../types/dashboard";

interface DashboardState {
  sourceBalances: SourceBalance[];
  lending: LendingOutstanding[];
  borrowing: BorrowingOutstanding[];
  monthlySummary: MonthlySummary[];
  investmentSummary: InvestmentSummary[];
  loading: boolean;
  error?: string;
}

const initialState: DashboardState = {
  sourceBalances: [],
  lending: [],
  borrowing: [],
  monthlySummary: [],
  investmentSummary: [],
  loading: true,
};

// Fetch dashboard data from Supabase RLS materialized view RPCs
export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const [
        { data: balances },
        { data: lending },
        { data: borrowing },
        { data: monthly },
        { data: investment },
      ] = await Promise.all([
        supabase.from("mv_source_balances").select("*"),
        supabase.from("mv_lending_outstanding").select("*"),
        supabase.from("mv_borrowing_outstanding").select("*"),
        supabase.from("mv_monthly_summary").select("*"),
        supabase.from("mv_investment_summary").select("*"),
      ]);

      return { balances, lending, borrowing, monthly, investment };
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue("Unknown error");
    }
  }
);

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.sourceBalances = action.payload.balances || [];
        state.lending = action.payload.lending || [];
        state.borrowing = action.payload.borrowing || [];
        state.monthlySummary = action.payload.monthly || [];
        state.investmentSummary = action.payload.investment || [];
        state.loading = false;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;
