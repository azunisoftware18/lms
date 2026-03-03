import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import api from "../lib/api";
import { setUser, setToken } from "../store/slices/authSlice";

export const useLogin = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      return response.data;
    },

    onSuccess: (data) => {
      dispatch(setUser(data.user));
      dispatch(setToken(data.token));
    },
  });
};