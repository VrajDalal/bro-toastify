import { BroToastify, BroToastifyToastifyOptions, BroToastifyContainerOptions } from "./types";
import { createContainer } from './container';
import { injectStyles } from "../dom/style";
import { defaultAnimationOptions } from "./animation";
import { AnimationType } from "./types";

// Global variable to store Toaster's animation
let toasterAnimation: AnimationType = 'fade';

// Function to set Toaster's animation
export function setToasterAnimation(animation: AnimationType) {
    toasterAnimation = animation;
}

if (typeof window !== 'undefined') {
    injectStyles();
}

//Default
const defaultOptions: Partial<BroToastifyToastifyOptions> = {
    type: "default",
    duration: 3000,
    position: "top-right",
    dismissible: true,
    pauseOnHover: true,
    customIcon: undefined,
    customClass: undefined,
    // animation: defaultAnimationOptions
}

// Store for active toasts
const broToastifys: Map<string, BroToastify> = new Map();

//Event emitter for toast events
const listeners: Map<string, Function[]> = new Map();

//Generate Unique Id
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
}

//Create toast function
export function createBroToastify(options: BroToastifyToastifyOptions & { containerOptions?: BroToastifyContainerOptions }): BroToastify | undefined {
    if (typeof window === 'undefined') {
        return undefined; // Prevent toast creation during SSR
    }

    if (!options.message) {
        console.error("BroToastify: message is required")
        return undefined
    }

    const type = options.type || 'default';
    const containerOptions = options.containerOptions || {};
    console.log('createBroToastify options:', { containerOptions, type, toasterAnimation });
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

    const id = generateId();

    const BroToastify: BroToastify = {
        ...mergedOptions,
        id,
        createdAt: Date.now(),
    }

    broToastifys.set(id, BroToastify);

    //container exits
    createContainer(mergedOptions.position!);

    //Emit event
    emit('create', BroToastify);

    //Auto dismiss
    if (mergedOptions.duration && mergedOptions.duration > 0) {
        setTimeout(() => {
            dismissBroToastify(id);
        }, mergedOptions.duration);
    }

    return BroToastify
}

//dismiss broToastify
export function dismissBroToastify(id: string): void {
    if (typeof window === "undefined") {
        return // Skip during SSR
    }

    const BroToastify = Array.from(broToastifys.values()).find((t) => t.id === id)

    if (BroToastify) {
        broToastifys.delete(id) // Remove the toast from the Map
        emit("dismiss", BroToastify)

        if (BroToastify.onClose) {
            BroToastify.onClose()
        }
    }
}

//clear all broToastify
export function clearBroToastify(): void {
    if (typeof window === 'undefined') {
        return; // Prevent execution during SSR
    }

    const allBroToastifys = Array.from(broToastifys.values());
    allBroToastifys.forEach((broToastify) => {
        dismissBroToastify(broToastify.id);
    })
}


//subscribe to event
export function on(event: string, callback: Function): { off: () => void } {
    if (!listeners.has(event)) {
        listeners.set(event, []);
    }

    listeners.get(event)!.push(callback);

    //return unsubscribe function
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

//emit event
function emit(event: string, data: any): void {
    const callbacks = listeners.get(event);
    if (callbacks) {
        callbacks.forEach((callback) => callback(data));
    }
}

//convenience methods
const toast = {
    show: (message: string, options?: Partial<BroToastifyToastifyOptions> & { containerOptions?: BroToastifyContainerOptions }) =>
        createBroToastify({ message, type: 'show', ...options }),
    success: (message: string, options?: Partial<BroToastifyToastifyOptions> & { containerOptions?: BroToastifyContainerOptions }) =>
        createBroToastify({ message, type: 'success', ...options }),
    error: (message: string, options?: Partial<BroToastifyToastifyOptions> & { containerOptions?: BroToastifyContainerOptions }) =>
        createBroToastify({ message, type: 'error', ...options }),
    info: (message: string, options?: Partial<BroToastifyToastifyOptions> & { containerOptions?: BroToastifyContainerOptions }) =>
        createBroToastify({ message, type: 'info', ...options }),
    warning: (message: string, options?: Partial<BroToastifyToastifyOptions> & { containerOptions?: BroToastifyContainerOptions }) =>
        createBroToastify({ message, type: 'warning', ...options }),
    loading: (message: string, options?: Partial<BroToastifyToastifyOptions> & { containerOptions?: BroToastifyContainerOptions }) =>
        createBroToastify({ message, type: 'loading', ...options }),
    promises: (
        promise: Promise<any>,
        message: { loading: string, success: string, error: string },
        options?: Partial<BroToastifyToastifyOptions> & { containerOptions?: BroToastifyContainerOptions }
    ) => {
        if (typeof window === 'undefined') {
            return undefined; // Prevent execution during SSR
        }

        const id = generateId();

        createBroToastify({ id, message: message.loading, type: 'loading', ...options });

        promise
            .then((result) => {
                dismissBroToastify(id)
                createBroToastify({ message: message.success, type: 'success', ...options });
                return result
            })
            .catch((error) => {
                dismissBroToastify(id)
                createBroToastify({ message: message.error, type: 'error', ...options });
                throw error
            });
        return { id };
    },
    isToastActive: (id: string): boolean => {
        return !!Array.from(broToastifys.values()).find((toast) => toast.id === id);
    },
    dismiss: (id: string) => dismissBroToastify(id),
    dismissible: (id: string) => dismissBroToastify(id),
    clearAll: clearBroToastify,
}

export default toast;


