import { useCallback } from "react";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectIsAuthenticated } from "../features/auth/authSlice";
import { openAuthModal } from "../features/authModal/authModalSlice";
import { setPendingAction } from "../utils/pendingAction";

/**
 * Central gate for any action that requires being logged in (like,
 * comment, subscribe, upload, create playlist, etc).
 *
 * Usage:
 *   const requireAuth = useRequireAuth();
 *   requireAuth(() => likeVideo(), "Create an account to like videos.");
 *
 * If the user is authenticated, `callback` runs immediately - no modal,
 * no extra render. If not, no API request is made at all: instead the
 * global AuthRequiredModal opens, and `callback` is stashed so it can
 * run automatically right after the user logs in or registers.
 */
function useRequireAuth() {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const requireAuth = useCallback(
        (callback, message) => {
            if (isAuthenticated) {
                callback?.();
                return;
            }

            setPendingAction(callback);
            dispatch(openAuthModal(message ? { message } : undefined));
        },
        [isAuthenticated, dispatch]
    );

    return requireAuth;
}

export default useRequireAuth;