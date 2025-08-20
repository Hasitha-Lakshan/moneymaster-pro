import React from "react";
import { CheckCircle, XCircle, X } from "react-feather";

type ConfirmationModalProps = {
  visible: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="p-6 rounded-2xl w-full max-w-md shadow-2xl bg-card border-2 border-border transform transition-all duration-300 scale-95 hover:scale-100">
        {/* Header with Title + Close Button */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-card-foreground">{title}</h3>
          <button
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-destructive/20 transition-all duration-200 hover:scale-110 group"
          >
            <X className="w-5 h-5 text-muted-foreground group-hover:text-destructive transition-colors" />
          </button>
        </div>

        {/* Modal Message */}
        <p className="mb-6 text-muted-foreground leading-relaxed">{message}</p>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          {/* Cancel Button */}
          <button
            onClick={onCancel}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold border-2 border-border hover:border-destructive/50 bg-background text-muted-foreground hover:text-destructive transition-all duration-200 hover:scale-105 group"
          >
            <XCircle className="w-5 h-5 text-muted-foreground group-hover:text-destructive transition-colors" />
            <span>{cancelText}</span>
          </button>

          {/* Confirm Button */}
          <button
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-destructive text-destructive-foreground shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group relative overflow-hidden"
          >
            {/* Solid background */}
            <div className="absolute inset-0 bg-destructive opacity-100 group-hover:bg-destructive/90 transition-colors" />

            {/* Content */}
            <span className="relative z-10 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-destructive-foreground" />
              <span>{confirmText}</span>
            </span>

            {/* Hover effect */}
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-16 h-16 bg-destructive/10 rounded-full -translate-x-8 -translate-y-8 blur-xl" />
        <div className="absolute bottom-0 right-0 w-12 h-12 bg-border/20 rounded-full translate-x-6 translate-y-6 blur-xl" />
      </div>
    </div>
  );
};
