## 1. Implementation

- [x] 1.1 更新 `src/App.vue`：移除獨立的矩形和圓形按鈕。
- [x] 1.2 更新 `src/App.vue`：新增帶有 `direction="left"` 的 `q-fab` 元件。
- [x] 1.3 更新 `src/App.vue`：根據 `activeTool` 實作 FAB 圖示的計算屬性或邏輯。
- [x] 1.4 更新 `src/App.vue`：新增矩形和圓形的 `q-fab-action` 項目，並連結至 `setTool`。
- [x] 1.5 調整 `src-electron/electron-main.ts`：增大視窗寬度並設定背景透明。
- [x] 1.6 調整 `src/App.vue` CSS：設定工具列背景透明、將按鈕向右靠齊，並為工具列直行增加 `#f5f5f5` 背景。
- [x] 1.7 改善 `src/App.vue` 佈局：將按鈕封裝在 `.tool-wrapper` 中以確保在背景條內置中對齊。
- [x] 1.8 驗證工具列佈局和拖曳行為（確保 fab actions 不會觸發拖曳）。
