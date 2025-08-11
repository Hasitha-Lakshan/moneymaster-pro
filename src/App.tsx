import { useEffect } from "react";
import "./App.css";
import type { RootState } from "./store/store";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "./lib/supabaseClient";
import { setUser } from "./store/features/authSlice";
import { Auth } from "./auth/Auth";
import { toast } from "react-toastify";
import { mapSupabaseUserToAppUser } from "./utils/userMapper";
import AppRoutes from "./routes";
import { Header } from "./components/Header";

export const App = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    // Check session on mount
    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data.session?.user;
      if (sessionUser) {
        try {
          const appUser = mapSupabaseUserToAppUser(sessionUser);
          dispatch(setUser(appUser));
        } catch (error) {
          console.error("User mapping error:", error);
          dispatch(setUser(null));
        }
      }
    });

    // Subscribe to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const sessionUser = session?.user;

        if (sessionUser) {
          try {
            const appUser = mapSupabaseUserToAppUser(sessionUser);
            dispatch(setUser(appUser));

            // Show login toast only once per browser session
            if (
              event === "SIGNED_IN" &&
              !sessionStorage.getItem("toastLoggedIn")
            ) {
              toast.success("Logged in successfully");
              sessionStorage.setItem("toastLoggedIn", "true");
            }
          } catch (error) {
            console.error("User mapping error:", error);
            dispatch(setUser(null));
          }
        } else {
          // User signed out or session expired
          dispatch(setUser(null));
          // Clear sessionStorage flags on sign out
          sessionStorage.removeItem("toastLoggedIn");
          sessionStorage.removeItem("toastWelcomeBack");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [dispatch]);

  if (!user) {
    return <Auth onLogin={() => toast.info("Redirecting after login...")} />;
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Header />

      <main className="p-6">
        <AppRoutes />
      </main>
    </div>
  );
};
