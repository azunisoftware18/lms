import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { apiPost } from "../lib/api/apiClient";
import toast from "react-hot-toast";
import {
  loginStart,
  setUser,
  loginError,
  clearUser,
} from "../store/slices/authSlice";

export const useLogin = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (credentials) => apiPost("/auth/login", credentials),
    onMutate: () => {
      dispatch(loginStart());
    },
    onSuccess: (data) => {
      const userData = data?.data ?? data?.user ?? data;

      if (!userData || typeof userData !== "object") {
        dispatch(loginError("Invalid login response"));
        toast.error("Invalid login response");
        return;
      }

      dispatch(setUser(userData));
      localStorage.setItem("user", JSON.stringify(userData));
      if (userData?.token) {
        localStorage.setItem("token", userData.token);
      } else {
        localStorage.removeItem("token");
      }
      toast.success("Login successful");
    },
    onError: (error) => {
      const message = error?.message || "Invalid credentials";
      dispatch(loginError(message));
      toast.error(message);
    },
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: () => apiPost("/auth/logout"),
    onSuccess: () => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      dispatch(clearUser());
      toast.success("Logged out successfully");
    },
    onError: (error) => {
      const message = error?.message || "Logout failed";
      toast.error(message);
    },
  });
};
