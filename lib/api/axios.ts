import axios from "axios";
import { API_BASE_URL } from "@/lib/common/constants";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL || "http://localhost:3000/api", // Fallback for safety
  headers: {
    "Content-Type": "application/json",
  },
});

export const handleLogout = () => {
  if (typeof window !== "undefined") {
    // Clear tokens and storage
    localStorage.removeItem("gearguard_token");
    localStorage.removeItem("gearguard_user");
    document.cookie = "gearguard_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // Redirect to login
    window.location.href = "/auth/login";
  }
};

// Request Interceptor: Attach Token
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("gearguard_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Errors (401)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      handleLogout();
    }
    return Promise.reject(error);
  }
);
