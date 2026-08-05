
import { forwardRef } from "react";

const Input = forwardRef(function Input(
    {
        label,
        error,
        helperText,
        leftIcon,
        rightIcon,
        className = "",
        id,
        ...rest
    },
    ref
) {
    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label
                    htmlFor={id}
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                    {label}
                </label>
            )}

            <div className="relative">
                {leftIcon && (
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        {leftIcon}
                    </span>
                )}

                <input
                    id={id}
                    ref={ref}
                    {...rest}
                    className={`
                        w-full rounded-lg border
                        bg-white dark:bg-slate-900
                        text-slate-900 dark:text-slate-100
                        py-2 px-3
                        focus:outline-none
                        focus:ring-2
                        focus:ring-indigo-500
                        ${
                            error
                                ? "border-red-500 focus:border-red-500"
                                : "border-slate-300 dark:border-slate-600 focus:border-indigo-500"
                        }
                        ${leftIcon ? "pl-10" : ""}
                        ${rightIcon ? "pr-10" : ""}
                        ${className}
                    `}
                />

                {rightIcon && (
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                        {rightIcon}
                    </span>
                )}
            </div>

            {error ? (
                <p className="mt-1 text-xs text-red-500">
                    {error}
                </p>
            ) : helperText ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    {helperText}
                </p>
            ) : null}
        </div>
    );
});

export default Input;