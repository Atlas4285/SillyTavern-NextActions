# SillyTavern Next Actions

**English** | [简体中文](README.zh-CN.md)

Next Actions is a third-party [SillyTavern](https://github.com/SillyTavern/SillyTavern) UI extension that turns a `<next_actions>` block in a character response into a list of clickable reply buttons.

The buttons are rendered where the tag originally appeared, so a response may contain normal text before the actions, after the actions, or both.

## Features

- Renders one action button for each non-empty line inside `<next_actions>`.
- Preserves and formats text before and after the action block.
- Supports newly generated messages, swipes, edited messages, chat changes, and loaded chat history.
- Can either fill the chat input or send the selected action immediately.
- Uses SillyTavern theme variables for a consistent appearance.
- Provides an English interface with Simplified Chinese localization.

## Message format

Ask your model to include actions in the following format:

```text
<next_actions>
Ask what happened next
Look around the room
Leave quietly
</next_actions>
```

Each non-empty line becomes one button. Use plain lines rather than Markdown list markers unless you want those markers to appear in the button text.

The block can also appear between normal paragraphs:

```text
The corridor falls silent as the door closes behind you.

<next_actions>
Knock on the door
Continue down the corridor
Call out for help
</next_actions>

Somewhere in the distance, a clock begins to chime.
```

The `<next_actions>` block is replaced by the buttons while the surrounding text remains in its original order.

### Suggested prompt instruction

You can add an instruction similar to this to your system prompt, character prompt, or author note:

```text
Include a <next_actions> block containing several appropriate next actions for the user. Put each action on its own line without bullets or numbering, and close the block with </next_actions>.
```

## Installation

### Install through SillyTavern

1. Open the **Extensions** panel in SillyTavern.
2. Select **Install Extension**.
3. Enter this repository URL:

   ```text
   https://github.com/Atlas4285/SillyTavern-NextActions
   ```

4. Complete the installation. Reload the SillyTavern page if the extension does not appear immediately.

Only install third-party extensions from sources you trust.

### Manual installation

Clone the repository into SillyTavern's third-party extensions directory:

```bash
cd /path/to/SillyTavern/public/scripts/extensions/third-party
git clone https://github.com/Atlas4285/SillyTavern-NextActions.git
```

If you are cloning the source without a prebuilt bundle, install the development dependencies and build it:

```bash
cd SillyTavern-NextActions
npm install
npm run build
```

Then reload SillyTavern.

## Configuration

Open the SillyTavern **Extensions** panel and locate **Next Actions**. The **Action button behavior** setting provides two modes:

- **Fill input**: replaces the current chat input with the selected action without sending it.
- **Send immediately**: replaces the current chat input with the selected action and then sends it.

Only actions belonging to the latest chat message can be executed. Actions in older messages remain visible and can still be selected and copied.

## Current behavior and limitations

- Only character messages are processed. User and system messages are ignored.
- Only the first `<next_actions>` block in a message is parsed.
- Action entries are separated by line breaks; empty lines are ignored.
- Markdown list markers are not removed automatically.
- Both opening and closing tags are required. An incomplete block is not transformed by this extension.
- Historical action buttons are intentionally non-executable.

## Development

This extension is written in TypeScript and bundled with Webpack.

Install dependencies:

```bash
npm install
```

Build and watch during local development:

```bash
npm run dev
```

Create a production bundle in `dist/`:

```bash
npm run build
```

Check the source with ESLint:

```bash
npm run lint
```

Apply automatically fixable ESLint changes:

```bash
npm run lint:fix
```

The development watcher rebuilds the bundle when source files change, but it does not hot-reload SillyTavern. Refresh the browser page to load the updated bundle.

### Project structure

```text
src/
├── index.ts                    Extension initialization and event listeners
├── style.css                  Action button styles
├── next-actions/
│   ├── parser.ts              <next_actions> parser
│   ├── renderer.ts            Message rendering and button availability
│   └── input-actions.ts       Fill-input and send behavior
└── settings/
    ├── settings.html          Settings panel markup
    └── settings.ts            Persistent settings management
```

The production entry point declared in `manifest.json` is `dist/index.js`.

## License

This project is licensed under the [GNU Affero General Public License v3.0](LICENSE).
