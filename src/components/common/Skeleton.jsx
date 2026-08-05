
function Skeleton({
    className = "",
    width,
    height,
    rounded = true,
}) {
    return (
        <div
            className={`
                bg-slate-200
                dark:bg-slate-700
                animate-pulse
                ${rounded ? "rounded-lg" : ""}
                ${width ? `w-${width}` : ""}
                ${height ? `h-${height}` : ""}
                ${className}
            `}
        />
    );
}

export function SkeletonVideoCard() {
    return (
        <div className="w-full">
            {/* 16:9 video thumbnail */}
            <Skeleton
                className="aspect-video w-full"
                rounded={true}
            />

            {/* Video title */}
            <Skeleton
                className="mt-3 h-4 w-4/5"
                rounded={true}
            />

            {/* Channel / metadata */}
            <Skeleton
                className="mt-2 h-3 w-2/5"
                rounded={true}
            />
        </div>
    );
}

export function SkeletonText() {
    return (
        <Skeleton
            className="h-4 w-full"
            rounded={true}
        />
    );
}

export default Skeleton;