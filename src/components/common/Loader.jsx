
function Loader({
    size = "md",
    fullScreen = false,
}) {
    const sizes = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
    };

    const spinner = (
        <div
            className={`
                ${sizes[size]}
                animate-spin
                rounded-full
                border-4
                border-slate-200
                border-t-indigo-600
            `}
            role="status"
            aria-label="Loading"
        />
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
                {spinner}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center">
            {spinner}
        </div>
    );
}

export default Loader;