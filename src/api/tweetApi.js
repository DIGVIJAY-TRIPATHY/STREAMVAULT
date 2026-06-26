import axiosInstance from "./axiosInstance";

/**
 * Tweet API methods.
 */
export const tweetApi = {
  async createTweet(content) {
    return await axiosInstance.post("/tweets", { content });
  },

  async getUserTweets(userId) {
    return await axiosInstance.get(`/tweets/user/${userId}`);
  },

  async updateTweet(tweetId, content) {
    return await axiosInstance.patch(`/tweets/${tweetId}`, { content });
  },

  async deleteTweet(tweetId) {
    return await axiosInstance.delete(`/tweets/${tweetId}`);
  },
};