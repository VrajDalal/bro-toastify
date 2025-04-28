import React, { useEffect } from "react"
import toast from "../../core/bro-toastify"

export const Toaster: React.FC<{
    position?: "top-right" | "top-left" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center"
    newestOnTop?: any
    dismissible?: any
}> = ({ position = "top-right", newestOnTop, dismissible }) => {
    if (typeof window === "undefined") {
        // Render nothing on the server
        return null
    }
    useEffect(() => {
        // Initialize the toast container after the component mounts
        toast.show("Toast container initialized", {
            position,
            newestOnTop,
            dismissible,
        })
    }, [position, newestOnTop, dismissible])

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