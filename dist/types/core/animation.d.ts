import { AnimationType, AnimationDirection, AnimationOptions } from './types';
export declare const defaultAnimationOptions: Record<string, AnimationOptions>;
export declare function getAnimationKeyframes(type: AnimationType, direction?: AnimationDirection, customKeyframes?: AnimationOptions['customKeyframes']): string;
export declare function applyAnimation(element: HTMLElement, options?: AnimationOptions, isEnter?: boolean): void;
