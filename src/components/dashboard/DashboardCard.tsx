import React from "react";

interface DashboardCardProps {
  title: string;
  value: number | string | null | undefined;
  icon?: React.ReactNode;
  className?: string;
  currency?: string; // Optional, defaults to USD
  variant?: "primary" | "accent" | "secondary" | "default"; // Added variant prop
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  className = "",
  currency = "USD",
}) => {
  return (
    <div
      className={`rounded-2xl p-6 border-2 border-border shadow-pastel transform transition-all duration-300 hover:scale-105 ${"bg-card"} ${className}`}
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
          <p className="text-sm font-semibold text-muted-foreground">{title}</p>
          <p className={`text-2xl font-bold ${"text-card-foreground"}`}>
            {typeof value === "number"
              ? value.toLocaleString(undefined, {
                  style: "currency",
                  currency,
                })
              : value ?? "-"}
          </p>
        </div>
      </div>
    </div>
  );
};
