import React from 'react';
import coreToast, { on } from '../../core/bro-toastify';
import { BroToastify, BroToastifyToastifyOptions } from '../../core/types';

// Global singleton to manage toast rendering
const toastManager = (() => {
  let container: HTMLDivElement | null = null;
  let activeToasts: Map<string, HTMLElement> = new Map();
  let createListener: { off: () => void } | null = null;
  let dismissListener: { off: () => void } | null = null;
  let initialized = false;

  const init = (position: string, newestOnTop: boolean, dismissible: boolean) => {
    if (typeof window === 'undefined' || initialized) return;

    console.log('ToastManager initializing, position:', position); // Debug log
    initialized = true;

    // Create or update container
    container = document.querySelector(`.broToastify-container.broToastify-${position}`);
    if (!container) {
      container = document.createElement('div');
      container.className = `broToastify-container broToastify-${position}`;
      document.body.appendChild(container);
      console.log('Created container:', container); // Debug log
    }

    // Clean up old containers
    document.querySelectorAll('.broToastify-container').forEach((oldContainer) => {
      if (oldContainer !== container) {
        oldContainer.remove();
      }
    });

    // Handle create event
    const createHandler = (toast: BroToastify) => {
      if (!container || !toast) {
        console.error('No container or invalid toast:', { container, toast });
        return;
      }

      console.log('Received create event for toast:', toast); // Debug log

      let toastElement = activeToasts.get(toast.id);

      if (!toastElement) {
        toastElement = document.createElement('div');
        toastElement.id = `broToastify-${toast.id}`;
        toastElement.className = `broToastify-notification broToastify-${toast.type}`;
        toastElement.setAttribute('data-id', toast.id);

        if (newestOnTop) {
          container.prepend(toastElement);
        } else {
          container.appendChild(toastElement);
        }

        activeToasts.set(toast.id, toastElement);
        console.log('Created toast element:', toastElement); // Debug log
      }

      toastElement.innerHTML = `
        <div class="broToastify-title">${toast.title || ''}</div>
        <div class="broToastify-message">${toast.message}</div>
        ${dismissible ? `<button class="broToastify-close" aria-label="Close">×</button>` : ''}
      `;

      if (dismissible) {
        const closeButton = toastElement.querySelector('.broToastify-close');
        closeButton?.addEventListener('click', () => {
          if (container && toastElement) {
            container.removeChild(toastElement);
            activeToasts.delete(toast.id);
            coreToast.dismiss(toast.id);
            console.log('Dismissed toast:', toast.id); // Debug log
          }
        });
      }

      // Auto-dismiss
      if (toast.duration && toast.duration > 0) {
        setTimeout(() => {
          if (container && toastElement && container.contains(toastElement)) {
            container.removeChild(toastElement);
            activeToasts.delete(toast.id);
            console.log('Auto-dismissed toast:', toast.id); // Debug log
          }
        }, toast.duration);
      }
    };

    // Handle dismiss event
    const dismissHandler = (id: string) => {
      const toastElement = activeToasts.get(id);
      if (toastElement && container && container.contains(toastElement)) {
        container.removeChild(toastElement);
        activeToasts.delete(id);
        console.log('Handled dismiss event for toast:', id); // Debug log
      }
    };

    // Register listeners
    createListener = on('create', createHandler);
    dismissListener = on('dismiss', dismissHandler);
  };

  const cleanup = () => {
    if (typeof window === 'undefined') return;
    console.log('ToastManager cleaning up'); // Debug log
    createListener?.off();
    dismissListener?.off();
    if (container) {
      container.remove();
      activeToasts.clear();
      container = null;
    }
    initialized = false;
  };

  return { init, cleanup };
})();

// Server-safe Toaster component
export const Toaster: React.FC<{
  position?: BroToastifyToastifyOptions['position'];
  newestOnTop?: boolean;
  dismissible?: boolean;
}> = ({ position = 'top-right', newestOnTop = true, dismissible = true }) => {
  // Initialize toast manager on client-side
  if (typeof window !== 'undefined') {
    toastManager.cleanup(); // Ensure no duplicate managers
    toastManager.init(position, newestOnTop, dismissible);
  }

  // Render a hidden placeholder to avoid hydration issues
  return <div className={`broToastify-container broToastify-${position}`} style={{ display: 'none' }} />;
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
    loading: (message: string, options?: Partial<BroToastifyToastifyOptions>) =>
      coreToast.loading(message, options),
    promises: (
      promise: Promise<any>,
      messages: { loading: string; success: string; error: string },
      options?: Partial<BroToastifyToastifyOptions>
    ) => coreToast.promises(promise, messages, options),
    isToastActive: (id: string) => coreToast.isToastActive(id),
    dismiss: (id: string) => coreToast.dismiss(id),
    dismissible: (id: string) => coreToast.dismissible(id),
    clearAll: () => coreToast.clearAll(),
  };
};

// Export the core toast for direct usage
export const toast = coreToast;