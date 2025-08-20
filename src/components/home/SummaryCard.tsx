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
  variant = "default",
  currency = "USD",
}) => {
  // Determine colors based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          bg: "bg-primary/10",
          iconBg: "bg-primary/20",
          iconColor: "text-primary",
          text: "text-primary",
        };
      case "accent":
        return {
          bg: "bg-accent/10",
          iconBg: "bg-accent/20",
          iconColor: "text-accent",
          text: "text-accent",
        };
      case "secondary":
        return {
          bg: "bg-secondary/10",
          iconBg: "bg-secondary/20",
          iconColor: "text-secondary",
          text: "text-secondary",
        };
      default:
        return {
          bg: "bg-card",
          iconBg: "bg-muted",
          iconColor: "text-muted-foreground",
          text: "text-card-foreground",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      className={`rounded-2xl p-6 border-2 border-border shadow-pastel transform transition-all duration-300 hover:scale-105 ${styles.bg}`}
    >
      <div className="flex items-center gap-4">
        {icon && (
          <div
            className={`p-3 rounded-xl ${styles.iconBg} ${styles.iconColor}`}
          >
            {icon}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-muted-foreground">{label}</p>
          <p className={`text-2xl font-bold ${styles.text}`}>
            {typeof value === "number"
              ? value.toLocaleString(undefined, { style: "currency", currency })
              : value ?? "-"}
          </p>
        </div>
      </div>
    </div>
  );
};
