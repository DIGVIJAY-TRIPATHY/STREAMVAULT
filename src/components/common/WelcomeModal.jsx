import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import {
    LogIn,
    UserPlus,
    X,
    Play,
    ThumbsUp,
    MessageCircle,
    Bell,
    UploadCloud,
    ListVideo,
} from "lucide-react";

import { useAppSelector } from "../../app/hooks";
import { selectIsAuthenticated } from "../../features/auth/authSlice";

const FEATURES = [
    { icon: ThumbsUp, label: "Like videos", color: "from-rose-500 to-pink-500" },
    { icon: MessageCircle, label: "Comment", color: "from-sky-500 to-blue-500" },
    { icon: Bell, label: "Subscribe", color: "from-amber-500 to-orange-500" },
    { icon: UploadCloud, label: "Upload videos", color: "from-emerald-500 to-teal-500" },
    { icon: ListVideo, label: "Create playlists", color: "from-violet-500 to-purple-500" },
];

/**
 * Eye-catching welcome popup shown to guests on every page load/refresh
 * (mounted once in MainLayout, so it doesn't re-show on client-side
 * in-app navigation - only when the app itself is freshly loaded).
 */
function WelcomeModal() {
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            setIsOpen(true);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") setIsOpen(false);
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    if (!isOpen) return null;

    const goTo = (path) => {
        setIsOpen(false);
        navigate(path);
    };

    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) setIsOpen(false);
    };

    return ReactDOM.createPortal(
        <div
            className="animate-backdrop-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
            onMouseDown={handleBackdropClick}
            role="presentation"
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="welcome-modal-title"
                className="animate-modal-pop-in w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-slate-900"
            >
                {/* Gradient hero header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-6 pb-8 pt-6 text-white">
                    <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                    <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-fuchsia-400/20 blur-2xl" />

                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="absolute right-4 top-4 rounded-full bg-white/15 p-1.5 text-white/90 backdrop-blur-sm transition-colors hover:bg-white/25 hover:text-white"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>

                    <div className="animate-badge-float relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 shadow-lg backdrop-blur-sm">
                        <Play size={28} className="ml-0.5 fill-white text-white" />
                    </div>

                    <h2
                        id="welcome-modal-title"
                        className="relative mt-4 text-center text-2xl font-extrabold tracking-tight"
                    >
                        Welcome to StreamVault
                    </h2>

                    <p className="relative mt-1.5 text-center text-sm text-white/85">
                        Watch unlimited videos for free — no account needed.
                    </p>
                </div>

                {/* Body */}
                <div className="px-6 py-6">
                    <p className="text-center text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                        Create a free account to unlock
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                        {FEATURES.map(({ icon: Icon, label, color }) => (
                            <div
                                key={label}
                                className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-800/50"
                            >
                                <span
                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${color} text-white shadow-sm`}
                                >
                                    <Icon size={16} />
                                </span>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex flex-col gap-2.5">
                        <button
                            type="button"
                            onClick={() => goTo("/login")}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-transform hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.99]"
                        >
                            <LogIn size={16} />
                            Login
                        </button>

                        <button
                            type="button"
                            onClick={() => goTo("/register")}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-indigo-200 px-4 py-2.5 text-sm font-semibold text-indigo-600 transition-colors hover:border-indigo-300 hover:bg-indigo-50 dark:border-indigo-900 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
                        >
                            <UserPlus size={16} />
                            Register
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="mt-1 flex items-center justify-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                        >
                            Continue as guest
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default WelcomeModal;