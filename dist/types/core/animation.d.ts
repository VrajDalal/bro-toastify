export type AnimationType = 'fade' | 'slide' | 'zoom' | 'flip' | 'bounce' | 'none';
export type AnimationDirection = 'top' | 'right' | 'bottom' | 'left';
export interface AnimationOptions {
    type: AnimationType;
    duration: number;
    direction?: AnimationDirection;
    easing?: string;
}
export declare const defaultAnimationOptions: AnimationOptions;
export declare function getAnimationKeyframes(type: AnimationType, direction?: AnimationDirection): string;
export declare function applyAnimation(element: HTMLElement, options?: AnimationOptions, isEnter?: boolean): void;
