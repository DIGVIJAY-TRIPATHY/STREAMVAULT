import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  clearUser,
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthStatus,
} from "../features/auth/authSlice";
import { authApi } from "../api/authApi";

/**
 * Convenience hook that exposes the current auth state along with a
 * `logout` action that calls the API, clears Redux state, resets any
 * cached queries, and redirects to the login page.
 */
function useAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const status = useAppSelector(selectAuthStatus);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Even if the request fails (e.g. token already expired),
      // proceed to clear local state so the UI stays consistent.
      console.error("Logout request failed:", error);
    } finally {
      dispatch(clearUser());
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    }
  }, [dispatch, navigate, queryClient]);

  return {
    user,
    isAuthenticated,
    status,
    logout,
  };
}

export default useAuth;
