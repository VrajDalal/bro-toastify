import React from 'react';
import { BroToastify, BroToastifyToastifyOptions } from '../../core/types';
export declare const ToastContainer: React.FC<{
    position?: BroToastifyToastifyOptions['position'];
    newestOnTop?: boolean;
}>;
export declare const broToastify: () => {
    show: (message: string, options?: Partial<BroToastifyToastifyOptions>) => BroToastify;
    success: (message: string, options?: Partial<BroToastifyToastifyOptions>) => BroToastify;
    error: (message: string, options?: Partial<BroToastifyToastifyOptions>) => BroToastify;
    info: (message: string, options?: Partial<BroToastifyToastifyOptions>) => BroToastify;
    warning: (message: string, options?: Partial<BroToastifyToastifyOptions>) => BroToastify;
    dismissible: typeof import("../../core/bro-toastify").dismissBroTostify;
    clearAll: typeof import("../../core/bro-toastify").clearBroToastify;
};
export declare const toast: {
    show: (message: string, options?: Partial<BroToastifyToastifyOptions> | undefined) => BroToastify;
    success: (message: string, options?: Partial<BroToastifyToastifyOptions> | undefined) => BroToastify;
    error: (message: string, options?: Partial<BroToastifyToastifyOptions> | undefined) => BroToastify;
    info: (message: string, options?: Partial<BroToastifyToastifyOptions> | undefined) => BroToastify;
    warning: (message: string, options?: Partial<BroToastifyToastifyOptions> | undefined) => BroToastify;
    dismissible: typeof import("../../core/bro-toastify").dismissBroTostify;
    clearAll: typeof import("../../core/bro-toastify").clearBroToastify;
};
