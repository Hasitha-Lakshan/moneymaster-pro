import { useEffect, useState } from "react";
import "./App.css";
import type { RootState } from "./store/store";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "./lib/supabaseClient";
import { setUser } from "./store/features/authSlice";
import { LoginPage } from "./pages/LoginPage";
import { toast } from "react-toastify";
import { mapSupabaseUserToAppUser } from "./utils/userMapper";
import AppRoutes from "./routes";
import { Header } from "./components/Header";
import Footer from "./components/Footer";
import { LoadingSpinner } from "./components/shared/LoadingSpinner";

export const App = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const user = useSelector((state: RootState) => state.auth.user);

  const [loadingSession, setLoadingSession] = useState(true);

  // Check and insert default data once per user session
  async function checkAndInsertDefaults(userId: string) {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("defaults_inserted")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching user profile:", error);
        return;
      }

      if (!data || !data.defaults_inserted) {
        const { error: insertError } = await supabase.rpc(
          "insert_default_data",
          {
            p_user_id: userId,
          }
        );

        if (insertError) {
          console.error("Error inserting default data:", insertError);
        } else {
          console.log("Default data inserted for user:", userId);
        }
      } else {
        console.log("Defaults already inserted for user:", userId);
      }
    } catch (err) {
      console.error("Unexpected error during defaults check:", err);
    }
  }

  useEffect(() => {
    let initialCheckDone = false;

    const finishLoading = () => {
      if (!initialCheckDone) {
        setLoadingSession(false);
        initialCheckDone = true;
      }
    };

    // Add timeout as fallback
    const timeout = setTimeout(() => {
      console.warn("Session loading timed out - clearing auth state");
      dispatch(setUser(null));
      sessionStorage.clear();
      finishLoading();
    }, 8000); // 8 seconds timeout

    // First check with better error handling
    supabase.auth
      .getSession()
      .then(async ({ data, error }) => {
        clearTimeout(timeout);

        if (error) {
          console.error("Error getting session:", error);
          // If there's an auth error, clear everything and start fresh
          await supabase.auth.signOut();
          dispatch(setUser(null));
          sessionStorage.clear();
          finishLoading();
          return;
        }

        const session = data.session;
        const sessionUser = session?.user;

        // Check if session is expired
        if (session && session.expires_at) {
          const now = Math.floor(Date.now() / 1000);
          if (session.expires_at < now) {
            console.log("Session expired, signing out");
            await supabase.auth.signOut();
            dispatch(setUser(null));
            sessionStorage.clear();
            finishLoading();
            return;
          }
        }

        if (sessionUser) {
          try {
            const appUser = mapSupabaseUserToAppUser(sessionUser);
            dispatch(setUser(appUser));

            if (!sessionStorage.getItem("defaultsChecked")) {
              await checkAndInsertDefaults(appUser.id);
              sessionStorage.setItem("defaultsChecked", "true");
            }
          } catch (err) {
            console.error("Error mapping user:", err);
            // If user mapping fails, clear auth state
            await supabase.auth.signOut();
            dispatch(setUser(null));
            sessionStorage.clear();
          }
        } else {
          dispatch(setUser(null));
          sessionStorage.clear();
        }

        finishLoading();
      })
      .catch(async (err) => {
        clearTimeout(timeout);
        console.error("Unexpected session error:", err);
        // On any unexpected error, clear auth state
        await supabase.auth.signOut();
        dispatch(setUser(null));
        sessionStorage.clear();
        finishLoading();
      });

    // Listen for changes with better error handling
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "TOKEN_REFRESHED") {
          console.log("Token refreshed successfully");
        }

        if (event === "SIGNED_OUT") {
          dispatch(setUser(null));
          sessionStorage.clear();
          finishLoading();
          return;
        }

        const sessionUser = session?.user;

        if (sessionUser && session) {
          // Check if session is valid
          if (
            session.expires_at &&
            session.expires_at < Math.floor(Date.now() / 1000)
          ) {
            console.log("Received expired session, signing out");
            await supabase.auth.signOut();
            return;
          }

          try {
            const appUser = mapSupabaseUserToAppUser(sessionUser);
            dispatch(setUser(appUser));

            if (!sessionStorage.getItem("defaultsChecked")) {
              await checkAndInsertDefaults(appUser.id);
              sessionStorage.setItem("defaultsChecked", "true");
            }

            if (
              event === "SIGNED_IN" &&
              !sessionStorage.getItem("toastLoggedIn")
            ) {
              toast.success("Logged in successfully");
              sessionStorage.setItem("toastLoggedIn", "true");
            }
          } catch (err) {
            console.error("Error mapping user:", err);
            await supabase.auth.signOut();
            dispatch(setUser(null));
            sessionStorage.clear();
          }
        } else {
          dispatch(setUser(null));
          sessionStorage.clear();
        }

        finishLoading();
      }
    );

    return () => {
      clearTimeout(timeout);
      listener.subscription.unsubscribe();
    };
  }, [dispatch]);

  if (loadingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Header />

      <main className="pt-16 pb-16">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
};
