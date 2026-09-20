import { getSettings } from "../settings/settings";

function fillChatInput(action: string): boolean {
    const input = document.querySelector<HTMLTextAreaElement>("#send_textarea");

    if (!input) {
        console.warn("[next-actions] Chat input not found");
        return false;
    }

    input.value = action;

    // Programmatic value changes do not emit an input event automatically.
    input.dispatchEvent(
        new Event("input", {
            bubbles: true,
        }),
    );

    input.focus();

    return true;
}

export function executeNextAction(action: string): void {
    const settings = getSettings();

    const inputWasFilled = fillChatInput(action);

    if (!inputWasFilled) {
        return;
    }

    if (settings.behavior === "fill") {
        return;
    }

    const sendButton = document.querySelector<HTMLElement>("#send_but");

    if (!sendButton) {
        console.warn("[next-actions] Send button not found");
        return;
    }

    sendButton.click();
}
