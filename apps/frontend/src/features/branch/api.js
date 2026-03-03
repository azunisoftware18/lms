import apiClient from '../../services/apiClient';

export const listBranches = async (params = {}) => {
  const { data } = await apiClient.get('/branches', { params });
  return data;
};

export default { listBranches };
