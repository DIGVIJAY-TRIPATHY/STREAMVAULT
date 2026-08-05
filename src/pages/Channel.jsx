import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

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

function ChannelVideos({ userId }) {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.VIDEOS, "channel", userId],
    queryFn: () => videoApi.getAllVideos({ userId, limit: 24 }),
    enabled: Boolean(userId),
  });

  const videos = data?.data?.docs || [];

  return <VideoGrid videos={videos} isLoading={isLoading} emptyMessage="This channel hasn't uploaded any videos yet." />;
}

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
      {playlists.map((playlist) => (
        <div
          key={playlist._id}
          className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
        >
          <h3 className="font-semibold text-slate-900 dark:text-white">{playlist.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
            {playlist.description}
          </p>
        </div>
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
      {tweets.map((tweet) => (
        <div
          key={tweet._id}
          className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
        >
          <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
            {tweet.content}
          </p>
          <p className="mt-2 text-xs text-slate-400">
            {formatRelativeDate(tweet.createdAt)}
          </p>
        </div>
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
      <ChannelHeader channel={channel} />

      <div className="mt-6">
        <ChannelTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-6">
          {activeTab === "videos" && <ChannelVideos userId={channel._id} />}
          {activeTab === "playlists" && <ChannelPlaylists userId={channel._id} />}
          {activeTab === "community" && <ChannelTweets userId={channel._id} />}
        </div>
      </div>
    </div>
  );
}

export default Channel;
