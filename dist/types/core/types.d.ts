export interface BroToastifyToastifyOptions {
    type?: 'show' | 'success' | 'error' | 'info' | 'warning' | 'default' | 'loading' | 'promises';
    message: string;
    title?: string;
    duration?: number;
    position?: 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center';
    dismissible?: boolean;
    onClose?: () => void;
    onClick?: () => void;
    pauseOnHover?: boolean;
    customIcon?: string;
    customClass?: string;
}
export interface BroToastify extends BroToastifyToastifyOptions {
    id: string;
    createdAt: number;
}
export interface BroToastifyContainerOptions {
    maxToasts?: number;
    newestOnTop?: boolean;
}
