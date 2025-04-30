export type AnimationType = 'fade' | 'top-slide' | 'right-slide' | 'bottom-slide' | 'left-slide' | 'zoom' | 'flip' | 'bounce' | 'none';
export interface AnimationOptions {
    type: AnimationType;
    duration: number;
    easing?: string;
    delay?: number;
}
export interface BroToastifyToastifyOptions {
    id?: string;
    type?: 'show' | 'success' | 'error' | 'info' | 'warning' | 'default' | 'loading' | 'promises' | 'dismiss';
    message: string;
    title?: string;
    duration?: number;
    position?: 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center';
    newestOnTop?: boolean;
    dismissible?: boolean;
    dismiss?: (id: string) => void;
    onClose?: () => void;
    onClick?: () => void;
    pauseOnHover?: boolean;
    customIcon?: string;
    customClass?: string;
    animation?: AnimationOptions;
}
export interface BroToastify extends BroToastifyToastifyOptions {
    id: string;
    createdAt: number;
}
export interface BroToastifyContainerOptions {
    maxToasts?: number;
    newestOnTop?: boolean;
    dismissible?: boolean;
    animation?: AnimationType | AnimationOptions;
}
