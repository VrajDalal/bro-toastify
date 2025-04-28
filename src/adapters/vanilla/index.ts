import toast, { on } from '../../core/bro-toastify';
import { BroToastify, BroToastifyToastifyOptions, BroToastifyContainerOptions } from '../../core/types';
import { injectStyles } from '../../dom/style';
import { createBroToastifyElement } from '../../dom/renderer';
import { getContainer } from '../../core/container';

/**
 * Initialize the vanilla JS adapter
 * @param options Default options for all toasts
 */

export { injectStyles }

export function init(options?: Partial<BroToastifyContainerOptions>): () => void {
    // Inject styles
    if (typeof window !== 'undefined') {
        injectStyles();
    }

    // Set default options if provided
    if (options) {
        Object.assign(toast, { defaultOptions: options });
    }

    // Subscribe to toast events
    const createListener = on('create', (toast: BroToastify) => {
        const container = getContainer(toast.position);
        const toastElement = createBroToastifyElement(toast);

        // Add to container
        if (options?.newestOnTop) {
            container?.prepend(toastElement);
        } else {
            container?.appendChild(toastElement);
        }

        // Set up dismiss event listener
        const handleDismiss = (e: CustomEvent) => {
            if (e.detail.id === toast.id) {
                toast.dismiss?.(toast.id);
                toastElement.remove();
            }
        };
        document.addEventListener('toast:dismiss', handleDismiss as EventListener);

        // Auto dismiss
        if (toast.duration && toast.duration > 0) {
            setTimeout(() => {
                toast.dismiss?.(toast.id); // Use dismiss method
                toastElement.remove();
            }, toast.duration);
        }

        const cleanup = () => {
            document.removeEventListener('toast:dismiss', handleDismiss as EventListener);
        };
        toastElement.addEventListener('remove', cleanup, { once: true });
    });

    // Cleanup on module unload (optional, if needed)
    return () => {
        createListener.off();
    };
}

// Export the core toast for direct usage
export const vanilla = toast;