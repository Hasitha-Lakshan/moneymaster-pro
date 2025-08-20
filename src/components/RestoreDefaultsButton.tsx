import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { fetchCategories } from "../store/features/categoriesSlice";
import { Toast, type ToastType } from "./shared/Toast";
import { RotateCcw } from "react-feather";
import { LoadingSpinner } from "./shared/LoadingSpinner";

export const RestoreDefaultsButton = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleRestore = async () => {
    if (!user) return;

    setLoading(true);

    const { error } = await supabase.rpc("restore_default_data", {
      p_user_id: user?.id,
    });

    setLoading(false);

    if (error) {
      setMessage({
        text: "Failed to restore defaults: " + error.message,
        type: "error",
      });
    } else {
      setMessage({ text: "Defaults restored successfully!", type: "success" });
      dispatch(fetchCategories()); // refresh Redux store automatically
    }
  };

  return (
    <div>
      {message.text && (
        <Toast
          message={message.text}
          type={message?.type as ToastType}
          onClose={() => setMessage({ text: "", type: "" })}
        />
      )}

      <button
        onClick={handleRestore}
        disabled={loading}
        className="group flex items-center justify-center md:justify-start p-3 md:px-6 md:py-3 rounded-xl font-semibold 
           shadow-pastel hover:shadow-lg transform hover:scale-105 
           transition-all duration-200 disabled:opacity-50 
           disabled:transform-none disabled:hover:shadow-pastel
           relative overflow-hidden bg-restore text-restore-foreground
           border-2 border-restore/50 hover:border-restore/70"
      >
        {/* Content */}
        <span className="flex items-center gap-2">
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <RotateCcw className="h-5 w-5 transition-transform group-hover:-rotate-45" />
          )}
          <span className="hidden md:inline font-medium">
            {loading ? "Restoring..." : "Restore Defaults"}
          </span>
        </span>

        {/* Hover effect */}
        <div className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </button>
    </div>
  );
};
