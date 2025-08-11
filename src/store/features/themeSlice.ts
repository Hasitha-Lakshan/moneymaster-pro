import { createSlice } from '@reduxjs/toolkit';

interface ThemeState {
  darkMode: boolean;
}

const initialState: ThemeState = {
  darkMode: localStorage.getItem('darkMode') === 'true' || false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode.toString());
    },
    setDarkMode(state, action: { payload: boolean }) {
      state.darkMode = action.payload;
      localStorage.setItem('darkMode', state.darkMode.toString());
    },
  },
});

export const { toggleDarkMode, setDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
