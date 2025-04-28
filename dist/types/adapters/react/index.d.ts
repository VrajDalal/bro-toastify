import React from "react";
import type { BroToastify, BroToastifyToastifyOptions } from "../../core/types";
export declare const Toaster: React.FC<{
    position?: BroToastifyToastifyOptions["position"];
    newestOnTop?: boolean;
    dismissible?: boolean;
}>;
export declare const ClientToaster: {
    ({ position, newestOnTop, dismissible }: {
        position?: string | undefined;
        newestOnTop?: boolean | undefined;
        dismissible?: boolean | undefined;
    }): React.JSX.Element;
    displayName: string;
    toString(): string;
};
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
export default toast;
