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
  variant = "default",
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

  const variantStyles = getVariantStyles();

  return (
    <div
      className={`rounded-2xl p-6 border-2 border-border shadow-pastel transform transition-all duration-300 hover:scale-105 ${variantStyles.bg} ${className}`}
    >
      <div className="flex items-center gap-4">
        {icon && (
          <div
            className={`p-3 rounded-xl ${variantStyles.iconBg} ${variantStyles.iconColor}`}
          >
            {icon}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-muted-foreground">{title}</p>
          <p className={`text-2xl font-bold ${variantStyles.text}`}>
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
