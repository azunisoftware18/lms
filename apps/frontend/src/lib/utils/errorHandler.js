/**
 * Error handler utility for standardized error management
 * Extracts and formats error messages from various error types
 */

export const getErrorMessage = (error) => {
  // Axios error with response
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  // Axios error with status
  if (error?.response?.status) {
    const statusMessages = {
      400: 'Invalid request. Please check your input.',
      401: 'Unauthorized. Please login again.',
      403: 'You do not have permission to perform this action.',
      404: 'Resource not found.',
      409: 'This resource already exists.',
      422: 'Validation error. Please check your input.',
      500: 'Server error. Please try again later.',
      502: 'Bad Gateway. Please try again later.',
      503: 'Service unavailable. Please try again later.',
    };
    return statusMessages[error.response.status] || 'An error occurred. Please try again.';
  }

  // Network error
  if (error?.message === 'Network Error') {
    return 'Network error. Please check your connection.';
  }

  // Generic error message
  if (error?.message) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};

export const getErrorStatus = (error) => {
  return error?.response?.status || 500;
};

export const isNetworkError = (error) => {
  return error?.message === 'Network Error' || !error?.response;
};

export const handleErrorResponse = (error) => {
  return {
    message: getErrorMessage(error),
    status: getErrorStatus(error),
    isNetworkError: isNetworkError(error),
    originalError: error,
  };
};
