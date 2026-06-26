import { createSlice } from "@reduxjs/toolkit";

const getInitialState = () => {
  const savedTheme = localStorage.getItem("videotube-theme");
  const theme = savedTheme === "dark" ? "dark" : "light";

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  }

  return {
    sidebarOpen: true,
    theme,
    activeModal: null,
  };
};

const uiSlice = createSlice({
  name: "ui",
  initialState: getInitialState(),
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },

    toggleTheme: (state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";

      state.theme = newTheme;
      document.documentElement.classList.toggle(
        "dark",
        newTheme === "dark"
      );
      localStorage.setItem("videotube-theme", newTheme);
    },

    setTheme: (state, action) => {
      const newTheme = action.payload;

      state.theme = newTheme;
      document.documentElement.classList.toggle(
        "dark",
        newTheme === "dark"
      );
      localStorage.setItem("videotube-theme", newTheme);
    },

    openModal: (state, action) => {
      state.activeModal = action.payload;
    },

    closeModal: (state) => {
      state.activeModal = null;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleTheme,
  setTheme,
  openModal,
  closeModal,
} = uiSlice.actions;

export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectTheme = (state) => state.ui.theme;
export const selectActiveModal = (state) => state.ui.activeModal;

export default uiSlice.reducer;