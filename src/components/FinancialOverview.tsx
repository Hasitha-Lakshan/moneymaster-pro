import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { DollarSign, Users, TrendingUp, TrendingDown } from "react-feather";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

type SourceBalance = {
  source_id: string;
  source_name: string;
  currency: string;
  created_by: string;
  current_balance: number;
};

type LendingOutstanding = {
  transaction_id: string;
  person_name: string | null;
  lent_amount: number;
  initial_outstanding: number;
  outstanding_balance: number;
  created_by: string;
};

type BorrowingOutstanding = {
  transaction_id: string;
  person_name: string | null;
  borrowed_amount: number;
  initial_outstanding: number;
  outstanding_balance: number;
  created_by: string;
};

export function FinancialOverview() {
  const [balances, setBalances] = useState<SourceBalance[]>([]);
  const [lending, setLending] = useState<LendingOutstanding[]>([]);
  const [borrowing, setBorrowing] = useState<BorrowingOutstanding[]>([]);
  const [loading, setLoading] = useState(true);
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const { data: sourceBalancesData, error: sourceBalancesError } =
        await supabase.rpc("get_source_balances");
      const { data: lendingData, error: lendingError } = await supabase.rpc(
        "get_lending_outstanding"
      );
      const { data: borrowingData, error: borrowingError } = await supabase.rpc(
        "get_borrowing_outstanding"
      );

      if (sourceBalancesError) {
        console.error("Source Balances Error:", sourceBalancesError);
        setBalances([]);
      } else {
        setBalances(sourceBalancesData ?? []);
      }

      if (lendingError) {
        console.error("Lending Outstanding Error:", lendingError);
        setLending([]);
      } else {
        setLending(lendingData ?? []);
      }

      if (borrowingError) {
        console.error("Borrowing Outstanding Error:", borrowingError);
        setBorrowing([]);
      } else {
        setBorrowing(borrowingData ?? []);
      }

      setLoading(false);
    }

    load();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <svg
          className="animate-spin h-12 w-12 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-label="Loading"
          role="img"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      </div>
    );

  const baseBg = darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900";
  const borderBase = darkMode ? "border-gray-700" : "border-gray-200";
  const bgLight = darkMode ? "bg-gray-800" : "bg-gray-50";
  const textMuted = darkMode ? "text-gray-400" : "text-gray-600";

  return (
    <div
      className={`${baseBg} p-6 rounded-lg max-w-5xl mx-auto space-y-12 font-sans`}
    >
      {/* Source Balances */}
      <section>
        <h2
          className={`flex items-center gap-3 text-3xl font-bold mb-6 ${
            darkMode ? "text-blue-400" : "text-blue-800"
          } border-b pb-2 border-blue-300`}
        >
          <DollarSign size={28} />
          Source Balances
        </h2>
        {balances.length === 0 ? (
          <p className={`${textMuted} text-lg italic`}>
            No source balances found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {balances.map((b) => (
              <div
                key={b.source_id}
                className={`${bgLight} border ${borderBase} rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300`}
              >
                <h3
                  className={`flex items-center gap-2 font-semibold text-xl ${
                    darkMode ? "text-white" : "text-gray-900"
                  } mb-2`}
                >
                  <Users
                    size={18}
                    className={darkMode ? "text-blue-400" : "text-blue-500"}
                  />
                  {b.source_name}
                </h3>
                <p className={`${textMuted} text-sm uppercase tracking-wide`}>
                  Currency
                </p>
                <p
                  className={`${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  } font-mono mb-4`}
                >
                  {b.currency}
                </p>
                <p
                  className={`text-2xl font-extrabold flex items-center gap-1 ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  <DollarSign size={20} /> {b.current_balance.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lending Outstanding */}
      <section>
        <h2
          className={`flex items-center gap-3 text-3xl font-bold mb-6 ${
            darkMode ? "text-green-400" : "text-green-800"
          } border-b pb-2 border-green-300`}
        >
          <TrendingUp size={28} />
          Lending Outstanding
        </h2>
        {lending.length === 0 ? (
          <p className={`${textMuted} text-lg italic`}>
            No lending outstanding found.
          </p>
        ) : (
          <div
            className={`overflow-x-auto rounded-lg border ${borderBase} shadow-sm`}
          >
            <table
              className={`min-w-full divide-y ${
                darkMode ? "divide-green-700" : "divide-green-200"
              } table-auto border-collapse`}
            >
              <thead className={`${darkMode ? "bg-green-900" : "bg-green-50"}`}>
                <tr>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider ${
                      darkMode ? "text-green-300" : "text-green-700"
                    }`}
                  >
                    Person
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-right text-sm font-semibold uppercase tracking-wider ${
                      darkMode ? "text-green-300" : "text-green-700"
                    }`}
                  >
                    Outstanding Balance
                  </th>
                </tr>
              </thead>
              <tbody
                className={`${
                  darkMode
                    ? "bg-gray-900 divide-green-700"
                    : "bg-white divide-green-100"
                } divide-y`}
              >
                {lending.map((l) => (
                  <tr
                    key={l.transaction_id}
                    className={`${
                      darkMode ? "hover:bg-green-800" : "hover:bg-green-50"
                    } transition-colors`}
                  >
                    <td
                      className={`px-6 py-4 whitespace-nowrap font-medium flex items-center gap-2 ${
                        darkMode ? "text-green-300" : "text-green-800"
                      }`}
                    >
                      <Users size={16} className="inline" />
                      {l.person_name ?? "Unknown Person"}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-right font-semibold flex justify-end items-center gap-1 ${
                        darkMode ? "text-green-400" : "text-green-600"
                      }`}
                    >
                      <DollarSign size={16} />{" "}
                      {l.outstanding_balance.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Borrowing Outstanding */}
      <section>
        <h2
          className={`flex items-center gap-3 text-3xl font-bold mb-6 ${
            darkMode ? "text-red-400" : "text-red-800"
          } border-b pb-2 border-red-300`}
        >
          <TrendingDown size={28} />
          Borrowing Outstanding
        </h2>
        {borrowing.length === 0 ? (
          <p className={`${textMuted} text-lg italic`}>
            No borrowing outstanding found.
          </p>
        ) : (
          <div
            className={`overflow-x-auto rounded-lg border ${borderBase} shadow-sm`}
          >
            <table
              className={`min-w-full divide-y ${
                darkMode ? "divide-red-700" : "divide-red-200"
              } table-auto border-collapse`}
            >
              <thead className={`${darkMode ? "bg-red-900" : "bg-red-50"}`}>
                <tr>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider ${
                      darkMode ? "text-red-300" : "text-red-700"
                    }`}
                  >
                    Person
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-right text-sm font-semibold uppercase tracking-wider ${
                      darkMode ? "text-red-300" : "text-red-700"
                    }`}
                  >
                    Outstanding Balance
                  </th>
                </tr>
              </thead>
              <tbody
                className={`${
                  darkMode
                    ? "bg-gray-900 divide-red-700"
                    : "bg-white divide-red-100"
                } divide-y`}
              >
                {borrowing.map((b) => (
                  <tr
                    key={b.transaction_id}
                    className={`${
                      darkMode ? "hover:bg-red-800" : "hover:bg-red-50"
                    } transition-colors`}
                  >
                    <td
                      className={`px-6 py-4 whitespace-nowrap font-medium flex items-center gap-2 ${
                        darkMode ? "text-red-300" : "text-red-800"
                      }`}
                    >
                      <Users size={16} className="inline" />
                      {b.person_name ?? "Unknown Person"}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-right font-semibold flex justify-end items-center gap-1 ${
                        darkMode ? "text-red-400" : "text-red-600"
                      }`}
                    >
                      <DollarSign size={16} />{" "}
                      {b.outstanding_balance.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
