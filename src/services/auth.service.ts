/* eslint-disable @typescript-eslint/no-explicit-any */
import { SignInSchemaType } from "@/utils/schemas";
import { apiClient } from "../utils/api/apiClient";
import { API } from "@/utils/api/apiUrl";
import { errorHandler } from "@/utils/helpers";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

export const signIn = async (body: SignInSchemaType) => {
  let response;
  try {
    response = await apiClient.post(API.signin, body);
    if (response.status === 200) {
      toast.success(response.data.message || "Login successful!");
    }
  } catch (error: any) {
    response = error.response;
    if (response?.status === 401) {
      toast.error(response.data?.message || "Invalid email or password");
    } else if (response?.status === 403) {
      toast.error(response.data?.message || "Access denied");
      errorHandler(response.status);
    } else {
      toast.error(
        error?.response?.data?.message ??
          "Something went wrong. Please try again.",
      );
      errorHandler(response.status);
    }
  }
  return response;
};

export const logout = async () => {
  let response;
  try {
    Cookies.remove("token");
    localStorage.removeItem("adminDetails");
    // if (response.status === 200) {
    setTimeout(() => {
      toast.success("Logged out successfully.");
    }, 200);
    // }
  } catch (error: any) {
    response = error.response;
    toast.error(
      error?.response?.data?.message ??
        "Something went wrong. Please try again.",
    );
    errorHandler(response.status);
  }
  return response;
};