import axios from "axios";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

// Create custom Axios instance
const api = axios.create({
  baseURL: apiBaseUrl
});

export const getMediaUrl = (url) => {
  if (!url || /^https?:\/\//i.test(url) || url.startsWith("blob:") || url.startsWith("data:")) {
    return url;
  }
  return `${apiBaseUrl}${url.startsWith("/") ? url : `/${url}`}`;
};

// Interceptor to attach JWT token to administrative requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
