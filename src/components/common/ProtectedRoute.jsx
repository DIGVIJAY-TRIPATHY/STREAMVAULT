import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import {
    selectIsAuthenticated,
    selectAuthStatus,
} from "../../features/auth/authSlice";

import Loader from "./Loader";

function ProtectedRoute() {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const authStatus = useSelector(selectAuthStatus);
    const location = useLocation();

    // Wait for the session/authentication check to finish
    if (authStatus === "loading") {
        return <Loader fullScreen />;
    }

    // Allow authenticated users to access protected routes
    if (isAuthenticated) {
        return <Outlet />;
    }

    // Save the original location for redirecting after login
    return (
        <Navigate
            to="/login"
            state={{ from: location }}
            replace
        />
    );
}

export default ProtectedRoute;