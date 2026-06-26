import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  authStatus: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.authStatus = "loading";
    },

    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.authStatus = "succeeded";
    },

    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.authStatus = "idle";
    },

    updateUserAvatar: (state, action) => {
      if (state.user) {
        state.user.avatar = action.payload;
      }
    },

    updateUserCoverImage: (state, action) => {
      if (state.user) {
        state.user.coverImage = action.payload;
      }
    },

    updateUserAccount: (state, action) => {
      if (state.user) {
        Object.assign(state.user, action.payload);
      }
    },
  },
});

export const {
  setUser,
  setLoading,
  clearUser,
  updateUserAvatar,
  updateUserCoverImage,
  updateUserAccount,
} = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) =>
  state.auth.isAuthenticated;
export const selectAuthStatus = (state) => state.auth.authStatus;

export default authSlice.reducer;