"use client";

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { on, dismissBroToastify, setToasterAnimation } from '../../core/bro-toastify'; // Import 'on'
import type { BroToastify, BroToastifyContainerOptions } from '../../core/types';
import { applyAnimation, defaultAnimationOptions } from '../../core/animation';
import '../../index.css'

export const Toaster = ({
    position = 'top-right',
    newestOnTop = true,
    dismissible = false,
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
    const timerRefs = useRef<Map<string, number | null>>(new Map());

    useEffect(() => {
        setMounted(true);
        // injectStyles(); // Inject styles on the client
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
                    timerRefs.current.delete(toast.id);
                }, { once: true });
            } else {
                setToasts((prev) => prev.filter((t) => t.id !== toast.id));
                timerRefs.current.delete(toast.id);
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
            if (toast.duration && toast.duration > 0 && toast.type !== 'loading') {
                const timer = setTimeout(() => {
                    dismissBroToastify(toast.id);
                }, toast.duration);
                timerRefs.current.set(toast.id, timer);
                return timer;
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

    const handleMouseEnter = (toastId: string) => {
        const timer = timerRefs.current.get(toastId);
        if (timer) {
            clearTimeout(timer);
            timerRefs.current.set(toastId, null);
        }
    };

    const handleMouseLeave = (toastId: string) => {
        const toast = toasts.find((t) => t.id === toastId);
        if (toast && toast.duration && toast.duration > 0 && toast.type !== 'loading') {
            const timer = setTimeout(() => {
                dismissBroToastify(toastId);
            }, toast.duration);
            timerRefs.current.set(toastId, timer);
        }
    };

    if (!mounted) return null;

    // Map position to Tailwind classes
    const positionClasses = {
        'top-right': 'top-4 right-4 items-end',
        'top-left': 'top-4 left-4 items-start',
        'bottom-right': 'bottom-4 right-4 items-end',
        'bottom-left': 'bottom-4 left-4 items-start',
        'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
        'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
    };

    // Map toast type to Tailwind classes for macOS theme
    const typeClasses: Record<NonNullable<BroToastify['type']>, string> = {
        default: 'bg-white/80 backdrop-blur-md border border-gray-200 text-gray-900',
        success: 'bg-green-500/90 backdrop-blur-md border border-green-600 text-white',
        error: 'bg-red-500/90 backdrop-blur-md border border-red-600 text-white',
        info: 'bg-blue-500/90 backdrop-blur-md border border-blue-600 text-white',
        warning: 'bg-yellow-500/90 backdrop-blur-md border border-yellow-600 text-white',
        loading: 'bg-white/80 backdrop-blur-md border border-gray-200 text-gray-900',
        promises: 'bg-white/80 backdrop-blur-md border border-gray-200 text-gray-900',
        show: 'bg-white/80 backdrop-blur-md border border-gray-200 text-gray-900',
        dismiss: 'bg-white/80 backdrop-blur-md border border-gray-200 text-gray-900',
    };

    return createPortal(
        <div className={`fixed z-[9999] flex flex-col gap-3 max-w-full max-h-screen overflow-y-auto p-4 font-sans ${positionClasses[position]}`}>
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    id={`toast-${toast.id}`}
                    className={`relative min-w-[300px] max-w-[500px] p-4 rounded-xl shadow-md flex flex-col opacity-100 transition-all duration-300 hover:scale-105 hover:shadow-lg ${typeClasses[toast.type ?? 'default']} ${toast.customClass || ''}`}
                    ref={(ele) => {
                        if (ele) {
                            toastRefs.current.set(toast.id, ele);
                        } else {
                            toastRefs.current.delete(toast.id);
                        }
                    }}
                    onMouseEnter={() => handleMouseEnter(toast.id)}
                    onMouseLeave={() => handleMouseLeave(toast.id)}
                >
                    {toast.title && (
                        <div className="font-semibold text-base mb-1.5 tracking-tight">
                            {toast.title}
                        </div>
                    )}
                    {toast.type === 'loading' ? (
                        <div className="flex items-center gap-3">
                            <div className="border-4 border-gray-200 border-t-blue-500 rounded-full w-5 h-5 animate-spin" />
                            <div className="text-sm text-gray-900 animate-[fade_0.3s_ease-in-out]">
                                {toast.message}
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm tracking-tight">{toast.message}</div>
                    )}
                    {dismissible && toast.type !== 'loading' && toast.type !== 'promises' && (
                        <button
                            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-200/50 text-gray-600 text-sm font-semibold hover:bg-gray-300/70 hover:text-gray-900 transition-all duration-200"
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