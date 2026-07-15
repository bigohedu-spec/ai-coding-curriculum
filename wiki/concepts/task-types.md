# Task Types｜任務類型定義

## 定義

課程中的任務依**內容性質**分類，而非依「在哪個平台完成」分類。無論任務在 Minecraft、Lab Terminal、還是外部工具上執行，都進入同一套點數系統，也使用同一套驗收流程。

---

## 五種任務類型

### MC｜Minecraft 內部任務
- 任務內容完全在 Minecraft 世界內發生
- 包含：探索、建造、生存、Redstone 邏輯、指令方塊
- 驗收：截圖提交 + 教師確認（初期）；AI 判定（未來）
- 範例：S1-W01-B 我是誰？（建造）、S3-W14-A 序列挑戰（指令方塊邏輯）

### EX｜外部工具任務
- 任務內容在 Lab Terminal 以外的第三方工具上完成
- 包含：Lab Image 生圖、VS Code 寫程式、Lab Video 影片生成、Suno 音樂生成
- 驗收：截圖或檔案提交 + 教師確認
- 範例：S1-W11-A 第一張 AI 圖（Lab Image）、S5-W08-A 讓 AI 寫函式（GitHub Copilot）

### LT｜Lab Terminal 任務
- 任務內容在 Lab Terminal 平台上完成
- 包含：AI 提問練習、平台內建遊戲、問答挑戰、Prompt 訓練
- 驗收：Lab Terminal 系統自動記錄（或教師後台確認）
- 原先 wiki 中標注「Lab Terminal」的 EX 任務，應歸類為 LT

### MS｜里程碑成就
- 學期或模組結束時解鎖，代表整個階段完成
- 點數最高（150–500 幣），解鎖稱號和新區域/功能
- 驗收：所有主線任務完成後系統自動觸發
- 範例：S1-W24-MS AI 探索者、S2-W24-MS AI 創作者

### RT｜定時任務
- 每週固定刷新，培養回訪習慣
- 本週沒完成則消失，點數偏低（20–30 幣）但累積可觀
- 範例：S1-W05-B 每週探索

### TA｜助教任務（翻轉教育）
- 觸發條件：完成任務後，成功幫助另一位同學完成同一任務
- 點數：被幫助任務點數的 50%
- 詳見 [[flipped-education]]

---

## 任務分類對照（原分類 → 新分類）

原始任務清單中的 EX 任務，依實際工具重新分類：

| 原標注 | 實際工具 | 新分類 |
|-------|---------|-------|
| EX（Lab Terminal） | Lab Terminal | LT |
| EX（Lab Image） | Lab Image | EX |
| EX（VS Code） | VS Code + Copilot | EX |
| EX（Lab Video/Suno） | 影片/音樂工具 | EX |
| EX（ChatGPT/Claude 比較用） | ChatGPT + Claude | EX |

---

## 驗收流程（所有類型通用）

```
學生完成任務
     ↓
截圖/提交/系統自動記錄
     ↓
教師後台確認（初期）
或 AI 自動判定（未來）
     ↓
點數發放到統一錢包
```

---

## 任務設計原則

- 每個模組至少有 1 個 MC 任務（保持 Minecraft 作為核心遊戲世界）
- 每個有 AI 學習內容的週次至少有 1 個 LT 任務（讓 Lab Terminal 發揮 AI 詢問功能）
- EX 任務專注於需要特定工具能力的創作任務（生圖、寫程式、剪輯）
- MS 每學期 1 個，放在最後一週
- RT 每週固定 1 個，全學期不中斷

---

## 相關概念

- [[gamification-system]]（點數機制與統一經濟體）
- [[lab-terminal]]（LT 任務的平台說明）
- [[flipped-education]]（TA 任務機制）

---

> 最後修改：2026-04-23，原因：重新定義任務分類，從「平台位置」改為「任務內容」，新增 LT 類型
