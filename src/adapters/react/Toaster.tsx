"use client";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { on, dismissBroToastify } from "../../core/bro-toastify";
import type { BroToastify } from "../../core/types";

export const Toaster: React.FC<{
  position?: "top-right" | "top-left" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
  newestOnTop?: boolean;
  dismissible?: boolean;
}> = ({ position = "top-right", newestOnTop = false, dismissible = true }) => {
  const [toasts, setToasts] = useState<BroToastify[]>([]);

  useEffect(() => {
    const createHandler = (toast: BroToastify) => {
      setToasts((prev) => (newestOnTop ? [toast, ...prev] : [...prev, toast]));
    };

    const dismissHandler = (id: string) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const createListener = on("create", createHandler);
    const dismissListener = on("dismiss", dismissHandler);

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

  if (typeof window === "undefined") return null;

  return ReactDOM.createPortal(
    <div className={`broToastify-container broToastify-${position}`}>
      {toasts.map((toast) => (
        <div key={toast.id} id={`broToastify-${toast.id}`} className={`broToastify-notification broToastify-${toast.type}`}>
          <div className="broToastify-title">{toast.title || ""}</div>
          <div className="broToastify-message">{toast.message}</div>
          {dismissible && (
            <button className="broToastify-close" aria-label="Close" onClick={() => dismissBroToastify(toast.id)}>
              ×
            </button>
          )}
        </div>
      ))}
    </div>,
    document.body
  );
};