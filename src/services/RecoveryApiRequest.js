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
