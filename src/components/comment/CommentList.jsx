import { useInfiniteQuery } from "@tanstack/react-query";

import { commentApi } from "../../api/commentApi";

import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

import InfiniteScrollSentinel from "../common/InfiniteScrollSentinel";
import Avatar from "../common/Avatar";
import { SkeletonText } from "../common/Skeleton";

import { QUERY_KEYS } from "../../utils/constants";


function CommentSkeleton() {
    return (
        <div className="flex gap-3">
            <Avatar
                alt="User"
                size="xs"
            />

            <div className="flex-1 space-y-2">
                <SkeletonText
                    width="w-32"
                    height="h-3"
                />

                <SkeletonText
                    width="w-full"
                    height="h-3"
                />

                <SkeletonText
                    width="w-3/4"
                    height="h-3"
                />
            </div>
        </div>
    );
}


function CommentList({ videoId }) {
    const {
        data,
        isLoading,
        isError,
        error,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useInfiniteQuery({
        queryKey: [
            QUERY_KEYS.COMMENTS,
            videoId,
        ],

        queryFn: ({ pageParam = 1 }) =>
            commentApi.getVideoComments(
                videoId,
                {
                    page: pageParam,
                    limit: 10,
                }
            ),

        getNextPageParam: (lastPage) =>
            lastPage?.data?.hasNextPage
                ? lastPage.data.page + 1
                : undefined,

        enabled: Boolean(videoId),

        initialPageParam: 1,
    });


    // =====================================================
    // Flatten Comments
    // Backend paginates with mongoose-aggregate-paginate-v2,
    // which returns the array under `docs`, not `comments`.
    // =====================================================

    const comments =
        data?.pages.flatMap(
            (page) =>
                page?.data?.docs || []
        ) ?? [];


    // =====================================================
    // Total Count
    // =====================================================

    const totalComments =
        data?.pages?.[0]?.data?.totalDocs ??
        comments.length;


    return (
        <section>
            {/* Heading */}
            <div className="mb-5">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {totalComments}{" "}
                    {totalComments === 1
                        ? "Comment"
                        : "Comments"}
                </h2>
            </div>


            {/* Add Comment */}
            <div className="mb-8">
                <CommentForm
                    videoId={videoId}
                />
            </div>


            {/* Loading */}
            {isLoading && (
                <div className="space-y-6">
                    {Array.from({
                        length: 3,
                    }).map((_, index) => (
                        <CommentSkeleton
                            key={index}
                        />
                    ))}
                </div>
            )}


            {/* Error */}
            {isError && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">
                    {error?.message ||
                        "Failed to load comments."}
                </div>
            )}


            {/* Comments */}
            {!isLoading &&
                !isError &&
                comments.length > 0 && (
                    <div className="space-y-6">
                        {comments.map(
                            (comment) => (
                                <CommentItem
                                    key={
                                        comment._id
                                    }
                                    comment={
                                        comment
                                    }
                                    videoId={
                                        videoId
                                    }
                                />
                            )
                        )}
                    </div>
                )}


            {/* Empty */}
            {!isLoading &&
                !isError &&
                comments.length === 0 && (
                    <div className="py-8 text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            No comments yet.
                            Be the first to
                            comment!
                        </p>
                    </div>
                )}


            {/* Loading next page */}
            {isFetchingNextPage && (
                <div className="mt-6 space-y-6">
                    {Array.from({
                        length: 2,
                    }).map((_, index) => (
                        <CommentSkeleton
                            key={`next-${index}`}
                        />
                    ))}
                </div>
            )}


            {/* Infinite Scroll */}
            <InfiniteScrollSentinel
                hasMore={hasNextPage}
                isLoading={
                    isFetchingNextPage
                }
                onVisible={() => {
                    if (
                        hasNextPage &&
                        !isFetchingNextPage
                    ) {
                        fetchNextPage();
                    }
                }}
            />
        </section>
    );
}

export default CommentList;