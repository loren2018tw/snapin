# Project Context

## Purpose

SnapIn 是一個基於 Quasar 和 Electron 的桌面應用程式，提供繪圖和設定功能。目標是建立一個輕量級的桌面工具，用於快速繪圖和個人化設定。

## Tech Stack

- 前端框架：Quasar (基於 Vue 3)
- 語言：TypeScript
- 建構工具：Vite
- 桌面應用：Electron
- 程式碼品質：ESLint, Prettier
- 樣式：PostCSS, SCSS
- 狀態管理：Vue 3 Composition API
- 路由：Vue Router
- 儲存：electron-store

## Project Conventions

### Code Style

- 使用單引號 (singleQuote: true)
- 列寬限制：100 字元 (printWidth: 100)
- 縮排：2 個空格
- 檔案編碼：UTF-8
- 行尾：LF
- 檔案結尾必須有換行
- 修剪尾隨空白
- TypeScript：使用 type-imports 偏好設定
- Vue：使用 essential 規則集

### Architecture Patterns

- 使用 Quasar 框架的元件架構
- Electron 主進程處理桌面功能
- Vue 3 Composition API 用於元件邏輯
- 路由基於 Vue Router
- 設定儲存使用 electron-store

### Testing Strategy

目前無測試策略。使用 "echo \"No test specified\"" 作為測試指令。

### Git Workflow

未指定。建議使用標準 Git 流程：feature branches, pull requests, semantic commits。

## Domain Context

應用程式包含繪圖頁面 (drawing.html) 和設定頁面 (settings.html)。專注於桌面應用體驗，提供繪圖工具和使用者設定。

## Important Constraints

- Node.js 版本：^28 || ^26 || ^24 || ^22 || ^20
- 私有專案 (private: true)
- 模組類型：ES modules (type: "module")

## External Dependencies

- Quasar Extras：圖示和額外元件
- electron-store：設定儲存
- Vue Router：路由管理
