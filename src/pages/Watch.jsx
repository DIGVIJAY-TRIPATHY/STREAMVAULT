import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { ThumbsUp } from "lucide-react";
import toast from "react-hot-toast";

import { videoApi } from "../api/videoApi";
import { likeApi } from "../api/likeApi";
import { userApi } from "../api/userApi";

import Avatar from "../components/common/Avatar";
import SubscribeButton from "../components/channel/SubscribeButton";
import CommentList from "../components/comment/CommentList";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";

import { QUERY_KEYS } from "../utils/constants";
import { formatRelativeDate, formatCount } from "../utils/formatDate";
import { getMediaUrl } from "../utils/media";
import { selectCurrentUser, selectIsAuthenticated } from "../features/auth/authSlice";

function Watch() {
  const { videoId } = useParams();

  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [QUERY_KEYS.VIDEO, videoId],
    queryFn: () => videoApi.getVideoById(videoId),
    enabled: Boolean(videoId),
  });

  const video = data?.data;

  // getVideoById doesn't return subscribersCount/isSubscribed for the
  // owner, so fetch the channel profile separately for an accurate
  // SubscribeButton state instead of always defaulting to false/0.
  const { data: channelData } = useQuery({
    queryKey: [QUERY_KEYS.CHANNEL, video?.owner?.username],
    queryFn: () => userApi.getChannelProfile(video.owner.username),
    enabled: Boolean(video?.owner?.username),
  });

  const channel = channelData?.data;

  const initiallyLiked = useMemo(() => {
    if (!video?.likes || !currentUser?._id) return false;

    return video.likes.some(
      (like) => String(like.likedBy) === String(currentUser._id)
    );
  }, [video, currentUser]);

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isTogglingLike, setIsTogglingLike] = useState(false);

  // Sync local like state whenever the fetched video changes.
  useEffect(() => {
    setIsLiked(initiallyLiked);
    setLikeCount(video?.likesCount ?? 0);
  }, [video?._id, initiallyLiked, video?.likesCount]);

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Sign in to like this video");
      return;
    }

    const previousLiked = isLiked;
    const previousCount = likeCount;

    setIsLiked(!previousLiked);
    setLikeCount(previousLiked ? Math.max(0, previousCount - 1) : previousCount + 1);
    setIsTogglingLike(true);

    try {
      await likeApi.toggleVideoLike(videoId);
    } catch (err) {
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
      toast.error(err?.message || "Failed to update like");
    } finally {
      setIsTogglingLike(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError || !video) {
    return (
      <EmptyState
        title="Video not found"
        description={error?.message || "This video may have been removed or is unavailable."}
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Player */}
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
        <video
          src={getMediaUrl(video.videoFile)}
          poster={getMediaUrl(video.thumbnail)}
          controls
          autoPlay
          className="h-full w-full"
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Title */}
      <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
        {video.title}
      </h1>

      <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {formatCount(video.views)} views · {formatRelativeDate(video.createdAt)}
        </p>

        <button
          type="button"
          onClick={handleToggleLike}
          disabled={isTogglingLike}
          className={`
            flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors
            ${
              isLiked
                ? "border-indigo-600 bg-indigo-50 text-indigo-600 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-400"
                : "border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            }
          `}
        >
          <ThumbsUp size={16} className={isLiked ? "fill-current" : ""} />
          {likeCount > 0 ? formatCount(likeCount) : "Like"}
        </button>
      </div>

      {/* Channel row */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-y border-slate-200 py-4 dark:border-slate-800">
        <Link
          to={`/channel/${video.owner?.username}`}
          className="flex items-center gap-3"
        >
          <Avatar
            src={video.owner?.avatar}
            alt={video.owner?.username || "Channel"}
            size="md"
          />

          <div>
            <p className="font-semibold text-slate-900 dark:text-white">
              {video.owner?.fullName || video.owner?.username}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              @{video.owner?.username}
            </p>
          </div>
        </Link>

        {video.owner?._id && (
          <SubscribeButton
            channelId={video.owner._id}
            initialIsSubscribed={channel?.isSubscribed ?? false}
            initialCount={channel?.subscribersCount ?? 0}
          />
        )}
      </div>

      {/* Description */}
      {video.description && (
        <div className="mt-4 rounded-xl bg-slate-100 p-4 text-sm leading-relaxed text-slate-700 dark:bg-slate-900 dark:text-slate-300">
          <p className="whitespace-pre-wrap">{video.description}</p>
        </div>
      )}

      {/* Comments */}
      <div className="mt-8">
        <CommentList videoId={videoId} />
      </div>
    </div>
  );
}

export default Watch;
