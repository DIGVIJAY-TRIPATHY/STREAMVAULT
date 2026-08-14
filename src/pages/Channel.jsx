import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

import { userApi } from "../api/userApi";
import { videoApi } from "../api/videoApi";
import { playlistApi } from "../api/playlistApi";
import { tweetApi } from "../api/tweetApi";

import ChannelHeader from "../components/channel/ChannelHeader";
import ChannelTabs from "../components/channel/ChannelTabs";
import VideoGrid from "../components/video/VideoGrid";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import { formatRelativeDate } from "../utils/formatDate";

import { QUERY_KEYS } from "../utils/constants";

function ChannelPlaylists({ userId }) {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.PLAYLISTS, userId],
    queryFn: () => playlistApi.getUserPlaylists(userId),
    enabled: Boolean(userId),
  });

  const playlists = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader />
      </div>
    );
  }

  if (playlists.length === 0) {
    return <EmptyState title="No playlists" description="This channel hasn't created any playlists yet." />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {playlists.map((playlist, index) => (
        <motion.div
          key={playlist._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.04 }}
          className="rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <h3 className="font-semibold text-slate-900 dark:text-white">{playlist.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
            {playlist.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function ChannelTweets({ userId }) {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.TWEETS, userId],
    queryFn: () => tweetApi.getUserTweets(userId),
    enabled: Boolean(userId),
  });

  const tweets = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader />
      </div>
    );
  }

  if (tweets.length === 0) {
    return <EmptyState title="No posts yet" description="This channel hasn't posted anything yet." />;
  }

  return (
    <div className="space-y-4">
      {tweets.map((tweet, index) => (
        <motion.div
          key={tweet._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.04 }}
          className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
        >
          <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
            {tweet.content}
          </p>
          <p className="mt-2 text-xs text-slate-400">
            {formatRelativeDate(tweet.createdAt)}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function Channel() {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState("videos");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [QUERY_KEYS.CHANNEL, username],
    queryFn: () => userApi.getChannelProfile(username),
    enabled: Boolean(username),
  });

  const channel = data?.data;

  // Fetched once here (not inside a tab-specific child) so the real
  // video count is available for the header stats regardless of which
  // tab is active, instead of always showing a hardcoded 0.
  const { data: videosData, isLoading: isLoadingVideos } = useQuery({
    queryKey: [QUERY_KEYS.VIDEOS, "channel", channel?._id],
    queryFn: () => videoApi.getAllVideos({ userId: channel._id, limit: 24 }),
    enabled: Boolean(channel?._id),
  });

  const videos = videosData?.data?.docs || [];
  const videosCount = videosData?.data?.totalDocs ?? videos.length;

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError || !channel) {
    return (
      <EmptyState
        title="Channel not found"
        description={error?.message || "This channel doesn't exist."}
      />
    );
  }

  return (
    <div>
      <ChannelHeader channel={channel} videosCount={videosCount} />

      <div className="mt-6">
        <ChannelTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-6">
          {activeTab === "videos" && (
            <VideoGrid
              videos={videos}
              isLoading={isLoadingVideos}
              emptyMessage="This channel hasn't uploaded any videos yet."
            />
          )}
          {activeTab === "playlists" && <ChannelPlaylists userId={channel._id} />}
          {activeTab === "community" && <ChannelTweets userId={channel._id} />}
        </div>
      </div>
    </div>
  );
}

export default Channel;