import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { loginRequest } from '../api';
import { loginFailed, loginStarted, loginSucceeded } from '../slice';

const normalizeError = (error) => {
  return error?.response?.data?.message || error?.message || 'Login failed';
};

export const useLogin = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: loginRequest,
    onMutate: () => {
      dispatch(loginStarted());
    },
    onSuccess: (result) => {
      if (result?.success && result?.data) {
        dispatch(loginSucceeded(result.data));
        toast.success(result?.message || 'Login successful');
        return;
      }

      const message = result?.message || 'Login failed';
      dispatch(loginFailed(message));
      toast.error(message);
    },
    onError: (error) => {
      const message = normalizeError(error);
      dispatch(loginFailed(message));
      toast.error(message);
    },
  });
};
