"use client";

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { on, dismissBroToastify, setToasterAnimation } from '../../core/bro-toastify'; // Import 'on'
import type { BroToastify, BroToastifyContainerOptions } from '../../core/types';
import { injectStyles } from '../../dom/style';
import { applyAnimation, defaultAnimationOptions } from '../../core/animation';

export const Toaster = ({
    position = 'top-right',
    newestOnTop = true,
    dismissible = true,
    animation = 'fade',
}: {
    position?: BroToastify['position'];
    newestOnTop?: boolean;
    dismissible?: boolean;
    animation?: BroToastifyContainerOptions['animation'];
}) => {
    const [toasts, setToasts] = useState<BroToastify[]>([]);
    const [mounted, setMounted] = useState(false);
    const toastRefs = useRef<Map<string, HTMLElement>>(new Map());

    useEffect(() => {
        setMounted(true);
        injectStyles(); // Inject styles on the client
        setToasterAnimation(animation);

        const createHandler = (toast: BroToastify) => {
            // Apply Toaster's animation if toast.animation is undefined
            const updatedToast = {
                ...toast,
                animation: toast.animation || defaultAnimationOptions[animation],
            };
            setToasts((prev) => (newestOnTop ? [updatedToast, ...prev] : [...prev, updatedToast]));
        };

        const dismissHandler = (toast: BroToastify) => {
            const element = toastRefs.current.get(toast.id);
            if (element) {
                applyAnimation(element, toast.animation || defaultAnimationOptions[animation], false);
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
    }, [newestOnTop, animation]);

    useEffect(() => {
        const timers = toasts.map((toast) => {
            if (toast.duration && toast.duration > 0) {
                return setTimeout(() => {
                    dismissBroToastify(toast.id); // Call the server-safe dismiss function
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
                applyAnimation(element, toast.animation || defaultAnimationOptions[animation], true);
                element.dataset.animated = 'true';
            }
        });
    }, [toasts, animation]);

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
                    {dismissible && toast.type !== 'loading' && toast.type !== 'promises' && (
                        <button
                            className="broToastify-close"
                            aria-label="Close"
                            onClick={() => dismissBroToastify(toast.id)} // Call the server-safe dismiss
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