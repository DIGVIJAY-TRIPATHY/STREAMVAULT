import { Video as VideoIcon } from "lucide-react";

import VideoCard from "./VideoCard";
import { SkeletonVideoCard } from "../common/Skeleton";
import EmptyState from "../common/EmptyState";

function VideoGrid({ videos = [], isLoading = false, emptyMessage = "No videos found." }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonVideoCard key={index} />
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <EmptyState
        icon={VideoIcon}
        title="Nothing here yet"
        description={emptyMessage}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
}

export default VideoGrid;
