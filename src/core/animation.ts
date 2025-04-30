import { AnimationType, AnimationDirection, AnimationOptions } from './types';

export const defaultAnimationOptions: Record<string, AnimationOptions> = {
  default: { type: 'fade', duration: 300, easing: 'ease' },
  success: { type: 'fade', duration: 300, easing: 'ease' },
  error: { type: 'slide', duration: 400, direction: 'right', easing: 'ease-in-out' },
  info: { type: 'zoom', duration: 350, easing: 'ease' },
  warning: { type: 'bounce', duration: 500, easing: 'ease-out' },
  loading: { type: 'slide', duration: 300, direction: 'top', easing: 'ease' },
  show: { type: 'fade', duration: 300, easing: 'ease' },
};

export function getAnimationKeyframes(type: AnimationType, direction?: AnimationDirection, customKeyframes?: AnimationOptions['customKeyframes']): string {
  if (type === 'custom' && customKeyframes) {
    return `
      ${customKeyframes.in}
      ${customKeyframes.out}
    `;
  }
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
  options: AnimationOptions = defaultAnimationOptions.default,
  isEnter: boolean = true
): void {
  const { type, duration, easing, delay, customKeyframes } = options;

  if (type === 'none') return;

  const animationName = type === 'custom' && customKeyframes
    ? (isEnter ? 'custom-in' : 'custom-out')
    : `broToastify-${type}-${isEnter ? 'in' : 'out'}`;

  element.style.animation = `${animationName} ${duration}ms ${easing} ${delay ? `${delay}ms` : ''} forwards`;

  // Clean up after animation completes
  element.addEventListener('animationend', () => {
    element.style.animation = '';
  }, { once: true });
}
