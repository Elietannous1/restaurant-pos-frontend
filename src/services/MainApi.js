import axios from "axios";
import { BaseURL } from "../config/BaseURL";
import { getToken } from "../utils/storage";
const api = axios.create({
  baseURL: BaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (
    token &&
    !config.url.includes("/login") &&
    !config.url.includes("/register")
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
