import React from "react";
import type { ReactNode } from "react";

interface SummaryCardProps {
  icon?: ReactNode;
  label: string;
  value: string | number;
  variant?: "primary" | "accent" | "secondary" | "default";
  currency?: string; // Optional, for formatting numbers
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  icon,
  label,
  value,
  // variant = "default",
  currency = "USD",
}) => {
  return (
    <div
      className={`rounded-2xl p-6 border-2 border-border shadow-pastel transform transition-all duration-300 hover:scale-105 ${"bg-card"}`}
    >
      <div className="flex items-center gap-4">
        {icon && (
          <div
            className={`p-3 rounded-xl ${"bg-muted"} ${"text-muted-foreground"}`}
          >
            {icon}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-muted-foreground">{label}</p>
          <p className={`text-2xl font-bold ${"text-card-foreground"}`}>
            {typeof value === "number"
              ? value.toLocaleString(undefined, { style: "currency", currency })
              : value ?? "-"}
          </p>
        </div>
      </div>
    </div>
  );
};
