import { BroToastifyToastifyOptions } from "./types";

const containers: Map<string, HTMLElement> = new Map()

export function createContainer(position: BroToastifyToastifyOptions['position']): HTMLElement | null {
    if (typeof window === 'undefined') {
        return null; // Return null during SSR
    }

    if (containers.has(position!)) {
        const existingContainer = containers.get(position!)!;
        existingContainer.className = `broToastify-container broToastify-${position}`;
        return existingContainer;
    }
    console.debug('Creating container for position:', position);


    const container = document.createElement('div')
    container.className = `broToastify-container broToastify-${position}`
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


export function getContainer(position: BroToastifyToastifyOptions['position']): HTMLElement {
    if (containers.has(position!)) {
        console.debug('Retrieving container for position:', position);
        return containers.get(position!)!;
    }

    throw new Error(`Container with position "${position}" does not exist.`);
}


export function removeAllContainers(): void {
    console.debug('Removing all containers');
    containers.forEach((container) => {
        container.remove();
    });
    containers.clear();
}





