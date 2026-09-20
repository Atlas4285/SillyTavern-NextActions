const NEXT_ACTIONS_PATTERN = /<next_actions>\s*([\s\S]*?)\s*<\/next_actions>/i;

export interface ParsedNextActions {
    beforeText: string;
    actions: string[];
    afterText: string;
}

export function parseNextActions(rawText: string): ParsedNextActions {
    const match = rawText.match(NEXT_ACTIONS_PATTERN);

    if (!match || match.index === undefined) {
        return {
            beforeText: rawText,
            actions: [],
            afterText: "",
        };
    }

    // Match the first multiline action block and preserve the surrounding text
    const actions = match[1]
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    const afterStart = match.index + match[0].length;

    return {
        beforeText: rawText.slice(0, match.index).trim(),
        actions,
        afterText: rawText.slice(afterStart).trim(),
    };
}
