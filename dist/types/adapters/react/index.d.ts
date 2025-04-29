import { Toaster } from './Toaster';
import type { BroToastifyToastifyOptions } from '../../core/types';
export { Toaster };
export declare const broToastify: () => {
    show: (message: string, options?: Partial<BroToastifyToastifyOptions>) => import("../../core/types").BroToastify | undefined;
    success: (message: string, options?: Partial<BroToastifyToastifyOptions>) => import("../../core/types").BroToastify | undefined;
    error: (message: string, options?: Partial<BroToastifyToastifyOptions>) => import("../../core/types").BroToastify | undefined;
    info: (message: string, options?: Partial<BroToastifyToastifyOptions>) => import("../../core/types").BroToastify | undefined;
    warning: (message: string, options?: Partial<BroToastifyToastifyOptions>) => import("../../core/types").BroToastify | undefined;
    loading: (message: string, options?: Partial<BroToastifyToastifyOptions>) => import("../../core/types").BroToastify | undefined;
    promises: (promise: Promise<any>, messages: {
        loading: string;
        success: string;
        error: string;
    }, options?: Partial<BroToastifyToastifyOptions>) => {
        id: string;
    } | undefined;
    isToastActive: (id: string) => boolean;
    dismiss: (id: string) => void;
    clearAll: () => void;
};
