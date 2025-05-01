import { BroToastify, BroToastifyToastifyOptions, BroToastifyContainerOptions } from "./types";
import { AnimationType } from "./types";
export declare function setToasterAnimation(animation: AnimationType): void;
export declare function createBroToastify(options: BroToastifyToastifyOptions & {
    containerOptions?: BroToastifyContainerOptions;
}): BroToastify | undefined;
export declare function dismissBroToastify(id: string): void;
export declare function clearBroToastify(): void;
export declare function on(event: string, callback: Function): {
    off: () => void;
};
declare const toast: {
    show: (message: string, options?: Partial<BroToastifyToastifyOptions> & {
        containerOptions?: BroToastifyContainerOptions;
    }) => BroToastify | undefined;
    success: (message: string, options?: Partial<BroToastifyToastifyOptions> & {
        containerOptions?: BroToastifyContainerOptions;
    }) => BroToastify | undefined;
    error: (message: string, options?: Partial<BroToastifyToastifyOptions> & {
        containerOptions?: BroToastifyContainerOptions;
    }) => BroToastify | undefined;
    info: (message: string, options?: Partial<BroToastifyToastifyOptions> & {
        containerOptions?: BroToastifyContainerOptions;
    }) => BroToastify | undefined;
    warning: (message: string, options?: Partial<BroToastifyToastifyOptions> & {
        containerOptions?: BroToastifyContainerOptions;
    }) => BroToastify | undefined;
    loading: (message: string, options?: Partial<BroToastifyToastifyOptions> & {
        containerOptions?: BroToastifyContainerOptions;
    }) => {
        id: string;
    };
    promises: (promise: Promise<any>, message: {
        loading: string;
        success: string;
        error: string;
    }, options?: Partial<BroToastifyToastifyOptions> & {
        containerOptions?: BroToastifyContainerOptions;
    }) => {
        id: string;
    } | undefined;
    isToastActive: (id: string) => boolean;
    dismiss: (id: string) => void;
    dismissible: (id: string) => void;
    clearAll: typeof clearBroToastify;
};
export default toast;
