import { useNavigate, useLocation } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
    selectIsAuthModalOpen,
    selectAuthModalMessage,
    closeAuthModal,
} from "../../features/authModal/authModalSlice";

import Modal from "./Modal";
import Button from "./Button";

/**
 * Global "Login required" modal. Shown instead of redirecting whenever
 * a guest attempts something that needs an account (like, comment,
 * subscribe, upload, etc) - see useRequireAuth. Mounted once in
 * MainLayout so any part of the app can trigger it via Redux.
 */
function AuthRequiredModal() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const isOpen = useAppSelector(selectIsAuthModalOpen);
    const message = useAppSelector(selectAuthModalMessage);

    const goTo = (path) => {
        dispatch(closeAuthModal());
        navigate(path, { state: { from: location } });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => dispatch(closeAuthModal())}
            title="Login required"
            size="sm"
        >
            <p className="text-sm text-slate-600 dark:text-slate-300">
                {message}
            </p>

            <div className="mt-6 flex flex-col gap-2">
                <Button
                    leftIcon={<LogIn size={16} />}
                    onClick={() => goTo("/login")}
                    className="w-full"
                >
                    Login
                </Button>

                <Button
                    variant="secondary"
                    leftIcon={<UserPlus size={16} />}
                    onClick={() => goTo("/register")}
                    className="w-full"
                >
                    Register
                </Button>

                <button
                    type="button"
                    onClick={() => dispatch(closeAuthModal())}
                    className="mt-1 text-center text-sm text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                    Not now
                </button>
            </div>
        </Modal>
    );
}

export default AuthRequiredModal;