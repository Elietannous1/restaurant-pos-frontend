import axios from "axios";
import BaseURL from "../config/BaseURL";
import { setToken } from "../utils/storage";

export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${BaseURL}/user/register`, {
      username,
      email,
      password,
    });
    const { token } = response.data;
    setToken(token);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Registeration failed";
  }
};
