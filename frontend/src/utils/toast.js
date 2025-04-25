import { toast } from 'react-toastify';

export const showSuccessToast = (message) => {
  toast.success(message);
};

export const showErrorToast = (message) => {
  toast.error(message);
};

export const showInfoToast = (message) => {
  toast.info(message);
};

export const showWarningToast = (message) => {
  toast.warn(message);
};

export function getErrorMessage(error) {
  if (typeof error === 'string') {
    return error;
  }

  const message = error.response?.data;

  let firstKeyMessage;

  if (message && typeof message === 'object' && !Array.isArray(message)) {
    const firstKey = Object.keys(message)[0];
    firstKeyMessage = message[firstKey];
  }

  return (
    message?.error ||
    message?.message ||
    firstKeyMessage ||
    (typeof message === 'string' &&
    !message.trim().toLowerCase().startsWith('<!doctype html>')
      ? message
      : null) ||
    'An unexpected error occurred.'
  );
}

export function useCreateNotification() {
  return ({ message, type }) => {
    if (type === 'error') {
      message = getErrorMessage(message);
    }
    switch (type) {
      case 'success':
        showSuccessToast(message);
        break;
      case 'error':
        showErrorToast(message);
        break;
      case 'info':
        showInfoToast(message);
        break;
      case 'warning':
        showWarningToast(message);
        break;
      default:
        toast(message);
    }
  };
}
