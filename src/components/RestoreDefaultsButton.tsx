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
        className="group flex items-center gap-2 px-4 py-2 rounded-xl shadow-md 
                   bg-indigo-600 hover:bg-indigo-700 text-white 
                   transition-all disabled:opacity-50"
      >
        {loading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <RotateCcw className="h-5 w-5 transition-transform group-hover:-rotate-45" />
        )}
        <span className="hidden md:inline font-medium">
          {loading ? "Restoring..." : "Restore Defaults"}
        </span>
      </button>
    </div>
  );
};
