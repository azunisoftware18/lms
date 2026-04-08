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
    ...(params?.propertyType !== undefined &&
      params.propertyType !== "" && { propertyType: params.propertyType }),
    ...(params?.constructionStatus !== undefined &&
      params.constructionStatus !== "" && {
        constructionStatus: params.constructionStatus,
      }),
    ...(params?.city !== undefined &&
      params.city !== "" && { city: params.city }),
    // Preserve additional filter parameters
    ...(params?.status !== undefined &&
      params.status !== "" && { status: params.status }),
    ...(params?.isActive !== undefined && { isActive: params.isActive }),
    ...(params?.isPublic !== undefined && { isPublic: params.isPublic }),
    ...(params?.publicOnly !== undefined && { publicOnly: params.publicOnly }),
    ...(params?.dateRange !== undefined &&
      params.dateRange !== "" && { dateRange: params.dateRange }),
  };
};

export default normalizeParams;
