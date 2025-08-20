import { LoadingSpinner } from "../components/shared/LoadingSpinner";
import { SummaryCard } from "../components/home/SummaryCard";
import { RecentTransactions } from "../components/home/RecentTransactions";
import { QuickLink } from "../components/home/QuickLink";
import { useHomeData } from "../hooks/useHomeData";
import {
  TrendingUp,
  PieChart,
  CreditCard,
  Plus,
  Settings,
} from "react-feather";

export const HomePage = () => {
  const { categories, recentTransactions, totalBalance, loading } =
    useHomeData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-muted-foreground mt-4">Loading your home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-background text-foreground">
      <h1 className="text-3xl font-bold text-card-foreground mb-8">Home</h1>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <SummaryCard
          icon={<TrendingUp className="h-6 w-6 text-primary" />}
          label="Total Balance"
          value={`$${totalBalance.toFixed(2)}`}
        />
        <SummaryCard
          icon={<PieChart className="h-6 w-6 text-accent" />}
          label="Categories"
          value={categories.length}
        />
        <SummaryCard
          icon={<CreditCard className="h-6 w-6 text-secondary" />}
          label="Transactions"
          value={recentTransactions.length}
        />
      </div>

      {/* Recent Transactions */}
      <div className="mb-8 p-6 border-2 border-border rounded-2xl bg-card shadow-pastel">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-card-foreground">
            Recent Transactions
          </h2>
        </div>
        <RecentTransactions transactions={recentTransactions} />
      </div>

      {/* Quick Links */}
      <div className="grid gap-6 md:grid-cols-3">
        <QuickLink
          to="/transactions"
          icon={<Plus className="h-8 w-8 text-primary" />}
          title="Add Transaction"
          description="Record new income or expense"
          hoverColorClass="bg-primary/10 border-primary/50"
        />
        <QuickLink
          to="/categories"
          icon={<Settings className="h-8 w-8 text-accent" />}
          title="Manage Categories"
          description="Organize your finances"
          hoverColorClass="bg-accent/10 border-accent/50"
        />
        <QuickLink
          to="/sources"
          icon={<CreditCard className="h-8 w-8 text-secondary" />}
          title="View Sources"
          description="Manage your accounts"
          hoverColorClass="bg-secondary/10 border-secondary/50"
        />
      </div>
    </div>
  );
};
