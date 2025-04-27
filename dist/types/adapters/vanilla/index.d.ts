import { BroToastify, BroToastifyToastifyOptions, BroToastifyContainerOptions } from '../../core/types';
import { injectStyles } from '../../dom/style';
/**
 * Initialize the vanilla JS adapter
 * @param options Default options for all toasts
 */
export { injectStyles };
export declare function init(options?: Partial<BroToastifyContainerOptions>): void;
export declare const toast: {
    show: (message: string, options?: Partial<BroToastifyToastifyOptions> | undefined) => BroToastify | undefined;
    success: (message: string, options?: Partial<BroToastifyToastifyOptions> | undefined) => BroToastify | undefined;
    error: (message: string, options?: Partial<BroToastifyToastifyOptions> | undefined) => BroToastify | undefined;
    info: (message: string, options?: Partial<BroToastifyToastifyOptions> | undefined) => BroToastify | undefined;
    warning: (message: string, options?: Partial<BroToastifyToastifyOptions> | undefined) => BroToastify | undefined;
    loading: (message: string, options?: Partial<BroToastifyToastifyOptions> | undefined) => BroToastify | undefined;
    promises: (promise: Promise<any>, message: {
        loading: string;
        success: string;
        error: string;
    }, options?: Partial<BroToastifyToastifyOptions> | undefined) => {
        id: string;
    } | undefined;
    isToastActive: (id: string) => boolean;
    dismiss: (id: string) => void;
    dismissible: (id: string) => void;
    clearAll: typeof import("../../core/bro-toastify").clearBroToastify;
};
