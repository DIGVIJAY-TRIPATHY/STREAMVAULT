import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Play,
    Pause,
    Volume2,
    Volume1,
    VolumeX,
    Maximize,
    Minimize,
    Settings,
    Loader2,
    RotateCcw,
    RotateCw,
    Check,
} from "lucide-react";

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const SEEK_STEP = 10;
const CONTROLS_HIDE_DELAY = 2800;

function formatTime(totalSeconds) {
    if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const paddedSeconds = String(seconds).padStart(2, "0");

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, "0")}:${paddedSeconds}`;
    }

    return `${minutes}:${paddedSeconds}`;
}

/**
 * Fully custom video player: animated controls bar that auto-hides,
 * click-to-seek/drag progress bar with hover preview, volume slider,
 * playback speed menu, fullscreen, keyboard shortcuts, and double-click
 * (or double-tap) skip with a ripple indicator.
 */
function VideoPlayer({ src, poster, title, autoPlay = true }) {
    const containerRef = useRef(null);
    const videoRef = useRef(null);
    const progressBarRef = useRef(null);
    const hideTimerRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [bufferedEnd, setBufferedEnd] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isBuffering, setIsBuffering] = useState(true);
    const [showControls, setShowControls] = useState(true);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isDraggingProgress, setIsDraggingProgress] = useState(false);
    const [hoverPreview, setHoverPreview] = useState(null); // { time, x }
    const [skipRipple, setSkipRipple] = useState(null); // { side, key }
    const [showCenterIcon, setShowCenterIcon] = useState(null); // 'play' | 'pause' | null

    const clearHideTimer = () => {
        if (hideTimerRef.current) {
            clearTimeout(hideTimerRef.current);
            hideTimerRef.current = null;
        }
    };

    const scheduleHide = useCallback(() => {
        clearHideTimer();
        hideTimerRef.current = setTimeout(() => {
            if (videoRef.current && !videoRef.current.paused) {
                setShowControls(false);
                setShowSpeedMenu(false);
            }
        }, CONTROLS_HIDE_DELAY);
    }, []);

    const wakeControls = useCallback(() => {
        setShowControls(true);
        scheduleHide();
    }, [scheduleHide]);

    useEffect(() => clearHideTimer, []);

    // ---- Core video element event wiring ----
    useEffect(() => {
        const el = videoRef.current;
        if (!el) return;

        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onTimeUpdate = () => setCurrentTime(el.currentTime);
        const onLoadedMetadata = () => {
            setDuration(el.duration || 0);
            setIsBuffering(false);
        };
        const onWaiting = () => setIsBuffering(true);
        const onPlaying = () => setIsBuffering(false);
        const onCanPlay = () => setIsBuffering(false);
        const onVolumeChange = () => {
            setVolume(el.volume);
            setIsMuted(el.muted);
        };
        const onRateChange = () => setPlaybackRate(el.playbackRate);
        const onProgress = () => {
            if (el.buffered.length > 0) {
                setBufferedEnd(el.buffered.end(el.buffered.length - 1));
            }
        };

        el.addEventListener("play", onPlay);
        el.addEventListener("pause", onPause);
        el.addEventListener("timeupdate", onTimeUpdate);
        el.addEventListener("loadedmetadata", onLoadedMetadata);
        el.addEventListener("waiting", onWaiting);
        el.addEventListener("playing", onPlaying);
        el.addEventListener("canplay", onCanPlay);
        el.addEventListener("volumechange", onVolumeChange);
        el.addEventListener("ratechange", onRateChange);
        el.addEventListener("progress", onProgress);

        return () => {
            el.removeEventListener("play", onPlay);
            el.removeEventListener("pause", onPause);
            el.removeEventListener("timeupdate", onTimeUpdate);
            el.removeEventListener("loadedmetadata", onLoadedMetadata);
            el.removeEventListener("waiting", onWaiting);
            el.removeEventListener("playing", onPlaying);
            el.removeEventListener("canplay", onCanPlay);
            el.removeEventListener("volumechange", onVolumeChange);
            el.removeEventListener("ratechange", onRateChange);
            el.removeEventListener("progress", onProgress);
        };
    }, [src]);

    // Reset transient state whenever the source changes (new video)
    useEffect(() => {
        setCurrentTime(0);
        setDuration(0);
        setBufferedEnd(0);
        setIsBuffering(true);
    }, [src]);

    // ---- Fullscreen state sync ----
    useEffect(() => {
        const onFsChange = () =>
            setIsFullscreen(Boolean(document.fullscreenElement));

        document.addEventListener("fullscreenchange", onFsChange);
        return () => document.removeEventListener("fullscreenchange", onFsChange);
    }, []);

    // ---- Actions ----
    const togglePlay = useCallback(() => {
        const el = videoRef.current;
        if (!el) return;

        if (el.paused) {
            el.play();
            setShowCenterIcon("play");
        } else {
            el.pause();
            setShowCenterIcon("pause");
        }

        window.clearTimeout(togglePlay._t);
        togglePlay._t = window.setTimeout(() => setShowCenterIcon(null), 500);
    }, []);

    const seekBy = useCallback((deltaSeconds) => {
        const el = videoRef.current;
        if (!el || !Number.isFinite(el.duration)) return;

        el.currentTime = Math.min(
            Math.max(0, el.currentTime + deltaSeconds),
            el.duration
        );
    }, []);

    const seekTo = useCallback((time) => {
        const el = videoRef.current;
        if (!el || !Number.isFinite(el.duration)) return;

        el.currentTime = Math.min(Math.max(0, time), el.duration);
    }, []);

    const toggleMute = useCallback(() => {
        const el = videoRef.current;
        if (!el) return;
        el.muted = !el.muted;
    }, []);

    const changeVolume = useCallback((value) => {
        const el = videoRef.current;
        if (!el) return;
        el.volume = value;
        el.muted = value === 0;
    }, []);

    const changeSpeed = useCallback((rate) => {
        const el = videoRef.current;
        if (!el) return;
        el.playbackRate = rate;
        setShowSpeedMenu(false);
    }, []);

    const toggleFullscreen = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            container.requestFullscreen?.();
        }
    }, []);

    const triggerSkipRipple = (side) => {
        setSkipRipple({ side, key: Date.now() });
    };

    // ---- Progress bar interaction ----
    const timeFromClientX = useCallback((clientX) => {
        const bar = progressBarRef.current;
        if (!bar || !duration) return 0;

        const rect = bar.getBoundingClientRect();
        const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
        return ratio * duration;
    }, [duration]);

    const handleProgressPointerMove = (event) => {
        const time = timeFromClientX(event.clientX);
        const bar = progressBarRef.current;
        if (!bar) return;

        const rect = bar.getBoundingClientRect();
        setHoverPreview({
            time,
            x: Math.min(Math.max(0, event.clientX - rect.left), rect.width),
        });

        if (isDraggingProgress) {
            seekTo(time);
        }
    };

    const handleProgressPointerDown = (event) => {
        setIsDraggingProgress(true);
        seekTo(timeFromClientX(event.clientX));
    };

    useEffect(() => {
        if (!isDraggingProgress) return;

        const handleMove = (event) => seekTo(timeFromClientX(event.clientX));
        const handleUp = () => setIsDraggingProgress(false);

        window.addEventListener("pointermove", handleMove);
        window.addEventListener("pointerup", handleUp);

        return () => {
            window.removeEventListener("pointermove", handleMove);
            window.removeEventListener("pointerup", handleUp);
        };
    }, [isDraggingProgress, seekTo, timeFromClientX]);

    // ---- Double-click / double-tap to skip ----
    const clickTimerRef = useRef(null);
    const handleVideoAreaClick = (event) => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const isLeftThird = clickX < rect.width / 3;
        const isRightThird = clickX > (rect.width * 2) / 3;

        if (clickTimerRef.current) {
            // Double click detected
            clearTimeout(clickTimerRef.current);
            clickTimerRef.current = null;

            if (isLeftThird) {
                seekBy(-SEEK_STEP);
                triggerSkipRipple("left");
            } else if (isRightThird) {
                seekBy(SEEK_STEP);
                triggerSkipRipple("right");
            } else {
                togglePlay();
            }
        } else {
            clickTimerRef.current = setTimeout(() => {
                clickTimerRef.current = null;
                if (!isLeftThird && !isRightThird) {
                    togglePlay();
                }
            }, 220);
        }
    };

    // ---- Keyboard shortcuts (scoped to the player container) ----
    const handleKeyDown = (event) => {
        switch (event.key.toLowerCase()) {
            case " ":
            case "k":
                event.preventDefault();
                togglePlay();
                wakeControls();
                break;
            case "arrowright":
                event.preventDefault();
                seekBy(SEEK_STEP);
                triggerSkipRipple("right");
                wakeControls();
                break;
            case "arrowleft":
                event.preventDefault();
                seekBy(-SEEK_STEP);
                triggerSkipRipple("left");
                wakeControls();
                break;
            case "arrowup":
                event.preventDefault();
                changeVolume(Math.min(1, (videoRef.current?.volume ?? 1) + 0.1));
                wakeControls();
                break;
            case "arrowdown":
                event.preventDefault();
                changeVolume(Math.max(0, (videoRef.current?.volume ?? 1) - 0.1));
                wakeControls();
                break;
            case "m":
                toggleMute();
                wakeControls();
                break;
            case "f":
                toggleFullscreen();
                wakeControls();
                break;
            default:
                break;
        }
    };

    const progressPercent = duration ? (currentTime / duration) * 100 : 0;
    const bufferedPercent = duration ? (bufferedEnd / duration) * 100 : 0;

    const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

    return (
        <div
            ref={containerRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onMouseMove={wakeControls}
            onMouseLeave={() => {
                if (!videoRef.current?.paused) setShowControls(false);
            }}
            className="group relative aspect-video w-full overflow-hidden rounded-xl bg-black outline-none"
        >
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                autoPlay={autoPlay}
                onClick={handleVideoAreaClick}
                className="h-full w-full cursor-pointer"
            >
                Your browser does not support the video tag.
            </video>

            {/* Buffering spinner */}
            <AnimatePresence>
                {isBuffering && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="pointer-events-none absolute inset-0 flex items-center justify-center"
                    >
                        <Loader2 size={44} className="animate-spin text-white/90" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Skip ripple feedback */}
            <AnimatePresence>
                {skipRipple && (
                    <motion.div
                        key={skipRipple.key}
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: [0, 1, 0], scale: 1.1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        onAnimationComplete={() => setSkipRipple(null)}
                        className={`pointer-events-none absolute top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-full bg-white/15 px-5 py-4 text-white backdrop-blur-sm ${
                            skipRipple.side === "left" ? "left-6" : "right-6"
                        }`}
                    >
                        {skipRipple.side === "left" ? (
                            <RotateCcw size={26} />
                        ) : (
                            <RotateCw size={26} />
                        )}
                        <span className="text-sm font-semibold">{SEEK_STEP}s</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Center play/pause flash */}
            <AnimatePresence>
                {showCenterIcon && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.3 }}
                        transition={{ duration: 0.35 }}
                        className="pointer-events-none absolute inset-0 flex items-center justify-center"
                    >
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/40 text-white">
                            {showCenterIcon === "play" ? (
                                <Play size={30} className="ml-1 fill-white" />
                            ) : (
                                <Pause size={30} className="fill-white" />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Big idle play button when paused and controls visible */}
            <AnimatePresence>
                {!isPlaying && !isBuffering && showControls && (
                    <motion.button
                        type="button"
                        onClick={togglePlay}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-900/40"
                        aria-label="Play"
                    >
                        <Play size={26} className="ml-1 fill-white" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Top title gradient (fullscreen-friendly) */}
            {title && (
                <AnimatePresence>
                    {showControls && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/60 to-transparent px-4 py-3"
                        >
                            <p className="truncate text-sm font-medium text-white/90">
                                {title}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}

            {/* Controls bar */}
            <AnimatePresence>
                {showControls && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-3 pb-2 pt-8 sm:px-4"
                    >
                        {/* Progress bar */}
                        <div
                            ref={progressBarRef}
                            onPointerDown={handleProgressPointerDown}
                            onPointerMove={handleProgressPointerMove}
                            onPointerLeave={() => !isDraggingProgress && setHoverPreview(null)}
                            className="group/bar relative mb-2 flex h-3 cursor-pointer items-center"
                        >
                            <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/25 transition-all group-hover/bar:h-1.5">
                                <div
                                    className="absolute inset-y-0 left-0 rounded-full bg-white/35"
                                    style={{ width: `${bufferedPercent}%` }}
                                />
                                <div
                                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>

                            <div
                                className="absolute h-3 w-3 -translate-x-1/2 rounded-full bg-white opacity-0 shadow transition-opacity group-hover/bar:opacity-100"
                                style={{ left: `${progressPercent}%` }}
                            />

                            {hoverPreview && (
                                <div
                                    className="pointer-events-none absolute bottom-5 -translate-x-1/2 rounded-md bg-slate-950/90 px-2 py-1 text-xs font-medium text-white"
                                    style={{ left: hoverPreview.x }}
                                >
                                    {formatTime(hoverPreview.time)}
                                </div>
                            )}
                        </div>

                        {/* Controls row */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={togglePlay}
                                className="text-white transition-transform hover:scale-110"
                                aria-label={isPlaying ? "Pause" : "Play"}
                            >
                                {isPlaying ? (
                                    <Pause size={20} className="fill-white" />
                                ) : (
                                    <Play size={20} className="ml-0.5 fill-white" />
                                )}
                            </button>

                            {/* Volume */}
                            <div className="group/vol flex items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={toggleMute}
                                    className="text-white transition-transform hover:scale-110"
                                    aria-label={isMuted ? "Unmute" : "Mute"}
                                >
                                    <VolumeIcon size={19} />
                                </button>

                                <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.05}
                                    value={isMuted ? 0 : volume}
                                    onChange={(event) => changeVolume(Number(event.target.value))}
                                    className="w-0 accent-indigo-500 opacity-0 transition-all duration-200 group-hover/vol:w-16 group-hover/vol:opacity-100"
                                    aria-label="Volume"
                                />
                            </div>

                            <span className="text-xs font-medium text-white/85">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>

                            <div className="flex-1" />

                            {/* Speed */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowSpeedMenu((s) => !s)}
                                    className="flex items-center gap-1 text-white transition-transform hover:scale-110"
                                    aria-label="Playback speed"
                                >
                                    <Settings size={18} />
                                    <span className="text-xs font-semibold">{playbackRate}x</span>
                                </button>

                                <AnimatePresence>
                                    {showSpeedMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute bottom-8 right-0 w-28 overflow-hidden rounded-lg bg-slate-900/95 py-1 shadow-xl ring-1 ring-white/10"
                                        >
                                            {SPEED_OPTIONS.map((speed) => (
                                                <button
                                                    key={speed}
                                                    type="button"
                                                    onClick={() => changeSpeed(speed)}
                                                    className="flex w-full items-center justify-between px-3 py-1.5 text-left text-xs text-white/90 hover:bg-white/10"
                                                >
                                                    {speed}x
                                                    {playbackRate === speed && <Check size={13} />}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button
                                type="button"
                                onClick={toggleFullscreen}
                                className="text-white transition-transform hover:scale-110"
                                aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                            >
                                {isFullscreen ? <Minimize size={19} /> : <Maximize size={19} />}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default VideoPlayer;