import axiosInstance from './axiosInstance';

export const commentApi = {
  async getVideoComments(videoId, { page = 1, limit = 10 } = {}) {
    return await axiosInstance.get(`/comments/${videoId}`, {
      params: { page, limit },
    });
  },

  async addComment(videoId, content) {
    return await axiosInstance.post(`/comments/${videoId}`, { content });
  },

  async updateComment(commentId, content) {
    return await axiosInstance.patch(`/comments/c/${commentId}`, { content });
  },

  async deleteComment(commentId) {
    return await axiosInstance.delete(`/comments/c/${commentId}`);
  },
};
