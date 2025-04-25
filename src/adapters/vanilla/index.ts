import { broToastify as coreToast, on } from '../../core/bro-toastify';
import { BroToastify, BroToastifyToastifyOptions, BroToastifyContainerOptions } from '../../core/types';
import { injectStyles } from '../../dom/style';
import { createBroToastifyElement } from '../../dom/renderer';
import { getContainer } from '../../core/container';

/**
 * Initialize the vanilla JS adapter
 * @param options Default options for all toasts
 */

export { injectStyles }

export function init(options?: Partial<BroToastifyContainerOptions>): void {
    // Inject styles
    injectStyles();

    // Set default options if provided
    if (options) {
        Object.assign(coreToast, { defaultOptions: options });
    }

    // Subscribe to toast events
    on('create', (toast: BroToastify) => {
        const container = getContainer(toast.position);
        const toastElement = createBroToastifyElement(toast);

        // Add to container
        if (options?.newestOnTop) {
            container.prepend(toastElement);
        } else {
            container.appendChild(toastElement);
        }

        // Set up dismiss event listener
        document.addEventListener('toast:dismiss', (e: any) => {
            if (e.detail.id === toast.id) {
                coreToast.dismiss(toast.id);
                toastElement.remove();
            }
        });

        // Auto dismiss
        if (toast.duration && toast.duration > 0) {
            setTimeout(() => {
                coreToast.dismiss(toast.id);
                toastElement.remove();
            }, toast.duration);
        }
    });
}

// Export the core toast for direct usage
export const toast = coreToast;