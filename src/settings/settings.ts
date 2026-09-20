import settingsHtml from "./settings.html";
import { MODULE_NAME } from "../constants";

export type ActionBehavior = "fill" | "send";

export interface NextActionsSettings {
    behavior: ActionBehavior;
}

const DEFAULT_SETTINGS: Readonly<NextActionsSettings> = Object.freeze({
    behavior: "fill",
});

export function getSettings(): NextActionsSettings {
    const { extensionSettings } = SillyTavern.getContext();

    if (!extensionSettings[MODULE_NAME]) {
        extensionSettings[MODULE_NAME] = structuredClone(DEFAULT_SETTINGS);
    }

    const settings = extensionSettings[MODULE_NAME] as NextActionsSettings;

    if (settings.behavior !== "fill" && settings.behavior !== "send") {
        settings.behavior = DEFAULT_SETTINGS.behavior;
    }

    return settings;
}

export function setActionBehavior(behavior: ActionBehavior): void {
    const { saveSettingsDebounced } = SillyTavern.getContext();

    const settings = getSettings();
    settings.behavior = behavior;

    saveSettingsDebounced();
}

export function initializeSettings(): void {
    const container = document.querySelector<HTMLElement>(
        "#extensions_settings2",
    );

    if (!container) {
        console.warn("[next-actions] Extensions settings container not found");
        return;
    }

    if (document.querySelector("#next_actions_settings")) {
        return;
    }

    container.insertAdjacentHTML("beforeend", settingsHtml);

    const behaviorSelect = document.querySelector<HTMLSelectElement>(
        "#next_actions_behavior",
    );

    if (!behaviorSelect) {
        console.warn("[next-actions] Behavior select not found");
        return;
    }

    const settings = getSettings();
    behaviorSelect.value = settings.behavior;

    behaviorSelect.addEventListener("change", () => {
        const behavior = behaviorSelect.value;

        if (behavior !== "fill" && behavior !== "send") {
            return;
        }

        setActionBehavior(behavior);
    });
}
