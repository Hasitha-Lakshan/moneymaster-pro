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
  const user = useSelector((state: RootState) => state.auth.user);

  const [loadingSession, setLoadingSession] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(
    "Loading your session..."
  );

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
        setLoadingMessage("Setting up your account...");
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
      setLoadingMessage("Taking longer than expected...");

      setTimeout(() => {
        dispatch(setUser(null));
        sessionStorage.clear();
        finishLoading();
      }, 1000);
    }, 8000); // 8 seconds timeout

    // First check with better error handling
    supabase.auth
      .getSession()
      .then(async ({ data, error }) => {
        clearTimeout(timeout);

        if (error) {
          console.error("Error getting session:", error);
          setLoadingMessage("Authentication error - restarting...");
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
            setLoadingMessage("Session expired - redirecting...");
            await supabase.auth.signOut();
            dispatch(setUser(null));
            sessionStorage.clear();
            finishLoading();
            return;
          }
        }

        if (sessionUser) {
          try {
            setLoadingMessage("Welcome back! Loading your data...");
            const appUser = mapSupabaseUserToAppUser(sessionUser);
            dispatch(setUser(appUser));

            if (!sessionStorage.getItem("defaultsChecked")) {
              await checkAndInsertDefaults(appUser.id);
              sessionStorage.setItem("defaultsChecked", "true");
            }
          } catch (err) {
            console.error("Error mapping user:", err);
            setLoadingMessage("Error loading profile - restarting...");
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
        setLoadingMessage("Unexpected error - please wait...");
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
          setLoadingMessage("Signing out...");
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
            setLoadingMessage("Session expired - redirecting...");
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6">
        <div className="text-center mb-6">
          <LoadingSpinner size="lg" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-card-foreground mb-2">
            Money Master Pro
          </h2>
          <p className="text-muted-foreground text-sm animate-pulse">
            {loadingMessage}
          </p>
        </div>
        <div className="mt-8 w-48 h-1 bg-gradient-to-r from-primary to-accent rounded-full opacity-50 animate-pulse-gentle" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-all duration-300">
      <Header />

      <main className="pt-18 pb-16">
        <AppRoutes />
      </main>

      <Footer />
    </div>
  );
};
