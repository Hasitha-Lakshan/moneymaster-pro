import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import {
  createTransaction,
  fetchTransactions,
  removeTransaction,
  updateTransaction,
} from "../store/features/transactionsSlice";
import { LoadingSpinner } from "../components/shared/LoadingSpinner";
import { Toast } from "../components/shared/Toast";

export const TransactionsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: transactions, loading } = useSelector(
    (state: RootState) => state.transactions
  );

  const { categories } = useSelector((state: RootState) => state.categories);
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const [formData, setFormData] = useState({
    category_id: "",
    amount: "",
    note: "",
  });

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const handleAdd = () => {
    if (!formData.category_id || !formData.amount) return;

    dispatch(
      createTransaction({
        amount: Number(formData.amount),
        category_id: formData.category_id, // use category_id (snake_case)
        note: formData.note, // use note instead of description
      })
    );

    setFormData({ category_id: "", amount: "", note: "" });
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      } min-h-screen p-6`}
    >
      {<Toast message="Data saved successfully!" type="success" />}
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="mb-6 flex gap-2">
            <select
              className="border p-2 rounded"
              value={formData.category_id}
              onChange={(e) =>
                setFormData({ ...formData, category_id: e.target.value })
              }
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Amount"
              className="border p-2 rounded"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Note"
              className="border p-2 rounded"
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
            />
            <button
              onClick={handleAdd}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Category</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Note</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id} className="border-t">
                  <td className="p-2">
                    {categories.find((c) => c.id === txn.category_id)?.name}
                  </td>
                  <td className="p-2">{txn.amount}</td>
                  <td className="p-2">{txn.note}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => dispatch(removeTransaction(txn.id))}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        dispatch(
                          updateTransaction({
                            ...txn,
                            note: txn.note + " (Updated)",
                          })
                        )
                      }
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};
