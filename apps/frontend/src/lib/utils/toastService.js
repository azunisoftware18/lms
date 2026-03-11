import toast from "react-hot-toast";

/**
 * Toast service for consistent notifications
 */

export const showSuccess = (message, options = {}) => {
  return toast.success(message, {
    duration: 3000,
    ...options,
  });
};

export const showError = (message, options = {}) => {
  return toast.error(message, {
    duration: 4000,
    ...options,
  });
};

export const showLoading = (message, options = {}) => {
  return toast.loading(message, {
    ...options,
  });
};

export const showInfo = (message, options = {}) => {
  return toast(message, {
    icon: "ℹ️",
    duration: 3000,
    ...options,
  });
};

export const updateToast = (toastId, message, type = "success") => {
  toast.dismiss(toastId);
  if (type === "success") {
    showSuccess(message);
  } else if (type === "error") {
    showError(message);
  }
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};
