import { useState } from "react";
import { Plus, Edit2, Trash2 } from "react-feather"; // or your icon library
import type { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { addSource } from "../store/features/sourcesSlice";
import { FinancialOverview } from "../components/FinancialOverview";

export const SourcesPage = () => {
  const dispatch = useDispatch();
  const sources = useSelector((state: RootState) => state.sources.sources);
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  // Local state for showing forms & editing
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSource, setEditingSource] = useState(null);

  // Form state
  const [sourceName, setSourceName] = useState("");
  const [sourceType, setSourceType] = useState("");
  const [creditLimit, setCreditLimit] = useState("");
  const [totalOutstanding, setTotalOutstanding] = useState("");
  const [initialBalance, setInitialBalance] = useState("");

  // Reset form fields helper
  const resetForm = () => {
    setSourceName("");
    setSourceType("");
    setCreditLimit("");
    setTotalOutstanding("");
    setInitialBalance("");
    setEditingSource(null);
  };

  // Handle form close
  const handleCloseForm = () => {
    resetForm();
    setShowAddForm(false);
  };

  // Calculate available credit helper for display
  const availableCredit =
    creditLimit && totalOutstanding
      ? parseFloat(creditLimit) - parseFloat(totalOutstanding)
      : 0;

  // Icons based on type
  const getSourceIcon = (type: string) => {
    switch (type) {
      case "bank":
        return "🏦";
      case "credit_card":
        return "💳";
      case "cash":
        return "💵";
      case "investment":
        return "📈";
      default:
        return "💰";
    }
  };

  // Balance color
  const getBalanceColor = (balance: number) => {
    if (balance < 0) return darkMode ? "text-red-400" : "text-red-600";
    if (balance > 10000) return darkMode ? "text-green-400" : "text-green-600";
    return darkMode ? "text-white" : "text-gray-900";
  };

  // Handle submit (mocked here, replace with actual save logic)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: add actual logic to save or update source
    alert("Form submitted. Implement your save logic!");
    handleCloseForm();
  };

  return (
    <>
      <FinancialOverview />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2
            className={`text-3xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Sources
          </h2>
          <button
            onClick={() => setShowAddForm(true)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              darkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Add Source</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sources.map((source) => (
            <div
              key={source.id}
              className={`p-6 rounded-lg border ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getSourceIcon(source.type)}</span>
                  <div>
                    <h3
                      className={`font-semibold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {source.name}
                    </h3>
                    <p
                      className={`text-sm capitalize ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {source.type.replace("_", " ")}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      dispatch(addSource(source));
                      setShowAddForm(true);
                    }}
                    className={`p-1 rounded ${
                      darkMode
                        ? "text-blue-400 hover:bg-gray-700"
                        : "text-blue-600 hover:bg-gray-100"
                    }`}
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => alert("Delete logic here")}
                    className={`p-1 rounded ${
                      darkMode
                        ? "text-red-400 hover:bg-gray-700"
                        : "text-red-600 hover:bg-gray-100"
                    }`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {source.type === "credit_card" ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Credit Limit
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      $
                      {source.credit_limit?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      }) || "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Outstanding
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        darkMode ? "text-red-400" : "text-red-600"
                      }`}
                    >
                      $
                      {source.total_outstanding?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      }) || "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Available Credit
                    </span>
                    <span
                      className={`text-lg font-bold ${getBalanceColor(
                        source.available_credit || 0
                      )}`}
                    >
                      $
                      {source.available_credit?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      }) || "0.00"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-right">
                  <p
                    className={`text-xs ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } mb-1`}
                  >
                    Balance
                  </p>
                  <p
                    className={`text-2xl font-bold ${getBalanceColor(
                      source.balance || 0
                    )}`}
                  >
                    $
                    {source.balance?.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    }) || "0.00"}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto`}
            >
              <h3
                className={`text-lg font-semibold mb-4 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {editingSource ? "Edit Source" : "Add Source"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Source Name *
                  </label>
                  <input
                    type="text"
                    value={sourceName}
                    onChange={(e) => setSourceName(e.target.value)}
                    placeholder="e.g., Chase Checking, Visa Card"
                    className={`w-full px-3 py-2 border rounded-md ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                    required
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Source Type *
                  </label>
                  <select
                    value={sourceType}
                    onChange={(e) => {
                      setSourceType(e.target.value);
                      // Reset credit card fields if type changes
                      if (e.target.value !== "credit_card") {
                        setCreditLimit("");
                        setTotalOutstanding("");
                      } else {
                        setInitialBalance("");
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-md ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="bank">Bank Account</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="cash">Cash</option>
                    <option value="investment">Investment Account</option>
                  </select>
                </div>

                {sourceType === "credit_card" ? (
                  <>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Credit Limit *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={creditLimit}
                        onChange={(e) => setCreditLimit(e.target.value)}
                        placeholder="5000.00"
                        className={`w-full px-3 py-2 border rounded-md ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        }`}
                        required
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Total Outstanding *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={totalOutstanding}
                        onChange={(e) => setTotalOutstanding(e.target.value)}
                        placeholder="850.00"
                        className={`w-full px-3 py-2 border rounded-md ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        }`}
                        required
                      />
                      <p
                        className={`text-xs mt-1 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Current amount owed on the credit card
                      </p>
                    </div>

                    {creditLimit && totalOutstanding && (
                      <div
                        className={`p-3 rounded-md ${
                          darkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}
                      >
                        <div className="flex justify-between text-sm">
                          <span
                            className={`${
                              darkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            Available Credit:
                          </span>
                          <span
                            className={`font-medium ${
                              availableCredit > 1000
                                ? darkMode
                                  ? "text-green-400"
                                  : "text-green-600"
                                : darkMode
                                ? "text-red-400"
                                : "text-red-600"
                            }`}
                          >
                            $
                            {availableCredit.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  sourceType && (
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Initial Balance *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={initialBalance}
                        onChange={(e) => setInitialBalance(e.target.value)}
                        placeholder="1000.00"
                        className={`w-full px-3 py-2 border rounded-md ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        }`}
                        required
                      />
                    </div>
                  )
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className={`flex-1 px-4 py-2 border rounded-md transition-colors ${
                      darkMode
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {editingSource ? "Update" : "Add"} Source
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
