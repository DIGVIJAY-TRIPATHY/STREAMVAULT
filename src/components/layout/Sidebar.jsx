import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Home,
  ThumbsUp,
  History,
  ListVideo,
  LayoutDashboard,
  Upload,
  X,
} from "lucide-react";

import { selectIsSidebarOpen, closeSidebar } from "../../features/ui/uiSlice";
import { selectIsAuthenticated } from "../../features/auth/authSlice";

const navItems = [
  { label: "Home", to: "/", icon: Home, requiresAuth: false },
  { label: "Liked Videos", to: "/liked-videos", icon: ThumbsUp, requiresAuth: true },
  { label: "Watch History", to: "/history", icon: History, requiresAuth: true },
  { label: "Playlists", to: "/playlists", icon: ListVideo, requiresAuth: true },
  { label: "Studio", to: "/dashboard", icon: LayoutDashboard, requiresAuth: true },
  { label: "Upload", to: "/upload", icon: Upload, requiresAuth: true },
];

function Sidebar() {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectIsSidebarOpen);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const visibleItems = navItems.filter(
    (item) => !item.requiresAuth || isAuthenticated
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => dispatch(closeSidebar())}
          role="presentation"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 shrink-0 transform
          border-r border-slate-200 bg-white pt-16 transition-transform
          duration-200 dark:border-slate-800 dark:bg-slate-950
          lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-4 py-3 lg:hidden">
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Menu
          </span>

          <button
            type="button"
            onClick={() => dispatch(closeSidebar())}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => dispatch(closeSidebar())}
              className={({ isActive }) => `
                flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                transition-colors
                ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }
              `}
            >
              <item.icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
