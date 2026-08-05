
function Avatar({
    src,
    alt = "",
    size = "md",
    className = "",
}) {
    const sizes = {
        xs: "w-6 h-6",
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-16 h-16",
        xl: "w-24 h-24",
    };

    const initials = alt.slice(0, 2).toUpperCase();

    const baseClasses = `
        ${sizes[size]}
        rounded-full
        object-cover
        ring-2
        ring-white
        dark:ring-slate-900
        ${className}
    `;

    if (src) {
        return (
            <img
                src={src}
                alt={alt}
                className={baseClasses}
            />
        );
    }

    return (
        <div
            role="img"
            aria-label={alt}
            className={`
                ${baseClasses}
                flex items-center justify-center
                bg-indigo-600
                text-white
                font-medium
            `}
        >
            {initials}
        </div>
    );
}

export default Avatar;