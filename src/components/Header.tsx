import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../store/features/themeSlice";
import type { RootState } from "../store/store";
import { supabase } from "../lib/supabaseClient";

export const Header = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Error signing out: " + error.message);
    } else {
      // Optionally, you can reload or redirect after sign out
      window.location.assign("/");
    }
  };

  return (
    <header className="p-4 flex justify-between items-center border-b border-gray-300 dark:border-gray-700">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => window.location.assign("/")}
      >
        Finance Tracker
      </h1>
      <div className="flex gap-4">
        <button
          onClick={() => dispatch(toggleDarkMode())}
          className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <button
          onClick={handleSignOut}
          className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
};
