import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Film, Eye, Users, ThumbsUp } from "lucide-react";
import toast from "react-hot-toast";

import { dashboardApi } from "../api/dashboardApi";
import { videoApi } from "../api/videoApi";

import StatsCard from "../components/dashboard/StatsCard";
import VideoTable from "../components/dashboard/VideoTable";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";

import { QUERY_KEYS } from "../utils/constants";
import { formatCount } from "../utils/formatDate";

function Dashboard() {
  const queryClient = useQueryClient();

  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_STATS],
    queryFn: () => dashboardApi.getChannelStats(),
  });

  const { data: videosData, isLoading: isLoadingVideos } = useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_VIDEOS],
    queryFn: () => dashboardApi.getChannelVideos(),
  });

  const stats = statsData?.data;
  const videos = videosData?.data || [];

  const togglePublishMutation = useMutation({
    mutationFn: (videoId) => videoApi.togglePublishStatus(videoId),
    onError: (error) => {
      toast.error(error?.message || "Failed to update publish status");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_VIDEOS] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (videoId) => videoApi.deleteVideo(videoId),
    onSuccess: () => {
      toast.success("Video deleted");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_VIDEOS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to delete video");
    },
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900 dark:text-white">Channel dashboard</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Videos"
          value={isLoadingStats ? "—" : formatCount(stats?.totalVideos ?? 0)}
          icon={Film}
          color="indigo"
        />
        <StatsCard
          title="Total Views"
          value={isLoadingStats ? "—" : formatCount(stats?.totalViews ?? 0)}
          icon={Eye}
          color="teal"
        />
        <StatsCard
          title="Subscribers"
          value={isLoadingStats ? "—" : formatCount(stats?.totalSubscribers ?? 0)}
          icon={Users}
          color="amber"
        />
        <StatsCard
          title="Total Likes"
          value={isLoadingStats ? "—" : formatCount(stats?.totalLikes ?? 0)}
          icon={ThumbsUp}
          color="rose"
        />
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          Your videos
        </h2>

        {isLoadingVideos ? (
          <div className="flex justify-center py-10">
            <Loader />
          </div>
        ) : videos.length === 0 ? (
          <EmptyState
            icon={Film}
            title="No videos yet"
            description="Upload your first video to see it here."
          />
        ) : (
          <VideoTable
            videos={videos}
            onTogglePublish={(videoId) => togglePublishMutation.mutateAsync(videoId)}
            onDelete={(videoId) => deleteMutation.mutate(videoId)}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
