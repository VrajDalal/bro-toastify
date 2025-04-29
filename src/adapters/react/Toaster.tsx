import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { on, dismissBroToastify } from '../../core/bro-toastify';
import type { BroToastify, BroToastifyToastifyOptions } from '../../core/types';
import { injectStyles } from '../../dom/style';

export const Toaster = ({
  position = 'top-right',
  newestOnTop = false,
  dismissible = true,
}: {
  position?: BroToastifyToastifyOptions['position'];
  newestOnTop?: boolean;
  dismissible?: boolean;
}) => {
  const [toasts, setToasts] = useState<BroToastify[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    injectStyles();

    const createHandler = (toast: BroToastify) => {
      setToasts((prev) => (newestOnTop ? [toast, ...prev] : [...prev, toast]));
    };

    const dismissHandler = (toast: BroToastify) => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
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

  if (!mounted) return null;

  return createPortal(
    <div className={`broToastify-container broToastify-${position}`}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={`broToastify-${toast.id}`}
          className={`broToastify-notification broToastify-${toast.type}`}
        >
          {toast.title && <div className="broToastify-title">{toast.title}</div>}
          <div className="broToastify-message">{toast.message}</div>
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