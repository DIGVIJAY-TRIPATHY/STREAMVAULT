import React from "react";
import Button from "./Button";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error, errorInfo) {
        if (import.meta.env.DEV) {
            console.error("ErrorBoundary caught an error:", error);
            console.error("Component stack:", errorInfo.componentStack);
        }
    }

    handleRetry = () => {
        this.setState({
            hasError: false,
            error: null,
        });
    };

    render() {
        const {
            children,
            fallback,
        } = this.props;

        const {
            hasError,
            error,
        } = this.state;

        if (!hasError) {
            return children;
        }

        // Custom fallback supplied by parent
        if (fallback) {
            return fallback;
        }

        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center px-4 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                    <span className="text-2xl font-bold">!</span>
                </div>

                <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    Something went wrong
                </h1>

                <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                    Something unexpected happened. Please try again.
                </p>

                {import.meta.env.DEV && error?.message && (
                    <pre className="mt-4 max-w-2xl overflow-auto rounded-lg bg-slate-100 p-4 text-left text-xs text-red-600 dark:bg-slate-800 dark:text-red-400">
                        {error.message}
                    </pre>
                )}

                <Button
                    type="button"
                    className="mt-6"
                    onClick={this.handleRetry}
                >
                    Retry
                </Button>
            </div>
        );
    }
}

export default ErrorBoundary;