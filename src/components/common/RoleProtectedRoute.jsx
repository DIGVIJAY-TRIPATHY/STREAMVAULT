import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import {
    selectIsAuthenticated,
    selectAuthStatus,
    selectCurrentUser,
} from "../../features/auth/authSlice";

import Loader from "./Loader";

/**
 * Like ProtectedRoute, but also requires the logged-in user's role to be
 * in `allowedRoles`. Unauthenticated users get sent to /login same as
 * ProtectedRoute; authenticated users with the wrong role get sent home
 * instead of seeing a page that isn't theirs to see.
 *
 * Usage: <Route element={<RoleProtectedRoute allowedRoles={["highCommand"]} />}>
 */
function RoleProtectedRoute({ allowedRoles = [] }) {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const authStatus = useSelector(selectAuthStatus);
    const currentUser = useSelector(selectCurrentUser);
    const location = useLocation();

    if (authStatus === "loading") {
        return <Loader fullScreen />;
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    if (!allowedRoles.includes(currentUser?.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default RoleProtectedRoute;