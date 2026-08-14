import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ThumbsUp, Pencil, Trash2, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

import { videoApi } from "../api/videoApi";
import { likeApi } from "../api/likeApi";
import { userApi } from "../api/userApi";

import useRequireAuth from "../hooks/useRequireAuth";

import VideoPlayer from "../components/video/VideoPlayer";
import Avatar from "../components/common/Avatar";
import SubscribeButton from "../components/channel/SubscribeButton";
import CommentList from "../components/comment/CommentList";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import ConfirmDialog from "../components/common/ConfirmDialog";

import { QUERY_KEYS } from "../utils/constants";
import { formatRelativeDate, formatCount } from "../utils/formatDate";
import { getMediaUrl } from "../utils/media";
import { selectCurrentUser } from "../features/auth/authSlice";

function Watch() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const currentUser = useSelector(selectCurrentUser);
  const requireAuth = useRequireAuth();

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sync local like state whenever the fetched video changes.
  useEffect(() => {
    setIsLiked(initiallyLiked);
    setLikeCount(video?.likesCount ?? 0);
  }, [video?._id, initiallyLiked, video?.likesCount]);

  const performLike = async () => {
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

  const handleToggleLike = () => {
    requireAuth(performLike, "Create a StreamVault account to like videos.");
  };

  const isOwner =
    currentUser?._id &&
    video?.owner?._id &&
    String(currentUser._id) === String(video.owner._id);

  const isHighCommand = currentUser?.role === "highCommand";
  const canDelete = isOwner || isHighCommand;

  const handleDelete = async () => {
    try {
      await videoApi.deleteVideo(videoId);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_VIDEOS] });
      toast.success("Video deleted");
      navigate(isOwner ? "/dashboard" : "/");
    } catch (err) {
      toast.error(err?.message || "Failed to delete video");
      throw err;
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto max-w-4xl"
    >
      {video.status !== "approved" && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400">
          <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500" />
          This video is pending review and is only visible to you. It
          will appear publicly once approved.
        </div>
      )}

      {isHighCommand && !isOwner && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-400">
          <ShieldAlert size={16} className="shrink-0" />
          You&apos;re viewing this as highCommand. You can remove this video
          if it violates platform guidelines.
        </div>
      )}

      {/* Player */}
      <VideoPlayer
        src={getMediaUrl(video.videoFile)}
        poster={getMediaUrl(video.thumbnail)}
        title={video.title}
        autoPlay
      />

      {/* Title */}
      <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
        {video.title}
      </h1>

      <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {formatCount(video.views)} views · {formatRelativeDate(video.createdAt)}
        </p>

        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            onClick={handleToggleLike}
            disabled={isTogglingLike}
            whileTap={{ scale: 0.94 }}
            className={`
              flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors
              ${
                isLiked
                  ? "border-indigo-600 bg-indigo-50 text-indigo-600 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-400"
                  : "border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              }
            `}
          >
            <motion.span
              animate={isLiked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
              transition={{ duration: 0.35 }}
              className="flex"
            >
              <ThumbsUp size={16} className={isLiked ? "fill-current" : ""} />
            </motion.span>
            {likeCount > 0 ? formatCount(likeCount) : "Like"}
          </motion.button>

          {isOwner && (
            <Link
              to={`/video/edit/${videoId}`}
              className="flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Pencil size={15} />
              Edit
            </Link>
          )}

          {canDelete && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <Trash2 size={15} />
              Delete
            </button>
          )}
        </div>
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

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete this video?"
        message={
          isOwner
            ? "This permanently deletes the video, its file, and all comments/likes. This cannot be undone."
            : "As highCommand, you're permanently deleting this creator's video and all its data. This cannot be undone."
        }
        confirmLabel="Delete"
        isDangerous
      />
    </motion.div>
  );
}

export default Watch;