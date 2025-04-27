import React from 'react';
import coreToast, { on } from '../../core/bro-toastify';
import { BroToastify, BroToastifyToastifyOptions } from '../../core/types';

// Global singleton to manage toast rendering
const toastManager = (() => {
  let container: HTMLDivElement | null = null;
  let activeToasts: Map<string, HTMLElement> = new Map();
  let dismissedToasts: Set<string> = new Set(); // Track dismissed toasts
  let createListener: { off: () => void } | null = null;
  let dismissListener: { off: () => void } | null = null;
  let initialized = false;

  const init = (position: string, newestOnTop: boolean, dismissible: boolean) => {
    if (typeof window === 'undefined' || initialized) {
      console.log('ToastManager init skipped:', { isServer: typeof window === 'undefined', initialized });
      return;
    }

    console.log('ToastManager initializing, position:', position);
    initialized = true;

    // Create or update container
    container = document.querySelector(`.broToastify-container.broToastify-${position}`);
    if (!container) {
      container = document.createElement('div');
      container.className = `broToastify-container broToastify-${position}`;
      document.body.appendChild(container);
      console.log('Created container:', container);
    } else {
      console.log('Found existing container:', container);
    }

    // Verify container is in DOM
    if (!document.body.contains(container)) {
      document.body.appendChild(container);
      console.log('Re-appended container to body:', container);
    }

    // Clean up old containers
    document.querySelectorAll('.broToastify-container').forEach((oldContainer) => {
      if (oldContainer !== container) {
        oldContainer.remove();
        console.log('Removed old container:', oldContainer);
      }
    });

    // Handle create event
    const createHandler = (toast: BroToastify) => {
      if (!container || !toast) {
        console.error('Cannot create toast: missing container or toast', { container, toast });
        return;
      }

      console.log('Received create event for toast:', toast);

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
          console.log('Created and appended toast element:', toastElement);
        } catch (error) {
          console.error('Failed to append toast element:', error);
          return;
        }

        activeToasts.set(toast.id, toastElement);
      } else {
        console.log('Toast element already exists:', toastElement);
      }

      try {
        toastElement.innerHTML = `
          <div class="broToastify-title">${toast.title || ''}</div>
          <div class="broToastify-message">${toast.message}</div>
          ${dismissible ? `<button class="broToastify-close" aria-label="Close">×</button>` : ''}
        `;
        console.log('Updated toast element HTML:', toastElement);
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
              dismissedToasts.add(toast.id); // Mark as dismissed
              coreToast.dismiss(toast.id);
              console.log('Dismissed toast:', toast.id);
            }
          });
          console.log('Added close button listener for toast:', toast.id);
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
            dismissedToasts.add(toast.id); // Mark as dismissed
            coreToast.dismiss(toast.id);
            console.log('Auto-dismissed toast:', toast.id);
          }
        }, toast.duration);
      }
    };

    // Handle dismiss event
    const dismissHandler = (id: string) => {
      if (dismissedToasts.has(id)) {
        console.log('Ignoring dismiss event for already dismissed toast:', id);
        return;
      }

      const toastElement = activeToasts.get(id);
      if (toastElement && container && container.contains(toastElement)) {
        container.removeChild(toastElement);
        activeToasts.delete(id);
        dismissedToasts.add(id);
        console.log('Handled dismiss event for toast:', id);
      } else {
        console.log('Dismiss event for non-existent toast:', id);
      }
    };

    // Register listeners
    try {
      createListener = on('create', createHandler);
      dismissListener = on('dismiss', dismissHandler);
      console.log('Registered create and dismiss listeners');
    } catch (error) {
      console.error('Failed to register listeners:', error);
    }
  };

  const cleanup = () => {
    if (typeof window === 'undefined') return;
    console.log('ToastManager cleaning up');
    createListener?.off();
    dismissListener?.off();
    if (container) {
      container.remove();
      activeToasts.clear();
      dismissedToasts.clear();
      container = null;
    }
    initialized = false;
  };

  return { init, cleanup };
})();

// Toaster component
export const Toaster: React.FC<{
  position?: BroToastifyToastifyOptions['position'];
  newestOnTop?: boolean;
  dismissible?: boolean;
}> = ({ position = 'top-right', newestOnTop = true, dismissible = true }) => {
  React.useEffect(() => {
    console.log('Toaster useEffect running, initializing with:', { position, newestOnTop, dismissible });
    toastManager.cleanup();
    toastManager.init(position, newestOnTop, dismissible);

    return () => {
      console.log('Toaster useEffect cleanup');
      toastManager.cleanup();
    };
  }, [position, newestOnTop, dismissible]);

  // Render a hidden placeholder
  return <div className={`broToastify-container broToastify-${position}`} style={{ display: 'none' }} />;
};

// Hook for using toast
export const broToastify = () => {
  return {
    show: (message: string, options?: Partial<BroToastifyToastifyOptions>) =>
      coreToast.show(message, { ...options, duration: options?.duration ?? 5000 }), // Increase default duration
    success: (message: string, options?: Partial<BroToastifyToastifyOptions>) =>
      coreToast.success(message, { ...options, duration: options?.duration ?? 5000 }),
    error: (message: string, options?: Partial<BroToastifyToastifyOptions>) =>
      coreToast.error(message, { ...options, duration: options?.duration ?? 5000 }),
    info: (message: string, options?: Partial<BroToastifyToastifyOptions>) =>
      coreToast.info(message, { ...options, duration: options?.duration ?? 5000 }),
    warning: (message: string, options?: Partial<BroToastifyToastifyOptions>) =>
      coreToast.warning(message, { ...options, duration: options?.duration ?? 5000 }),
    loading: (message: string, options?: Partial<BroToastifyToastifyOptions>) =>
      coreToast.loading(message, { ...options, duration: options?.duration ?? 5000 }),
    promises: (
      promise: Promise<any>,
      messages: { loading: string; success: string; error: string },
      options?: Partial<BroToastifyToastifyOptions>
    ) => coreToast.promises(promise, messages, { ...options, duration: options?.duration ?? 5000 }),
    isToastActive: (id: string) => coreToast.isToastActive(id),
    dismiss: (id: string) => coreToast.dismiss(id),
    dismissible: (id: string) => coreToast.dismiss(id),
    clearAll: () => coreToast.clearAll(),
  };
};

// Export the core toast for direct usage
export const toast = coreToast;