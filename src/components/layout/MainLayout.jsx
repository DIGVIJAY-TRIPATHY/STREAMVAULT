import { Outlet } from "react-router-dom";

import Header from "./Header";
import Sidebar from "./Sidebar";

function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />

      <div className="flex">
        <Sidebar />

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
