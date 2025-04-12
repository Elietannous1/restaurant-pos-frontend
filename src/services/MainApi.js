import axios from "axios";
import BaseURL from "../config/BaseURL";
import { getToken, clearToken } from "../utils/storage";

const api = axios.create({
  baseURL: BaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach token to headers
api.interceptors.request.use((config) => {
  const token = getToken();
  if (
    token &&
    !config.url.includes("/login") &&
    !config.url.includes("/register")
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("Outgoing request:", config.url, config.headers);
  return config;
});

// Response interceptor with debugging logs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("Error intercepted:", error);
    if (error.response) {
      console.log("Error status:", error.response.status);
      console.log("Error data:", error.response.data);
    }
    // Check for token expiration or invalid token
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.log(
        "Token expired or invalid. Clearing token and redirecting to login."
      );
      clearToken(); // Clear the token from storage
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
