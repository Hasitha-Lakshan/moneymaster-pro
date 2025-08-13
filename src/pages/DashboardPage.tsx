import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { fetchCategories } from "../store/features/categoriesSlice";
import { fetchTransactions } from "../store/features/transactionsSlice";
import { LoadingSpinner } from "../components/shared/LoadingSpinner";
import { Toast } from "../components/shared/Toast";
import { FinancialOverview } from "../components/FinancialOverview";

export const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: transactions, loading: txnLoading } = useSelector(
    (state: RootState) => state.transactions
  );
  const { categories, loading: catLoading } = useSelector(
    (state: RootState) => state.categories
  );
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchTransactions());
  }, [dispatch]);

  // Compute total income, expense, investments, transfers
  const totalByType = categories.reduce((acc, cat) => {
    const catTxns = transactions.filter((t) => t.category_id === cat.id);
    const sum = catTxns.reduce((s, t) => s + t.amount, 0);
    acc[cat.type] = (acc[cat.type] || 0) + sum;
    return acc;
  }, {} as Record<string, number>);

  // Color badges like your categories page
  const getTypeColor = (type: string) => {
    switch (type) {
      case "income":
        return darkMode
          ? "text-green-400 bg-green-400/10"
          : "text-green-700 bg-green-100";
      case "expense":
        return darkMode
          ? "text-red-400 bg-red-400/10"
          : "text-red-700 bg-red-100";
      case "investment":
        return darkMode
          ? "text-blue-400 bg-blue-400/10"
          : "text-blue-700 bg-blue-100";
      case "transfer":
        return darkMode
          ? "text-purple-400 bg-purple-400/10"
          : "text-purple-700 bg-purple-100";
      default:
        return darkMode
          ? "text-gray-400 bg-gray-400/10"
          : "text-gray-700 bg-gray-100";
    }
  };

  // Sort transactions descending by date if date exists, fallback on id descending
  const sortedTxns = [...transactions].sort((a, b) => {
    if (a.date && b.date)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    return b.id.localeCompare(a.id);
  });

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } min-h-screen p-6`}
    >
      {<Toast message="Dashboard loaded successfully!" type="success" />}
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {txnLoading || catLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <FinancialOverview />

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {["income", "expense", "investment", "transfer"].map((type) => (
              <div
                key={type}
                className={`p-4 rounded-lg border ${
                  darkMode
                    ? "border-gray-700 bg-gray-800"
                    : "border-gray-200 bg-gray-50"
                } flex flex-col items-center`}
              >
                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2 ${getTypeColor(
                    type
                  )}`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </div>
                <div className="text-2xl font-bold">
                  ${totalByType[type]?.toFixed(2) || "0.00"}
                </div>
              </div>
            ))}
          </div>

          {/* Recent Transactions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>

            {sortedTxns.length === 0 ? (
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                No transactions found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse border border-gray-300 dark:border-gray-700">
                  <thead>
                    <tr
                      className={`${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
                    >
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">
                        Category
                      </th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">
                        Amount
                      </th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">
                        Date
                      </th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">
                        Note
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTxns.slice(0, 10).map((txn) => {
                      const category = categories.find(
                        (c) => c.id === txn.category_id
                      );
                      return (
                        <tr
                          key={txn.id}
                          className={`${
                            darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                          }`}
                        >
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 flex items-center gap-2">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                category
                                  ? getTypeColor(category.type)
                                  : "text-gray-500 bg-gray-200"
                              }`}
                            >
                              {category?.name || "Unknown"}
                            </span>
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                            ${txn.amount.toFixed(2)}
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                            {txn.date
                              ? new Date(txn.date).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                            {txn.note || "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
