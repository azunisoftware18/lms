import apiClient from '../../services/apiClient';

export const listPartners = async (params = {}) => {
  const { data } = await apiClient.get('/partners', { params });
  return data;
};

export default { listPartners };
