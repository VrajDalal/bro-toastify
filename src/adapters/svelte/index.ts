import { writable } from 'svelte/store';
import toast, { on } from '../../core/bro-toastify';
import { BroToastify, BroToastifyToastifyOptions } from '../../core/types';
import { injectStyles } from '../../dom/style';

// Create a Svelte store for toasts
export const toasts = writable<Map<string, BroToastify>>(new Map());

// Subscribe to toast events and update the store
function setupToastStore() {
  // Inject styles
  if (typeof window !== 'undefined') {
    injectStyles();
  }

  // Subscribe to toast events
  on('create', (toast: BroToastify) => {
    toasts.update((store: Map<string, BroToastify>) => {
      const newStore = new Map(store);
      newStore.set(toast.id, toast);
      return newStore;
    });
  });

  on('dismiss', (toast: BroToastify) => {
    toasts.update((store: Map<string, BroToastify>) => {
      const newStore = new Map(store);
      newStore.delete(toast.id);
      return newStore;
    });
  });
}

// Initialize the store
setupToastStore();

// Toast functions for Svelte
export const toastify = {

  show: (message: string, options?: Partial<BroToastifyToastifyOptions>) =>
    toast.show(message, options),

  success: (message: string, options?: Partial<BroToastifyToastifyOptions>) =>
    toast.success(message, options),

  error: (message: string, options?: Partial<BroToastifyToastifyOptions>) =>
    toast.error(message, options),

  info: (message: string, options?: Partial<BroToastifyToastifyOptions>) =>
    toast.info(message, options),

  warning: (message: string, options?: Partial<BroToastifyToastifyOptions>) =>
    toast.warning(message, options),

  dismissible: toast.dismissible,
  clearAll: toast.clearAll
};

// Export ToastContainer component (would be a .svelte file in a real implementation)
// This is a simplified representation
export const ToastContainer = {
  // In a real implementation, this would be a Svelte component
  // that subscribes to the toasts store and renders them
};