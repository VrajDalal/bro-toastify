import React, { useEffect, useRef } from 'react';
import { broToastify as coreToast, on } from '../../core/bro-toastify';
import { BroToastify, BroToastifyToastifyOptions } from '../../core/types';

// Client-only ToastContainer implementation
const ClientToastContainer: React.FC<{
  position?: BroToastifyToastifyOptions['position'];
  newestOnTop?: any;
  dismissible?: any;
}> = ({
  position = 'top-right',
  newestOnTop,
  dismissible,
}) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const activeToastsRef = useRef<Map<string, HTMLElement>>(new Map());

    useEffect(() => {
      if (typeof window === 'undefined') return;

      // Create or update the container (fixed missing dot in selector)
      let container = document.querySelector(`.broToastify-container broToastify-${position}`);
      if (!container) {
        container = document.createElement('div');
        container.className = `broToastify-container broToastify-${position}`;
        document.body.appendChild(container);
      }
      containerRef.current = container as HTMLDivElement;

      const updateContainerPosition = (newPosition: string) => {
        if (containerRef.current) {
          // Remove previous position classes
          containerRef.current.className = `broToastify-container broToastify-${newPosition}`;
          // Move existing toasts to the new container
          activeToastsRef.current.forEach((toastElement) => {
            if (containerRef.current && !containerRef.current.contains(toastElement)) {
              if (newestOnTop) {
                containerRef.current.prepend(toastElement);
              } else {
                containerRef.current.appendChild(toastElement);
              }
            }
          });
        }
      };

      const cleanupOldContainers = () => {
        document.querySelectorAll('.broToastify-container').forEach((oldContainer) => {
          if (oldContainer !== containerRef.current) {
            oldContainer.remove();
          }
        });
      };

      const createHandler = (toast: BroToastify) => {
        if (!containerRef.current || !toast) return;

        let toastElement = activeToastsRef.current.get(toast.id);

        if (!toastElement) {
          toastElement = document.createElement('div');
          toastElement.id = `broToastify-${toast.id}`; // Match ID used in dismissBroToastify
          toastElement.className = `broToastify-notification broToastify-${toast.type}`;
          toastElement.setAttribute('data-id', toast.id);

          if (newestOnTop) {
            containerRef.current.prepend(toastElement);
          } else {
            containerRef.current.appendChild(toastElement);
          }

          activeToastsRef.current.set(toast.id, toastElement);
        }

        toastElement.innerHTML = `
        <div class="broToastify-title">${toast.title || ''}</div>
        <div class="broToastify-message">${toast.message}</div>
        ${dismissible ? `<button class="broToastify-close" aria-label="Close">×</button>` : ''}
      `;

        if (dismissible) {
          const closeButton = toastElement.querySelector('.broToastify-close');
          closeButton?.addEventListener('click', () => {
            if (containerRef.current && toastElement) {
              containerRef.current.removeChild(toastElement);
              activeToastsRef.current.delete(toast.id);
              coreToast.dismiss(toast.id);
            }
          });
        }

        if (toast.duration && toast.duration > 0) {
          setTimeout(() => {
            if (containerRef.current && toastElement && containerRef.current.contains(toastElement)) {
              containerRef.current.removeChild(toastElement);
              activeToastsRef.current.delete(toast.id);
            }
          }, toast.duration);
        }
      };

      const dismissHandler = (id: string) => {
        const toastElement = activeToastsRef.current.get(id);
        if (toastElement && containerRef.current && containerRef.current.contains(toastElement)) {
          containerRef.current.removeChild(toastElement);
          activeToastsRef.current.delete(id);
        }
      };

      // Register event listeners
      const createListener = on('create', createHandler);
      const dismissListener = on('dismiss', dismissHandler);

      // Update position if it changes
      updateContainerPosition(position);
      cleanupOldContainers();

      // Cleanup on unmount (fixed incorrect listener cleanup)
      return () => {
        createListener.off();
        dismissListener.off();
        if (containerRef.current) {
          containerRef.current.remove();
          activeToastsRef.current.clear();
        }
      };
    }, [position, newestOnTop, dismissible]);

    return null;
  };

// Server-safe ToastContainer wrapper
export const ToastContainer: React.FC<{
  position?: BroToastifyToastifyOptions['position'];
  newestOnTop?: any;
  dismissible?: any;
}> = (props) => {
  if (typeof window === 'undefined') {
    return null;
  }
  return <ClientToastContainer {...props} />;
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
    ) => coreToast.promises(promise, messages, options),
    isToastActive: (id: string) => coreToast.isToastActive(id),
    dismissible: (id: string) => coreToast.dismissible(id),
    dismiss: (id: string) => coreToast.dismissible(id),
    clearAll: coreToast.clearAll,
  };
};

// Export the core toast for direct usage
export const toast = coreToast;