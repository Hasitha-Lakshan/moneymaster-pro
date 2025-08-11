import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../store/features/themeSlice";
import type { RootState } from "../store/store";
import { supabase } from "../lib/supabaseClient";
import { Sun, Moon, Power } from "react-feather";

export const Header = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Error signing out: " + error.message);
    } else {
      window.location.assign("/");
    }
  };

  return (
    <header
      className={`p-4 flex justify-between items-center border-b ${
        darkMode
          ? "border-gray-700 bg-gray-900 text-white"
          : "border-gray-300 bg-white text-gray-900"
      }`}
    >
      <h1
        tabIndex={0}
        role="button"
        onClick={() => window.location.assign("/")}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            window.location.assign("/");
          }
        }}
        className="flex items-center cursor-pointer select-none space-x-2"
        aria-label="Go to home page"
      >
        <img
          src="/MM_Logo.svg"
          alt="Money Master Pro logo"
          className="h-8 w-auto"
          draggable={false}
        />
        <span className="text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}">
          Money Master Pro
        </span>
      </h1>

      <nav className="flex gap-4 items-center">
        <button
          onClick={() => dispatch(toggleDarkMode())}
          className="p-1 rounded bg-transparent transition focus:outline-none focus:ring-0"
          aria-pressed={darkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          {darkMode ? (
            <Sun className="w-6 h-6 text-yellow-400" />
          ) : (
            <Moon className="w-6 h-6 text-gray-700" />
          )}
        </button>
        <button
          onClick={handleSignOut}
          className="p-1 rounded bg-transparent transition focus:outline-none focus:ring-0"
          aria-label="Sign out"
          title="Sign out"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Power className="w-6 h-6 text-red-600 hover:text-red-700 transition-colors" />
        </button>
      </nav>
    </header>
  );
};
