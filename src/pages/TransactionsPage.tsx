import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import {
  createTransaction,
  fetchTransactions,
  removeTransaction,
  updateTransaction,
  type Transaction,
} from "../store/features/transactionsSlice";
import { fetchCategories } from "../store/features/categoriesSlice";
import { fetchTransactionTypes } from "../store/features/transactionTypesSlice";
import { fetchSources } from "../store/features/sourcesSlice";
import { LoadingSpinner } from "../components/shared/LoadingSpinner";
import { Toast } from "../components/shared/Toast";
import { Edit, Trash2 } from "react-feather";

export const TransactionsPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const { items: transactions, loading: txnLoading } = useSelector(
    (state: RootState) => state.transactions
  );
  const {
    categories,
    subCategories,
    loading: catLoading,
  } = useSelector((state: RootState) => state.categories);
  const { types: transactionTypes, loading: typeLoading } = useSelector(
    (state: RootState) => state.transactionTypes
  );
  const { sources, loading: sourcesLoading } = useSelector(
    (state: RootState) => state.sources
  );
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  // Local state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    type_id: "",
    category_id: "",
    subcategory_id: "",
    source_id: "",
    destination_source_id: "",
    amount: "",
    notes: "",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string>("");

  // Fetch all data on mount
  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchCategories());
    dispatch(fetchTransactionTypes());
    dispatch(fetchSources());
  }, [dispatch]);

  const selectedTypeName =
    transactionTypes
      .find((t) => t.id.toString() === formData.type_id)
      ?.name.toLowerCase() || "";

  const isTransfer = selectedTypeName === "transfer";

  // Add / Update transaction
  const handleSubmit = () => {
    if (!formData.type_id || !formData.amount) {
      setToastMessage("Type and amount are required.");
      return;
    }

    if (
      isTransfer &&
      (!formData.destination_source_id ||
        formData.destination_source_id === formData.source_id)
    ) {
      setToastMessage("Please select a valid destination for the transfer.");
      return;
    }

    const payload: Omit<Transaction, "id"> = {
      date: formData.date,
      type_id: Number(formData.type_id),
      category_id: isTransfer ? undefined : formData.category_id,
      subcategory_id: isTransfer
        ? undefined
        : formData.subcategory_id || undefined,
      source_id: formData.source_id || undefined,
      destination_source_id: formData.destination_source_id || undefined,
      amount: Number(formData.amount),
      notes: formData.notes,
    };

    if (editId) {
      dispatch(updateTransaction({ id: editId, ...payload }));
      setToastMessage("Transaction updated successfully!");
      setEditId(null);
    } else {
      dispatch(createTransaction(payload));
      setToastMessage("Transaction added successfully!");
    }

    setFormData({
      date: new Date().toISOString().split("T")[0],
      type_id: "",
      category_id: "",
      subcategory_id: "",
      source_id: "",
      destination_source_id: "",
      amount: "",
      notes: "",
    });
  };

  const handleEdit = (txn: Transaction) => {
    const txnTypeName =
      transactionTypes.find((t) => t.id === txn.type_id)?.name.toLowerCase() ||
      "";
    setEditId(txn.id);
    setFormData({
      date: txn.date,
      type_id: txn.type_id.toString() || "",
      category_id: txnTypeName === "transfer" ? "" : txn.category_id || "",
      subcategory_id:
        txnTypeName === "transfer" ? "" : txn.subcategory_id || "",
      source_id: txn.source_id || "",
      destination_source_id: txn.destination_source_id || "",
      amount: txn.amount.toString(),
      notes: txn.notes || "",
    });
  };

  const isLoading = txnLoading || catLoading || typeLoading || sourcesLoading;

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } min-h-screen p-6`}
    >
      {toastMessage && <Toast message={toastMessage} type="success" />}

      <h1 className="text-3xl font-bold mb-6">Transactions</h1>

      {/* Form */}
      <div
        className={`p-6 rounded shadow mb-6 ${
          darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "Edit Transaction" : "Add Transaction"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date */}
          <input
            type="date"
            className={`border p-2 rounded w-full ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600 placeholder-gray-300"
                : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
            }`}
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />

          {/* Type */}
          <select
            className={`border p-2 rounded w-full ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600 placeholder-gray-300"
                : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
            }`}
            value={formData.type_id}
            onChange={(e) =>
              setFormData({ ...formData, type_id: e.target.value })
            }
          >
            <option value="">Select Type</option>
            {transactionTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* Category & Subcategory only if not transfer */}
          {!isTransfer && (
            <>
              <select
                className={`border p-2 rounded w-full ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600 placeholder-gray-300"
                    : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
                }`}
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category_id: e.target.value,
                    subcategory_id: "",
                  })
                }
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                className={`border p-2 rounded w-full ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600 placeholder-gray-300"
                    : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
                }`}
                value={formData.subcategory_id}
                onChange={(e) =>
                  setFormData({ ...formData, subcategory_id: e.target.value })
                }
              >
                <option value="">Select Subcategory</option>
                {subCategories
                  .filter((s) => s.category_id === formData.category_id)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </>
          )}

          {/* Source */}
          <select
            className={`border p-2 rounded w-full ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600 placeholder-gray-300"
                : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
            }`}
            value={formData.source_id}
            onChange={(e) =>
              setFormData({ ...formData, source_id: e.target.value })
            }
          >
            <option value="">Select Source</option>
            {sources.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Destination - only for transfer */}
          {isTransfer && (
            <select
              className={`border p-2 rounded w-full ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600 placeholder-gray-300"
                  : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
              }`}
              value={formData.destination_source_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  destination_source_id: e.target.value,
                })
              }
            >
              <option value="">Select Destination</option>
              {sources
                .filter((s) => s.id !== formData.source_id)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
          )}

          {/* Amount */}
          <input
            type="number"
            placeholder="Amount"
            className={`border p-2 rounded w-full ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600 placeholder-gray-300"
                : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
            }`}
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
          />

          {/* Notes */}
          <input
            type="text"
            placeholder="Notes"
            className={`border p-2 rounded w-full md:col-span-2 ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600 placeholder-gray-300"
                : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
            }`}
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
          />

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-4 py-2 rounded w-full md:col-span-1"
          >
            {editId ? "Update" : "Add"}
          </button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-x-auto">
          <table
            className={`w-full border-collapse shadow rounded ${
              darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
            }`}
          >
            <thead>
              <tr className={`${darkMode ? "bg-gray-800" : "bg-gray-200"}`}>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Subcategory</th>
                <th className="p-3 text-left">Source</th>
                <th className="p-3 text-left">Destination</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Notes</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => {
                const typeName =
                  transactionTypes.find((t) => t.id === txn.type_id)
                    ?.name || "-";
                const isTxnTransfer = !!txn.destination_source_id;

                return (
                  <tr
                    key={txn.id}
                    className={`border-t ${
                      darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="p-2">{txn.date}</td>
                    <td className="p-2">
                      {isTxnTransfer ? "Transfer" : typeName}
                    </td>
                    <td className="p-2">
                      {categories.find((c) => c.id === txn.category_id)?.name ||
                        "-"}
                    </td>
                    <td className="p-2">
                      {subCategories.find((s) => s.id === txn.subcategory_id)
                        ?.name || "-"}
                    </td>
                    <td className="p-2">
                      {sources.find((s) => s.id === txn.source_id)?.name}
                    </td>
                    <td className="p-2">
                      {txn.destination_source_id
                        ? sources.find(
                            (s) => s.id === txn.destination_source_id
                          )?.name
                        : "-"}
                    </td>
                    <td className="p-2">{txn.amount.toFixed(2)}</td>
                    <td className="p-2">{txn.notes || "-"}</td>
                    <td className="p-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(txn)}
                        className="text-yellow-500 hover:text-yellow-700"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => dispatch(removeTransaction(txn.id))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
