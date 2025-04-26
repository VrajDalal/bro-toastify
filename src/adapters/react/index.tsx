import React from 'react';
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
    if (typeof window !== "undefined") {
      const container =
        document.querySelector(`.broToastify-container.broToastify-${position}`) ||
        document.createElement("div");

      if (!container.parentElement) {
        container.className = `broToastify-container broToastify-${position}`;
        document.body.appendChild(container);

        const activeToasts = new Map<string, HTMLElement>();

        on("create", (toast: BroToastify) => {
          let toastElement = activeToasts.get(toast.id);

          if (!toastElement) {
            // Create a new toast element if it doesn't exist
            toastElement = document.createElement("div");
            toastElement.className = `broToastify-notification broToastify-${toast.type}`;
            toastElement.setAttribute("data-id", toast.id);

            if (newestOnTop) {
              container.prepend(toastElement);
            } else {
              container.appendChild(toastElement);
            }

            activeToasts.set(toast.id, toastElement);
          }

          // Update the toast content
          toastElement.innerHTML = `
            <div class="broToastify-title">${toast.title || ""}</div>
            <div class="broToastify-message">${toast.message}</div>
            ${dismissible
              ? `<button class="broToastify-close" aria-label="Close">&times;</button>`
              : ""
            }
          `;

          if (dismissible) {
            const closeButton = toastElement.querySelector(".broToastify-close");
            closeButton?.addEventListener("click", () => {
              container.removeChild(toastElement!);
              activeToasts.delete(toast.id);
            });
          }

          if (toast.duration && toast.duration > 0) {
            setTimeout(() => {
              if (container.contains(toastElement!)) {
                container.removeChild(toastElement!);
                activeToasts.delete(toast.id);
              }
            }, toast.duration);
          }
        });

        on("dismiss", (id: string) => {
          const toastElement = activeToasts.get(id);
          if (toastElement) {
            container.removeChild(toastElement);
            activeToasts.delete(id);
          }
        });
      }
    }
    return null;
  };

// Individual toast component
// const ToastItem: React.FC<{ toast: BroToastify; dismissible: boolean }> = ({ toast, dismissible }) => {
//   const { id, type, message, title } = toast;

//   const handleDismiss = useCallback(() => {
//     coreToast.dismissible(id);
//   }, [id]);

//   return (
//     <div
//       className={`broToastify-notification broToastify-${type} ${toast.customClass || ''}`}
//       role="alert"
//       onClick={toast.onClick}
//     >
//       {title && <div className="broToastify-title">{title}</div>}
//       <div className="broToastify-message">
//         {type === 'loading' ? (
//           <div className="broToastify-loader-container">
//             <div className="broToastify-loader"></div>
//             <div className="broToastify-loader-message">{message}</div>
//           </div>
//         ) : (
//           message
//         )}
//       </div>

//       {dismissible && (
//         <button
//           className="broToastify-close"
//           aria-label="Close"
//           onClick={(e) => {
//             e.stopPropagation();
//             handleDismiss();
//           }}
//         >
//           &times;
//         </button>
//       )}
//     </div>
//   );
// };

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