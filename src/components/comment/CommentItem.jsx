import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Pencil,
    Trash2,
    ThumbsUp,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import { commentApi } from "../../api/commentApi";
import { likeApi } from "../../api/likeApi";

import Avatar from "../common/Avatar";
import Button from "../common/Button";
import ConfirmDialog from "../common/ConfirmDialog";

import { QUERY_KEYS } from "../../utils/constants";
import { formatRelativeDate } from "../../utils/formatDate";


function CommentItem({ comment, videoId }) {
    const queryClient = useQueryClient();

    const user = useSelector(
        (state) => state.auth.user
    );

    const isAuthenticated = useSelector(
        (state) => state.auth.isAuthenticated
    );

    const [isEditing, setIsEditing] =
        useState(false);

    const [editContent, setEditContent] =
        useState(comment.content || "");

    const [showDeleteDialog, setShowDeleteDialog] =
        useState(false);


    const ownerId =
        comment.owner?._id ||
        comment.owner;

    const isOwner =
        Boolean(user?._id) &&
        String(ownerId) ===
            String(user._id);


    // =====================================================
    // Update Comment
    // =====================================================

    const updateMutation = useMutation({
        mutationFn: ({ commentId, content }) =>
            commentApi.updateComment(
                commentId,
                content
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [
                    QUERY_KEYS.COMMENTS,
                    videoId,
                ],
            });

            setIsEditing(false);

            toast.success("Comment updated");
        },

        onError: (error) => {
            toast.error(
                error?.message ||
                    "Failed to update comment"
            );
        },
    });


    // =====================================================
    // Delete Comment
    // =====================================================

    const deleteMutation = useMutation({
        mutationFn: (commentId) =>
            commentApi.deleteComment(
                commentId
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [
                    QUERY_KEYS.COMMENTS,
                    videoId,
                ],
            });

            setShowDeleteDialog(false);

            toast.success("Comment deleted");
        },

        onError: (error) => {
            toast.error(
                error?.message ||
                    "Failed to delete comment"
            );
        },
    });


    // =====================================================
    // Like Comment - Optimistic Update
    // =====================================================

    const likeMutation = useMutation({
        mutationFn: () =>
            likeApi.toggleCommentLike(
                comment._id
            ),

        onMutate: async () => {
            if (!isAuthenticated) {
                toast.error(
                    "Please sign in to like comments"
                );

                return null;
            }

            await queryClient.cancelQueries({
                queryKey: [
                    QUERY_KEYS.COMMENTS,
                    videoId,
                ],
            });

            const queryKey = [
                QUERY_KEYS.COMMENTS,
                videoId,
            ];

            const previousComments =
                queryClient.getQueryData(
                    queryKey
                );

            queryClient.setQueryData(
                queryKey,
                (oldData) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        pages: oldData.pages?.map(
                            (page) => {
                                const comments =
                                    page?.data?.comments ||
                                    [];

                                return {
                                    ...page,
                                    data: {
                                        ...page.data,
                                        comments:
                                            comments.map(
                                                (item) => {
                                                    if (
                                                        item._id !==
                                                        comment._id
                                                    ) {
                                                        return item;
                                                    }

                                                    const currentlyLiked =
                                                        Boolean(
                                                            item.isLiked
                                                        );

                                                    const currentLikes =
                                                        Array.isArray(
                                                            item.likes
                                                        )
                                                            ? item.likes.length
                                                            : Number(
                                                                  item.likes ||
                                                                      0
                                                              );

                                                    return {
                                                        ...item,
                                                        isLiked:
                                                            !currentlyLiked,
                                                        likes: Array.isArray(
                                                            item.likes
                                                        )
                                                            ? item.likes
                                                            : Math.max(
                                                                  0,
                                                                  currentLikes +
                                                                      (currentlyLiked
                                                                          ? -1
                                                                          : 1)
                                                              ),
                                                        likeCount:
                                                            Math.max(
                                                                0,
                                                                currentLikes +
                                                                    (currentlyLiked
                                                                        ? -1
                                                                        : 1)
                                                            ),
                                                    };
                                                }
                                            ),
                                    },
                                };
                            }
                        ),
                    };
                }
            );

            return {
                previousComments,
            };
        },

        onError: (_error, _variables, context) => {
            if (context?.previousComments) {
                queryClient.setQueryData(
                    [
                        QUERY_KEYS.COMMENTS,
                        videoId,
                    ],
                    context.previousComments
                );
            }

            toast.error(
                "Failed to update comment like"
            );
        },

        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: [
                    QUERY_KEYS.COMMENTS,
                    videoId,
                ],
            });
        },
    });


    // =====================================================
    // Save Edit
    // =====================================================

    const handleSaveEdit = () => {
        const content =
            editContent.trim();

        if (!content) {
            toast.error(
                "Comment cannot be empty"
            );
            return;
        }

        if (content.length > 1000) {
            toast.error(
                "Comment cannot exceed 1000 characters"
            );
            return;
        }

        updateMutation.mutate({
            commentId: comment._id,
            content,
        });
    };


    const handleCancelEdit = () => {
        setEditContent(
            comment.content || ""
        );

        setIsEditing(false);
    };


    // =====================================================
    // Like Count
    // =====================================================

    const likeCount = Array.isArray(
        comment.likes
    )
        ? comment.likes.length
        : Number(comment.likes || 0);


    return (
        <>
            <article className="group flex gap-3">
                {/* Avatar */}
                <Avatar
                    src={comment.owner?.avatar}
                    alt={
                        comment.owner?.username ||
                        comment.owner?.fullName ||
                        "User"
                    }
                    size="xs"
                />

                <div className="min-w-0 flex-1">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {comment.owner
                                ?.username ||
                                comment.owner
                                    ?.fullName ||
                                "Unknown user"}
                        </span>

                        <span className="text-xs text-slate-400">
                            {formatRelativeDate(
                                comment.createdAt
                            )}
                        </span>
                    </div>


                    {/* Content / Edit */}
                    {isEditing ? (
                        <div className="mt-2">
                            <textarea
                                value={
                                    editContent
                                }
                                onChange={(event) =>
                                    setEditContent(
                                        event.target
                                            .value
                                    )
                                }
                                maxLength={1000}
                                rows={3}
                                autoFocus
                                disabled={
                                    updateMutation.isPending
                                }
                                className="
                                    w-full
                                    resize-none
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-3
                                    py-2
                                    text-sm
                                    text-slate-900
                                    outline-none
                                    focus:border-indigo-500
                                    focus:ring-2
                                    focus:ring-indigo-500/20
                                    dark:border-slate-700
                                    dark:bg-slate-900
                                    dark:text-slate-100
                                "
                            />

                            <div className="mt-2 flex items-center gap-2">
                                <Button
                                    size="sm"
                                    isLoading={
                                        updateMutation.isPending
                                    }
                                    onClick={
                                        handleSaveEdit
                                    }
                                >
                                    Save
                                </Button>

                                <Button
                                    type="button"
                                    size="sm"
                                    variant="secondary"
                                    disabled={
                                        updateMutation.isPending
                                    }
                                    onClick={
                                        handleCancelEdit
                                    }
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                            {comment.content}
                        </p>
                    )}


                    {/* Actions */}
                    {!isEditing && (
                        <div className="mt-2 flex items-center gap-3">
                            {/* Like */}
                            <button
                                type="button"
                                onClick={() =>
                                    likeMutation.mutate()
                                }
                                disabled={
                                    likeMutation.isPending
                                }
                                className={`
                                    flex
                                    items-center
                                    gap-1.5
                                    rounded-full
                                    px-2
                                    py-1
                                    text-xs
                                    transition-colors
                                    ${
                                        comment.isLiked
                                            ? "text-indigo-600 dark:text-indigo-400"
                                            : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                                    }
                                `}
                                aria-label="Like comment"
                            >
                                <ThumbsUp
                                    size={14}
                                    className={
                                        comment.isLiked
                                            ? "fill-current"
                                            : ""
                                    }
                                />

                                {likeCount > 0 && (
                                    <span>
                                        {likeCount}
                                    </span>
                                )}
                            </button>


                            {/* Owner Actions */}
                            {isOwner && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsEditing(
                                                true
                                            )
                                        }
                                        className="
                                            flex
                                            items-center
                                            gap-1
                                            rounded
                                            p-1
                                            text-slate-400
                                            opacity-0
                                            transition-all
                                            hover:bg-slate-100
                                            hover:text-indigo-600
                                            group-hover:opacity-100
                                            focus:opacity-100
                                            dark:hover:bg-slate-800
                                        "
                                        aria-label="Edit comment"
                                    >
                                        <Pencil
                                            size={14}
                                        />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowDeleteDialog(
                                                true
                                            )
                                        }
                                        className="
                                            flex
                                            items-center
                                            gap-1
                                            rounded
                                            p-1
                                            text-slate-400
                                            opacity-0
                                            transition-all
                                            hover:bg-red-50
                                            hover:text-red-600
                                            group-hover:opacity-100
                                            focus:opacity-100
                                            dark:hover:bg-red-950/30
                                        "
                                        aria-label="Delete comment"
                                    >
                                        <Trash2
                                            size={14}
                                        />
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </article>


            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() =>
                    setShowDeleteDialog(false)
                }
                onConfirm={() =>
                    deleteMutation.mutate(
                        comment._id
                    )
                }
                title="Delete comment?"
                message="This comment will be permanently deleted. This action cannot be undone."
                confirmLabel="Delete"
                isDangerous
            />
        </>
    );
}

export default CommentItem;