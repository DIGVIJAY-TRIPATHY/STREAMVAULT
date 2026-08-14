import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Video, UserCheck, ShieldCheck, Expand } from "lucide-react";

import Avatar from "../common/Avatar";
import Lightbox from "../common/Lightbox";
import SubscribeButton from "./SubscribeButton";

function StatChip({ icon: Icon, label, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay }}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300"
        >
            <Icon size={14} className="text-indigo-500 dark:text-indigo-400" />
            {label}
        </motion.div>
    );
}

function ChannelHeader({ channel, videosCount }) {
    const [lightbox, setLightbox] = useState(null); // { src, alt } | null

    if (!channel) {
        return null;
    }

    const {
        _id,
        username,
        fullName,
        avatar,
        coverImage,
        subscribersCount = 0,
        channelsSubscribedToCount = 0,
        isSubscribed = false,
        role,
    } = channel;

    const displayName = fullName || username;
    const resolvedVideosCount = videosCount ?? 0;

    return (
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-900">
            {/* Cover Image */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="group/cover relative h-44 w-full overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-700 md:h-64"
            >
                {coverImage ? (
                    <button
                        type="button"
                        onClick={() =>
                            setLightbox({ src: coverImage, alt: `${displayName}'s cover image` })
                        }
                        className="block h-full w-full"
                        aria-label="View cover image"
                    >
                        <img
                            src={coverImage}
                            alt={`${displayName}'s cover`}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover/cover:scale-105"
                            loading="lazy"
                        />

                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover/cover:bg-black/25 group-hover/cover:opacity-100">
                            <span className="flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                                <Expand size={13} />
                                View cover
                            </span>
                        </div>
                    </button>
                ) : (
                    <>
                        <div className="pointer-events-none absolute -left-10 top-4 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
                        <div className="pointer-events-none absolute -right-6 bottom-0 h-40 w-40 rounded-full bg-fuchsia-300/20 blur-3xl" />
                    </>
                )}

                {/* Bottom fade for text legibility when content overlaps */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent" />

                {/* Avatar */}
                <div className="absolute bottom-0 left-6 translate-y-1/2 md:left-8">
                    <motion.button
                        type="button"
                        onClick={() =>
                            avatar && setLightbox({ src: avatar, alt: `${displayName}'s avatar` })
                        }
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        className="group/avatar relative block rounded-full bg-white p-1 shadow-lg ring-4 ring-white dark:bg-slate-900 dark:ring-slate-900"
                        aria-label="View avatar"
                    >
                        <Avatar
                            src={avatar}
                            alt={username || fullName || "Channel"}
                            size="xl"
                        />

                        {avatar && (
                            <span className="absolute inset-1 flex items-center justify-center rounded-full bg-black/0 opacity-0 transition-all duration-200 group-hover/avatar:bg-black/40 group-hover/avatar:opacity-100">
                                <Expand size={18} className="text-white" />
                            </span>
                        )}
                    </motion.button>
                </div>
            </motion.div>

            {/* Channel Information */}
            <div className="px-6 pb-6 pt-14 md:px-8 md:pt-16">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white md:text-2xl">
                                {displayName}
                            </h1>

                            {role === "highCommand" && (
                                <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                                    <ShieldCheck size={12} />
                                    highCommand
                                </span>
                            )}
                        </div>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            @{username}
                        </p>

                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            {subscribersCount.toLocaleString()}{" "}
                            {subscribersCount === 1 ? "subscriber" : "subscribers"}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.35, delay: 0.25 }}
                    >
                        <SubscribeButton
                            channelId={_id}
                            initialIsSubscribed={isSubscribed}
                            initialCount={subscribersCount}
                        />
                    </motion.div>
                </div>

                {/* Stats */}
                <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-5 dark:border-slate-800">
                    <StatChip icon={Video} label={`${resolvedVideosCount.toLocaleString()} videos`} delay={0.3} />
                    <StatChip icon={Users} label={`${subscribersCount.toLocaleString()} subscribers`} delay={0.36} />
                    <StatChip
                        icon={UserCheck}
                        label={`subscribed to ${channelsSubscribedToCount.toLocaleString()}`}
                        delay={0.42}
                    />
                </div>
            </div>

            <Lightbox
                src={lightbox?.src}
                alt={lightbox?.alt}
                isOpen={Boolean(lightbox)}
                onClose={() => setLightbox(null)}
            />
        </section>
    );
}

export default ChannelHeader;