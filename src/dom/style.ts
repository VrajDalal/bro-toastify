import { getAnimationKeyframes } from '../core/animation';


export function getBroToastifyStyles(): string {
    return `
    .broToastify-container {
      position: fixed;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: 100%;
      max-height: 100vh;
      overflow-y: auto;
      pointer-events: none;
    }
    
    .broToastify-notification {
      position: relative;
      min-width: 300px;
      max-width: 500px;
      padding: 1rem;
      border-radius: 0.375rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      overflow: hidden;
      pointer-events: auto;
      display: flex;
      flex-direction: column;
    }
    
    .broToastify-success {
      background-color: #10B981;
      color: white;
    }
    
    .broToastify-error {
      background-color: #EF4444;
      color: white;
    }
    
    .broToastify-info {
      background-color: #3B82F6;
      color: white;
    }
    
    .broToastify-warning {
      background-color: #F59E0B;
      color: white;
    }
    
    .broToastify-title {
      font-weight: bold;
      margin-bottom: 0.25rem;
    }
    
    .broToastify-message {
      font-size: 0.875rem;
    }
    
    .broToastify-close {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: transparent;
      border: none;
      color: currentColor;
      font-size: 1.25rem;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.2s;
    }
    
    .broToastify-close:hover {
      opacity: 1;
      cursor: pointer;
    }
    
    
    .broToastify-paused .broToastify-progress {
      animation-play-state: paused;
    }
    
    /* Position-specific styles */
    .broToastify-top-right {
      top: 1rem;
      right: 1rem;
      align-items: flex-end;
    }
    
    .broToastify-top-left {
      top: 1rem;
      left: 1rem;
      align-items: flex-start;
    }
    
    .broToastify-bottom-right {
      bottom: 1rem;
      right: 1rem;
      align-items: flex-end;
    }
    
    .broToastify-bottom-left {
      bottom: 1rem;
      left: 1rem;
      align-items: flex-start;
    }
    
    .broToastify-top-center {
      top: 1rem;
      left: 50%;
      transform: translateX(-50%);
      align-items: center;
    }
    
    .broToastify-bottom-center {
      bottom: 1rem;
      left: 50%;
      transform: translateX(-50%);
      align-items: center;
    }
    
    /* Animation keyframes */
    ${getAnimationKeyframes('fade')}
    ${getAnimationKeyframes('slide', 'top')}
    ${getAnimationKeyframes('zoom')}
    
    /* Responsive styles */
    @media (max-width: 576px) {
      .broToastify-container {
        width: 100%;
        padding: 0 1rem;
      }
      
      .broToastify-notification {
        min-width: 100%;
        max-width: 100%;
      }
      
      .broToastify-top-center,
      .broToastify-top-right,
      .broToastify-top-left {
        top: 0;
        right: 0;
        left: 0;
        transform: none;
      }
      
      .broToastify-bottom-center,
      .broToastify-bottom-right,
      .broToastify-bottom-left {
        bottom: 0;
        right: 0;
        left: 0;
        transform: none;
      }
    }
  `;
}

export function injectStyles(): void {
  console.debug('injectStyles function called'); // Log when the function is called

  // Check if styles are already injected
  if (document.getElementById('broToastify-styles')) {
      console.debug('Styles are already injected'); // Log if styles are already present
      return;
  }

  // Create style element
  const styleElement = document.createElement('style');
  console.debug('Creating style element:', styleElement); // Log the created style element

  styleElement.id = 'broToastify-styles';
  styleElement.textContent = getBroToastifyStyles();
  console.debug('Generated styles:', styleElement.textContent); // Log the generated CSS content

  // Append to head
  if (document.head) {
      document.head.appendChild(styleElement);
      console.debug('Style element appended to head'); // Log when the style element is appended
  } else {
      console.error('document.head is not available'); // Log an error if document.head is missing
  }
}