import coreToast from "../../core/bro-toastify";
import type { BroToastifyToastifyOptions } from "../../core/types";
import type { BroToastify } from "../../core/types";
export { Toaster } from "./Toaster";
export { default as toast } from "../../core/bro-toastify";
export default coreToast;
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
    clearAll: () => void;
};
