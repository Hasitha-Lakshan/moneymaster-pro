import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { RootState } from "../store/store";
import { useSelector } from "react-redux";
import { Toast, type ToastType } from "./shared/Toast";

export const RestoreDefaultsButton = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleRestore = async () => {
    setLoading(true);
    // setMessage("");
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
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Restoring..." : "Restore Default Categories"}
      </button>
    </div>
  );
};
