import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../store/features/themeSlice";
import type { RootState } from "../store/store";
import { supabase } from "../lib/supabaseClient";
import { Sun, Moon, Power, Home } from "react-feather";

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
    <header className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center border-b-2 border-border/50 bg-background/95 backdrop-blur-sm text-foreground z-50">
      {/* Logo and App Name */}
      <div
        tabIndex={0}
        role="button"
        onClick={() => window.location.assign("/")}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            window.location.assign("/");
          }
        }}
        className="flex items-center cursor-pointer select-none space-x-3 group"
        aria-label="Go to home page"
      >
        <div className="relative">
          <img
            src="/MM_Logo.svg"
            alt="Money Master Pro logo"
            className="h-10 w-auto transition-transform group-hover:scale-110"
            draggable={false}
          />
          <div className="absolute inset-0 bg-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>
        <span className="text-2xl font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Money Master Pro
        </span>
      </div>

      {/* Navigation Buttons */}
      <nav className="flex gap-3 items-center">
        {/* Theme Toggle Button */}
        <button
          onClick={() => dispatch(toggleDarkMode())}
          className="p-3 rounded-xl bg-card border-2 border-border/50 hover:border-accent/50 
                   transition-all duration-200 hover:scale-110 group relative overflow-hidden"
          aria-pressed={darkMode}
          aria-label={darkMode ? "Switch to pastel mode" : "Switch to dark mode"}
          title={darkMode ? "Switch to pastel mode" : "Switch to dark mode"}
        >
          <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          {darkMode ? (
            <Sun className="w-5 h-5 text-accent group-hover:text-accent-foreground transition-colors" />
          ) : (
            <Moon className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
          )}
        </button>

        {/* Home Button */}
        <button
          onClick={() => window.location.assign("/")}
          className="p-3 rounded-xl bg-card border-2 border-border/50 hover:border-primary/50 
                   transition-all duration-200 hover:scale-110 group relative overflow-hidden"
          aria-label="Go to home"
          title="Go to home"
        >
          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <Home className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="p-3 rounded-xl bg-card border-2 border-border/50 hover:border-destructive/50 
                   transition-all duration-200 hover:scale-110 group relative overflow-hidden"
          aria-label="Sign out"
          title="Sign out"
        >
          <div className="absolute inset-0 bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <Power className="w-5 h-5 text-destructive group-hover:text-destructive-foreground transition-colors" />
        </button>
      </nav>
    </header>
  );
};