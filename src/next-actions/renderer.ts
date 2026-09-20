import { executeNextAction } from "./input-actions";
import { parseNextActions } from "./parser";

const CONTAINER_CLASS = "next-actions";
const BUTTON_CLASS = "next-actions__button";
const INACTIVE_BUTTON_CLASS = "next-actions__button--inactive";

function setButtonAvailability(
    button: HTMLButtonElement,
    isAvailable: boolean,
): void {
    // Avoid native `disabled` so historical action text remains selectable.
    button.dataset.available = String(isAvailable);
    button.setAttribute("aria-disabled", String(!isAvailable));
    button.classList.toggle(INACTIVE_BUTTON_CLASS, !isAvailable);
}

function appendFormattedHtml(target: HTMLElement, html: string): void {
    if (html.length === 0) {
        return;
    }

    const template = document.createElement("template");
    template.innerHTML = html;
    target.append(template.content);
}

export function renderNextActions(messageId: number): void {
    const { chat, messageFormatting } = SillyTavern.getContext();
    const message = chat[messageId];

    if (!message || typeof message.mes !== "string") {
        console.warn("[next-actions] Chat message has no valid text", {
            messageId,
        });
        return;
    }

    if (message.is_user || message.is_system) {
        return;
    }

    const parsed = parseNextActions(message.mes);

    if (parsed.actions.length === 0) {
        return;
    }

    const messageElement = document.querySelector<HTMLElement>(
        `#chat .mes[mesid="${messageId}"]`,
    );

    if (!messageElement) {
        console.warn("[next-actions] Message element not found", {
            messageId,
        });
        return;
    }

    const messageText = messageElement.querySelector<HTMLElement>(".mes_text");

    if (!messageText) {
        console.warn("[next-actions] Message text element not found", {
            messageId,
        });
        return;
    }

    messageElement.querySelector(`.${CONTAINER_CLASS}`)?.remove();

    const beforeHtml = messageFormatting(
        parsed.beforeText,
        message.name,
        message.is_system,
        message.is_user,
        messageId,
        {},
        false,
    );

    const afterHtml = messageFormatting(
        parsed.afterText,
        message.name,
        message.is_system,
        message.is_user,
        messageId,
        {},
        false,
    );

    const container = document.createElement("div");
    container.classList.add(CONTAINER_CLASS);

    const isLatestMessage = messageId === chat.length - 1;

    for (const action of parsed.actions) {
        const button = document.createElement("button");

        button.type = "button";
        button.classList.add(BUTTON_CLASS);
        button.textContent = action;

        setButtonAvailability(button, isLatestMessage);

        button.addEventListener("click", () => {
            if (button.dataset.available !== "true") {
                return;
            }

            // Dragging to select text may also produce a click event.
            const selection = window.getSelection();

            if (selection && !selection.isCollapsed) {
                return;
            }

            executeNextAction(action);
        });

        container.append(button);
    }

    messageText.replaceChildren();

    appendFormattedHtml(messageText, beforeHtml);
    messageText.append(container);
    appendFormattedHtml(messageText, afterHtml);
}

export function updateNextActionsAvailability(): void {
    const { chat } = SillyTavern.getContext();
    const latestMessageId = chat.length - 1;

    const buttons = document.querySelectorAll<HTMLButtonElement>(
        `#chat .${BUTTON_CLASS}`,
    );

    for (const button of buttons) {
        const messageElement = button.closest<HTMLElement>(".mes[mesid]");

        const rawMessageId = messageElement?.getAttribute("mesid");

        if (rawMessageId === null || rawMessageId === undefined) {
            setButtonAvailability(button, false);
            continue;
        }

        const messageId = Number(rawMessageId);

        const isAvailable =
            Number.isInteger(messageId) && messageId === latestMessageId;

        setButtonAvailability(button, isAvailable);
    }
}
