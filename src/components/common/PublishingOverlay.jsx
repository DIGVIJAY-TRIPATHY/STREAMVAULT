import ReactDOM from 'react-dom';
import { UploadCloud } from 'lucide-react';

/**
 * Full-screen blocking overlay shown while a video upload is in flight.
 * Deliberately has NO close button, no backdrop-click dismiss, and no
 * Escape-key handling - the whole point is that the user can't interact
 * with anything else (including navigating away) until the upload
 * finishes, so it can't be interrupted mid-publish.
 */
function PublishingOverlay({
    isOpen,
    progress = 0,
    title = 'Publishing your video',
    subtitle = "Please don't close or refresh this page.",
}) {
    if (!isOpen) return null;

    const clampedProgress = Math.min(100, Math.max(0, progress));

    return ReactDOM.createPortal(
        <div
            className="animate-backdrop-fade-in fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
            role="alertdialog"
            aria-modal="true"
            aria-live="assertive"
            aria-label={title}
        >
            <div className="animate-modal-pop-in w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl dark:bg-slate-900">
                {/* Layered spinner */}
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                    <span className="absolute inset-0 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600 dark:border-slate-800 dark:border-t-indigo-500" />
                    <span
                        className="absolute inset-2 animate-spin rounded-full border-4 border-violet-100 border-t-violet-500 dark:border-slate-800 dark:border-t-violet-400"
                        style={{
                            animationDirection: 'reverse',
                            animationDuration: '1.4s',
                        }}
                    />
                    <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30">
                        <UploadCloud size={20} className="animate-pulse" />
                    </span>
                </div>

                <h2 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">{title}</h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>

                {/* Progress bar */}
                <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                        className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-all duration-300"
                        style={{ width: `${clampedProgress}%` }}
                    >
                        <span className="animate-shimmer-sweep absolute inset-0 -skew-x-12 bg-white/30" />
                    </div>
                </div>

                <p className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {Math.round(clampedProgress)}%
                </p>
            </div>
        </div>,
        document.body
    );
}

export default PublishingOverlay;
