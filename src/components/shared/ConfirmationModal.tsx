import React from "react";
import { CheckCircle, XCircle, X } from "react-feather";

type ConfirmationModalProps = {
  darkMode: boolean;
  visible: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  darkMode,
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={`p-6 rounded-xl w-full max-w-md shadow-xl transition-all duration-200 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Header with Title + Close Button */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onCancel}
            className={`p-1 rounded ${
              darkMode
                ? "text-gray-400 hover:text-white"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <X />
          </button>
        </div>

        {/* Modal Message */}
        <p
          className={`mb-6 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {message}
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          {/* Cancel Button */}
          <button
            onClick={onCancel}
            className={`flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all duration-200 ${
              darkMode
                ? "border border-gray-600 text-gray-300 hover:bg-gray-700 active:scale-95"
                : "border border-gray-300 text-gray-700 hover:bg-gray-100 active:scale-95"
            }`}
          >
            <XCircle className="w-4 h-4" />
            <span>{cancelText}</span>
          </button>

          {/* Confirm Button */}
          <button
            onClick={onConfirm}
            className={`flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium shadow-md transition-all duration-200 ${
              darkMode
                ? "bg-red-600 text-white hover:bg-red-500 active:scale-95"
                : "bg-red-500 text-white hover:bg-red-600 active:scale-95"
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
