import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { logout } from '../slice';

export const useLogout = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logout successful');
  };

  return { logout: handleLogout };
};
