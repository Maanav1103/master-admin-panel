import axios from "axios";
import Cookies from "js-cookie";
// import { LocalStorageGetItem, SessionStorageGetItem } from "../helpers";

export const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token") ?? Cookies.get("reset-password-token");
    // const token = "dfsdfdsfdsfdsdsfdsfdsfdsfdsfdsfdsfdsfds";

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Prevent caching
    config.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
    config.headers["Pragma"] = "no-cache";
    config.headers["Expires"] = "0";

    return config;
  },
  (error) => Promise.reject(error)
);
