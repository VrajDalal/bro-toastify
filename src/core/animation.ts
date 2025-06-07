import { AnimationType, AnimationOptions } from './types';

export const defaultAnimationOptions: Record<string, AnimationOptions> = {
  default: { type: 'fade', duration: 300, easing: 'ease' },
  success: { type: 'fade', duration: 300, easing: 'ease' },
  error: { type: 'fade', duration: 300, easing: 'ease' },
  info: { type: 'fade', duration: 300, easing: 'ease' },
  warning: { type: 'fade', duration: 500, easing: 'ease' },
  loading: { type: 'fade', duration: 300, easing: 'ease' },
  show: { type: 'fade', duration: 300, easing: 'ease' },
  promises: { type: 'fade', duration: 300, easing: 'ease' },
  fade: { type: 'fade', duration: 300, easing: 'ease' },
  'top-slide': { type: 'top-slide', duration: 300, easing: 'ease' },
  'right-slide': { type: 'right-slide', duration: 300, easing: 'ease' },
  'bottom-slide': { type: 'bottom-slide', duration: 300, easing: 'ease' },
  'left-slide': { type: 'left-slide', duration: 300, easing: 'ease' },
  zoom: { type: 'zoom', duration: 300, easing: 'ease' },
  flip: { type: 'flip', duration: 300, easing: 'ease' },
  bounce: { type: 'bounce', duration: 300, easing: 'ease' },
  none: { type: 'none', duration: 0, easing: 'ease' },
};

export function getAnimationKeyframes(type: AnimationType): void {

}

export function applyAnimation(
  element: HTMLElement,
  options: AnimationOptions = defaultAnimationOptions.default,
  isEnter: boolean = true
): void {
  const { type } = options;

  if (type === 'none') return;

  // Map animation type to Tailwind class
  const animationClasses: Record<AnimationType, string> = {
    fade: 'animate-fade',
    'top-slide': isEnter ? 'animate-topSlide' : 'animate-topSlideReverse',
    'right-slide': isEnter ? 'animate-rightSlide' : 'animate-rightSlideReverse',
    'bottom-slide': isEnter ? 'animate-bottomSlide' : 'animate-bottomSlideReverse',
    'left-slide': isEnter ? 'animate-leftSlide' : 'animate-leftSlideReverse',
    zoom: 'animate-zoom',
    flip: 'animate-flip',
    bounce: 'animate-bounce',
    none: '',
  };

  // Add reverse animations for smooth dismissal
  // const style = document.createElement('style');
  // style.textContent = `
  //   .animate-topSlideReverse {
  //     animation: topSlideReverse 0.3s ease-in-out forwards;
  //   }
  //   @keyframes topSlideReverse {
  //     from { transform: translateY(0); opacity: 1; }
  //     to { transform: translateY(-100%); opacity: 0; }
  //   }
  //   .animate-rightSlideReverse {
  //     animation: rightSlideReverse 0.3s ease-in-out forwards;
  //   }
  //   @keyframes rightSlideReverse {
  //     from { transform: translateX(0); opacity: 1; }
  //     to { transform: translateX(100%); opacity: 0; }
  //   }
  //   .animate-bottomSlideReverse {
  //     animation: bottomSlideReverse 0.3s ease-in-out forwards;
  //   }
  //   @keyframes bottomSlideReverse {
  //     from { transform: translateY(0); opacity: 1; }
  //     to { transform: translateY(100%); opacity: 0; }
  //   }
  //   .animate-leftSlideReverse {
  //     animation: leftSlideReverse 0.3s ease-in-out forwards;
  //   }
  //   @keyframes leftSlideReverse {
  //     from { transform: translateX(0); opacity: 1; }
  //     to { transform: translateX(-100%); opacity: 0; }
  //   }
  // `;
  // document.head.appendChild(style);

  const animationClass = animationClasses[type];
  if (animationClass) {
    element.classList.add(animationClass);
    element.addEventListener(
      'animationend',
      () => {
        element.classList.remove(animationClass);
      },
      { once: true }
    )
  }
}