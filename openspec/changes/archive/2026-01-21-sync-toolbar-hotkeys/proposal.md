# Change: 同步工具列視窗的快速鍵功能

## Why

目前快速鍵（如 e, t, r, c, m, w）僅在繪圖視窗（drawing.html）作用。當使用者正在操作工具列視窗時，這些快速鍵會失靈。為了提供一致的使用者體驗，工具列視窗也應該支援這些快捷鍵。

## What Changes

- 在 `src/App.vue` 中新增 `keydown` 事件監聽器。
- 將按下到的按鍵透過 `electronAPI.send('hotkey-pressed', key)` 傳送至主進程，與繪圖視窗行為一致。

## Impact

- **Specs**: `toolbar` 功能。
- **Code**: `src/App.vue`。
- **User Experience**: 使用者不論焦點在哪個視窗（繪圖或工具列），都能使用快速鍵切換工具。
