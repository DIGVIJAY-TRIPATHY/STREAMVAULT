import { useQuery } from "@tanstack/react-query";

import { userApi } from "../api/userApi";
import VideoGrid from "../components/video/VideoGrid";

import { QUERY_KEYS } from "../utils/constants";

function History() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [QUERY_KEYS.WATCH_HISTORY],
    queryFn: () => userApi.getWatchHistory(),
  });

  const videos = data?.data || [];

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">Watch history</h1>

      {isError && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">
          {error?.message || "Failed to load watch history."}
        </div>
      )}

      <VideoGrid
        videos={videos}
        isLoading={isLoading}
        emptyMessage="Videos you watch will show up here."
      />
    </div>
  );
}

export default History;
