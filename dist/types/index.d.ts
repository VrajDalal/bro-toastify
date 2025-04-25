export * from './core/types';
import * as ReactAdapter from './adapters/react';
import * as AngularAdapter from './adapters/angular';
import * as VanillaAdapter from './adapters/vanilla/index';
export declare const React: typeof ReactAdapter;
export declare const Angular: typeof AngularAdapter;
export declare const Vanilla: {
    injectStyles: typeof VanillaAdapter.injectStyles;
    init(options?: Partial<import("./core/types").BroToastifyContainerOptions> | undefined): void;
    toast: {
        show: (message: string, options?: Partial<import("./core/types").BroToastifyToastifyOptions> | undefined) => import("./core/types").BroToastify;
        success: (message: string, options?: Partial<import("./core/types").BroToastifyToastifyOptions> | undefined) => import("./core/types").BroToastify;
        error: (message: string, options?: Partial<import("./core/types").BroToastifyToastifyOptions> | undefined) => import("./core/types").BroToastify;
        info: (message: string, options?: Partial<import("./core/types").BroToastifyToastifyOptions> | undefined) => import("./core/types").BroToastify;
        warning: (message: string, options?: Partial<import("./core/types").BroToastifyToastifyOptions> | undefined) => import("./core/types").BroToastify;
        dismiss: typeof import("./core/bro-toastify").dismissBroTostify;
        clearAll: typeof import("./core/bro-toastify").clearBroToastify;
    };
};
export { broToastify } from './core/bro-toastify';
