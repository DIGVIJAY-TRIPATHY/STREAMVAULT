import axiosInstance from './axiosInstance';

export const likeApi = {
  async toggleVideoLike(videoId) {
    return await axiosInstance.post(`/likes/toggle/v/${videoId}`);
  },

  async toggleCommentLike(commentId) {
    return await axiosInstance.post(`/likes/toggle/c/${commentId}`);
  },

  async toggleTweetLike(tweetId) {
    return await axiosInstance.post(`/likes/toggle/t/${tweetId}`);
  },

  async getLikedVideos() {
    return await axiosInstance.get('/likes/videos');
  },
};
