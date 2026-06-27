import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../app/store";
import { queryClient } from "../app/queryClient";
import { authApi } from "../api/authApi";
import { userApi } from "../api/userApi";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthStatus,
  setUser,
  clearUser,
  setLoading,
} from "../features/auth/authSlice";

/**
 * Custom hook that provides authentication state and actions.
 * Does not perform any network requests automatically.
 */
const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authStatus = useSelector(selectAuthStatus);

  const login = useCallback(
    async (credentials) => {
      dispatch(setLoading());
      try {
        const userData = await authApi.login(credentials);
        dispatch(setUser(userData));
        return userData;
      } catch (error) {
        dispatch(clearUser());
        throw error;
      }
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    dispatch(setLoading());
    try {
      await authApi.logout();
    } finally {
      dispatch(clearUser());
      queryClient.clear();
      navigate("/login");
    }
  }, [dispatch, navigate]);

  const fetchCurrentUser = useCallback(async () => {
    dispatch(setLoading());
    try {
      const userData = await userApi.getCurrentUser();
      dispatch(setUser(userData));
      return userData;
    } catch (error) {
      dispatch(clearUser());
      throw error;
    }
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    authStatus,
    login,
    logout,
    fetchCurrentUser,
  };
};

export default useAuth;