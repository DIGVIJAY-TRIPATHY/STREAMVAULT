import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  // "loading" | "idle"
  status: "loading",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = Boolean(action.payload);
      state.status = "idle";
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = "idle";
    },
    setLoading: (state, action) => {
      // dispatch(setLoading()) -> loading, dispatch(setLoading(false)) -> idle
      state.status = action.payload === false ? "idle" : "loading";
    },
  },
});

export const { setUser, clearUser, setLoading } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthStatus = (state) => state.auth.status;

export default authSlice.reducer;
