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
    if (typeof window === 'undefined' || initialized) {
      console.log('ToastManager init skipped:', { isServer: typeof window === 'undefined', initialized });
      return;
    }

    console.log('ToastManager initializing, position:', position); // Debug log
    initialized = true;

    // Create or update container
    container = document.querySelector(`.broToastify-container.broToastify-${position}`);
    if (!container) {
      container = document.createElement('div');
      container.className = `broToastify-container broToastify-${position}`;
      document.body.appendChild(container);
      console.log('Created container:', container); // Debug log
    } else {
      console.log('Found existing container:', container); // Debug log
    }

    // Verify container is in DOM
    if (!document.body.contains(container)) {
      document.body.appendChild(container);
      console.log('Re-appended container to body:', container); // Debug log
    }

    // Clean up old containers
    document.querySelectorAll('.broToastify-container').forEach((oldContainer) => {
      if (oldContainer !== container) {
        oldContainer.remove();
        console.log('Removed old container:', oldContainer); // Debug log
      }
    });

    // Handle create event
    const createHandler = (toast: BroToastify) => {
      if (!container || !toast) {
        console.error('Cannot create toast: missing container or toast', { container, toast });
        return;
      }

      console.log('Received create event for toast:', toast); // Debug log

      let toastElement = activeToasts.get(toast.id);

      if (!toastElement) {
        toastElement = document.createElement('div');
        toastElement.id = `broToastify-${toast.id}`;
        toastElement.className = `broToastify-notification broToastify-${toast.type}`;
        toastElement.setAttribute('data-id', toast.id);

        try {
          if (newestOnTop) {
            container.prepend(toastElement);
          } else {
            container.appendChild(toastElement);
          }
          console.log('Created and appended toast element:', toastElement); // Debug log
        } catch (error) {
          console.error('Failed to append toast element:', error);
          return;
        }

        activeToasts.set(toast.id, toastElement);
      } else {
        console.log('Toast element already exists:', toastElement); // Debug log
      }

      try {
        toastElement.innerHTML = `
          <div class="broToastify-title">${toast.title || ''}</div>
          <div class="broToastify-message">${toast.message}</div>
          ${dismissible ? `<button class="broToastify-close" aria-label="Close">×</button>` : ''}
        `;
        console.log('Updated toast element HTML:', toastElement); // Debug log
      } catch (error) {
        console.error('Failed to update toast HTML:', error);
      }

      if (dismissible) {
        const closeButton = toastElement.querySelector('.broToastify-close');
        if (closeButton) {
          closeButton.addEventListener('click', () => {
            if (container && toastElement) {
              container.removeChild(toastElement);
              activeToasts.delete(toast.id);
              coreToast.dismiss(toast.id);
              console.log('Dismissed toast:', toast.id); // Debug log
            }
          });
          console.log('Added close button listener for toast:', toast.id); // Debug log
        } else {
          console.warn('Close button not found for toast:', toast.id);
        }
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
      } else {
        console.warn('Dismiss event for non-existent toast:', id);
      }
    };

    // Register listeners
    try {
      createListener = on('create', createHandler);
      dismissListener = on('dismiss', dismissHandler);
      console.log('Registered create and dismiss listeners'); // Debug log
    } catch (error) {
      console.error('Failed to register listeners:', error);
    }
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

// Client-side initialization script
if (typeof window !== 'undefined') {
  // Delay initialization to ensure DOM and Toaster render are complete
  setTimeout(() => {
    console.log('Running client-side Toaster initialization'); // Debug log
    const toasterConfig = (window as any).__BRO_TOASTER_CONFIG || {
      position: 'top-right',
      newestOnTop: true,
      dismissible: true,
    };
    console.log('Toaster config:', toasterConfig); // Debug log
    toastManager.cleanup();
    toastManager.init(toasterConfig.position, toasterConfig.newestOnTop, toasterConfig.dismissible);
  }, 0);
}

// Server-safe Toaster component
export const Toaster: React.FC<{
  position?: BroToastifyToastifyOptions['position'];
  newestOnTop?: boolean;
  dismissible?: boolean;
}> = ({ position = 'top-right', newestOnTop = true, dismissible = true }) => {
  // Store config for client-side initialization
  if (typeof window !== 'undefined') {
    try {
      console.log('Toaster component storing config:', { position, newestOnTop, dismissible }); // Debug log
      (window as any).__BRO_TOASTER_CONFIG = { position, newestOnTop, dismissible };
    } catch (error) {
      console.error('Failed to store Toaster config:', error);
    }
  } else {
    console.log('Toaster component running in SSR'); // Debug log
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
    dismissible: (id: string) => coreToast.dismiss(id),
    clearAll: () => coreToast.clearAll(),
  };
};

// Export the core toast for direct usage
export const toast = coreToast;