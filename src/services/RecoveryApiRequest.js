import axios from "axios";
import BaseURL from "../config/BaseURL";

export const requestRecoveryEmail = async (email) => {
  try {
    const response = await axios.post(`${BaseURL}/account/recover`, {
      email,
    });
    return response.data;
  } catch (error) {
    console.error("Error requesting recovery email:", error);
    throw error.response?.data || "Failed to send recovery email";
  }
};
export const verifyRecoveryCode = async (email, code) => {
  try {
    const response = await axios.post(
      `${BaseURL}/account/verify`,
      { email }, // Request body
      { params: { code } } // Query parameters
    );
    return response.data;
  } catch (error) {
    console.error("Error verifying recovery code:", error);
    throw error.response?.data || "Failed to verify recovery code";
  }
};

export const resetPassword = async (email, password) => {
  try {
    console.log(
      "Resetting password for email:",
      email,
      "new password: ",
      password
    );
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
