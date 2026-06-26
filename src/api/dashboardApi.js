import axiosInstance from "./axiosInstance";

/**
 * Dashboard API methods.
 */
export const dashboardApi = {
  async getChannelStats() {
    return await axiosInstance.get("/dashboard/stats");
  },

  async getChannelVideos() {
    return await axiosInstance.get("/dashboard/videos");
  },
};