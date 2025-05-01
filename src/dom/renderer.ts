import { BroToastify, BroToastifyToastifyOptions } from "../core/types";
import { injectStyles, getBroToastifyStyles } from "./style";
import { applyAnimation, defaultAnimationOptions } from "../core/animation";

export function createBroToastifyElement(broToastify: BroToastify): HTMLElement {
    const { id, type, message, title, dismissible, customClass, animation } = broToastify;

    const broToastifyElement = document.createElement("div");
    broToastifyElement.id = `broToastify-${id}`;
    broToastifyElement.className = `broToastify-notification broToastify-${type} ${customClass || ""}`;
    broToastifyElement.setAttribute("role", "alert");

    // Apply animation
    applyAnimation(broToastifyElement, animation, true);

    //add title
    if (title) {
        const broToastifyTitleElement = document.createElement('div');
        broToastifyTitleElement.className = 'broToastify-title';
        broToastifyTitleElement.textContent = title;
        broToastifyElement.appendChild(broToastifyTitleElement);
    }

    if (type === 'loading') {
        const loaderContainer = document.createElement('div');
        loaderContainer.className = 'broToastify-loader-container';

        const loader = document.createElement('div');
        loader.className = 'broToastify-loader';
        loaderContainer.appendChild(loader);

        const messageElement = document.createElement('div');
        messageElement.className = 'broToastify-loader-message';
        messageElement.textContent = message;
        loaderContainer.appendChild(messageElement);

        broToastifyElement.appendChild(loaderContainer);
    } else {
        const broToastifyMessageElement = document.createElement('div');
        broToastifyMessageElement.className = 'broToastify-message';
        broToastifyMessageElement.textContent = message;
        broToastifyElement.appendChild(broToastifyMessageElement);
    }

    // Add close button if dismissible
    if (dismissible) {
        const closeButton = document.createElement('button');
        closeButton.className = 'broToastify-close';
        closeButton.innerHTML = '&times;';
        closeButton.setAttribute('aria-label', 'Close');
        closeButton.onclick = () => {
            // This will be handled by the core
            const event = new CustomEvent('broToastify:dismiss', { detail: { id } });
            document.dispatchEvent(event);
        };
        broToastifyElement.appendChild(closeButton);
    }

    //handle click event
    if (broToastify.onClick) {
        broToastifyElement.addEventListener('click', (e) => {
            // Don't trigger if clicking the close button
            if (!(e.target as HTMLElement).closest('.broToastify-close')) {
                broToastify.onClick!();
            }
        });
        broToastifyElement.style.cursor = 'pointer';
    }
    return broToastifyElement;
}

// Ensure styles are injected
export function initializeRenderer(): void {
    injectStyles();
}