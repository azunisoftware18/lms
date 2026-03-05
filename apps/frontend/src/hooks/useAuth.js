import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { login,logout } from "../lib/api/auth.api";
import { setUser, clearUser } from "../redux/slices/authSlice";

export const useLogin = ()=>{
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: login,
    onSuccess:(data)=>{
      dispatch(setUser(data.user));
    },
    onError:(error)=>{
      console.log(error);
    }
  })
}

export const useLogout = ()=>{
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: logout,
    onSuccess:()=>{
      dispatch(clearUser());
    },
    onError:(error)=>{
      console.log(error);
    }
  })
}
