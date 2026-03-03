import apiClient from '../../services/apiClient';

export const listLeads = async (params = {}) => {
  const { data } = await apiClient.get('/lead', { params });
  return data;
};

export default { listLeads };
