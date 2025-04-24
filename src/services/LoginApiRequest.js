import axios from "axios"; // HTTP client for API requests
import BaseURL from "../config/BaseURL"; // Base URL of backend API
import { setToken } from "../utils/storage"; // Utility to save auth token (e.g. localStorage)

/**
 * Send login request to backend, store returned JWT on success.
 *
 * @param {string} email    – user’s email address
 * @param {string} password – user’s password
 * @returns {Promise<object>} – response data (e.g. user info + token)
 * @throws – error message from server or default "Login failed"
 */
export const login = async (email, password) => {
  try {
    // POST /user/login with credentials
    const response = await axios.post(`${BaseURL}/user/login`, {
      email,
      password,
    });

    // Extract JWT token from response
    const { token } = response.data;

    // Persist token for future API calls
    setToken(token);

    // Return full response payload
    return response.data;
  } catch (error) {
    // On error, throw server-provided message or fallback
    throw error.response?.data || "Login failed";
  }
};
