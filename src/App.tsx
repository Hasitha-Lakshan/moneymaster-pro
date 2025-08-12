import { useEffect, useState } from "react";
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
import Footer from "./components/Footer";

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
    // Check session on mount
    supabase.auth.getSession().then(async ({ data }) => {
      const sessionUser = data.session?.user;
      if (sessionUser) {
        try {
          const appUser = mapSupabaseUserToAppUser(sessionUser);
          dispatch(setUser(appUser));

          // Check and insert defaults once per session
          if (!sessionStorage.getItem("defaultsChecked")) {
            await checkAndInsertDefaults(appUser.id);
            sessionStorage.setItem("defaultsChecked", "true");
          }

          if (!sessionStorage.getItem("toastRedirect")) {
            toast.info("Redirecting after login...");
            sessionStorage.setItem("toastRedirect", "true");
          }
        } catch (error) {
          console.error("User mapping error:", error);
          dispatch(setUser(null));
        }
      }
      setLoadingSession(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const sessionUser = session?.user;

        if (sessionUser) {
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
          } catch (error) {
            console.error("User mapping error:", error);
            dispatch(setUser(null));
          }
        } else {
          // User signed out or session expired
          dispatch(setUser(null));
          sessionStorage.removeItem("toastLoggedIn");
          sessionStorage.removeItem("toastRedirect");
          sessionStorage.removeItem("defaultsChecked");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [dispatch]);

  if (loadingSession) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Auth />;
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
