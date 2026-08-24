import axios from "axios";

// Determine the base URL from environment variables, or default to a standard /api/v1 prefix
const baseURL = import.meta.env.VITE_API_URL || "/api/v1";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to attach tokens if stored in localStorage
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle global errors like 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem("token");
      // Use window.location for hard redirect, or dispatch a logout action
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
