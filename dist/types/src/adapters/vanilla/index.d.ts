import { BroToastify, BroToastifyToastifyOptions, BroToastifyContainerOptions } from '../../core/types';
import { injectStyles } from '../../dom/style';
/**
 * Initialize the vanilla JS adapter
 * @param options Default options for all toasts
 */
export { injectStyles };
export declare function init(options?: Partial<BroToastifyContainerOptions>): () => void;
export declare const vanilla: {
    show: (message: string, options?: (Partial<BroToastifyToastifyOptions> & {
        containerOptions?: BroToastifyContainerOptions | undefined;
    }) | undefined) => BroToastify | undefined;
    default: (message: string, options?: (Partial<BroToastifyToastifyOptions> & {
        containerOptions?: BroToastifyContainerOptions | undefined;
    }) | undefined) => BroToastify | undefined;
    success: (message: string, options?: (Partial<BroToastifyToastifyOptions> & {
        containerOptions?: BroToastifyContainerOptions | undefined;
    }) | undefined) => BroToastify | undefined;
    error: (message: string, options?: (Partial<BroToastifyToastifyOptions> & {
        containerOptions?: BroToastifyContainerOptions | undefined;
    }) | undefined) => BroToastify | undefined;
    info: (message: string, options?: (Partial<BroToastifyToastifyOptions> & {
        containerOptions?: BroToastifyContainerOptions | undefined;
    }) | undefined) => BroToastify | undefined;
    warning: (message: string, options?: (Partial<BroToastifyToastifyOptions> & {
        containerOptions?: BroToastifyContainerOptions | undefined;
    }) | undefined) => BroToastify | undefined;
    loading: (message: string, options?: (Partial<BroToastifyToastifyOptions> & {
        containerOptions?: BroToastifyContainerOptions | undefined;
    }) | undefined) => {
        id: string;
    };
    promises: (promise: Promise<any>, message: {
        loading: string;
        success: string;
        error: string;
    }, options?: (Partial<BroToastifyToastifyOptions> & {
        containerOptions?: BroToastifyContainerOptions | undefined;
    }) | undefined) => {
        id: string;
    };
    isToastActive: (id: string) => boolean;
    dismiss: (idOrToast: string | BroToastify) => void;
    dismissible: (id: string) => void;
    clearAll: typeof import("../../core/bro-toastify").clearBroToastify;
};
