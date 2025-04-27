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
      padding: 1rem;
    }
    
    .broToastify-notification {
      position: relative;
      min-width: 300px;
      max-width: 500px;
      padding: 1rem;
      border-radius: 0.375rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      opacity: 1 !important;
      visibility: visible !important;
    }

    .broToastify-default {
      background-color: rgb(240, 241, 240);
      color: #333;
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

    .broToastify-loader-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }   

    .broToastify-loader {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      animation: spin 1s linear infinite;
    }

    .broToastify-loader-message {
      font-size: 0.875rem;
      color: #333;
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes fadeIn {
      0% { opacity: 0; transform: translateY(-10px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    
    .broToastify-title {
      font-weight: bold;
      margin-bottom: 0.25rem;
      font-size: 1rem;
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
    }
    
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
    
    ${getAnimationKeyframes('fade')}
    ${getAnimationKeyframes('slide', 'top')}
    ${getAnimationKeyframes('zoom')}
    
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

let stylesInjected = false;

export function injectStyles() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    console.log('injectStyles skipped: server-side');
    return;
  }

  if (stylesInjected) {
    console.log('injectStyles skipped: already injected');
    return;
  }

  stylesInjected = true;

  const style = document.createElement('style');
  style.id = 'broToastify-styles';
  style.innerHTML = getBroToastifyStyles();
  document.head.appendChild(style);
  console.log('injectStyles: styles injected successfully');
}