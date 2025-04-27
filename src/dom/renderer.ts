import { BroToastify, BroToastifyToastifyOptions } from "../core/types";
import { injectStyles, getBroToastifyStyles } from "./style";

export function createBroToastifyElement(broToastify: BroToastify): HTMLElement {
    const { id, type, message, title, dismissible, customClass } = broToastify;

    const broToastifyElement = document.createElement("div");
    broToastifyElement.id = `broToastify-${id}`;
    broToastifyElement.className = `broToastify-notification broToastify-${type} ${customClass || ""}`;
    broToastifyElement.setAttribute("role", "alert");

    //add title
    if (title) {
        const broToastifyTitleElement = document.createElement('div');
        broToastifyTitleElement.className = 'broToastify-title';
        broToastifyTitleElement.textContent = title;
        broToastifyElement.appendChild(broToastifyTitleElement);
    }

    //add message
    const broToastifyMessageElement = document.createElement('div');
    broToastifyMessageElement.className = 'broToastify-message';
    broToastifyMessageElement.textContent = message;
    broToastifyElement.appendChild(broToastifyMessageElement);

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