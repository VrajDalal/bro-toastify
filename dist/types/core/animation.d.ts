import { AnimationType, AnimationDirection, AnimationOptions } from './types';
export declare const defaultAnimationOptions: AnimationOptions;
export declare function getAnimationKeyframes(type: AnimationType, direction?: AnimationDirection): string;
export declare function applyAnimation(element: HTMLElement, options?: AnimationOptions, isEnter?: boolean): void;
