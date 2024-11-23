import { toast as sonnerToast } from 'sonner';

const toast = {
  success: (message) => {
    sonnerToast.success(message, {
      duration: 3000,
      position: 'bottom-right',
    });
  },
  error: (message) => {
    sonnerToast.error(message, {
      duration: 4000,
      position: 'bottom-right',
    });
  },
  info: (message) => {
    sonnerToast.info(message, {
      duration: 3000,
      position: 'bottom-right',
    });
  },
  warning: (message) => {
    sonnerToast.warning(message, {
      duration: 4000,
      position: 'bottom-right',
    });
  },
  loading: (message) => {
    return sonnerToast.loading(message, {
      position: 'bottom-right',
    });
  },
  dismiss: (toastId) => {
    sonnerToast.dismiss(toastId);
  },
};

export default toast;
