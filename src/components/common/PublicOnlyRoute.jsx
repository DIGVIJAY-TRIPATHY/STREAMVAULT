import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import {
    selectIsAuthenticated,
    selectAuthStatus,
} from "../../features/auth/authSlice";

function PublicOnlyRoute() {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const authStatus = useSelector(selectAuthStatus);

    // Wait for the session/authentication check to finish
    if (authStatus === "loading") {
        return null;
    }

    // Authenticated users should not access login/register
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Allow unauthenticated users to access public routes
    return <Outlet />;
}

export default PublicOnlyRoute;