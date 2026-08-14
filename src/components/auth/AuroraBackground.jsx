import { motion } from "framer-motion";

const blobTransition = (duration, delay = 0) => ({
    duration,
    delay,
    repeat: Infinity,
    repeatType: "mirror",
    ease: "easeInOut",
});

/**
 * Full-viewport animated backdrop for the auth pages: a dark base,
 * a faint drifting grid, and several large blurred gradient blobs that
 * slowly morph and drift, mimicking an aurora. Deliberately fixed/dark
 * regardless of the site's light/dark toggle - this is meant to be its
 * own immersive "moment", separate from the rest of the app's theme.
 */
function AuroraBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-[#05040f]">
            {/* Drifting grid */}
            <motion.div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                    backgroundImage:
                        "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
                    backgroundSize: "46px 46px",
                }}
                animate={{ backgroundPosition: ["0px 0px", "46px 46px"] }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            />

            {/* Aurora blobs */}
            <motion.div
                className="absolute -left-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-indigo-600/40 blur-[120px]"
                animate={{ x: [0, 90, 0], y: [0, 60, 0], scale: [1, 1.15, 1] }}
                transition={blobTransition(15)}
            />
            <motion.div
                className="absolute -right-32 top-0 h-[32rem] w-[32rem] rounded-full bg-fuchsia-600/30 blur-[120px]"
                animate={{ x: [0, -70, 0], y: [0, 50, 0], scale: [1, 1.1, 1] }}
                transition={blobTransition(17, 1)}
            />
            <motion.div
                className="absolute bottom-[-12rem] left-1/3 h-[32rem] w-[32rem] rounded-full bg-violet-600/30 blur-[120px]"
                animate={{ x: [0, 60, -50, 0], y: [0, -40, 0] }}
                transition={blobTransition(19, 2)}
            />
            <motion.div
                className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-cyan-500/20 blur-[110px]"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={blobTransition(11, 0.5)}
            />

            {/* Vignette so content stays legible at the edges */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#05040f]/60 via-transparent to-[#05040f]/80" />
        </div>
    );
}

export default AuroraBackground;