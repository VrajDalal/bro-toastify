import { BroToastifyToastifyOptions } from "./types";

const containers: Map<string, HTMLElement> = new Map()

export function createContainer(position: BroToastifyToastifyOptions['position']): HTMLElement | null {
    if (typeof window === 'undefined') {
        return null; // Return null during SSR
    }

    if (containers.has(position!)) {
        const existingContainer = containers.get(position!)!;
        if (document.body.contains(existingContainer)) {
            return existingContainer;
        } else {
            // Container exists in our map but not in DOM, re-append it
            document.body.appendChild(existingContainer);
            return existingContainer;
        }
    }
    console.debug('Creating container for position:', position);

    function getPositionClasses(position: BroToastifyToastifyOptions['position']): string {
        const positionClasses: Record<string, string> = {
            'top-right': 'top-4 right-4 items-end',
            'top-left': 'top-4 left-4 items-start',
            'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
            'bottom-right': 'bottom-4 right-4 items-end',
            'bottom-left': 'bottom-4 left-4 items-start',
            'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
        };
        return positionClasses[position || 'top-right'];
    }

    const container = document.createElement('div')
    container.className = `broToastify-container ${getPositionClasses(position)}`
    container.setAttribute('role', 'region')
    container.setAttribute('aria-live', 'polite')
    container.setAttribute('aria-atomic', 'true')

    switch (position) {
        case 'top-right':
            container.style.top = '1rem'
            container.style.right = '1rem'
            break
        case 'top-left':
            container.style.top = '1rem'
            container.style.left = '1rem'
            break
        case 'top-center':
            container.style.top = '1rem'
            container.style.left = '50%'
            container.style.transform = 'translateX(-50%)'
            break
        case 'bottom-right':
            container.style.bottom = '1rem'
            container.style.right = '1rem'
            break
        case 'bottom-left':
            container.style.bottom = '1rem'
            container.style.left = '1rem'
            break
        case 'bottom-center':
            container.style.bottom = '1rem'
            container.style.left = '50%'
            container.style.transform = 'translateX(-50%)'
            break
        default:
            console.error(`Invalid position: ${position}`);
            break;
    }

    document.body.appendChild(container)

    containers.set(position!, container)

    return container
}


export function getContainer(position: BroToastifyToastifyOptions["position"]): HTMLElement | null {
    if (typeof window === "undefined") {
        return null // Return null during SSR
    }

    // If container exists, return it
    if (containers.has(position!)) {
        const container = containers.get(position!)!

        // Make sure it's still in the DOM
        if (!document.body.contains(container)) {
            document.body.appendChild(container)
        }

        return container
    }

    // Otherwise create a new one
    return createContainer(position)
}


export function removeAllContainers(): void {
    if (typeof window === "undefined") {
        return // Skip during SSR
    }

    console.debug("Removing all containers")
    containers.forEach((container) => {
        if (document.body.contains(container)) {
            container.remove()
        }
    })
    containers.clear()
}





