import React from "react";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Smartphone,
  HelpCircle,
  Edit2,
  Trash2,
} from "react-feather";
import { getDetailedBalanceColor } from "../../utils/sourceUtils";

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

  credit_limit?: number;
  total_outstanding?: number;
  available_credit?: number;
  interest_rate?: number;
  billing_cycle_start?: number;

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
      ? getDetailedBalanceColor(source.available_credit || 0)
      : getDetailedBalanceColor(source.balance || 0);

  const formatAmount = (amount?: number) =>
    `${source.currency} ${
      amount?.toLocaleString("en-US", { minimumFractionDigits: 2 }) || "0.00"
    }`;

  const getSourceIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      "Bank Account": <DollarSign />,
      "Credit Card": <CreditCard />,
      Cash: <DollarSign />,
      Investment: <TrendingUp />,
      "Digital Wallet": <Smartphone />,
    };
    return icons[type] || <HelpCircle />;
  };

  return (
    <div
      className={`p-6 rounded-xl border-2 border-border shadow-pastel transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${"bg-card"}`}
    >
      {/* Header */}
      <div className="flex justify-between mb-4">
        <div className="flex space-x-3 items-center">
          {getSourceIcon(source.type) && (
            <div
              className={`flex items-center justify-center rounded-xl p-3 ${"bg-muted"}`}
              style={{ width: 40, height: 40 }}
            >
              <div className={`${"bg-muted"} h-6 w-6`}>
                {getSourceIcon(source.type)}
              </div>
            </div>
          )}

          <div className="flex flex-col justify-start">
            <h3 className="font-semibold text-card-foreground leading-tight">
              {source.name}
            </h3>
            <p className="text-sm text-muted-foreground capitalize mt-1">
              {source.type}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-all duration-200 hover:scale-110"
          >
            <Edit2 className="h-4 w-4 text-primary" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-all duration-200 hover:scale-110"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </button>
        </div>
      </div>

      {/* Body */}
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

          {source.interest_rate !== undefined && (
            <div className="pt-2 border-t border-border/30">
              <p className="text-xs text-muted-foreground">
                Interest: {source.interest_rate}% | Billing Start:{" "}
                {source.billing_cycle_start || "-"}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-right">
          <p className="text-xs text-muted-foreground mb-2">
            {source.type === "Investment" ? "Current Balance" : "Balance"}
          </p>
          <p className={`text-2xl font-bold ${balanceColor}`}>
            {formatAmount(source.balance)}
          </p>
          {source.notes && (
            <div className="mt-3 p-2 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">{source.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
