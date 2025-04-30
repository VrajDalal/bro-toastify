import { AnimationType, AnimationDirection, AnimationOptions } from './types';

export const defaultAnimationOptions: AnimationOptions = {
  type: 'fade',
  duration: 300,
  easing: 'ease'
};

export function getAnimationKeyframes(type: AnimationType, direction?: AnimationDirection): string {
  switch (type) {
    case 'fade':
      return `
        @keyframes broToastify-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes broToastify-fade-out {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `;

    case 'slide':
      let translateFrom = 'translateY(-100%)';
      let translateTo = 'translateY(0)';

      if (direction === 'right') {
        translateFrom = 'translateX(100%)';
        translateTo = 'translateX(0)';
      } else if (direction === 'bottom') {
        translateFrom = 'translateY(100%)';
        translateTo = 'translateY(0)';
      } else if (direction === 'left') {
        translateFrom = 'translateX(-100%)';
        translateTo = 'translateX(0)';
      }

      return `
        @keyframes broToastify-slide-in {
          from { transform: ${translateFrom}; opacity: 0; }
          to { transform: ${translateTo}; opacity: 1; }
        }
        @keyframes broToastify-slide-out {
          from { transform: ${translateTo}; opacity: 1; }
          to { transform: ${translateFrom}; opacity: 0; }
        }
      `;

    case 'zoom':
      return `
        @keyframes broToastify-zoom-in {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes broToastify-zoom-out {
          from { transform: scale(1); opacity: 1; }
          to { transform: scale(0.5); opacity: 0; }
        }
      `;

    case 'flip':
      return `
        @keyframes broToastify-flip-in {
          from { transform: perspective(400px) rotateX(90deg); opacity: 0; }
          to { transform: perspective(400px) rotateX(0deg); opacity: 1; }
        }
        @keyframes broToastify-flip-out {
          from { transform: perspective(400px) rotateX(0deg); opacity: 1; }
          to { transform: perspective(400px) rotateX(90deg); opacity: 0; }
        }
      `;

    case 'bounce':
      return `
        @keyframes broToastify-bounce-in {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes broToastify-bounce-out {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(0.5); opacity: 0; }
        }
      `;

    case 'none':
    default:
      return '';
  }
}


export function applyAnimation(
  element: HTMLElement,
  options: AnimationOptions = defaultAnimationOptions,
  isEnter: boolean = true
): void {
  const { type, duration, easing } = options;

  if (type === 'none') return;

  const animationName = `broToastify-${type}-${isEnter ? 'in' : 'out'}`;

  element.style.animation = `${animationName} ${duration}ms ${easing} forwards`;

  // Clean up after animation completes
  element.addEventListener('animationend', () => {
    element.style.animation = '';
  }, { once: true });
}
