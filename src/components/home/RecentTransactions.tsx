import React from "react";
import type { TransactionWithType } from "../../types/home";

interface RecentTransactionsProps {
  transactions: TransactionWithType[];
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
}) => {
  if (transactions.length === 0) {
    return (
      <p className="text-muted-foreground py-4 text-center">
        No recent transactions
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {transactions.map((txn) => (
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
              txn.direction === "in" ? "text-green-500" : "text-red-500"
            }`}
          >
            {txn.direction === "in" ? "+" : "-"}${txn.amount.toFixed(2)}
          </span>
        </li>
      ))}
    </ul>
  );
};
