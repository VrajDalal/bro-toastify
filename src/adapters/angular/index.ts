
import toast, { on } from '../../core/bro-toastify';
import { BroToastify, BroToastifyToastifyOptions } from '../../core/types';
import { injectStyles } from '../../dom/style';

// Toast service for Angular
export class ToastService {
  constructor() {
    // Inject styles when service is instantiated
    if (typeof window !== 'undefined') {
      injectStyles();
    }
  }

  show(message: string, options?: Partial<BroToastifyToastifyOptions>) {
    return toast.show(message, options);
  }

  success(message: string, options?: Partial<BroToastifyToastifyOptions>) {
    return toast.success(message, options);
  }

  error(message: string, options?: Partial<BroToastifyToastifyOptions>) {
    return toast.error(message, options);
  }

  info(message: string, options?: Partial<BroToastifyToastifyOptions>) {
    return toast.info(message, options);
  }

  warning(message: string, options?: Partial<BroToastifyToastifyOptions>) {
    return toast.warning(message, options);
  }

  dismiss(id: string) {
    toast.dismissible(id);
  }

  clearAll() {
    toast.clearAll();
  }
}

// Component class for ToastContainer
export class ToastContainerComponent {
  position: BroToastifyToastifyOptions['position'] = 'top-right';
  newestOnTop: boolean = true;
  toasts: BroToastify[] = [];

  private createUnsubscribe: (() => void) | null = null;
  private dismissUnsubscribe: (() => void) | null = null;

  ngOnInit() {
    // Subscribe to toast events
    const createSubscription = on('create', (toast: BroToastify) => {
      if (toast.position === this.position) {
        if (this.newestOnTop) {
          this.toasts = [toast, ...this.toasts];
        } else {
          this.toasts = [...this.toasts, toast];
        }
      }
    });
    this.createUnsubscribe = createSubscription.off;

    const dismissSubscription = on('dismiss', (toast: BroToastify) => {
      this.toasts = this.toasts.filter(t => t.id !== toast.id);
    });
    this.dismissUnsubscribe = dismissSubscription.off;
  }

  ngOnDestroy() {
    // Cleanup
    if (this.createUnsubscribe) {
      this.createUnsubscribe();
    }

    if (this.dismissUnsubscribe) {
      this.dismissUnsubscribe();
    }
  }

  handleDismiss(id: string) {
    toast.dismissible(id);
  }
}

// Export the core toast for direct usage
export const angularToast = toast;
