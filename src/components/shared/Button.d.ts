// components/shared/Button.d.ts
import * as React from "react";

declare module "../components/shared/Button" {
  type ButtonVariant = "primary" | "secondary" | "danger" | "outline";

  interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    children: React.ReactNode;
  }

  export const Button: React.FC<ButtonProps>;
}
