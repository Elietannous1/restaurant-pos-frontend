import axios from "axios"; // HTTP client for making API requests
import BaseURL from "../config/BaseURL"; // Base URL for the backend API

/**
 * Send a recovery-email request to the backend.
 * @param {string} email – the user's registered email address
 * @returns {Promise<any>} – server response data
 * @throws – error message from server or default string
 */
export const requestRecoveryEmail = async (email) => {
  try {
    // POST /account/recover with JSON body { email }
    const response = await axios.post(`${BaseURL}/account/recover`, { email });
    return response.data; // return whatever the server sends back
  } catch (error) {
    console.error("Error requesting recovery email:", error);
    // Propagate server error or fallback message
    throw error.response?.data || "Failed to send recovery email";
  }
};

/**
 * Verify the 6-digit recovery code for a given email.
 * @param {string} email – the user's email address
 * @param {string} code – the 6-digit recovery code to verify
 * @returns {Promise<any>} – server response data
 * @throws – error message from server or default string
 */
export const verifyRecoveryCode = async (email, code) => {
  try {
    // POST /account/verify with body { email } and query param ?code=
    const response = await axios.post(
      `${BaseURL}/account/verify`,
      { email }, // request body
      { params: { code } } // query string parameters
    );
    return response.data;
  } catch (error) {
    console.error("Error verifying recovery code:", error);
    throw error.response?.data || "Failed to verify recovery code";
  }
};

/**
 * Reset the user's password once code is verified.
 * @param {string} email – the user's email address
 * @param {string} password – the new password to set
 * @returns {Promise<any>} – server response data
 * @throws – error message from server or default string
 */
export const resetPassword = async (email, password) => {
  try {
    console.log(
      "Resetting password for email:",
      email,
      "new password:",
      password
    );
    // POST /account/reset with JSON body { email, password }
    const response = await axios.post(`${BaseURL}/account/reset`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error.response?.data || "Failed to reset password";
  }
};
