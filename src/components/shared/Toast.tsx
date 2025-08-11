import { useEffect, useState } from "react";

type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number; // milliseconds
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  duration = 3000,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!visible) return null;

  let bgColor = "bg-blue-500";
  if (type === "success") bgColor = "bg-green-500";
  else if (type === "error") bgColor = "bg-red-500";

  return (
    <div
      role="alert"
      className={`fixed top-4 right-4 z-50 rounded-md px-4 py-2 text-white shadow-lg ${bgColor} cursor-pointer select-none`}
      onClick={() => {
        setVisible(false);
        if (onClose) onClose();
      }}
    >
      {message}
    </div>
  );
};
