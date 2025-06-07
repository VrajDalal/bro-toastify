import { BroToastify, BroToastifyToastifyOptions, BroToastifyContainerOptions } from "./types";
import { AnimationType } from "./types";
import '../index.css';
export declare function setToasterAnimation(animation: AnimationType): void;
export declare function pauseTimer(id: string): void;
export declare function resumeTimer(id: string, duration: number): void;
export declare function createBroToastify(options: BroToastifyToastifyOptions & {
    containerOptions?: BroToastifyContainerOptions;
}): BroToastify | undefined;
export declare function dismissBroToastify(idOrToast: string | BroToastify): void;
export declare function clearBroToastify(): void;
export declare function on(event: string, callback: Function): {
    off: () => void;
};
export declare function createContainer(position: BroToastifyToastifyOptions['position']): HTMLElement | null;
export declare function getContainer(position: BroToastifyToastifyOptions["position"]): HTMLElement | null;
export declare function removeAllContainers(): void;
declare const toast: {
    show: (message: string, options?: Partial<BroToastifyToastifyOptions> & {
        containerOptions?: BroToastifyContainerOptions;
    }) => BroToastify | undefined;
    default: (message: string, options?: Partial<BroToastifyToastifyOptions> & {
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
    };
    isToastActive: (id: string) => boolean;
    dismiss: (idOrToast: string | BroToastify) => void;
    dismissible: (id: string) => void;
    clearAll: typeof clearBroToastify;
};
export default toast;
