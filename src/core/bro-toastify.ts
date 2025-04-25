import { BroToastify, BroToastifyToastifyOptions } from "./types";
import { createContainer, getContainer } from './container';
import { injectStyles } from "../dom/style";

injectStyles(); // Ensure styles are injected
//Default
const defaultOptions: Partial<BroToastifyToastifyOptions> = {
    type: 'default',
    duration: 3000,
    position: 'top-right',
    dismissible: true,
    pauseOnHover: true,
    customIcon: undefined,
    customClass: undefined,
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
export function createBroToastify(options: BroToastifyToastifyOptions): BroToastify {
    const mergedOptions = { ...defaultOptions, ...options };
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
            console.debug('Auto-dismissing toast with ID:', id);
            dismissBroTostify(id);
        }, mergedOptions.duration);
    }

    return BroToastify
}

//dismiss broToastify
export function dismissBroTostify(id: string): void {
    const BroToastify = broToastifys.get(id);
    if (BroToastify) {
        emit('dismissible', BroToastify);

        if (BroToastify.onClose) {
            BroToastify.onClose();
        }

        // Remove the toast element from the DOM
        const toastElement = document.getElementById(`bro-toastify-${id}`);
        if (toastElement) {
            toastElement.remove();
        }

        broToastifys.delete(id);
        console.debug('Toast dismissed:', id);
    }
}

//clear all broToastify
export function clearBroToastify(): void {
    const allBroToastifys = Array.from(broToastifys.values());
    allBroToastifys.forEach((BroToastify) => {
        dismissBroTostify(BroToastify.id);
    })
}


//subscribe to event
export function on(event: string, callback: Function): () => void {
    if (!listeners.has(event)) {
        listeners.set(event, []);
    }

    listeners.get(event)!.push(callback);

    //return unsubscribe function
    return () => {
        const callbacks = listeners.get(event);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index !== -1) {
                callbacks.splice(index, 1);
            }
        }
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
export const broToastify = {
    show: (message: string, options?: Partial<BroToastifyToastifyOptions>) =>
        createBroToastify({ message, type: 'show', ...options }),
    success: (message: string, options?: Partial<BroToastifyToastifyOptions>) =>
        createBroToastify({ message, type: 'success', ...options }),
    error: (message: string, options?: Partial<BroToastifyToastifyOptions>) =>
        createBroToastify({ message, type: 'error', ...options }),
    info: (message: string, options?: Partial<BroToastifyToastifyOptions>) =>
        createBroToastify({ message, type: 'info', ...options }),
    warning: (message: string, options?: Partial<BroToastifyToastifyOptions>) =>
        createBroToastify({ message, type: 'warning', ...options }),

    dismiss: dismissBroTostify,
    clearAll: clearBroToastify,
}


