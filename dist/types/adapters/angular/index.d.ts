import { BroToastify, BroToastifyToastifyOptions } from '../../core/types';
export declare class ToastService {
    constructor();
    show(message: string, options?: Partial<BroToastifyToastifyOptions>): BroToastify;
    success(message: string, options?: Partial<BroToastifyToastifyOptions>): BroToastify;
    error(message: string, options?: Partial<BroToastifyToastifyOptions>): BroToastify;
    info(message: string, options?: Partial<BroToastifyToastifyOptions>): BroToastify;
    warning(message: string, options?: Partial<BroToastifyToastifyOptions>): BroToastify;
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
export declare const toast: {
    show: (message: string, options?: Partial<BroToastifyToastifyOptions> | undefined) => BroToastify;
    success: (message: string, options?: Partial<BroToastifyToastifyOptions> | undefined) => BroToastify;
    error: (message: string, options?: Partial<BroToastifyToastifyOptions> | undefined) => BroToastify;
    info: (message: string, options?: Partial<BroToastifyToastifyOptions> | undefined) => BroToastify;
    warning: (message: string, options?: Partial<BroToastifyToastifyOptions> | undefined) => BroToastify;
    loading: (message: string, options?: Partial<BroToastifyToastifyOptions> | undefined) => BroToastify;
    promises: (promise: Promise<any>, message: {
        loading: string;
        success: string;
        error: string;
    }, options?: Partial<BroToastifyToastifyOptions> | undefined) => void;
    isToastActive: (id: string) => boolean;
    dismiss: (id: string) => void;
    dismissible: (id: string) => void;
    clearAll: typeof import("../../core/bro-toastify").clearBroToastify;
};
