
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Menu,
    Video,
    Search,
    Upload,
    Sun,
    Moon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { useDebounce } from "../../hooks/useDebounce.js";
import useAuth from "../../hooks/useAuth.js";

import Avatar from "../common/Avatar";
import Dropdown from "../common/Dropdown.jsx";

import {
    toggleSidebar,
    toggleTheme,
} from "../../features/ui/uiSlice.js";

import {
    selectIsAuthenticated,
} from "../../features/auth/authSlice.js";

function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { logout } = useAuth();

    const isAuthenticated = useSelector(selectIsAuthenticated);

    // Current user
    const user = useSelector((state) => state.auth.user);

    // Theme
    const theme = useSelector((state) => state.ui.theme);

    // Search
    const [searchValue, setSearchValue] = useState("");
    const debouncedSearch = useDebounce(searchValue, 500);

    const handleSearch = (value) => {
        const query = value.trim();

        if (query.length >= 2) {
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    // Navigate automatically when debounce finishes
    useEffect(() => {
        const query = debouncedSearch.trim();

        if (query.length >= 2) {
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    }, [debouncedSearch, navigate]);

    const handleSearchSubmit = (event) => {
        event.preventDefault();

        handleSearch(searchValue);
    };

    const handleSearchKeyDown = (event) => {
        if (event.key === "Escape") {
            setSearchValue("");
        }
    };

    const handleLogout = async () => {
        await logout();
    };

    return (
        <header
            className="
                sticky top-0 z-40
                w-full
                border-b border-slate-200
                bg-white/95
                backdrop-blur
                dark:border-slate-800
                dark:bg-slate-950/95
            "
        >
            <div className="flex h-16 items-center gap-3 px-4">
                {/* Hamburger */}
                <button
                    type="button"
                    onClick={() => dispatch(toggleSidebar())}
                    className="
                        flex h-10 w-10 shrink-0 items-center justify-center
                        rounded-lg
                        text-slate-600
                        transition-colors
                        hover:bg-slate-100
                        dark:text-slate-300
                        dark:hover:bg-slate-800
                    "
                    aria-label="Toggle sidebar"
                >
                    <Menu size={22} />
                </button>

                {/* Logo */}
                <Link
                    to="/"
                    className="
                        flex shrink-0 items-center gap-2
                        text-slate-900
                        dark:text-white
                    "
                >
                    <Video
                        size={28}
                        className="text-indigo-600"
                    />

                    <span className="hidden text-lg font-bold sm:block">
                        VideoTube
                    </span>
                </Link>

                {/* Search */}
                <form
                    onSubmit={handleSearchSubmit}
                    className="mx-auto flex max-w-2xl flex-1"
                >
                    <div className="relative w-full">
                        <input
                            type="search"
                            value={searchValue}
                            onChange={(event) =>
                                setSearchValue(event.target.value)
                            }
                            onKeyDown={handleSearchKeyDown}
                            placeholder="Search videos..."
                            className="
                                w-full
                                rounded-full
                                border border-slate-300
                                bg-slate-50
                                py-2.5
                                pl-4
                                pr-12
                                text-sm
                                text-slate-900
                                outline-none
                                transition
                                focus:border-indigo-500
                                focus:ring-2
                                focus:ring-indigo-500/20
                                dark:border-slate-700
                                dark:bg-slate-900
                                dark:text-slate-100
                                dark:placeholder:text-slate-500
                            "
                            aria-label="Search videos"
                        />

                        <button
                            type="submit"
                            className="
                                absolute right-1 top-1/2
                                flex h-9 w-9
                                -translate-y-1/2
                                items-center justify-center
                                rounded-full
                                text-slate-500
                                transition-colors
                                hover:bg-slate-200
                                hover:text-indigo-600
                                dark:text-slate-400
                                dark:hover:bg-slate-800
                                dark:hover:text-indigo-400
                            "
                            aria-label="Search"
                        >
                            <Search size={19} />
                        </button>
                    </div>
                </form>

                {/* Right actions */}
                <div className="flex shrink-0 items-center gap-2">
                    {/* Theme toggle */}
                    <button
                        type="button"
                        onClick={() => dispatch(toggleTheme())}
                        className="
                            flex h-10 w-10 items-center justify-center
                            rounded-lg
                            text-slate-600
                            transition-colors
                            hover:bg-slate-100
                            dark:text-slate-300
                            dark:hover:bg-slate-800
                        "
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? (
                            <Sun size={20} />
                        ) : (
                            <Moon size={20} />
                        )}
                    </button>

                    {isAuthenticated ? (
                        <>
                            {/* Upload */}
                            <button
                                type="button"
                                onClick={() => navigate("/upload")}
                                className="
                                    hidden items-center gap-2
                                    rounded-lg
                                    bg-indigo-600
                                    px-3 py-2
                                    text-sm font-medium
                                    text-white
                                    transition-colors
                                    hover:bg-indigo-700
                                    sm:flex
                                "
                            >
                                <Upload size={17} />
                                <span>Upload</span>
                            </button>

                            {/* Avatar Dropdown */}
                            <Dropdown
                                align="right"
                                trigger={
                                    <Avatar
                                        src={user?.avatar}
                                        alt={
                                            user?.username ||
                                            user?.fullName ||
                                            "User"
                                        }
                                        size="sm"
                                    />
                                }
                                items={[
                                    {
                                        label: "My Channel",
                                        onClick: () =>
                                            navigate(
                                                `/channel/${user?.username}`
                                            ),
                                    },
                                    {
                                        label: "Studio",
                                        onClick: () =>
                                            navigate("/dashboard"),
                                    },
                                    {
                                        label: "Settings",
                                        onClick: () =>
                                            navigate("/settings"),
                                    },
                                    {
                                        divider: true,
                                    },
                                    {
                                        label: "Logout",
                                        isDanger: true,
                                        onClick: handleLogout,
                                    },
                                ]}
                            />
                        </>
                    ) : (
                        <>
                            {/* Login */}
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="
                                    rounded-lg
                                    px-3 py-2
                                    text-sm font-medium
                                    text-slate-700
                                    transition-colors
                                    hover:bg-slate-100
                                    dark:text-slate-200
                                    dark:hover:bg-slate-800
                                "
                            >
                                Login
                            </button>

                            {/* Register */}
                            <button
                                type="button"
                                onClick={() => navigate("/register")}
                                className="
                                    rounded-lg
                                    bg-indigo-600
                                    px-3 py-2
                                    text-sm font-medium
                                    text-white
                                    transition-colors
                                    hover:bg-indigo-700
                                "
                            >
                                Register
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
