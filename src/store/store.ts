import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import themeReducer from "./features/theme/themeSlice";
import uiReducer from "./features/ui/uiSlice";
import sourcesReducer from "./features/sources/sourcesSlice";
import categoriesReducer from "./features/categories/categoriesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    ui: uiReducer,
    sources: sourcesReducer,
    categories: categoriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
