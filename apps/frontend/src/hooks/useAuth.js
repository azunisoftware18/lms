import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { login, logout } from "../lib/api/auth.api";
import {
  loginStart,
  setUser,
  loginError,
  clearUser,
} from "../redux/slices/authSlice";
import toast from "react-hot-toast";

export const useLogin = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: login,

    onMutate: () => {
      dispatch(loginStart());
    },

    onSuccess: (data) => {
      dispatch(setUser(data.user));

      toast.success("Login successful");
    },

    onError: (error) => {
      const message = error?.response?.data?.message || "Invalid credentials";

      dispatch(loginError(message));

      toast.error(message);
    },
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: logout,

    onSuccess: () => {
      dispatch(clearUser());

      toast.success("Logged out successfully");
    },

    onError: (error) => {
      const message = error?.response?.data?.message || "Logout failed";

      toast.error(message);
    },
  });
};
