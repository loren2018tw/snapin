# Change: Add Window Drag Button

## Why

Users need a convenient way to move the main window, specifically via a dedicated button in the toolbar. This improves usability for custom window layouts.

## What Changes

- Add a new button to the toolbar in `App.vue`.
- Enable window dragging functionality for this button.

## Impact

- Affected specs: `toolbar`
- Affected code: `src/App.vue`, `src-electron/electron-main.ts` (if IPC needed, but likely CSS is sufficient)
