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

export function getAnimationKeyframes(type: AnimationType): string {  
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

    case 'top-slide':
      return `
        @keyframes broToastify-top-slide-in {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes broToastify-top-slide-out {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(-100%); opacity: 0; }
        }
      `;

    case 'right-slide':
      return `
        @keyframes broToastify-right-slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes broToastify-right-slide-out {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;

    case 'bottom-slide':
      return `
        @keyframes broToastify-bottom-slide-in {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes broToastify-bottom-slide-out {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(100%); opacity: 0; }
        }
      `;

    case 'left-slide':
      return `
        @keyframes broToastify-left-slide-in {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes broToastify-left-slide-out {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(-100%); opacity: 0; }
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
  const { type, duration, easing, delay } = options;

  if (type === 'none') return;

  const animationName = `broToastify-${type}-${isEnter ? 'in' : 'out'}`;

  element.style.animation = `${animationName} ${duration}ms ${easing} ${delay ? `${delay}ms` : ''} forwards`;

  // Clean up after animation completes
  element.addEventListener('animationend', () => {
    element.style.animation = '';
  }, { once: true });
}