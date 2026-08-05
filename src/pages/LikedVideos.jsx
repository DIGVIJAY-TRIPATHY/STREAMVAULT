import { useQuery } from "@tanstack/react-query";

import { likeApi } from "../api/likeApi";
import VideoGrid from "../components/video/VideoGrid";

import { QUERY_KEYS } from "../utils/constants";

function LikedVideos() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [QUERY_KEYS.LIKED_VIDEOS],
    queryFn: () => likeApi.getLikedVideos(),
  });

  // The backend's getLikedVideos aggregation leaves `owner` as a raw
  // ObjectId and puts the populated user under `ownerDetails` instead
  // (unlike every other video endpoint, which populates `owner`
  // directly). Remap it so VideoCard's `video.owner.*` access works.
  const videos = (data?.data || []).map((video) => ({
    ...video,
    owner: video.ownerDetails || video.owner,
  }));

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">Liked videos</h1>

      {isError && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">
          {error?.message || "Failed to load liked videos."}
        </div>
      )}

      <VideoGrid
        videos={videos}
        isLoading={isLoading}
        emptyMessage="Videos you like will show up here."
      />
    </div>
  );
}

export default LikedVideos;
