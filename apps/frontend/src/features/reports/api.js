import apiClient from '../../services/apiClient';

export const getReportsSummary = async (params = {}) => {
  const { data } = await apiClient.get('/reports/summary', { params });
  return data;
};

export default { getReportsSummary };
