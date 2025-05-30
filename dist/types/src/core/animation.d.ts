import { AnimationType, AnimationOptions } from './types';
export declare const defaultAnimationOptions: Record<string, AnimationOptions>;
export declare function getAnimationKeyframes(type: AnimationType): void;
export declare function applyAnimation(element: HTMLElement, options?: AnimationOptions, isEnter?: boolean): void;
