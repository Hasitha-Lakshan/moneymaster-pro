import React from "react";
import { useDashboard } from "../hooks/useDashboard";
import { DollarSign, TrendingUp, TrendingDown } from "react-feather";
import { DashboardCard } from "../components/dashboard/DashboardCard";
import { DashboardList } from "../components/dashboard/DashboardList";
import type {
  LendingOutstanding,
  BorrowingOutstanding,
  InvestmentSummary,
  MonthlySummary,
} from "../types/dashboard";
import { LoadingSpinner } from "../components/shared/LoadingSpinner";

type SourceBalance = {
  source_id: string;
  source_name: string;
  current_balance: number;
};

export const DashboardPage: React.FC<{ darkMode: boolean }> = () => {
  const {
    sourceBalances,
    lending,
    borrowing,
    monthlySummary,
    investmentSummary,
    loading,
  } = useDashboard();

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-muted-foreground mt-4">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );

  const totalBalance: number = sourceBalances.reduce(
    (sum: number, s: SourceBalance) => sum + (s.current_balance ?? 0),
    0
  );

  const totalLending: number = lending.reduce(
    (sum: number, l: LendingOutstanding) => sum + (l.current_outstanding ?? 0),
    0
  );

  const totalBorrowing: number = borrowing.reduce(
    (sum: number, b: BorrowingOutstanding) =>
      sum + (b.current_outstanding ?? 0),
    0
  );

  return (
    <div className="min-h-screen p-6 bg-background text-foreground">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-card-foreground">Dashboard</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Total Balance"
          value={totalBalance}
          icon={<DollarSign className="h-6 w-6" />}
          variant="default"
        />
        <DashboardCard
          title="Lending Outstanding"
          value={totalLending}
          icon={<TrendingUp className="h-6 w-6" />}
          variant="default"
        />
        <DashboardCard
          title="Borrowing Outstanding"
          value={totalBorrowing}
          icon={<TrendingDown className="h-6 w-6" />}
          variant="default"
        />
      </div>

      {/* Lending & Borrowing Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <DashboardList
          title="Lending"
          items={lending.map((l: LendingOutstanding) => ({
            id: l.transaction_id,
            label: l.person_name ?? "-",
            value: l.current_outstanding ?? 0,
          }))}
          valueColor="text-blue-500"
        />
        <DashboardList
          title="Borrowing"
          items={borrowing.map((b: BorrowingOutstanding) => ({
            id: b.transaction_id,
            label: b.person_name ?? "-",
            value: b.current_outstanding ?? 0,
          }))}
          valueColor="text-red-500"
        />
      </div>

      {/* Investments & Monthly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <DashboardList
          title="Investments"
          items={investmentSummary.map((i: InvestmentSummary) => ({
            id: i.source_id,
            label: i.source_name ?? "-",
            value: i.total_value ?? 0,
          }))}
          valueColor="text-green-500"
        />
        <DashboardList
          title="Monthly Summary"
          items={monthlySummary.map((m: MonthlySummary) => {
            const net = (m.total_income ?? 0) - (m.total_expense ?? 0);
            return {
              id: m.month,
              label: new Date(m.month).toLocaleString("default", {
                month: "short",
                year: "numeric",
              }),
              value: net,
            };
          })}
          valueColor={(m) => (m.value >= 0 ? "text-green-500" : "text-red-500")}
        />
      </div>
    </div>
  );
};
