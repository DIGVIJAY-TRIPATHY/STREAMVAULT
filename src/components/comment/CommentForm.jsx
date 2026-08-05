import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { commentApi } from "../../api/commentApi";
import { useSelector } from "react-redux";

import Avatar from "../common/Avatar";
import Button from "../common/Button";

import { QUERY_KEYS } from "../../utils/constants";


function CommentForm({ videoId, onSuccess }) {
    const queryClient = useQueryClient();
    const textareaRef = useRef(null);

    const isAuthenticated = useSelector(
        (state) => state.auth.isAuthenticated
    );

    const user = useSelector(
        (state) => state.auth.user
    );


    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            content: "",
        },
    });

    const content = watch("content");


    // =====================================================
    // Auto-expand textarea
    // =====================================================

    const resizeTextarea = () => {
        const textarea = textareaRef.current;

        if (!textarea) return;

        textarea.style.height = "auto";

        const lineHeight = 24;
        const maxHeight = lineHeight * 4;

        textarea.style.height = `${Math.min(
            textarea.scrollHeight,
            maxHeight
        )}px`;
    };

    useEffect(() => {
        resizeTextarea();
    }, [content]);


    // =====================================================
    // Add Comment
    // =====================================================

    const addCommentMutation = useMutation({
        mutationFn: ({ videoId, content }) =>
            commentApi.addComment(
                videoId,
                content
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [
                    QUERY_KEYS.COMMENTS,
                    videoId,
                ],
            });

            reset();

            if (onSuccess) {
                onSuccess();
            }

            toast.success("Comment added");
        },

        onError: (error) => {
            toast.error(
                error?.message ||
                    "Failed to add comment"
            );
        },
    });


    const onSubmit = (data) => {
        const trimmedContent =
            data.content.trim();

        if (!trimmedContent) return;

        addCommentMutation.mutate({
            videoId,
            content: trimmedContent,
        });
    };


    // =====================================================
    // Not Authenticated
    // =====================================================

    if (!isAuthenticated) {
        return (
            <div className="flex items-center gap-3 rounded-xl bg-slate-100 p-4 dark:bg-slate-900">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Sign in to comment.
                </p>

                <Link
                    to="/login"
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                >
                    Sign in
                </Link>
            </div>
        );
    }


    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex gap-3"
        >
            {/* User Avatar */}
            <Avatar
                src={user?.avatar}
                alt={
                    user?.username ||
                    user?.fullName ||
                    "User"
                }
                size="sm"
            />

            <div className="min-w-0 flex-1">
                <div className="flex gap-2">
                    <textarea
                        {...register("content", {
                            required:
                                "Comment cannot be empty",
                            minLength: {
                                value: 1,
                                message:
                                    "Comment cannot be empty",
                            },
                            maxLength: {
                                value: 1000,
                                message:
                                    "Comment cannot exceed 1000 characters",
                            },
                        })}
                        ref={(element) => {
                            register("content").ref(
                                element
                            );
                            textareaRef.current =
                                element;
                        }}
                        rows={1}
                        placeholder="Add a comment..."
                        disabled={
                            addCommentMutation.isPending
                        }
                        className="
                            min-h-[42px]
                            max-h-[96px]
                            w-full
                            resize-none
                            overflow-y-auto
                            rounded-xl
                            border
                            border-slate-300
                            bg-white
                            px-4
                            py-2.5
                            text-sm
                            text-slate-900
                            outline-none
                            transition
                            focus:border-indigo-500
                            focus:ring-2
                            focus:ring-indigo-500/20
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                            dark:border-slate-700
                            dark:bg-slate-900
                            dark:text-slate-100
                        "
                    />

                    <Button
                        type="submit"
                        size="sm"
                        isLoading={
                            addCommentMutation.isPending
                        }
                        disabled={
                            !content?.trim() ||
                            addCommentMutation.isPending
                        }
                    >
                        Comment
                    </Button>
                </div>

                {errors.content && (
                    <p className="mt-1 text-xs text-red-500">
                        {errors.content.message}
                    </p>
                )}

                <div className="mt-1 text-right text-xs text-slate-400">
                    {content?.length || 0}/1000
                </div>
            </div>
        </form>
    );
}

export default CommentForm;