/**
 * Global Params Normalization Helper
 * Standardizes pagination and search parameters across all API calls
 * Preserves additional filter parameters
 */

export const normalizeParams = (params = {}) => {
  return {
    page: params?.page || 1,
    limit: params?.limit || 10,
    q: params?.search ?? params?.q ?? "",
    search: params?.search ?? params?.q ?? "",
    // Preserve additional filter parameters
    ...(params?.isActive !== undefined && { isActive: params.isActive }),
    ...(params?.isPublic !== undefined && { isPublic: params.isPublic }),
    ...(params?.publicOnly !== undefined && { publicOnly: params.publicOnly }),
    ...(params?.search !== undefined && { search: params.search }),
    ...(params?.q !== undefined && { q: params.q }),
  };
};

export default normalizeParams;
