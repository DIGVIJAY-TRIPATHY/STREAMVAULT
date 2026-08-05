import axiosInstance from "../api/axiosInstance";

/**
 * Auth service used by the auth forms (LoginForm / RegisterForm).
 * Kept separate from `api/authApi.js` so upload-progress callbacks
 * can be passed straight through to axios for the multipart register
 * request.
 */
export const authApi = {
  async login({ email, username, password }) {
    const body = {
      ...(email && { email }),
      ...(username && { username }),
      password,
    };

    return axiosInstance.post("/users/login", body);
  },

  async register(formData, onUploadProgress) {
    return axiosInstance.post("/users/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  },

  async logout() {
    return axiosInstance.post("/users/logout");
  },

  async refreshToken() {
    return axiosInstance.post("/users/refresh-token");
  },
};

export default authApi;
