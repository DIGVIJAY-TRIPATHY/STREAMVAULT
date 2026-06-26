import axiosInstance from './axiosInstance';

export const userApi = {
  async getCurrentUser() {
    return await axiosInstance.get('/users/current-user');
  },

  async updateAccount({ fullName, email }) {
    return await axiosInstance.patch('/users/update-account', {
      fullName,
      email,
    });
  },

  async changePassword({ oldPassword, newPassword }) {
    return await axiosInstance.post('/users/change-password', {
      oldPassword,
      newPassword,
    });
  },

  async updateAvatar(avatarFile) {
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    return await axiosInstance.patch('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async updateCoverImage(coverFile) {
    const formData = new FormData();
    formData.append('coverImage', coverFile);

    return await axiosInstance.patch('/users/cover-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async getChannelProfile(username) {
    return await axiosInstance.get(`/users/c/${username}`);
  },

  async getWatchHistory() {
    return await axiosInstance.get('/users/history');
  },
};
