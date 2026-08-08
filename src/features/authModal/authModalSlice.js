import { createSlice } from "@reduxjs/toolkit";

const DEFAULT_MESSAGE =
    "Create a StreamVault account to like videos, comment, subscribe, upload videos, and build playlists.";

const initialState = {
    isOpen: false,
    message: DEFAULT_MESSAGE,
};

const authModalSlice = createSlice({
    name: "authModal",
    initialState,
    reducers: {
        openAuthModal: (state, action) => {
            state.isOpen = true;
            state.message = action.payload?.message || DEFAULT_MESSAGE;
        },
        closeAuthModal: (state) => {
            state.isOpen = false;
        },
    },
});

export const { openAuthModal, closeAuthModal } = authModalSlice.actions;

export const selectIsAuthModalOpen = (state) => state.authModal.isOpen;
export const selectAuthModalMessage = (state) => state.authModal.message;

export default authModalSlice.reducer;