export const QUERY_KEYS = {
  VIDEOS: "videos",
  VIDEO: "video",
  COMMENTS: "comments",
  CHANNEL: "channel",
  SUBSCRIBED_CHANNELS: "subscribedChannels",
  CHANNEL_SUBSCRIBERS: "channelSubscribers",
  PLAYLISTS: "playlists",
  PLAYLIST: "playlist",
  TWEETS: "tweets",
  LIKED_VIDEOS: "likedVideos",
  DASHBOARD_STATS: "dashboardStats",
  DASHBOARD_VIDEOS: "dashboardVideos",
  WATCH_HISTORY: "watchHistory",
  CURRENT_USER: "currentUser",
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  WATCH: (videoId = ":videoId") => `/watch/${videoId}`,
  CHANNEL: (username = ":username") => `/channel/${username}`,
  UPLOAD: "/upload",
  EDIT_VIDEO: (videoId = ":videoId") => `/video/edit/${videoId}`,
  DASHBOARD: "/dashboard",
  SEARCH: "/search",
  SETTINGS: "/settings",
  LIKED_VIDEOS: "/liked-videos",
  HISTORY: "/history",
  PLAYLISTS: "/playlists",
  PLAYLIST: (playlistId = ":playlistId") => `/playlist/${playlistId}`,
};

export const MAX_AVATAR_SIZE_MB = 2;
export const MAX_COVER_IMAGE_SIZE_MB = 5;
export const MAX_VIDEO_SIZE_MB = 100;
