## 1. Implementation

- [x] 1.1 在 `src/App.vue` 的 `onMounted` 中加入 `window.addEventListener('keydown', handleKeydown)`。
- [x] 1.2 實作 `handleKeydown` 函數，將按鍵轉換為小寫並發送 `hotkey-pressed` 訊息。
- [x] 1.3 在 `onUnmounted` 中移除事件監聽器（良好的開發習慣）。
- [x] 1.4 驗證當工具列視窗處於作用中時，快速鍵（e, t, r, c, m, w）是否能正常運作。
