import Button from "./Button";

function EmptyState({
    icon: Icon,
    title,
    description,
    action,
}) {
    return (
        <div className="flex min-h-[300px] flex-col items-center justify-center px-4 text-center">
            {Icon && (
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                    <Icon size={48} strokeWidth={1.5} />
                </div>
            )}

            {title && (
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    {title}
                </h2>
            )}

            {description && (
                <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                    {description}
                </p>
            )}

            {action && (
                <div className="mt-5">
                    <Button
                        type="button"
                        onClick={action.onClick}
                    >
                        {action.label}
                    </Button>
                </div>
            )}
        </div>
    );
}

export default EmptyState;