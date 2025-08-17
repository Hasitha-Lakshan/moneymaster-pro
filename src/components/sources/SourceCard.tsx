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
  darkMode: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const SourceCard: React.FC<SourceCardProps> = ({
  source,
  darkMode,
  onEdit,
  onDelete,
}) => {
  const balanceColor =
    source.type === "Credit Card"
      ? getBalanceColor(source.available_credit || 0, darkMode)
      : getBalanceColor(source.balance || 0, darkMode);

  const formatAmount = (amount?: number) =>
    `${source.currency} ${
      amount?.toLocaleString("en-US", { minimumFractionDigits: 2 }) || "0.00"
    }`;

  return (
    <div
      className={`p-6 rounded-lg border ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      {/* Header: Icon + Name + Type + Actions */}
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
              {source.type}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className={`p-1 rounded ${
              darkMode
                ? "text-blue-400 hover:bg-gray-700"
                : "text-blue-600 hover:bg-gray-100"
            }`}
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
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

      {/* Body: Different views by Source type */}
      {source.type === "Credit Card" ? (
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
              {formatAmount(source.credit_limit)}
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
              {formatAmount(source.total_outstanding)}
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
            <span className={`text-lg font-bold ${balanceColor}`}>
              {formatAmount(source.available_credit)}
            </span>
          </div>

          {/* Optional Credit Card details */}
          {source.interest_rate !== undefined && (
            <p
              className={`text-xs ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Interest: {source.interest_rate}% | Billing Start:{" "}
              {source.billing_cycle_start || "-"}
            </p>
          )}
        </div>
      ) : source.type === "Investment" ? (
        <div className="text-right">
          <p
            className={`text-xs ${
              darkMode ? "text-gray-400" : "text-gray-600"
            } mb-1`}
          >
            Current Balance
          </p>
          <p className={`text-2xl font-bold ${balanceColor}`}>
            {formatAmount(source.balance)}
          </p>
          {/* placeholder for future investment summary */}
          {source.notes && (
            <p
              className={`mt-2 text-xs ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {source.notes}
            </p>
          )}
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
          <p className={`text-2xl font-bold ${balanceColor}`}>
            {formatAmount(source.balance)}
          </p>
        </div>
      )}
    </div>
  );
};
