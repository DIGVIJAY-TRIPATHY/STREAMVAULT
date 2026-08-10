import axiosInstance from './axiosInstance';

export const adminApi = {
    async getPendingVideos() {
        return axiosInstance.get('/admin/pending-videos');
    },

    async approveVideo(videoId) {
        return axiosInstance.patch(`/admin/videos/${videoId}/approve`);
    },

    async rejectVideo(videoId) {
        return axiosInstance.delete(`/admin/videos/${videoId}/reject`);
    },
};

export default adminApi;
