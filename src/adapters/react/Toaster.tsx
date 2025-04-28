"use client";

import React, { useEffect } from "react";
import { on } from "../../core/bro-toastify";
import type { BroToastify } from "../../core/types";

export const Toaster: React.FC<{
  position?: "top-right" | "top-left" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
  newestOnTop?: boolean;
  dismissible?: boolean;
}> = ({ position = "top-right", newestOnTop = false, dismissible = true }) => {
  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure this only runs on the client

    // Create or update the toast container
    let container = document.querySelector(`.broToastify-container.broToastify-${position}`);
    if (!container) {
      container = document.createElement("div");
      container.className = `broToastify-container broToastify-${position}`;
      document.body.appendChild(container);
    }

    const createHandler = (toast: BroToastify) => {
      if (!container) return;

      const toastElement = document.createElement("div");
      toastElement.id = `broToastify-${toast.id}`;
      toastElement.className = `broToastify-notification broToastify-${toast.type}`;
      toastElement.innerHTML = `
        <div class="broToastify-title">${toast.title || ""}</div>
        <div class="broToastify-message">${toast.message}</div>
        ${
          dismissible
            ? `<button class="broToastify-close" aria-label="Close">×</button>`
            : ""
        }
      `;

      if (newestOnTop) {
        container.prepend(toastElement);
      } else {
        container.appendChild(toastElement);
      }

      if (dismissible) {
        const closeButton = toastElement.querySelector(".broToastify-close");
        closeButton?.addEventListener("click", () => {
          container?.removeChild(toastElement);
        });
      }

      if (toast.duration && toast.duration > 0) {
        setTimeout(() => {
          container?.removeChild(toastElement);
        }, toast.duration);
      }
    };

    const dismissHandler = (id: string) => {
      const toastElement = document.getElementById(`broToastify-${id}`);
      if (toastElement && container?.contains(toastElement)) {
        container.removeChild(toastElement);
      }
    };

    // Register event listeners
    const createListener = on("create", createHandler);
    const dismissListener = on("dismiss", dismissHandler);

    // Cleanup on unmount
    return () => {
      createListener.off();
      dismissListener.off();
      container?.remove();
    };
  }, [position, newestOnTop, dismissible]);

  return null; // The Toaster does not render anything directly
};