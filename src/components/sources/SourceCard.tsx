import { Edit2, Trash2 } from "react-feather";
import { getBalanceColor, getSourceIcon } from "../../utils/sourceUtils";

interface Source {
  id: string;
  name: string;
  type:
    | "Bank Account"
    | "Credit Card"
    | "Cash"
    | "Digital Wallet"
    | "Investment"
    | "Other";
  currency: string;
  balance?: number;

  // Credit Card fields
  credit_limit?: number;
  total_outstanding?: number;
  available_credit?: number;
  interest_rate?: number;
  billing_cycle_start?: number;

  // Common fields
  notes?: string;
}

interface SourceCardProps {
  source: Source;
  onEdit: () => void;
  onDelete: () => void;
}

export const SourceCard: React.FC<SourceCardProps> = ({
  source,
  onEdit,
  onDelete,
}) => {
  const balanceColor =
    source.type === "Credit Card"
      ? getBalanceColor(source.available_credit || 0)
      : getBalanceColor(source.balance || 0);

  const formatAmount = (amount?: number) =>
    `${source.currency} ${
      amount?.toLocaleString("en-US", { minimumFractionDigits: 2 }) || "0.00"
    }`;

  return (
    <div className="p-6 rounded-xl border-2 border-border bg-card shadow-pastel hover:shadow-lg transition-all duration-300">
      {/* Header: Icon + Name + Type + Actions */}
      <div className="flex justify-between mb-4">
        <div className="flex space-x-3">
          <span className="text-2xl text-primary mt-1">
            {getSourceIcon(source.type)}
          </span>
          <div className="flex flex-col justify-start">
            <h3 className="font-semibold text-card-foreground leading-tight">
              {source.name}
            </h3>
            <p className="text-sm text-muted-foreground capitalize mt-1">
              {source.type}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-all duration-200 hover:scale-110 group h-fit"
          >
            <Edit2 className="h-4 w-4 text-primary group-hover:text-primary-foreground" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-all duration-200 hover:scale-110 group h-fit"
          >
            <Trash2 className="h-4 w-4 text-destructive group-hover:text-destructive-foreground" />
          </button>
        </div>
      </div>

      {/* Body: Different views by Source type */}
      {source.type === "Credit Card" ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Credit Limit</span>
            <span className="text-sm font-medium text-card-foreground">
              {formatAmount(source.credit_limit)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Outstanding</span>
            <span className="text-sm font-medium text-destructive">
              {formatAmount(source.total_outstanding)}
            </span>
          </div>

          <div className="flex justify-between items-center border-t border-border/50 pt-3">
            <span className="text-sm font-medium text-card-foreground">
              Available Credit
            </span>
            <span className={`text-lg font-bold ${balanceColor}`}>
              {formatAmount(source.available_credit)}
            </span>
          </div>

          {/* Optional Credit Card details */}
          {source.interest_rate !== undefined && (
            <div className="pt-2 border-t border-border/30">
              <p className="text-xs text-muted-foreground">
                Interest: {source.interest_rate}% | Billing Start:{" "}
                {source.billing_cycle_start || "-"}
              </p>
            </div>
          )}
        </div>
      ) : source.type === "Investment" ? (
        <div className="text-right">
          <p className="text-xs text-muted-foreground mb-2">Current Balance</p>
          <p className={`text-2xl font-bold ${balanceColor} mb-2`}>
            {formatAmount(source.balance)}
          </p>
          {/* placeholder for future investment summary */}
          {source.notes && (
            <div className="mt-3 p-2 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">{source.notes}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-right">
          <p className="text-xs text-muted-foreground mb-2">Balance</p>
          <p className={`text-2xl font-bold ${balanceColor}`}>
            {formatAmount(source.balance)}
          </p>
        </div>
      )}
    </div>
  );
};