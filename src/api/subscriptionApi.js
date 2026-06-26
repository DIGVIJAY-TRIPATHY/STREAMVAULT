import axiosInstance from './axiosInstance';

export const subscriptionApi = {
  async toggleSubscription(channelId) {
    return await axiosInstance.post(`/subscriptions/c/${channelId}`);
  },

  async getChannelSubscribers(channelId) {
    return await axiosInstance.get(`/subscriptions/c/${channelId}`);
  },

  async getSubscribedChannels(subscriberId) {
    return await axiosInstance.get(`/subscriptions/u/${subscriberId}`);
  },
};
