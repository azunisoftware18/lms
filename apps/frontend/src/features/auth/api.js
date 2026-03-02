import apiClient from '../../services/apiClient';

export const loginRequest = async (payload) => {
  const response = await apiClient.post('/auth/login', payload);
  return response.data;
};
