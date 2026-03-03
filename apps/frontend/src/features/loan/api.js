import apiClient from '../../services/apiClient';

export const listLoans = async (params = {}) => {
  const { data } = await apiClient.get('/loan-application', { params });
  return data;
};

export default { listLoans };
