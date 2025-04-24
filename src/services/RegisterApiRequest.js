import axios from "axios"; // HTTP client for API calls
import BaseURL from "../config/BaseURL"; // Base endpoint for backend
import { setToken } from "../utils/storage"; // Utility to store JWT in local storage

/**
 * Register a new user, store returned JWT, and return response data.
 *
 * @param {string} username – desired username
 * @param {string} email – user’s email address
 * @param {string} password – user’s chosen password
 * @returns {Promise<object>} – server response (includes token and user info)
 * @throws – server-provided error message or default "Registration failed"
 */
export const register = async (username, email, password) => {
  try {
    // Send POST /user/register with registration details
    const response = await axios.post(`${BaseURL}/user/register`, {
      username,
      email,
      password,
    });

    // Extract JWT from response
    const { token } = response.data;

    // Persist token for authenticated requests
    setToken(token);

    // Return full payload (e.g. user info + token)
    return response.data;
  } catch (error) {
    // On error, propagate server message or default
    throw error.response?.data || "Registration failed";
  }
};
