// import { RefreshToken } from "./isAuthenticated";

import { routes } from "@/constants/routes";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

enum ErrorCode {
  TokenExpired = 403, // Expired token
  Unauthorized = 401, // Token is completely invalid, redirect to login
  // PasswordExpired = 410, // Custom error for password expiration
}

export const errorHandler = async (code: number) => {
  if (code === ErrorCode.TokenExpired || code === ErrorCode.Unauthorized) {
    // window.location.href = `${import.meta.env.VITE_WEB_URL}/login`;
    Cookies.remove("token");
    window.location.href = `${routes.auth.signIn}`;
    toast.error("Token expired. Please login again.");
    localStorage.clear();
    // await logout();.
  }
};
