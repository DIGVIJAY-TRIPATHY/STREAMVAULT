import { Outlet, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

import AuroraBackground from "../auth/AuroraBackground";
import TiltCard from "../auth/TiltCard";

function AuthLayout() {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12">
            <AuroraBackground />

            {/* Logo */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 mb-8"
            >
                <Link to="/" className="flex items-center gap-2.5">
                    <motion.span
                        animate={{
                            boxShadow: [
                                "0 0 0px rgba(129,140,248,0.5)",
                                "0 0 28px rgba(129,140,248,0.7)",
                                "0 0 0px rgba(129,140,248,0.5)",
                            ],
                        }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                        className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500"
                    >
                        <Play size={20} className="ml-0.5 fill-white text-white" />
                    </motion.span>

                    <span className="text-xl font-extrabold tracking-tight text-white">
                        StreamVault
                    </span>
                </Link>
            </motion.div>

            {/* Tilting glass card */}
            <TiltCard className="w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 28, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/95 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10"
                >
                    {/* Subtle top sheen */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/60 to-transparent" />

                    <div className="relative">
                        <Outlet />
                    </div>
                </motion.div>
            </TiltCard>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="relative z-10 mt-8 text-xs text-white/40"
            >
                © {new Date().getFullYear()} StreamVault. Watch freely.
            </motion.p>
        </div>
    );
}

export default AuthLayout;