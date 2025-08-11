import { useEffect } from "react";
import { LoadingSpinner } from "../components/shared/LoadingSpinner";
import { fetchTransactions } from "../store/features/transactionsSlice";
import { fetchCategories } from "../store/features/categoriesSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

export const HomePage = () => {
  const dispatch = useAppDispatch();
  const { loading: catLoading } = useAppSelector((state) => state.categories);
  const { loading: txnLoading } = useAppSelector((state) => state.transactions);
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchTransactions());
  }, [dispatch]);

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      } min-h-screen p-6`}
    >
      {/* rest of your HomePage */}
      <h1 className="text-3xl font-bold mb-4">
        Welcome to Your Finance Dashboard
      </h1>

      {catLoading || txnLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 border rounded shadow">
            <h2 className="font-semibold mb-2">Categories Overview</h2>
            <p>View and manage your expense categories.</p>
          </div>
          <div className="p-4 border rounded shadow">
            <h2 className="font-semibold mb-2">Recent Transactions</h2>
            <p>Quick glance at your latest spending.</p>
          </div>
        </div>
      )}
    </div>
  );
};
