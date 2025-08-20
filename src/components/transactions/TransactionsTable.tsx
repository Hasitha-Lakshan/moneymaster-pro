import { Edit2, Trash2, RefreshCw } from "react-feather";
import type { Transaction } from "../../store/features/transactionsSlice";
import type { RootState } from "../../store/store";
import { useSelector } from "react-redux";

interface TransactionsTableProps {
  transactions: Transaction[];
  darkMode: boolean;
  onEdit: (txn: Transaction) => void;
  handleDeleteTransaction: (txnId: string) => void;
  isLoading: boolean;
}

export const TransactionsTable = ({
  transactions,
  onEdit,
  handleDeleteTransaction,
  isLoading,
}: TransactionsTableProps) => {
  const transactionTypes = useSelector(
    (state: RootState) => state.transactionTypes.types
  );
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const subCategories = useSelector(
    (state: RootState) => state.categories.subCategories
  );
  const sources = useSelector((state: RootState) => state.sources.sources);

  const getAmountStyle = (txn: Transaction) => {
    if (txn.destination_source_id) return "text-info"; // transfer - using info color
    const typeName =
      transactionTypes.find((t) => t.id.toString() === txn.type_id)?.name || "";
    return typeName.toLowerCase().includes("income")
      ? "text-success font-semibold"
      : "text-destructive font-semibold";
  };

  const getAmountColor = (txn: Transaction) => {
    if (txn.destination_source_id) return "text-info"; // transfer
    const typeName =
      transactionTypes.find((t) => t.id.toString() === txn.type_id)?.name || "";
    return typeName.toLowerCase().includes("income")
      ? "text-success"
      : "text-destructive";
  };

  return (
    <div>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border-border border-2 bg-card shadow-pastel">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <th className="p-4 text-left text-sm font-semibold text-card-foreground">
                Date
              </th>
              <th className="p-4 text-left text-sm font-semibold text-card-foreground">
                Type
              </th>
              <th className="p-4 text-left text-sm font-semibold text-card-foreground">
                Category
              </th>
              <th className="p-4 text-left text-sm font-semibold text-card-foreground">
                Subcategory
              </th>
              <th className="p-4 text-left text-sm font-semibold text-card-foreground">
                Source
              </th>
              {/* Only show Destination column if at least one transfer exists */}
              {transactions.some((txn) => txn.destination_source_id) && (
                <th className="p-4 text-left text-sm font-semibold text-card-foreground">
                  Destination
                </th>
              )}
              <th className="p-4 text-left text-sm font-semibold text-card-foreground">
                Amount
              </th>
              <th className="p-4 text-left text-sm font-semibold text-card-foreground">
                Notes
              </th>
              <th className="p-4 text-left text-sm font-semibold text-card-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => {
              const typeName =
                transactionTypes.find((t) => t.id.toString() === txn.type_id)
                  ?.name || "-";
              const isTxnTransfer = !!txn.destination_source_id;

              return (
                <tr
                  key={txn.id}
                  className="border-t border-border/50 transition-colors hover:bg-muted/20 group"
                >
                  <td className="p-4 text-sm text-card-foreground">
                    {txn.date}
                  </td>
                  <td className="p-4 text-sm text-card-foreground">
                    {isTxnTransfer ? "Transfer" : typeName}
                  </td>
                  <td className="p-4 text-sm text-card-foreground">
                    {categories.find((c) => c.id === txn.category_id)?.name ||
                      "-"}
                  </td>
                  <td className="p-4 text-sm text-card-foreground">
                    {subCategories.find((s) => s.id === txn.subcategory_id)
                      ?.name || "-"}
                  </td>
                  <td className="p-4 text-sm text-card-foreground">
                    {sources.find((s) => s.id === txn.source_id)?.name}
                  </td>

                  {/* Only render destination if transfer */}
                  {transactions.some((t) => t.destination_source_id) && (
                    <td className="p-4 text-sm text-card-foreground">
                      {isTxnTransfer
                        ? sources.find(
                            (s) => s.id === txn.destination_source_id
                          )?.name
                        : "-"}
                    </td>
                  )}

                  <td
                    className={`p-4 text-sm font-semibold ${getAmountStyle(
                      txn
                    )}`}
                  >
                    {txn.amount.toFixed(2)}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {txn.notes || "-"}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(txn)}
                        className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-all duration-200 hover:scale-110 group-hover:opacity-100 opacity-70"
                        title="Edit transaction"
                      >
                        <Edit2 className="h-4 w-4 text-primary" />
                      </button>
                      <button
                        onClick={() => handleDeleteTransaction(txn.id)}
                        className="p-2 rounded-full bg-destructive/10 hover:bg-destructive/20 transition-all duration-200 hover:scale-110 group-hover:opacity-100 opacity-70"
                        title="Delete transaction"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid gap-4 md:hidden">
        {transactions.map((txn) => {
          const typeName =
            transactionTypes.find((t) => t.id.toString() === txn.type_id)
              ?.name || "-";
          const isTxnTransfer = !!txn.destination_source_id;

          return (
            <div
              key={txn.id}
              className="p-5 rounded-xl border-2 border-border bg-card shadow-pastel hover:shadow-lg transition-all duration-300 group"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-base font-semibold text-card-foreground group-hover:text-primary transition-colors">
                    {isTxnTransfer ? "Transfer" : typeName}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {txn.date}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(txn)}
                    className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-all duration-200 hover:scale-110"
                  >
                    <Edit2 className="h-4 w-4 text-primary" />
                  </button>
                  <button
                    onClick={() => handleDeleteTransaction(txn.id)}
                    className="p-2 rounded-full bg-destructive/10 hover:bg-destructive/20 transition-all duration-200 hover:scale-110"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium text-card-foreground">
                    {categories.find((c) => c.id === txn.category_id)?.name ||
                      "-"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subcategory</span>
                  <span className="font-medium text-card-foreground">
                    {subCategories.find((s) => s.id === txn.subcategory_id)
                      ?.name || "-"}
                  </span>
                </div>

                {/* Source */}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Source</span>
                  <span className="font-medium text-card-foreground">
                    {sources.find((s) => s.id === txn.source_id)?.name}
                  </span>
                </div>

                {/* Destination → only for transfers */}
                {txn.destination_source_id && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Destination</span>
                    <span className="font-medium text-card-foreground">
                      {
                        sources.find((s) => s.id === txn.destination_source_id)
                          ?.name
                      }
                    </span>
                  </div>
                )}

                <div className="flex justify-between border-t border-border/50 pt-3 mt-2">
                  <span className="font-medium text-card-foreground">
                    Amount
                  </span>
                  <span className={`text-lg font-bold ${getAmountColor(txn)}`}>
                    {txn.amount.toFixed(2)}
                  </span>
                </div>

                {txn.notes && (
                  <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground italic">
                      {txn.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {transactions.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-muted/20 flex items-center justify-center mb-4">
            <RefreshCw className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground text-lg font-medium">
            No transactions found. Add your first transaction to get started!
          </p>
        </div>
      )}
    </div>
  );
};
