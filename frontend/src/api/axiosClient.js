import axios from "axios";

// Create custom Axios instance
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api",
  withCredentials: true, // send/receive httpOnly auth cookies
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Auth endpoints must never trigger the refresh-retry loop (avoids recursion)
const AUTH_ENDPOINTS = ["/user/login", "/user/register", "/user/refresh", "/user/logout"];

// Shared in-flight refresh so parallel 401s only refresh once
let refreshPromise = null;
const refreshSession = () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${axiosClient.defaults.baseURL}/user/refresh`, {}, { withCredentials: true })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

// Response Interceptor: on an expired access token, refresh once and retry
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config || {};
    const status = error.response?.status;
    const url = original.url || "";
    const isAuthCall = AUTH_ENDPOINTS.some((path) => url.includes(path));

    if (status === 401 && !original._retry && !isAuthCall) {
      original._retry = true;
      try {
        await refreshSession();
        return axiosClient(original);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
