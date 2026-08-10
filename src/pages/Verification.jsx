import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Check, X, ShieldCheck, Mail } from "lucide-react";

import { adminApi } from "../api/adminApi";

import Avatar from "../components/common/Avatar";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import ConfirmDialog from "../components/common/ConfirmDialog";

import { formatRelativeDate, formatDuration } from "../utils/formatDate";
import { getMediaUrl } from "../utils/media";

const QUERY_KEY = ["admin", "pendingVideos"];

function PendingVideoCard({ video, onApprove, onReject, isBusy }) {
    const [showRejectConfirm, setShowRejectConfirm] = useState(false);

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="aspect-video w-full bg-black">
                <video
                    src={getMediaUrl(video.videoFile)}
                    poster={getMediaUrl(video.thumbnail)}
                    controls
                    className="h-full w-full"
                />
            </div>

            <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="line-clamp-2 font-semibold text-slate-900 dark:text-white">
                            {video.title}
                        </h3>
                        <p className="mt-1 text-xs text-slate-400">
                            Submitted {formatRelativeDate(video.createdAt)} ·{" "}
                            {formatDuration(video.duration)}
                        </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                        Pending
                    </span>
                </div>

                {video.description && (
                    <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">
                        {video.description}
                    </p>
                )}

                <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                    <Avatar
                        src={video.owner?.avatar}
                        alt={video.owner?.username || "Uploader"}
                        size="md"
                    />

                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                            {video.owner?.fullName || video.owner?.username}
                        </p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                            @{video.owner?.username}
                        </p>
                        {video.owner?.email && (
                            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-400">
                                <Mail size={11} />
                                {video.owner.email}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-4 flex gap-2">
                    <Button
                        className="flex-1"
                        leftIcon={<Check size={16} />}
                        isLoading={isBusy}
                        disabled={isBusy}
                        onClick={() => onApprove(video._id)}
                    >
                        Accept
                    </Button>

                    <Button
                        variant="danger"
                        className="flex-1"
                        leftIcon={<X size={16} />}
                        disabled={isBusy}
                        onClick={() => setShowRejectConfirm(true)}
                    >
                        Reject
                    </Button>
                </div>
            </div>

            <ConfirmDialog
                isOpen={showRejectConfirm}
                onClose={() => setShowRejectConfirm(false)}
                onConfirm={() => onReject(video._id)}
                title="Reject this video?"
                message="This permanently deletes the video, its file, and all related data. The uploader will not be able to see it anymore. This cannot be undone."
                confirmLabel="Reject & Delete"
                isDangerous
            />
        </div>
    );
}

function Verification() {
    const queryClient = useQueryClient();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: QUERY_KEY,
        queryFn: () => adminApi.getPendingVideos(),
    });

    const videos = data?.data || [];

    const [busyVideoId, setBusyVideoId] = useState(null);

    const approveMutation = useMutation({
        mutationFn: (videoId) => adminApi.approveVideo(videoId),
        onMutate: (videoId) => setBusyVideoId(videoId),
        onSuccess: () => {
            toast.success("Video approved and published");
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
        onError: (err) => {
            toast.error(err?.message || "Failed to approve video");
        },
        onSettled: () => setBusyVideoId(null),
    });

    const rejectMutation = useMutation({
        mutationFn: (videoId) => adminApi.rejectVideo(videoId),
        onMutate: (videoId) => setBusyVideoId(videoId),
        onSuccess: () => {
            toast.success("Video rejected and removed");
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
        onError: (err) => {
            toast.error(err?.message || "Failed to reject video");
        },
        onSettled: () => setBusyVideoId(null),
    });

    return (
        <div>
            <div className="mb-6 flex items-center gap-2">
                <ShieldCheck className="text-indigo-600 dark:text-indigo-400" size={22} />
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                    Video Verification
                </h1>
            </div>

            {isError && (
                <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">
                    {error?.message || "Failed to load pending videos."}
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center py-16">
                    <Loader size="lg" />
                </div>
            ) : videos.length === 0 ? (
                <EmptyState
                    icon={ShieldCheck}
                    title="All caught up"
                    description="There are no videos waiting for review right now."
                />
            ) : (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {videos.map((video) => (
                        <PendingVideoCard
                            key={video._id}
                            video={video}
                            onApprove={(id) => approveMutation.mutate(id)}
                            onReject={(id) => rejectMutation.mutate(id)}
                            isBusy={busyVideoId === video._id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Verification;