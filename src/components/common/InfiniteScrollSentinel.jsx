import { useCallback } from "react";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import Loader from "./Loader";

function InfiniteScrollSentinel({
    onVisible,
    hasMore,
    isLoading,
}) {
    const handleVisible = useCallback(() => {
        if (!isLoading && hasMore) {
            onVisible();
        }
    }, [onVisible, hasMore, isLoading]);

    const sentinelRef = useInfiniteScroll(handleVisible);

    // Nothing to load anymore
    if (!hasMore) {
        return null;
    }

    return (
        <div
            ref={sentinelRef}
            className="h-px w-full"
            aria-hidden="true"
        >
            {isLoading && (
                <div className="flex items-center justify-center py-4">
                    <Loader size="sm" />
                </div>
            )}
        </div>
    );
}

export default InfiniteScrollSentinel;