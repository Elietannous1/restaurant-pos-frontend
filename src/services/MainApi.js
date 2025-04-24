import axios from "axios"; // Axios HTTP client
import BaseURL from "../config/BaseURL"; // Base API URL
import { getToken, clearToken } from "../utils/storage"; // Helpers to manage JWT in storage

// Create an Axios instance with default settings
const api = axios.create({
  baseURL: BaseURL, // prepend this URL on all requests
  headers: {
    "Content-Type": "application/json", // send/receive JSON by default
  },
});

// === Request interceptor ===
// Runs before each request; attaches JWT if present and not on auth endpoints
api.interceptors.request.use((config) => {
  const token = getToken(); // retrieve stored token
  // If we have a token and we're not calling login/register endpoints:
  if (
    token &&
    !config.url.includes("/login") &&
    !config.url.includes("/register")
  ) {
    config.headers.Authorization = `Bearer ${token}`; // add Authorization header
  }
  console.log("Outgoing request:", config.url, config.headers);
  return config; // must return config
});

// === Response interceptor ===
// Allows logging and centralized error handling (e.g. token expiry)
api.interceptors.response.use(
  (response) => {
    // On success, simply pass the response through
    return response;
  },
  (error) => {
    console.log("Error intercepted:", error);
    if (error.response) {
      console.log("Error status:", error.response.status);
      console.log("Error data:", error.response.data);
    }
    // If unauthorized or forbidden, assume token expired/invalid
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.log(
        "Token expired or invalid. Clearing token and redirecting to login."
      );
      clearToken(); // remove JWT from storage
      window.location.href = "/"; // redirect user to login page
    }
    // Propagate error to caller
    return Promise.reject(error);
  }
);

export default api; // Export configured Axios instance
