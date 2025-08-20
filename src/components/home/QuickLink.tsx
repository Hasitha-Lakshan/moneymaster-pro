import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface QuickLinkProps {
  to: string;
  icon?: ReactNode;
  title: string;
  description: string;
  variant?: "primary" | "accent" | "secondary" | "default";
}

export const QuickLink: React.FC<QuickLinkProps> = ({
  to,
  icon,
  title,
  description,
}) => {
  return (
    <Link
      to={to}
      className={`p-6 border-2 border-border rounded-2xl text-center shadow-pastel transform transition-all duration-300 hover:scale-105 hover:shadow-lg group ${"bg-card"}`}
    >
      <div className="flex flex-col items-center">
        {icon && (
          <div
            className={`p-3 rounded-xl mb-4 transition-colors ${"bg-muted"}`}
          >
            {icon}
          </div>
        )}
        <h3 className="font-semibold text-card-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
};
