/// <reference types="svelte" />
import { BroToastify, BroToastifyToastifyOptions } from '../../core/types';
export declare const toasts: import("svelte/store").Writable<Map<string, BroToastify>>;
export declare const toast: {
    show: (message: string, options?: Partial<BroToastifyToastifyOptions>) => BroToastify;
    success: (message: string, options?: Partial<BroToastifyToastifyOptions>) => BroToastify;
    error: (message: string, options?: Partial<BroToastifyToastifyOptions>) => BroToastify;
    info: (message: string, options?: Partial<BroToastifyToastifyOptions>) => BroToastify;
    warning: (message: string, options?: Partial<BroToastifyToastifyOptions>) => BroToastify;
    dismissible: typeof import("../../core/bro-toastify").dismissBroTostify;
    clearAll: typeof import("../../core/bro-toastify").clearBroToastify;
};
export declare const ToastContainer: {};
