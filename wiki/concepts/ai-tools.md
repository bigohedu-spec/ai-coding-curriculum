# AI Tools｜各學期工具清單

## 定義

本頁追蹤課程中引入的所有工具，記錄首次出現學期、用途，以及工具政策說明。

**核心政策：所有 AI 功能均使用自建 Lab 系列工具，不使用需要學生另行申請帳號的第三方 AI 服務。**
詳見 `CLAUDE.md` 第十四節。

---

## Lab 系列自建工具

| 工具 | 功能 | 首次出現 | 說明 |
|------|------|---------|------|
| **Lab Terminal** | 文字 AI 對話 + 任務平台 + 小遊戲 + 點數商店 | P1下（W13）/ S1（W1） | 課程最核心的自建系統；與 Minecraft 共用金幣經濟體；詳見 [[lab-terminal]] |
| **Lab Terminal（文字類）** | 輕量文字處理工具 | S3（W1） | 在 Lab Terminal 內處理整理、改寫、提示等文字任務；S3-W01 學生端名稱使用 Lab Terminal |
| **Lab Image** | AI 圖像生成 | P1下（W19）/ S1（W11） | 取代 Canva AI、Adobe Firefly；文字→圖片，支援風格設定 |
| **Lab Video** | AI 影片生成 | S3（W2） | 取代 Runway、Pika；圖片轉動畫、短影片生成 |
| **Lab Music** | AI 音樂生成 | S3（W1 試用 / W3 正式） | 學生端音樂工具；底層由後端串 ElevenLabs Music API，學生不需帳號 |

---

## 已授權保留的第三方工具

| 工具 | 類別 | 首次出現 | 用途 |
|------|------|---------|------|
| **Minecraft** | 遊戲學習環境 | P1上（W13）/ S1（W1） | 課程核心引擎，機構統一授權 |
| **VS Code** | 程式編輯器 | S3（W18） | 本地端，無需帳號 |
| **GitHub / GitHub Pages** | 版本控制 + 部署 | S5（W3）/ S6（W16） | 已納入課程，帳號由課程統一管理 |
| **GitHub Copilot** | 程式 AI | S5（W7） | 隨 GitHub 帳號配套，VS Code 內程式輔助 |
| **Canva**（非 AI 功能） | 設計排版 | P1上（W19）/ S1（W15） | 拖放排版工具，非 AI 系統，帳號可選 |

---

## 比較教學任務的特殊說明

舊版 S2 模組二（W7–W9）保留「認識 Claude」與「雙 AI 比較」任務、用真 ChatGPT／Claude 做比較教學。**這個例外已取消**（2026-08-20，CLAUDE.md 第八節、第十四節），上線內容也已換掉：

- S2 模組二（W7–W12）現在是一個遊戲《逃離數碼界》六層（W07 十六個守衛、W08／W09 回聲書庫追問自學、W10–W12 三週小論文），**全程在 Lab Terminal 內完成**，後端路由真實模型，學生不需帳號、不進 ChatGPT／Claude 網站。
- **目前六層都只用 GPT**。W07 的「比較兩個 AI」那一步要等後端補上 `ANTHROPIC_API_KEY` 才會出現。
- 詳見 [[S2-小三下-AI探索]]。

---

## 工具更新記錄

| 日期 | 事件 |
|------|------|
| 2026-04-23 | 初始建立，依課綱 docx 整理 |
| 2026-04-28 | 全面替換第三方 AI 工具：Canva AI → Lab Image；Adobe Firefly → Lab Image；Runway → Lab Video；Pika → Lab Video；新增工具政策說明（CLAUDE.md 第十四節） |
| 2026-07-20 | S3 音樂工具改為 Lab Music；學生端不顯示 ElevenLabs，工程端由後端串 ElevenLabs Music API；S3-W01 文字類工具學生端名稱改為 Lab Terminal |
| 2026-10-07 | 依 gpt-clone 上線內容對齊：S2 模組二（W7–W12）取消真 ChatGPT／Claude 比較例外，全程 Lab Terminal、目前只接 GPT（Claude 比較要等 `ANTHROPIC_API_KEY`） |

---

## 相關概念

- [[prompt-engineering]]（工具選擇影響 Prompt 方式）
- [[lab-terminal]]（Lab Terminal 完整說明）
- [[task-types]]（EX 任務都指定工具）

---

> 最後修改：2026-07-20，原因：S3-W01 文字類工具學生端名稱改為 Lab Terminal；S3 音樂工具改為學生端 Lab Music，底層由後端串 ElevenLabs Music API
> 最後修改：2026-10-07，原因：依 gpt-clone 上線內容對齊——「比較教學任務的特殊說明」改寫：S2 模組二已無真 ChatGPT／Claude 比較例外，《逃離數碼界》六層全程 Lab Terminal、目前只接 GPT；工具更新記錄補一列。
