import { useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, CheckCircle2 } from "lucide-react";

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const STATUS_MESSAGES = [
    { max: 15, text: "Preparing your upload..." },
    { max: 60, text: "Uploading your video..." },
    { max: 95, text: "Almost there..." },
    { max: 100, text: "Finalizing..." },
];

// Fixed positions/delays for the floating particles so they don't
// re-randomize (and jump around) on every re-render.
const PARTICLES = [
    { left: "18%", delay: 0, duration: 2.6 },
    { left: "35%", delay: 0.4, duration: 2.2 },
    { left: "52%", delay: 0.9, duration: 2.8 },
    { left: "68%", delay: 0.2, duration: 2.4 },
    { left: "82%", delay: 0.7, duration: 2.5 },
];

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
    title = "Publishing your video",
    subtitle = "Please don't close or refresh this page.",
}) {
    const clampedProgress = Math.min(100, Math.max(0, progress));
    const isComplete = clampedProgress >= 100;

    const statusText = useMemo(() => {
        const match = STATUS_MESSAGES.find((s) => clampedProgress <= s.max);
        return match?.text ?? STATUS_MESSAGES[STATUS_MESSAGES.length - 1].text;
    }, [clampedProgress]);

    // Lock page scroll while the overlay is up, as extra reinforcement
    // alongside the fieldset/beforeunload/popstate guards in Upload.jsx.
    useEffect(() => {
        if (!isOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md"
                    role="alertdialog"
                    aria-modal="true"
                    aria-live="assertive"
                    aria-label={title}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 8 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-8 text-center shadow-2xl dark:bg-slate-900"
                    >
                        {/* Ambient glow */}
                        <div className="pointer-events-none absolute -top-20 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 blur-3xl" />

                        {/* Floating particles rising behind the ring */}
                        <div className="pointer-events-none absolute inset-x-0 top-6 h-40 overflow-hidden">
                            {PARTICLES.map((p, index) => (
                                <motion.span
                                    key={index}
                                    className="absolute bottom-0 h-1.5 w-1.5 rounded-full bg-gradient-to-br from-indigo-400 to-violet-400"
                                    style={{ left: p.left }}
                                    animate={{
                                        y: [0, -110],
                                        opacity: [0, 1, 0],
                                    }}
                                    transition={{
                                        duration: p.duration,
                                        delay: p.delay,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                />
                            ))}
                        </div>

                        {/* Circular progress ring */}
                        <div className="relative mx-auto flex h-32 w-32 items-center justify-center">
                            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                                <circle
                                    cx="60"
                                    cy="60"
                                    r={RADIUS}
                                    fill="none"
                                    strokeWidth="8"
                                    className="stroke-slate-100 dark:stroke-slate-800"
                                />
                                <motion.circle
                                    cx="60"
                                    cy="60"
                                    r={RADIUS}
                                    fill="none"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    stroke="url(#publishing-gradient)"
                                    strokeDasharray={CIRCUMFERENCE}
                                    animate={{
                                        strokeDashoffset:
                                            CIRCUMFERENCE -
                                            (CIRCUMFERENCE * clampedProgress) / 100,
                                    }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                />
                                <defs>
                                    <linearGradient
                                        id="publishing-gradient"
                                        x1="0%"
                                        y1="0%"
                                        x2="100%"
                                        y2="100%"
                                    >
                                        <stop offset="0%" stopColor="#4f46e5" />
                                        <stop offset="100%" stopColor="#a21caf" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            {/* Center icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <AnimatePresence mode="wait">
                                    {isComplete ? (
                                        <motion.div
                                            key="check"
                                            initial={{ scale: 0, rotate: -45 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 15,
                                            }}
                                            className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                                        >
                                            <CheckCircle2 size={26} />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="upload"
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{
                                                scale: [1, 1.08, 1],
                                                opacity: 1,
                                                y: [0, -3, 0],
                                            }}
                                            exit={{ scale: 0.8, opacity: 0 }}
                                            transition={{
                                                scale: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
                                                y: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
                                            }}
                                            className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30"
                                        >
                                            <UploadCloud size={24} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Progress percentage badge */}
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-indigo-600 shadow-md ring-1 ring-slate-100 dark:bg-slate-900 dark:text-indigo-400 dark:ring-slate-800">
                                {Math.round(clampedProgress)}%
                            </div>
                        </div>

                        <h2 className="relative mt-6 text-lg font-bold text-slate-900 dark:text-white">
                            {title}
                        </h2>

                        <AnimatePresence mode="wait">
                            <motion.p
                                key={statusText}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.25 }}
                                className="relative mt-1 text-sm font-medium text-indigo-600 dark:text-indigo-400"
                            >
                                {statusText}
                            </motion.p>
                        </AnimatePresence>

                        <p className="relative mt-3 text-xs text-slate-400 dark:text-slate-500">
                            {subtitle}
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}

export default PublishingOverlay;