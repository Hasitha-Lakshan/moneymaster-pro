import React from "react";

interface DashboardListProps {
  title: string;
  items: { id: string; label: string; value: number }[];
  valueColor?:
    | string
    | ((item: { id: string; label: string; value: number }) => string);
  className?: string;
}

export const DashboardList: React.FC<DashboardListProps> = ({
  title,
  items,
  valueColor = "text-green-500",
  className = "",
}) => (
  <div
    className={`rounded-2xl p-6 border-2 border-border bg-card shadow-pastel ${className}`}
  >
    <h2 className="text-xl font-bold text-card-foreground mb-6">{title}</h2>
    {items.length === 0 ? (
      <p className="text-muted-foreground text-sm py-4 text-center">
        No records.
      </p>
    ) : (
      <ul className="space-y-3">
        {items.map((i) => {
          const color =
            typeof valueColor === "function" ? valueColor(i) : valueColor;

          return (
            <li
              key={i.id}
              className="flex justify-between items-center p-4 border-2 border-border rounded-xl bg-background hover:bg-muted/20 transition-all duration-200"
            >
              <span className="font-medium text-card-foreground">
                {i.label}
              </span>
              <span className={`${color} font-semibold text-lg`}>
                {i.value.toLocaleString(undefined, {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            </li>
          );
        })}
      </ul>
    )}
  </div>
);
