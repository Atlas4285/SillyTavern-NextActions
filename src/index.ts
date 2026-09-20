import "./style.css";

import { MODULE_NAME } from "./constants";
import {
    renderNextActions,
    updateNextActionsAvailability,
} from "./next-actions/renderer";

import { initializeSettings } from "./settings/settings";

function onCharacterMessageRendered(messageId: number): void {
    renderNextActions(messageId);
    updateNextActionsAvailability();
}
function onMessageSwiped(messageId: number): void {
    const messageText = document.querySelector<HTMLElement>(
        `#chat .mes[mesid="${messageId}"] .mes_text`,
    );

    // SillyTavern may briefly render a placeholder while switching swipes.
    if (messageText?.textContent?.trim() === "...") {
        return;
    }

    renderNextActions(messageId);
}

// Render only messages currently mounted in the chat, including newly loaded history.
function renderVisibleNextActions(): void {
    const messageElements =
        document.querySelectorAll<HTMLElement>("#chat .mes[mesid]");

    for (const messageElement of messageElements) {
        const rawMessageId = messageElement.getAttribute("mesid");

        if (rawMessageId === null || rawMessageId.trim().length === 0) {
            continue;
        }

        const messageId = Number(rawMessageId);

        if (!Number.isInteger(messageId) || messageId < 0) {
            continue;
        }

        renderNextActions(messageId);
    }

    updateNextActionsAvailability();
}

function initialize(): void {
    const { eventSource, eventTypes } = SillyTavern.getContext();

    eventSource.on(
        eventTypes.CHARACTER_MESSAGE_RENDERED,
        onCharacterMessageRendered,
    );

    eventSource.on(eventTypes.MESSAGE_SENT, updateNextActionsAvailability);
    eventSource.on(eventTypes.MESSAGE_DELETED, updateNextActionsAvailability);

    eventSource.on(eventTypes.MESSAGE_SWIPED, onMessageSwiped);

    eventSource.on(eventTypes.MESSAGE_UPDATED, renderNextActions);

    eventSource.on(eventTypes.CHAT_CHANGED, renderVisibleNextActions);
    eventSource.on(eventTypes.MORE_MESSAGES_LOADED, renderVisibleNextActions);

    eventSource.on(eventTypes.APP_INITIALIZED, initializeSettings);

    console.log(`[${MODULE_NAME}] Extension loaded`);
}

initialize();
