import { BroToastify, BroToastifyToastifyOptions, BroToastifyContainerOptions } from "./types";
import { defaultAnimationOptions } from "./animation";
import { AnimationType } from "./types";
import '../index.css';

let toasterAnimation: AnimationType = 'fade';

const timerRefs: Map<string, number | null> = new Map();

export function setToasterAnimation(animation: AnimationType) {
    toasterAnimation = animation;
}

const defaultOptions: Partial<BroToastifyToastifyOptions> = {
    type: "default",
    duration: 3000,
    position: "top-right",
    dismissible: true,
    pauseOnHover: true,
    customIcon: undefined,
    customClass: undefined,
};

const broToastifys: Map<string, BroToastify> = new Map();
const listeners: Map<string, Function[]> = new Map();

const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
};

export function pauseTimer(id: string) {
    const timer = timerRefs.get(id);
    if (timer) {
        clearTimeout(timer);
        timerRefs.set(id, null);
    }
}

export function resumeTimer(id: string, duration: number) {
    const toast = broToastifys.get(id);
    if (toast && duration > 0 && toast.type !== 'loading') {
        const timer = setTimeout(() => {
            dismissBroToastify(id);
        }, duration);
        timerRefs.set(id, timer);
    }
}

export function createBroToastify(options: BroToastifyToastifyOptions & { containerOptions?: BroToastifyContainerOptions }): BroToastify | undefined {
    if (!options.message) {
        console.error("BroToastify: message is required");
        return undefined;
    }

    const type = options.type || 'default';
    const containerOptions = options.containerOptions || {};
    const containerAnimation = containerOptions.animation
        ? { ...defaultAnimationOptions[containerOptions.animation] }
        : defaultAnimationOptions[toasterAnimation];

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        duration: options.type === 'loading' ? 0 : (options.duration ?? defaultOptions.duration),
        animation: {
            ...defaultAnimationOptions[type],
            ...containerAnimation,
            ...options.animation,
        },
    };

    const id = options.id || generateId();

    const BroToastify: BroToastify = {
        ...mergedOptions,
        id,
        createdAt: Date.now(),
    };

    broToastifys.set(id, BroToastify);
    emit('create', BroToastify);

    if (mergedOptions.duration && mergedOptions.duration > 0 && typeof window !== 'undefined') {
        const timer = setTimeout(() => {
            dismissBroToastify(id);
        }, mergedOptions.duration);
        timerRefs.set(id, timer);
    }

    return BroToastify;
}

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

    if (toastToDismiss) {
        // Clear the timer when dismissing
        const timer = timerRefs.get(id);
        if (timer) {
            clearTimeout(timer);
            timerRefs.delete(id);
        }

        broToastifys.delete(id);
        emit("dismiss", toastToDismiss);

        if (toastToDismiss.onClose) {
            toastToDismiss.onClose();
        }
    }
}

export function clearBroToastify(): void {
    const allBroToastifys = Array.from(broToastifys.values());
    allBroToastifys.forEach((broToastify) => {
        dismissBroToastify(broToastify.id);
    });
}

export function on(event: string, callback: Function): { off: () => void } {
    if (typeof window === 'undefined') {
        return { off: () => { } };
    }
    if (!listeners.has(event)) {
        listeners.set(event, []);
    }

    listeners.get(event)!.push(callback);

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
    };
}

function emit(event: string, data: any): void {
    if (typeof window !== 'undefined') {
        const callbacks = listeners.get(event);
        if (callbacks) {
            callbacks.forEach((callback) => callback(data));
        }
    }
}

const containers: Map<string, HTMLElement> = new Map();

export function createContainer(position: BroToastifyToastifyOptions['position']): HTMLElement | null {
    if (typeof window === 'undefined') {
        return null;
    }

    if (containers.has(position!)) {
        const existingContainer = containers.get(position!)!;
        if (document.body.contains(existingContainer)) {
            return existingContainer;
        } else {
            document.body.appendChild(existingContainer);
            return existingContainer;
        }
    }

    console.debug('Creating container for position:', position);

    const container = document.createElement('div');
    container.className = `bro-toastify-container ${getPositionClasses(position)}`;
    container.setAttribute('role', 'region');
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');

    document.body.appendChild(container);
    containers.set(position!, container);

    return container;
}

export function getContainer(position: BroToastifyToastifyOptions["position"]): HTMLElement | null {
    if (typeof window === "undefined") {
        return null;
    }

    if (containers.has(position!)) {
        const container = containers.get(position!)!;
        if (!document.body.contains(container)) {
            document.body.appendChild(container);
        }
        return container;
    }

    return createContainer(position);
}

export function removeAllContainers(): void {
    if (typeof window === "undefined") {
        return;
    }

    console.debug("Removing all containers");
    containers.forEach((container) => {
        if (document.body.contains(container)) {
            container.remove();
        }
    });
    containers.clear();
}

function getPositionClasses(position: BroToastifyToastifyOptions['position']): string {
    const positionClasses: Record<string, string> = {
        'top-right': 'top-4 right-4 items-end',
        'top-left': 'top-4 left-4 items-start',
        'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
        'bottom-right': 'bottom-4 right-4 items-end',
        'bottom-left': 'bottom-4 left-4 items-start',
        'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
    };
    return positionClasses[position || 'top-right'];
}

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