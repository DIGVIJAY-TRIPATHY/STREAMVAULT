import axiosInstance from "./axiosInstance";

/**
 * Healthcheck API methods.
 */
export const healthcheckApi = {
  async check() {
    return await axiosInstance.get("/healthcheck");
  },
};