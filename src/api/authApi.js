import axiosInstance from './axiosInstance';

// Login user with email/username and password
async function login({ email, username, password }) {
  const body = {
    ...(email && { email }),
    ...(username && { username }),
    password,
  };

  return axiosInstance.post('/users/login', body);
}

// Register a new user with FormData
async function register(formData) {
  return axiosInstance.post('/users/register', formData, {
    headers: {
      // Allow browser to generate multipart boundary automatically
      'Content-Type': 'multipart/form-data',
    },
  });
}

// Logout current user
async function logout() {
  return axiosInstance.post('/users/logout');
}

// Refresh access token using refresh token cookie
async function refreshToken() {
  return axiosInstance.post('/users/refresh-token');
}

// Authentication API methods
export const authApi = {
  login,
  register,
  logout,
  refreshToken,
};
