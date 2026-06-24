import axios from "axios";

// Create custom Axios instance
const api = axios.create({
  baseURL: "", // Requests will be proxied by Vite to our backend
  headers: {
    "Content-Type": "application/json"
  }
});

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
