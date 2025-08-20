import { useEffect } from "react";
import { LoadingSpinner } from "../components/shared/LoadingSpinner";
import { fetchTransactions } from "../store/features/transactionsSlice";
import { fetchCategories } from "../store/features/categoriesSlice";
import { fetchSources } from "../store/features/sourcesSlice";
import { fetchTransactionTypes } from "../store/features/transactionTypesSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  PieChart,
  CreditCard,
  Plus,
  Settings,
  CreditCard as SourcesIcon,
} from "react-feather";

export const HomePage = () => {
  const dispatch = useAppDispatch();

  const { loading: catLoading, categories } = useAppSelector(
    (state) => state.categories
  );
  const { loading: txnLoading, items: transactions } = useAppSelector(
    (state) => state.transactions
  );
  const { loading: srcLoading, sources } = useAppSelector(
    (state) => state.sources
  );
  const { types: transactionTypes, loading: typeLoading } = useAppSelector(
    (state) => state.transactionTypes
  );

  // Fetch all required data on mount
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchTransactions());
    dispatch(fetchSources());
    dispatch(fetchTransactionTypes());
  }, [dispatch]);

  // Add type_name to transactions for display
  const transactionsWithTypeName = transactions.map((txn) => {
    const type = transactionTypes.find((t) => t.id === Number(txn.type_id));
    let direction: "in" | "out" = "out";

    if (type?.name === "Income") direction = "in";
    else if (type?.name === "Expense") direction = "out";
    else if (type?.name === "Transfer") direction = "out"; // could be enhanced
    else if (type?.name === "Borrow") direction = "in";
    else if (type?.name === "Lend") direction = "out";
    else if (type?.name === "Payment") direction = "out";
    else if (type?.name === "Investment") direction = "out";

    return { ...txn, type_name: type?.name || "", direction };
  });

  const totalBalance = sources.reduce((acc, s) => acc + (s.balance || 0), 0);

  const recentTxns = [...transactionsWithTypeName]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const loading = catLoading || txnLoading || srcLoading || typeLoading;

  return (
    <div className="min-h-screen p-6 bg-background text-foreground">
      {loading ? (
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-muted-foreground mt-4">
              Loading your home...
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-card-foreground">Home</h1>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <div className="p-6 border-2 border-border rounded-2xl bg-card shadow-pastel transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-xl bg-primary/10 mr-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-muted-foreground">
                    Total Balance
                  </h2>
                  <p className="text-2xl font-bold text-card-foreground">
                    ${totalBalance.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-2 border-border rounded-2xl bg-card shadow-pastel transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-xl bg-accent/10 mr-4">
                  <PieChart className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h2 className="font-semibold text-muted-foreground">
                    Categories
                  </h2>
                  <p className="text-2xl font-bold text-card-foreground">
                    {categories.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-2 border-border rounded-2xl bg-card shadow-pastel transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-xl bg-secondary/10 mr-4">
                  <CreditCard className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h2 className="font-semibold text-muted-foreground">
                    Transactions
                  </h2>
                  <p className="text-2xl font-bold text-card-foreground">
                    {transactions.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="mb-8 p-6 border-2 border-border rounded-2xl bg-card shadow-pastel">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-card-foreground">
                Recent Transactions
              </h2>
              <Link
                to="/transactions"
                className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                View all
              </Link>
            </div>

            {recentTxns.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">
                No recent transactions
              </p>
            ) : (
              <ul className="space-y-3">
                {recentTxns.map((txn) => (
                  <li
                    key={txn.id}
                    className="flex justify-between items-center p-4 border-2 border-border rounded-xl bg-background hover:bg-muted/20 transition-all duration-200"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-card-foreground">
                        {txn.notes || txn.type_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(txn.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`font-semibold text-lg ${
                        txn.direction === "in"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {txn.direction === "in" ? "+" : "-"}$
                      {txn.amount.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quick Links */}
          <div className="grid gap-6 md:grid-cols-3">
            <Link
              to="/transactions"
              className="p-6 border-2 border-border rounded-2xl bg-card text-center hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 group shadow-pastel hover:shadow-pastel-lg"
            >
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-card-foreground mb-2">
                  Add Transaction
                </h3>
                <p className="text-sm text-muted-foreground">
                  Record new income or expense
                </p>
              </div>
            </Link>

            <Link
              to="/categories"
              className="p-6 border-2 border-border rounded-2xl bg-card text-center hover:bg-accent/10 hover:border-accent/50 transition-all duration-300 group shadow-pastel hover:shadow-pastel-lg"
            >
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-xl bg-accent/10 mb-4 group-hover:bg-accent/20 transition-colors">
                  <Settings className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-card-foreground mb-2">
                  Manage Categories
                </h3>
                <p className="text-sm text-muted-foreground">
                  Organize your finances
                </p>
              </div>
            </Link>

            <Link
              to="/sources"
              className="p-6 border-2 border-border rounded-2xl bg-card text-center hover:bg-secondary/10 hover:border-secondary/50 transition-all duration-300 group shadow-pastel hover:shadow-pastel-lg"
            >
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-xl bg-secondary/10 mb-4 group-hover:bg-secondary/20 transition-colors">
                  <SourcesIcon className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-semibold text-card-foreground mb-2">
                  View Sources
                </h3>
                <p className="text-sm text-muted-foreground">
                  Manage your accounts
                </p>
              </div>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};
