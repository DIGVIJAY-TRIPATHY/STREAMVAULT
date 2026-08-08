import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import authReducer from "../features/auth/authSlice";
import uiReducer from "../features/ui/uiSlice";
import authModalReducer from "../features/authModal/authModalSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    authModal: authModalReducer,
  },
});

/**
 * @typedef {ReturnType<typeof store.getState>} RootState
 */

/**
 * @typedef {typeof store.dispatch} AppDispatch
 */

export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;