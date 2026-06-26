import axiosInstance from './axiosInstance';

export const videoApi = {
  async getAllVideos({
    page = 1,
    limit = 10,
    query = '',
    sortBy = 'createdAt',
    sortType = 'desc',
    userId = '',
  } = {}) {
    const params = {};

    if (page) params.page = page;
    if (limit) params.limit = limit;
    if (query) params.query = query;
    if (sortBy) params.sortBy = sortBy;
    if (sortType) params.sortType = sortType;
    if (userId) params.userId = userId;

    return await axiosInstance.get('/videos', { params });
  },

  async uploadVideo(formData, onUploadProgress) {
    return await axiosInstance.post('/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: progressEvent => {
        if (onUploadProgress && progressEvent.total) {
          const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(pct);
        }
      },
    });
  },

  async getVideoById(videoId) {
    return await axiosInstance.get(`/videos/${videoId}`);
  },

  async updateVideo(videoId, { title, description, thumbnail }) {
    if (thumbnail instanceof File) {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('thumbnail', thumbnail);

      return await axiosInstance.patch(`/videos/${videoId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }

    return await axiosInstance.patch(`/videos/${videoId}`, {
      title,
      description,
      thumbnail,
    });
  },

  async deleteVideo(videoId) {
    return await axiosInstance.delete(`/videos/${videoId}`);
  },

  async togglePublishStatus(videoId) {
    return await axiosInstance.patch(`/videos/toggle/publish/${videoId}`);
  },
};
