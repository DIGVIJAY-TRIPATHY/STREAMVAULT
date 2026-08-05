import { Outlet, Link } from "react-router-dom";
import { Video } from "lucide-react";

function AuthLayout() {
    return (
        <div
            className="
                flex min-h-screen
                items-center justify-center
                bg-gradient-to-br
                from-indigo-950
                via-slate-900
                to-indigo-900
                px-4
                py-8
            "
        >
            <div
                className="
                    w-full
                    max-w-md
                    mx-4
                    rounded-2xl
                    bg-white
                    p-8
                    shadow-2xl
                    dark:bg-slate-900
                "
            >
                {/* Logo */}
                <Link
                    to="/"
                    className="
                        mb-8
                        flex
                        items-center
                        justify-center
                        gap-2
                    "
                >
                    <Video
                        size={32}
                        className="text-indigo-600"
                    />

                    <span
                        className="
                            text-2xl
                            font-bold
                            text-slate-900
                            dark:text-white
                        "
                    >
                        VideoTube
                    </span>
                </Link>

                {/* Login / Register */}
                <Outlet />
            </div>
        </div>
    );
}

export default AuthLayout;