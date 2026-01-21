## ADDED Requirements

### Requirement: 形狀工具 FAB 群組

工具列必須 (SHALL) 將形狀標註工具（矩形、圓形）分組為可展開的 FAB（浮動操作按鈕）群組以節省空間。
因為工具列是一直行，q-fab 向左拉時，q-fab-action 會超出工具列的範圍，所以要將主視窗寬度變大，背景透明，工具列按鈕向右靠齊，工具列該行的背景設定為 #f5f5f5。

#### Scenario: FAB 展開

- **WHEN** 使用者點擊形狀工具 FAB
- **THEN** 它向左展開以顯示可用的形狀工具（矩形、圓形）

#### Scenario: FAB 圖示 - 矩形啟用

- **WHEN** 目前啟用的工具為「矩形」
- **THEN** 形狀工具 FAB 顯示「矩形」圖示

#### Scenario: FAB 圖示 - 圓形啟用

- **WHEN** 目前啟用的工具為「圓形」
- **THEN** 形狀工具 FAB 顯示「圓形」圖示

#### Scenario: FAB 圖示 - 其他工具啟用

- **WHEN** 目前啟用的工具不是形狀工具（例如：畫筆）
- **THEN** 形狀工具 FAB 顯示通用類別圖示（`category`）

#### Scenario: FAB 圖示 - 其他工具啟用

- **WHEN** 目前啟用的工具不是形狀工具（例如：畫筆）
- **THEN** 形狀工具 FAB 顯示通用類別圖示（`category`）
