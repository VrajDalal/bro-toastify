import React, { useState, useEffect } from "react"

export const ClientOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null

    return <>{children}</>
}