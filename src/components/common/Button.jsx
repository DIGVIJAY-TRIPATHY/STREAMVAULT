function Button({
    variant = "primary",
    size = "md",
    isLoading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    children,
    className = "",
    ...rest
}) {
    const variants = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700",
        secondary:
            "border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800",
        ghost: "hover:bg-slate-100 dark:hover:bg-slate-800",
        danger: "bg-red-600 text-white hover:bg-red-700",
    };

    const sizes = {
        sm: "text-sm px-3 py-1.5",
        md: "text-sm px-4 py-2",
        lg: "text-base px-6 py-3",
    };

    return (
        <button
            {...rest}
            disabled={disabled || isLoading}
            className={`
                inline-flex items-center justify-center gap-2
                rounded-lg transition-colors
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-indigo-500
                focus-visible:ring-offset-2
                disabled:opacity-50
                disabled:cursor-not-allowed
                ${variants[variant]}
                ${sizes[size]}
                ${className}
            `}
        >
            {isLoading ? (
                <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />

                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                </svg>
            ) : (
                leftIcon
            )}

            {children}

            {!isLoading && rightIcon}
        </button>
    );
}

export default Button;