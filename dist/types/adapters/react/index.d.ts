import React from 'react';
import toast from '../../core/bro-toastify';
import { BroToastify, BroToastifyToastifyOptions } from '../../core/types';
export declare const Toaster: React.FC<{
    position?: BroToastifyToastifyOptions['position'];
    newestOnTop?: any;
    dismissible?: any;
}>;
export declare const broToastify: () => {
    show: (message: string, options?: Partial<BroToastifyToastifyOptions>) => BroToastify | undefined;
    success: (message: string, options?: Partial<BroToastifyToastifyOptions>) => BroToastify | undefined;
    error: (message: string, options?: Partial<BroToastifyToastifyOptions>) => BroToastify | undefined;
    info: (message: string, options?: Partial<BroToastifyToastifyOptions>) => BroToastify | undefined;
    warning: (message: string, options?: Partial<BroToastifyToastifyOptions>) => BroToastify | undefined;
    loading: (message: string, options?: Partial<BroToastifyToastifyOptions>) => BroToastify | undefined;
    promises: (promise: Promise<any>, messages: {
        loading: string;
        success: string;
        error: string;
    }, options?: Partial<BroToastifyToastifyOptions>) => {
        id: string;
    } | undefined;
    isToastActive: (id: string) => boolean;
    dismiss: (id: string) => void;
    dismissible: (id: string) => void;
    clearAll: typeof import("../../core/bro-toastify").clearBroToastify;
};
export default toast;
