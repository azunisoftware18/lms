import api from "../api";

/**
 * Global API Client
 * Centralized utility for all API calls across the application
 * Handles request/response formatting and error handling
 */

export const apiClient = async (url, options = {}) => {
  try {
    const response = await api({
      url,
      ...options,
    });
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

// GET request helper
export const apiGet = (url, config = {}) => {
  return apiClient(url, {
    method: "GET",
    ...config,
  });
};

// POST request helper
export const apiPost = (url, data, config = {}) => {
  return apiClient(url, {
    method: "POST",
    data,
    ...config,
  });
};

// PATCH request helper
export const apiPatch = (url, data, config = {}) => {
  return apiClient(url, {
    method: "PATCH",
    data,
    ...config,
  });
};

// PUT request helper
export const apiPut = (url, data, config = {}) => {
  return apiClient(url, {
    method: "PUT",
    data,
    ...config,
  });
};

// DELETE request helper
export const apiDelete = (url, config = {}) => {
  return apiClient(url, {
    method: "DELETE",
    ...config,
  });
};

export default apiClient;
