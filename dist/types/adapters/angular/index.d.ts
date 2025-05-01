import { BroToastify, BroToastifyToastifyOptions } from '../../core/types';
export declare class ToastService {
    constructor();
    show(message: string, options?: Partial<BroToastifyToastifyOptions>): BroToastify | undefined;
    success(message: string, options?: Partial<BroToastifyToastifyOptions>): BroToastify | undefined;
    error(message: string, options?: Partial<BroToastifyToastifyOptions>): BroToastify | undefined;
    info(message: string, options?: Partial<BroToastifyToastifyOptions>): BroToastify | undefined;
    warning(message: string, options?: Partial<BroToastifyToastifyOptions>): BroToastify | undefined;
    dismiss(id: string): void;
    clearAll(): void;
}
export declare class ToastContainerComponent {
    position: BroToastifyToastifyOptions['position'];
    newestOnTop: boolean;
    toasts: BroToastify[];
    private createUnsubscribe;
    private dismissUnsubscribe;
    ngOnInit(): void;
    ngOnDestroy(): void;
    handleDismiss(id: string): void;
}
export declare const angularToast: {
    show: (message: string, options?: (Partial<BroToastifyToastifyOptions> & {
        containerOptions?: import("../../core/types").BroToastifyContainerOptions | undefined;
    }) | undefined) => BroToastify | undefined;
    success: (message: string, options?: (Partial<BroToastifyToastifyOptions> & {
        containerOptions?: import("../../core/types").BroToastifyContainerOptions | undefined;
    }) | undefined) => BroToastify | undefined;
    error: (message: string, options?: (Partial<BroToastifyToastifyOptions> & {
        containerOptions?: import("../../core/types").BroToastifyContainerOptions | undefined;
    }) | undefined) => BroToastify | undefined;
    info: (message: string, options?: (Partial<BroToastifyToastifyOptions> & {
        containerOptions?: import("../../core/types").BroToastifyContainerOptions | undefined;
    }) | undefined) => BroToastify | undefined;
    warning: (message: string, options?: (Partial<BroToastifyToastifyOptions> & {
        containerOptions?: import("../../core/types").BroToastifyContainerOptions | undefined;
    }) | undefined) => BroToastify | undefined;
    loading: (message: string, options?: (Partial<BroToastifyToastifyOptions> & {
        containerOptions?: import("../../core/types").BroToastifyContainerOptions | undefined;
    }) | undefined) => void;
    promises: (promise: Promise<any>, message: {
        loading: string;
        success: string;
        error: string;
    }, options?: (Partial<BroToastifyToastifyOptions> & {
        containerOptions?: import("../../core/types").BroToastifyContainerOptions | undefined;
    }) | undefined) => {
        id: string;
    } | undefined;
    isToastActive: (id: string) => boolean;
    dismiss: (id: string) => void;
    dismissible: (id: string) => void;
    clearAll: typeof import("../../core/bro-toastify").clearBroToastify;
};
