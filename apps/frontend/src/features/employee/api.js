import apiClient from '../../services/apiClient';

export const listEmployees = async (params = {}) => {
  const { data } = await apiClient.get('/employees', { params });
  return data;
};

export default { listEmployees };
