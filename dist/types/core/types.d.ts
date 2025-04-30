export type AnimationType = 'fade' | 'slide' | 'zoom' | 'flip' | 'bounce' | 'none' | 'custom';
export type AnimationDirection = 'top' | 'right' | 'bottom' | 'left';
export interface AnimationOptions {
    type: AnimationType;
    duration: number;
    direction?: AnimationDirection;
    easing?: string;
    delay?: number;
    customKeyframes?: {
        in: string;
        out: string;
    };
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
