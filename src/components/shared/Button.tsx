import React from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "outline"
  | "accent"
  | "success"
  | "info";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const baseClasses =
    "rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantClasses = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/50 shadow-lg hover:shadow-xl",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/90 focus:ring-secondary/50 shadow-pastel hover:shadow-lg",
    danger:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive/50 shadow-lg hover:shadow-xl",
    accent:
      "bg-accent text-accent-foreground hover:bg-accent/90 focus:ring-accent/50 shadow-lg hover:shadow-xl",
    success:
      "bg-success text-success-foreground hover:bg-success/90 focus:ring-success/50 shadow-pastel hover:shadow-lg",
    info: "bg-info text-info-foreground hover:bg-info/90 focus:ring-info/50 shadow-pastel hover:shadow-lg",
    outline:
      "border-2 border-border bg-transparent text-foreground hover:bg-muted/50 focus:ring-primary/50 hover:border-primary/50",
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
