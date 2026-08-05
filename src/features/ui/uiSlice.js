import { createSlice } from "@reduxjs/toolkit";

function getInitialTheme() {
  if (typeof window === "undefined") return "light";

  const stored = window.localStorage.getItem("theme");

  if (stored === "dark" || stored === "light") {
    return stored;
  }

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  if (typeof document === "undefined") return;

  document.documentElement.classList.toggle("dark", theme === "dark");

  try {
    window.localStorage.setItem("theme", theme);
  } catch {
    // ignore storage errors (e.g. private browsing)
  }
}

const initialTheme = getInitialTheme();

if (typeof document !== "undefined") {
  applyTheme(initialTheme);
}

const initialState = {
  isSidebarOpen: false,
  theme: initialTheme,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    closeSidebar: (state) => {
      state.isSidebarOpen = false;
    },
    openSidebar: (state) => {
      state.isSidebarOpen = true;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      applyTheme(state.theme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      applyTheme(state.theme);
    },
  },
});

export const {
  toggleSidebar,
  closeSidebar,
  openSidebar,
  toggleTheme,
  setTheme,
} = uiSlice.actions;

export const selectIsSidebarOpen = (state) => state.ui.isSidebarOpen;
export const selectTheme = (state) => state.ui.theme;

export default uiSlice.reducer;
