import { BroToastify, BroToastifyToastifyOptions } from "./types";
export declare function createBroToastify(options: BroToastifyToastifyOptions): BroToastify;
export declare function dismissBroTostify(id: string): void;
export declare function clearBroToastify(): void;
export declare function on(event: string, callback: Function): () => void;
export declare const broToastify: {
    show: (message: string, options?: Partial<BroToastifyToastifyOptions>) => BroToastify;
    success: (message: string, options?: Partial<BroToastifyToastifyOptions>) => BroToastify;
    error: (message: string, options?: Partial<BroToastifyToastifyOptions>) => BroToastify;
    info: (message: string, options?: Partial<BroToastifyToastifyOptions>) => BroToastify;
    warning: (message: string, options?: Partial<BroToastifyToastifyOptions>) => BroToastify;
    dismiss: typeof dismissBroTostify;
    clearAll: typeof clearBroToastify;
};
