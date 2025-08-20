import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchDashboardData } from "../store/features/dashboardSlice";

export const useDashboard = () => {
  const dispatch = useAppDispatch();
  const {
    sourceBalances,
    lending,
    borrowing,
    monthlySummary,
    investmentSummary,
    loading,
    error,
  } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  return {
    sourceBalances,
    lending,
    borrowing,
    monthlySummary,
    investmentSummary,
    loading,
    error,
  };
};
