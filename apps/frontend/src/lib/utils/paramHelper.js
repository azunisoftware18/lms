/**
 * Global Params Normalization Helper
 * Standardizes pagination and search parameters across all API calls
 */

export const normalizeParams = (params = {}) => {
  return {
    page: params?.page || 1,
    limit: params?.limit || 10,
    q: params?.search ?? params?.q ?? "",
    search: params?.search ?? params?.q ?? "",
  };
};

export default normalizeParams;
