import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { on, dismissBroToastify } from '../../core/bro-toastify';
import type { BroToastify, BroToastifyToastifyOptions,BroToastifyContainerOptions } from '../../core/types';
import { injectStyles } from '../../dom/style';
import { applyAnimation, defaultAnimationOptions } from '../../core/animation';

export const Toaster = ({
  position = 'top-right',
  newestOnTop,
  dismissible,
  animation = 'fade',
}: {
  position?: BroToastifyToastifyOptions['position'];
  newestOnTop?: any;
  dismissible?: any;
  animation?: BroToastifyContainerOptions['animation'];

}) => {
  const [toasts, setToasts] = useState<BroToastify[]>([]);
  const [mounted, setMounted] = useState(false);
  const toastRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    setMounted(true);
    injectStyles();

    const createHandler = (toast: BroToastify) => {
      setToasts((prev) => (newestOnTop ? [toast, ...prev] : [...prev, toast]));
    };

    const dismissHandler = (toast: BroToastify) => {
      const element = toastRefs.current.get(toast.id);
      if (element) {
        applyAnimation(element, toast.animation || defaultAnimationOptions.default, false);
        element.addEventListener('animationend', () => {
          setToasts((prev) => prev.filter((t) => t.id !== toast.id));
          toastRefs.current.delete(toast.id);
        }, { once: true });
      } else {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }
    };

    const createListener = on('create', createHandler);
    const dismissListener = on('dismiss', dismissHandler);

    return () => {
      createListener.off();
      dismissListener.off();
    };
  }, [newestOnTop]);

  useEffect(() => {
    const timers = toasts.map((toast) => {
      if (toast.duration && toast.duration > 0) {
        return setTimeout(() => {
          dismissBroToastify(toast.id);
        }, toast.duration);
      }
      return null;
    });

    return () => {
      timers.forEach((timer) => timer && clearTimeout(timer));
    };
  }, [toasts]);

  useEffect(() => {
    toasts.forEach((toast) => {
      const element = toastRefs.current.get(toast.id);
      if (element && !element.dataset.animated) {
        applyAnimation(element, toast.animation || defaultAnimationOptions.default, true);
        element.dataset.animated = 'true';
      }
    });
  }, [toasts]);

  if (!mounted) return null;

  return createPortal(
    <div className={`broToastify-container broToastify-${position}`}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={`broToastify-${toast.id}`}
          className={`broToastify-notification broToastify-${toast.type} ${toast.customClass || ''}`}
          ref={(ele) => {
            if (ele) {
              toastRefs.current.set(toast.id, ele);
            } else {
              toastRefs.current.delete(toast.id);
            }
          }}
        >
          {toast.title && <div className="broToastify-title">{toast.title}</div>}
          {toast.type === 'loading' ? (
            <div className="broToastify-loader-container">
              <div className="broToastify-loader"></div>
              <div className="broToastify-loader-message">{toast.message}</div>
            </div>
          ) : (
            <div className="broToastify-message">{toast.message}</div>
          )}
          {dismissible && (
            <button
              className="broToastify-close"
              aria-label="Close"
              onClick={() => dismissBroToastify(toast.id)}
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>,
    document.body
  );
};

Toaster.displayName = 'Toaster';