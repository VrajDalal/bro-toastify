
import React, { useEffect, useState, useCallback } from 'react';
import { broToastify as coreToast, on } from '../../core/bro-toastify'
import { BroToastify, BroToastifyToastifyOptions } from '../../core/types';

// React component for toast container
export const ToastContainer: React.FC<{
  position?: BroToastifyToastifyOptions['position'],
  newestOnTop?: boolean
  dismissible?: any
}> = ({
  position = 'top-right',
  newestOnTop = true,
  dismissible
}) => {
    const [toasts, setToasts] = useState<BroToastify[]>([]);

    useEffect(() => {
      // Subscribe to toast events
      const createUnsubscribe = on('create', (toast: BroToastify) => {
        setToasts((prev) => {
          const newToasts = [...prev, toast];
          return newestOnTop ? newToasts : newToasts.reverse();
        });

        if (!dismissible && toast.duration && toast.duration > 0) {
          setTimeout(() => {
            coreToast.dismissible(toast.id);
          }, toast.duration);
        }
      });

      const dismissUnsubscribe = on('dismiss', (toast: BroToastify) => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      });

      // Cleanup
      return () => {
        createUnsubscribe();
        dismissUnsubscribe();
      };
    }, [newestOnTop, dismissible]);

    return (
      <div className={`broToastify-container broToastify-${position}`}>
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} dismissible={!!dismissible} />
        ))}
      </div>
    );
  };
``
// Individual toast component
const ToastItem: React.FC<{ toast: BroToastify; dismissible: boolean }> = ({ toast, dismissible }) => {
  const { id, type, message, title } = toast;

  const handleDismiss = useCallback(() => {
    coreToast.dismissible(id);
  }, [id]);

  return (
    <div
      className={`broToastify-notification broToastify-${type} ${toast.customClass || ''}`}
      role="alert"
      onClick={toast.onClick}
    >
      {title && <div className="broToastify-title">{title}</div>}
      <div className="broToastify-message">
        {type === 'loading' ? (
          <div className="broToastify-loader-container">
            <div className="broToastify-loader"></div>
            <div className="broToastify-loader-message">{message}</div>
          </div>
        ) : (
          message
        )}
      </div>

      {dismissible && (
        <button
          className="broToastify-close"
          aria-label="Close"
          onClick={(e) => {
            e.stopPropagation();
            handleDismiss();
          }}
        >
          &times;
        </button>
      )}
    </div>
  );
};

// Hook for using toast
export const broToastify = () => {
  return {
    show: (message: string, options?: Partial<BroToastifyToastifyOptions>) =>
      coreToast.show(message, options),
    success: (message: string, options?: Partial<BroToastifyToastifyOptions>) =>
      coreToast.success(message, options),
    error: (message: string, options?: Partial<BroToastifyToastifyOptions>) =>
      coreToast.error(message, options),
    info: (message: string, options?: Partial<BroToastifyToastifyOptions>) =>
      coreToast.info(message, options),
    warning: (message: string, options?: Partial<BroToastifyToastifyOptions>) =>
      coreToast.warning(message, options),
    loading: (message: string, options?: Partial<BroToastifyToastifyOptions>) => {
      const toast = coreToast.loading(message, options);
      return toast;
    },
    promises: (
      promise: Promise<any>,
      messages: { loading: string; success: string; error: string },
      options?: Partial<BroToastifyToastifyOptions>
    ) => {
      const toast = coreToast.loading(messages.loading, options);

      promise
        .then((result) => {
          coreToast.dismiss(toast.id); // Dismiss the loading toast
          coreToast.success(messages.success, options); // Show success toast
          return result;
        })
        .catch((error) => {
          coreToast.dismiss(toast.id); // Dismiss the loading toast
          coreToast.error(messages.error, options); // Show error toast
          throw error;
        });

      return toast;
    },
    dismiss: (id: string) => coreToast.dismissible(id),
    clearAll: coreToast.clearAll
  };
};

// Export the core toast for direct usage
export const toast = coreToast;