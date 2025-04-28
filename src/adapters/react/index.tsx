// react/index.tsx

import React, { useEffect } from "react"
import coreToast, { on } from "../../core/bro-toastify"
import type { BroToastify, BroToastifyToastifyOptions } from "../../core/types"
import { injectStyles } from "../../dom/style"
import { ClientOnly } from "./clientOnly"

// Inject styles and set up MutationObserver on the client
if (typeof window !== "undefined") {
  injectStyles()

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement && node.hasAttribute("data-bro-toastify")) {
            const position = node.getAttribute("data-position") || "top-right"
            const newestOnTop = node.getAttribute("data-newest-on-top") !== "false"
            const dismissible = node.getAttribute("data-dismissible") !== "false"

            initToastContainer(position, newestOnTop, dismissible)
          }
        })
      }
    })
  })

  observer.observe(document.body, { childList: true, subtree: true })
}

// Global state for toast management
const toastState = {
  containers: new Map<string, HTMLElement>(),
  activeToasts: new Map<string, HTMLElement>(),
  listeners: {
    create: null as { off: () => void } | null,
    dismiss: null as { off: () => void } | null,
  },
  initialized: new Set<string>(),
}

// Initialize toast container
function initToastContainer(position: string, newestOnTop: boolean, dismissible: boolean) {
  if (typeof window === "undefined") return

  const configKey = `${position}-${newestOnTop}-${dismissible}`
  if (toastState.initialized.has(configKey)) return

  console.log("Initializing toast container:", { position, newestOnTop, dismissible })
  toastState.initialized.add(configKey)

  let container = document.querySelector(`.broToastify-container.broToastify-${position}`) as HTMLDivElement
  if (!container) {
    container = document.createElement("div")
    container.className = `broToastify-container broToastify-${position}`
    container.style.display = "flex"
    document.body.appendChild(container)
  }

  toastState.containers.set(position, container)

  if (toastState.listeners.create) toastState.listeners.create.off()
  if (toastState.listeners.dismiss) toastState.listeners.dismiss.off()

  toastState.listeners.create = on("create", (toast: BroToastify) => {
    if (!container || !toast) return

    let toastElement = toastState.activeToasts.get(toast.id)
    if (!toastElement) {
      toastElement = document.createElement("div")
      toastElement.id = `broToastify-${toast.id}`
      toastElement.className = `broToastify-notification broToastify-${toast.type}`
      toastElement.setAttribute("data-id", toast.id)

      if (newestOnTop) {
        container.prepend(toastElement)
      } else {
        container.appendChild(toastElement)
      }

      toastState.activeToasts.set(toast.id, toastElement)
    }

    toastElement.innerHTML = `
      <div class="broToastify-title">${toast.title || ""}</div>
      <div class="broToastify-message">${toast.message}</div>
      ${dismissible ? `<button class="broToastify-close" aria-label="Close">×</button>` : ""}
    `

    if (dismissible) {
      const closeButton = toastElement.querySelector(".broToastify-close")
      if (closeButton) {
        closeButton.addEventListener("click", () => {
          if (container && toastElement) {
            container.removeChild(toastElement)
            toastState.activeToasts.delete(toast.id)
            coreToast.dismiss(toast.id)
          }
        })
      }
    }

    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        if (container && toastElement && container.contains(toastElement)) {
          container.removeChild(toastElement)
          toastState.activeToasts.delete(toast.id)
        }
      }, toast.duration)
    }
  })

  toastState.listeners.dismiss = on("dismiss", (toast: BroToastify) => {
    const id = toast.id
    const toastElement = toastState.activeToasts.get(id)
    if (toastElement && container && container.contains(toastElement)) {
      container.removeChild(toastElement)
      toastState.activeToasts.delete(id)
    }
  })
}

// Toaster Component
export const Toaster: React.FC<{
  position?: BroToastifyToastifyOptions["position"]
  newestOnTop?: boolean
  dismissible?: boolean
}> = ({ position = "top-right", newestOnTop = true, dismissible = true }) => {
  useEffect(() => {
    // Trigger initialization after the component mounts
    const placeholder = document.querySelector('[data-bro-toastify="true"]')
    if (placeholder) {
      const position = placeholder.getAttribute("data-position") || "top-right"
      const newestOnTop = placeholder.getAttribute("data-newest-on-top") !== "false"
      const dismissible = placeholder.getAttribute("data-dismissible") !== "false"

      initToastContainer(position, newestOnTop, dismissible)
    }
  }, [])

  return (
    <ClientOnly>
      <div
        data-bro-toastify="true"
        data-position={position}
        data-newest-on-top={String(newestOnTop)}
        data-dismissible={String(dismissible)}
        style={{ display: "none" }}
      />
    </ClientOnly>
  )
}

// Export the core toast for direct usage
export const toast = coreToast

// Hook for using toast (for client components)
export const broToastify = () => {
  return {
    show: (message: string, options?: Partial<BroToastifyToastifyOptions>) => coreToast.show(message, options),
    success: (message: string, options?: Partial<BroToastifyToastifyOptions>) => coreToast.success(message, options),
    error: (message: string, options?: Partial<BroToastifyToastifyOptions>) => coreToast.error(message, options),
    info: (message: string, options?: Partial<BroToastifyToastifyOptions>) => coreToast.info(message, options),
    warning: (message: string, options?: Partial<BroToastifyToastifyOptions>) => coreToast.warning(message, options),
    loading: (message: string, options?: Partial<BroToastifyToastifyOptions>) => coreToast.loading(message, options),
    promises: (
      promise: Promise<any>,
      messages: { loading: string; success: string; error: string },
      options?: Partial<BroToastifyToastifyOptions>,
    ) => coreToast.promises(promise, messages, options),
    isToastActive: (id: string) => coreToast.isToastActive(id),
    dismiss: (id: string) => coreToast.dismiss(id),
    clearAll: () => coreToast.clearAll(),
  }
}

export default toast