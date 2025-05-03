import { Toaster } from './Toaster';
import coreToast from '../../core/bro-toastify';
import type { BroToastifyToastifyOptions } from '../../core/types';

export { Toaster };

export const broToastify = () => ({
    show: (
        message: string,
        options?: Partial<BroToastifyToastifyOptions>) =>
        coreToast.show(message, options),
    success: (
        message: string,
        options?: Partial<BroToastifyToastifyOptions>) =>
        coreToast.success(message, options),
    error: (
        message: string,
        options?: Partial<BroToastifyToastifyOptions>) =>
        coreToast.error(message, options),
    info: (
        message: string,
        options?: Partial<BroToastifyToastifyOptions>) =>
        coreToast.info(message, options),
    warning: (
        message: string,
        options?: Partial<BroToastifyToastifyOptions>) =>
        coreToast.warning(message, options),
    loading: (
        message: string,
        options?: Partial<BroToastifyToastifyOptions>) =>
        coreToast.loading(message, options),
    promises: (
        promise: Promise<any>,
        messages: { loading: string; success: string; error: string },
        options?: Partial<BroToastifyToastifyOptions>
    ) => coreToast.promises(promise, messages, options),
    isToastActive: (id: string) => coreToast.isToastActive(id),
    dismiss: (id: string) => coreToast.dismiss(id),
    clearAll: () => coreToast.clearAll(),
});
