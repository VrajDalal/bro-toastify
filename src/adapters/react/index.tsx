// react/index.tsx

import React, { useEffect } from "react"
import coreToast, { on } from "../../core/bro-toastify"
import type { BroToastify, BroToastifyToastifyOptions } from "../../core/types"
import { injectStyles } from "../../dom/style"

// Client-side initialization script that runs when this module is imported on the client
if (typeof window !== "undefined") {
  // Inject styles immediately
  injectStyles()

  // Set up a MutationObserver to detect when Toaster placeholders are added to the DOM
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement && node.hasAttribute("data-bro-toastify")) {
            const position = node.getAttribute("data-position") || "top-right"
            const newestOnTop = node.getAttribute("data-newest-on-top") !== "false"
            const dismissible = node.getAttribute("data-dismissible") !== "false"

            // Initialize the toast container
            initToastContainer(position, newestOnTop, dismissible)
          }
        })
      }
    })
  })

  // Start observing the document body for Toaster placeholders
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

  // Create a unique key for this configuration
  const configKey = `${position}-${newestOnTop}-${dismissible}`

  // Skip if already initialized with this config
  if (toastState.initialized.has(configKey)) return

  console.log("Initializing toast container:", { position, newestOnTop, dismissible })
  toastState.initialized.add(configKey)

  // Create or update container
  let container = document.querySelector(`.broToastify-container.broToastify-${position}`) as HTMLDivElement
  if (!container) {
    container = document.createElement("div")
    container.className = `broToastify-container broToastify-${position}`
    container.style.display = "flex"
    document.body.appendChild(container)
    console.log("Created container:", container)
  } else {
    container.style.display = "flex"
    console.log("Found existing container:", container)
  }

  // Store the container
  toastState.containers.set(position, container)

  // Clean up old listeners
  if (toastState.listeners.create) toastState.listeners.create.off()
  if (toastState.listeners.dismiss) toastState.listeners.dismiss.off()

  // Set up create handler
  toastState.listeners.create = on("create", (toast: BroToastify) => {
    if (!container || !toast) {
      console.error("Cannot create toast: missing container or toast", { container, toast })
      return
    }

    console.log("Received create event for toast:", toast)

    let toastElement = toastState.activeToasts.get(toast.id)

    if (!toastElement) {
      toastElement = document.createElement("div")
      toastElement.id = `broToastify-${toast.id}`
      toastElement.className = `broToastify-notification broToastify-${toast.type}`
      toastElement.setAttribute("data-id", toast.id)

      try {
        if (newestOnTop) {
          container.prepend(toastElement)
        } else {
          container.appendChild(toastElement)
        }
        console.log("Created and appended toast element:", toastElement)
      } catch (error) {
        console.error("Failed to append toast element:", error)
        return
      }

      toastState.activeToasts.set(toast.id, toastElement)
    }

    try {
      toastElement.innerHTML = `
        <div class="broToastify-title">${toast.title || ""}</div>
        <div class="broToastify-message">${toast.message}</div>
        ${dismissible ? `<button class="broToastify-close" aria-label="Close">×</button>` : ""}
      `
      console.log("Updated toast element HTML:", toastElement)
    } catch (error) {
      console.error("Failed to update toast HTML:", error)
    }

    if (dismissible) {
      const closeButton = toastElement.querySelector(".broToastify-close")
      if (closeButton) {
        closeButton.addEventListener("click", () => {
          if (container && toastElement) {
            container.removeChild(toastElement)
            toastState.activeToasts.delete(toast.id)
            coreToast.dismiss(toast.id)
            console.log("Dismissed toast:", toast.id)
          }
        })
        console.log("Added close button listener for toast:", toast.id)
      }
    }

    // Auto-dismiss
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        if (container && toastElement && container.contains(toastElement)) {
          container.removeChild(toastElement)
          toastState.activeToasts.delete(toast.id)
          console.log("Auto-dismissed toast:", toast.id)
        }
      }, toast.duration)
    }
  })

  // Set up dismiss handler
  toastState.listeners.dismiss = on("dismiss", (toast: BroToastify) => {
    const id = toast.id
    const toastElement = toastState.activeToasts.get(id)
    if (toastElement && container && container.contains(toastElement)) {
      container.removeChild(toastElement)
      toastState.activeToasts.delete(id)
      console.log("Handled dismiss event for toast:", id)
    }
  })
}

// Server-safe Toaster component - no hooks!
export const Toaster: React.FC<{
  position?: BroToastifyToastifyOptions["position"]
  newestOnTop?: any
  dismissible?: any
}> = ({ position = "top-right", newestOnTop , dismissible  }) => {
  // Ensure this component is treated as a client component
  if (typeof window === "undefined") return null

  useEffect(() => {
    // Trigger a re-check for the MutationObserver
    const placeholder = document.querySelector('[data-bro-toastify="true"]')
    if (placeholder) {
      const position = placeholder.getAttribute("data-position") || "top-right"
      const newestOnTop = placeholder.getAttribute("data-newest-on-top") !== "false"
      const dismissible = placeholder.getAttribute("data-dismissible") !== "false"

      initToastContainer(position, newestOnTop, dismissible)
    }
  }, [])

  return (
    <div
      data-bro-toastify="true"
      data-position={position}
      data-newest-on-top={String(newestOnTop)}
      data-dismissible={String(dismissible)}
      style={{ display: "none" }}
    />
  )
}

// Mark Toaster as a client component
Toaster.displayName = "Toaster"
if (typeof Toaster.toString === "function") {
  const originalToString = Toaster.toString
  Toaster.toString = (): string => "'use client';\n" + originalToString.call(Toaster)
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
    dismissible: (id: string) => coreToast.dismiss(id),
    clearAll: () => coreToast.clearAll(),
  }
}

// Default export for convenience
export default toast