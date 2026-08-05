import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { X } from "lucide-react";

import { playlistApi } from "../api/playlistApi";
import { selectCurrentUser } from "../features/auth/authSlice";

import VideoCard from "../components/video/VideoCard";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";

import { QUERY_KEYS } from "../utils/constants";
import { getMediaUrl } from "../utils/media";

function PlaylistDetail() {
  const { playlistId } = useParams();
  const queryClient = useQueryClient();
  const currentUser = useSelector(selectCurrentUser);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [QUERY_KEYS.PLAYLIST, playlistId],
    queryFn: () => playlistApi.getPlaylistById(playlistId),
    enabled: Boolean(playlistId),
  });

  const playlist = data?.data;

  const removeMutation = useMutation({
    mutationFn: (videoId) => playlistApi.removeVideoFromPlaylist(videoId, playlistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLAYLIST, playlistId] });
      toast.success("Removed from playlist");
    },
    onError: (err) => toast.error(err?.message || "Failed to remove video"),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError || !playlist) {
    return (
      <EmptyState
        title="Playlist not found"
        description={error?.message || "This playlist doesn't exist."}
      />
    );
  }

  const isOwner =
    currentUser?._id && String(playlist.owner?._id) === String(currentUser._id);

  const videos = (playlist.videos || []).map((video) => ({
    ...video,
    thumbnail: getMediaUrl(video.thumbnail),
    videoFile: getMediaUrl(video.videoFile),
  }));

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900 dark:text-white">{playlist.name}</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{playlist.description}</p>
      <p className="mt-2 text-xs text-slate-400">
        {playlist.totalVideos || videos.length} videos
      </p>

      {videos.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No videos in this playlist" description="Add videos to this playlist to see them here." />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => (
            <div key={video._id} className="relative">
              <VideoCard video={video} />

              {isOwner && (
                <button
                  type="button"
                  onClick={() => removeMutation.mutate(video._id)}
                  disabled={removeMutation.isPending}
                  className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-black/90"
                  aria-label="Remove from playlist"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlaylistDetail;
