import axiosInstance from "./axiosInstance";

/**
 * Playlist API methods.
 */
export const playlistApi = {
  async createPlaylist({ name, description }) {
    return await axiosInstance.post("/playlist", { name, description });
  },

  async getPlaylistById(playlistId) {
    return await axiosInstance.get(`/playlist/${playlistId}`);
  },

  async updatePlaylist(playlistId, { name, description }) {
    return await axiosInstance.patch(`/playlist/${playlistId}`, {
      name,
      description,
    });
  },

  async deletePlaylist(playlistId) {
    return await axiosInstance.delete(`/playlist/${playlistId}`);
  },

  async addVideoToPlaylist(videoId, playlistId) {
    return await axiosInstance.patch(
      `/playlist/add/${videoId}/${playlistId}`
    );
  },

  async removeVideoFromPlaylist(videoId, playlistId) {
    return await axiosInstance.patch(
      `/playlist/remove/${videoId}/${playlistId}`
    );
  },

  async getUserPlaylists(userId) {
    return await axiosInstance.get(`/playlist/user/${userId}`);
  },
};