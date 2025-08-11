import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import themeReducer from "./features/themeSlice";
import uiReducer from "./features/uiSlice";
import sourcesReducer from "./features/sourcesSlice";
import categoriesReducer from "./features/categoriesSlice";
import transactionsReducer from "./features/transactionsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    ui: uiReducer,
    sources: sourcesReducer,
    categories: categoriesReducer,
    transactions: transactionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
