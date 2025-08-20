import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info, X } from "react-feather";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number; // milliseconds
  onClose?: () => void;
}

export const Toast = ({
  message,
  type = "info",
  duration = 3000,
  onClose,
}: ToastProps) => {
  const [visible, setVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, 300); // Match the transition duration
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!visible) return null;

  const toastConfig = {
    success: {
      bg: "bg-success",
      border: "border-success/30",
      icon: <CheckCircle className="w-4 h-4 text-success-foreground" />,
    },
    error: {
      bg: "bg-destructive",
      border: "border-destructive/30",
      icon: <XCircle className="w-4 h-4 text-destructive-foreground" />,
    },
    info: {
      bg: "bg-info",
      border: "border-info/30",
      icon: <Info className="w-4 h-4 text-info-foreground" />,
    },
    warning: {
      bg: "bg-warning",
      border: "border-warning/30",
      icon: <Info className="w-4 h-4 text-warning-foreground" />,
    },
  };

  const config = toastConfig[type];

  return (
    <div
      role="alert"
      className={`fixed top-4 right-4 z-50 rounded-xl px-4 py-3 shadow-lg border-2 ${config.bg} ${config.border} text-sm font-medium cursor-pointer select-none transform transition-all duration-300 ${
        isExiting
          ? "translate-x-full opacity-0"
          : "translate-x-0 opacity-100"
      } flex items-center space-x-2 min-w-[200px] max-w-[320px]`}
      onClick={() => {
        setIsExiting(true);
        setTimeout(() => {
          setVisible(false);
          if (onClose) onClose();
        }, 300);
      }}
    >
      {/* Icon */}
      <span className="flex-shrink-0">{config.icon}</span>
      
      {/* Message */}
      <span className="flex-1 text-foreground">
        {message}
      </span>
      
      {/* Close Button */}
      <button
        className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          setIsExiting(true);
          setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
          }, 300);
        }}
      >
        <X className="w-3 h-3 text-foreground" />
      </button>
    </div>
  );
};