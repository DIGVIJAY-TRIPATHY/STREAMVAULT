
import Avatar from "../common/Avatar";
import SubscribeButton from "./SubscribeButton";

function ChannelHeader({ channel }) {
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
        videosCount = 0,
    } = channel;

    return (
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-900">
            {/* Cover Image */}
            <div className="relative h-40 w-full overflow-hidden bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 md:h-56">
                {coverImage && (
                    <img
                        src={coverImage}
                        alt={`${fullName || username}'s cover`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                )}

                {/* Avatar */}
                <div className="absolute bottom-0 left-6 translate-y-1/2 md:left-8">
                    <div className="rounded-full bg-white p-1 ring-4 ring-white dark:bg-slate-900 dark:ring-slate-900">
                        <Avatar
                            src={avatar}
                            alt={
                                username ||
                                fullName ||
                                "Channel"
                            }
                            size="xl"
                        />
                    </div>
                </div>
            </div>

            {/* Channel Information */}
            <div className="px-6 pb-6 pt-14 md:px-8 md:pt-16">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white md:text-2xl">
                            {fullName || username}
                        </h1>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            @{username}
                        </p>

                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            {subscribersCount.toLocaleString()}{" "}
                            {subscribersCount === 1
                                ? "subscriber"
                                : "subscribers"}
                        </p>
                    </div>

                    <SubscribeButton
                        channelId={_id}
                        initialIsSubscribed={
                            isSubscribed
                        }
                        initialCount={
                            subscribersCount
                        }
                    />
                </div>

                {/* Stats */}
                <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-200 pt-5 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    <span>
                        {videosCount.toLocaleString()}{" "}
                        videos
                    </span>

                    <span className="text-slate-300 dark:text-slate-700">
                        ·
                    </span>

                    <span>
                        {subscribersCount.toLocaleString()}{" "}
                        subscribers
                    </span>

                    <span className="text-slate-300 dark:text-slate-700">
                        ·
                    </span>

                    <span>
                        subscribed to{" "}
                        {channelsSubscribedToCount.toLocaleString()}{" "}
                        channels
                    </span>
                </div>
            </div>
        </section>
    );
}

export default ChannelHeader;
