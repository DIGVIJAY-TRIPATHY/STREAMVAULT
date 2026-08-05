import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

import Button from "../components/common/Button";

function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
        <Compass size={40} />
      </div>

      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">404</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        We couldn&apos;t find the page you&apos;re looking for.
      </p>

      <Link to="/" className="mt-6">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}

export default NotFound;
