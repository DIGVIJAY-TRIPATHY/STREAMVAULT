import { useInfiniteQuery } from "@tanstack/react-query";

import { videoApi } from "../api/videoApi";
import VideoGrid from "../components/video/VideoGrid";
import InfiniteScrollSentinel from "../components/common/InfiniteScrollSentinel";

import { QUERY_KEYS } from "../utils/constants";

function Home() {
  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.VIDEOS, "home"],

    queryFn: ({ pageParam = 1 }) =>
      videoApi.getAllVideos({ page: pageParam, limit: 12 }),

    getNextPageParam: (lastPage) => {
      const paginated = lastPage?.data;
      return paginated?.hasNextPage ? paginated.page + 1 : undefined;
    },

    initialPageParam: 1,
  });

  const videos = data?.pages.flatMap((page) => page?.data?.docs || []) ?? [];

  return (
    <div>
      <h1 className="sr-only">Videos</h1>

      {isError && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">
          {error?.message || "Failed to load videos."}
        </div>
      )}

      <VideoGrid
        videos={videos}
        isLoading={isLoading}
        emptyMessage="No videos have been uploaded yet. Be the first to upload one!"
      />

      <InfiniteScrollSentinel
        hasMore={Boolean(hasNextPage)}
        isLoading={isFetchingNextPage}
        onVisible={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
      />
    </div>
  );
}

export default Home;
