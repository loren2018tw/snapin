## ADDED Requirements

### Requirement: 工具列視窗快速鍵同步

當工具列視窗（Toolbar Window）處於作用中狀態時，系統必須 (SHALL) 捕捉並處理預定的快速鍵，使其行為與繪圖視窗一致。

#### Scenario: 工具列視窗捕捉快速鍵

- **WHEN** 工具列視窗處於焦點狀態
- **AND** 使用者按下支援的快速鍵（如 'r' 代表矩形）
- **THEN** 系統應切換至對應的工具並更新所有視窗的狀態
