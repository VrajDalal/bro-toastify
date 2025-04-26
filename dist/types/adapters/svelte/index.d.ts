/// <reference types="svelte" />
import { BroToastify, BroToastifyToastifyOptions } from '../../core/types';
export declare const toasts: import("svelte/store").Writable<Map<string, BroToastify>>;
export declare const toast: {
    show: (message: string, options?: Partial<BroToastifyToastifyOptions>) => BroToastify | undefined;
    success: (message: string, options?: Partial<BroToastifyToastifyOptions>) => BroToastify | undefined;
    error: (message: string, options?: Partial<BroToastifyToastifyOptions>) => BroToastify | undefined;
    info: (message: string, options?: Partial<BroToastifyToastifyOptions>) => BroToastify | undefined;
    warning: (message: string, options?: Partial<BroToastifyToastifyOptions>) => BroToastify | undefined;
    dismissible: (id: string) => void;
    clearAll: typeof import("../../core/bro-toastify").clearBroToastify;
};
export declare const ToastContainer: {};
