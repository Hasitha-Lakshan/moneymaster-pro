import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTransactions } from "../store/features/transactionsSlice";
import { fetchCategories } from "../store/features/categoriesSlice";
import { fetchSources } from "../store/features/sourcesSlice";
import { fetchTransactionTypes } from "../store/features/transactionTypesSlice";
import type { TransactionWithType } from "../types/home";

export const useHomeData = () => {
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

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchTransactions());
    dispatch(fetchSources());
    dispatch(fetchTransactionTypes());
  }, [dispatch]);

  const transactionsWithTypeName: TransactionWithType[] = useMemo(
    () =>
      transactions.map((txn) => {
        const type = transactionTypes.find((t) => t.id === Number(txn.type_id));
        let direction: "in" | "out" = "out";

        if (type?.name === "Income") direction = "in";
        else if (type?.name === "Borrow") direction = "in";

        return { ...txn, type_name: type?.name || "", direction };
      }),
    [transactions, transactionTypes]
  );

  const totalBalance = useMemo(
    () => sources.reduce((acc, s) => acc + (s.balance || 0), 0),
    [sources]
  );

  const recentTransactions = useMemo(
    () =>
      [...transactionsWithTypeName]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5),
    [transactionsWithTypeName]
  );

  const loading = catLoading || txnLoading || srcLoading || typeLoading;

  return {
    categories,
    sources,
    transactionsWithTypeName,
    recentTransactions,
    totalBalance,
    loading,
  };
};
