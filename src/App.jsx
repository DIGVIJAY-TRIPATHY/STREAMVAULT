import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";

import AppRoutes from "./routes/AppRoutes";

import { userApi } from "./api/userApi.js";
import {
    setUser,
    clearUser,
    setLoading,
} from "./features/auth/authSlice";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        const restoreSession = async () => {
            dispatch(setLoading());

            try {
                const response = await userApi.getCurrentUser();

                dispatch(setUser(response.data));
            } catch (error) {
                // Session is invalid/expired
                if (error?.response?.status === 401) {
                    dispatch(clearUser());
                }
            } finally {
                dispatch(setLoading(false));
            }
        };

        restoreSession();
    }, [dispatch]);

    return (
        <>
            <Toaster position="top-right" />
            <AppRoutes />
        </>
    );
}

export default App;