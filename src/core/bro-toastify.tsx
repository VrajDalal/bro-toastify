import { BroToastify, BroToastifyToastifyOptions, BroToastifyContainerOptions } from "./types";
import { defaultAnimationOptions } from "./animation";
import { AnimationType } from "./types";

// Global variable to store Toaster's animation
let toasterAnimation: AnimationType = 'fade';

// Function to set Toaster's animation
export function setToasterAnimation(animation: AnimationType) {
    toasterAnimation = animation;
}

// Default
const defaultOptions: Partial<BroToastifyToastifyOptions> = {
    type: "default",
    duration: 3000,
    position: "top-right",
    dismissible: true,
    pauseOnHover: true,
    customIcon: undefined,
    customClass: undefined,
}

// Store for active toasts (in-memory)
const broToastifys: Map<string, BroToastify> = new Map();

// Event emitter for toast events
const listeners: Map<string, Function[]> = new Map();

// Generate Unique Id
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
}

// Create toast function (server-safe)
export function createBroToastify(options: BroToastifyToastifyOptions & { containerOptions?: BroToastifyContainerOptions }): BroToastify | undefined {
    if (!options.message) {
        console.error("BroToastify: message is required")
        return undefined
    }

    const type = options.type || 'default';
    const containerOptions = options.containerOptions || {};
    const containerAnimation = containerOptions.animation
        ? { ...defaultAnimationOptions[containerOptions.animation] }
        : defaultAnimationOptions[toasterAnimation]; // Default to fade

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        duration: options.type === 'loading' ? 0 : (options.duration ?? defaultOptions.duration),
        animation: {
            ...defaultAnimationOptions[type], // Default animation for type
            ...containerAnimation, // Toaster-level animation
            ...options.animation, // Toast-specific animation (highest priority)
        },
    };

    // Use the provided id if available, otherwise generate a new one
    const id = options.id || generateId();

    const BroToastify: BroToastify = {
        ...mergedOptions,
        id,
        createdAt: Date.now(),
    }

    broToastifys.set(id, BroToastify);
    console.log('Toast created with id:', id);

    // Emit event to notify the client-side Toaster
    emit('create', BroToastify);

    // Auto dismiss (will only work if this code runs on the client)
    if (mergedOptions.duration && mergedOptions.duration > 0 && typeof window !== 'undefined') {
        setTimeout(() => {
            dismissBroToastify(id);
        }, mergedOptions.duration);
    }

    return BroToastify
}

// Dismiss broToastify (server-safe)
export function dismissBroToastify(idOrToast: string | BroToastify): void {
    let id: string;
    let toastToDismiss: BroToastify | undefined;

    if (typeof idOrToast === 'string') {
        id = idOrToast;
        toastToDismiss = Array.from(broToastifys.values()).find((t) => t.id === id);
    } else {
        id = idOrToast.id;
        toastToDismiss = idOrToast;
    }

    console.log('Dismissing toast with id:', id, 'Found:', toastToDismiss);

    if (toastToDismiss) {
        broToastifys.delete(id); // Remove the toast from the Map
        emit("dismiss", toastToDismiss);

        if (toastToDismiss.onClose) {
            toastToDismiss.onClose();
        }
    }
}

// Clear all broToastify (server-safe)
export function clearBroToastify(): void {
    const allBroToastifys = Array.from(broToastifys.values());
    allBroToastifys.forEach((broToastify) => {
        dismissBroToastify(broToastify.id);
    })
}

// Subscribe to event (client-side Toaster will use this)
export function on(event: string, callback: Function): { off: () => void } {
    if (typeof window === 'undefined') {
        return { off: () => {} }; // No listeners on the server
    }
    if (!listeners.has(event)) {
        listeners.set(event, []);
    }

    listeners.get(event)!.push(callback);

    // Return unsubscribe function
    return {
        off: () => {
            const callbacks = listeners.get(event);
            if (callbacks) {
                const index = callbacks.indexOf(callback);
                if (index !== -1) {
                    callbacks.splice(index, 1);
                }
            }
        },
    }
}

// Emit event (called by createBroToastify and dismissBroToastify)
function emit(event: string, data: any): void {
    if (typeof window !== 'undefined') {
        const callbacks = listeners.get(event);
        if (callbacks) {
            callbacks.forEach((callback) => callback(data));
        }
    }
}

// Convenience methods (server-safe)
const toast = {
    show: (message: string, options?: Partial<BroToastifyToastifyOptions> & { containerOptions?: BroToastifyContainerOptions }) =>
        createBroToastify({ message, type: 'show', ...options }),
    default: (message: string, options?: Partial<BroToastifyToastifyOptions> & { containerOptions?: BroToastifyContainerOptions }) =>
        createBroToastify({ message, type: 'default', ...options }),
    success: (message: string, options?: Partial<BroToastifyToastifyOptions> & { containerOptions?: BroToastifyContainerOptions }) =>
        createBroToastify({ message, type: 'success', ...options }),
    error: (message: string, options?: Partial<BroToastifyToastifyOptions> & { containerOptions?: BroToastifyContainerOptions }) =>
        createBroToastify({ message, type: 'error', ...options }),
    info: (message: string, options?: Partial<BroToastifyToastifyOptions> & { containerOptions?: BroToastifyContainerOptions }) =>
        createBroToastify({ message, type: 'info', ...options }),
    warning: (message: string, options?: Partial<BroToastifyToastifyOptions> & { containerOptions?: BroToastifyContainerOptions }) =>
        createBroToastify({ message, type: 'warning', ...options }),
    loading: (message: string, options?: Partial<BroToastifyToastifyOptions> & { containerOptions?: BroToastifyContainerOptions }) => {
        const loadingId = generateId();
        createBroToastify({ id: loadingId, message, type: 'loading', ...options });
        return { id: loadingId };
    },
    promises: (
        promise: Promise<any>,
        message: { loading: string, success: string, error: string },
        options?: Partial<BroToastifyToastifyOptions> & { containerOptions?: BroToastifyContainerOptions }
    ) => {
        const loadingId = generateId();
        createBroToastify({ id: loadingId, message: message.loading, type: 'loading', ...options });

        promise
            .then((result) => {
                dismissBroToastify(loadingId);
                createBroToastify({ message: message.success, type: 'success', ...options });
                return result;
            })
            .catch((error) => {
                dismissBroToastify(loadingId);
                createBroToastify({ message: message.error, type: 'error', ...options });
                throw error;
            });
        return { id: loadingId };
    },
    isToastActive: (id: string): boolean => {
        return !!Array.from(broToastifys.values()).find((toast) => toast.id === id);
    },
    dismiss: (idOrToast: string | BroToastify) => dismissBroToastify(idOrToast),
    dismissible: (id: string) => dismissBroToastify(id),
    clearAll: clearBroToastify,
};

export default toast;