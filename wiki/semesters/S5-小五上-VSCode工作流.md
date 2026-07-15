# S5｜小五上學期｜Vibe Coding 工作流

## 學期概覽

| 項目 | 內容 |
|------|------|
| 年級 | 小五 |
| 學期 | 上學期 |
| 週數 | 24 週 |
| 核心目標 | 建立 VS Code + Copilot Chat 的 Vibe Coding 工作室；以「PM 描述功能、AI 實作」的方式逐步堆疊個人專案；學期末擁有一個本地可展示的完整多功能 web app 或遊戲 |
| 前置學期 | [[S4-小四下-AI創作]] |
| 下一學期 | [[S6-小五下-AI加速]] |

---

## Vibe Coding 是什麼

> **你不是工程師。你是 PM（產品經理）。Copilot Chat 是你的工程師。**

傳統程式課：學生學寫 function → 理解程式碼 → 把程式接上畫面
Vibe Coding：學生描述功能 → Copilot Chat 寫所有程式碼 → 學生測試 → 學生描述問題 → Copilot 修正

學生不需要看懂每一行程式碼。學生需要學會的是：
1. **怎麼把一個功能描述清楚**（PM 的語言）
2. **怎麼測試 Copilot 給的東西**（驗收）
3. **遇到問題怎麼描述**（Debug 語言）
4. **怎麼讓功能越來越接近你要的樣子**（迭代）

詳見 [[vibe-coding]] 概念頁。

---

## 作品導向里程碑

> **S5 的終點不是「學會 JavaScript」，而是「有一個可以給人看的你的作品」。**
> 每一個功能，都是你的專案多長出來的一塊。

| 週次 | 作品狀態 |
|------|---------|
| W6 | 第一次 Vibe Coding：Copilot Chat 幫你做出一個可以在瀏覽器打開的起始頁 |
| W7 | 專案方向確立，初始功能清單寫好 |
| W9 | 至少兩個功能在瀏覽器上可以操作 |
| W12 | 有 Welcome Page + 登入功能 + localStorage 持久化，多頁面可展示版本（MVP） |
| W18 | 連接外部 API，或進一步擴充持久化功能（Firebase / Supabase） |
| W22 | 專案本地可完整執行，準備展示錄影 |
| W24 | 學期結束，提交可展示的完整作品錄影 |

---

## 模組列表

| 模組 | 週次 | 主題 | 核心技能 |
|------|------|------|---------|
| 模組一 | W1–W6 | Vibe Coding 工作室建立 | VS Code、Git、Copilot Chat 開通、第一次 Vibe Coding 體驗 |
| 模組二 | W7–W12 | 專案啟動 + 核心功能堆疊 | 專案宣言、功能菜單選功能、用 Chat 描述 → 實作 → 測試迭代 |
| 模組三 | W13–W18 | 進階功能 | 狀態持久化（localStorage）、外部 API 串接、進階功能（Firebase/Supabase 等，無上限） |
| 模組四 | W19–W22 | 專案深化與完善 | 功能補強、視覺優化、本地展示版 |
| 模組五 | W23–W24 | 學期收尾 | 作品錄影、說明文件、里程碑 |

---

## 概念連結

- [[vibe-coding]]（Vibe Coding 工作流：PM ↔ 工程師框架、迭代對話）
- [[feature-menu]]（功能菜單：web app 軌與遊戲軌的可選功能清單）
- [[project-centric]]（作品導向設計：S5 模組二起生效）
- [[prompt-engineering]]（描述功能給 AI 就是更高層的 Prompt Engineering）
- [[ai-tools]]（GitHub Copilot Chat 為主要工具、Lab Terminal 輔助理解）
- [[ai-first]]（AI 優先：遇到問題先問 Chat，不是老師）

---

## 里程碑成就

| 項目 | 內容 |
|------|------|
| 成就名稱 | 開發者初心 |
| 金幣 | 320（估） |
| 解鎖條件 | 完成所有主線任務，**提交一個本地可執行的完整互動專案錄影**（非截圖），作品需有 Welcome Page 且至少三個功能可操作 |
| 解鎖內容 | 「開發者初心」稱號、小五下任務區域解鎖 |

---

## 任務清單

### 模組一：Vibe Coding 工作室建立（W1–W6）

> 目標：建好工具、完成第一次 Vibe Coding 體驗。W1–W4 聚焦環境設定，W5–W6 聚焦 Copilot Chat 開通與第一次讓 AI 幫你做出網頁。

| 任務 ID | 名稱 | 類型 | 金幣 | 工具 |
|---------|------|------|------|------|
| S5-W01-A | VS Code 完整設定 | EX | 250 | VS Code |
| S5-W02-A | 擴充套件安裝（含 Copilot） | EX | 250 | VS Code |
| S5-W03-A | Git 初次使用 | EX | 250 | VS Code + Git |
| S5-W04-A | 第一次 commit | EX | 250 | VS Code + Git |
| S5-W05-A | Copilot Chat 開通 + 認識功能菜單 | EX | 250 | VS Code + Copilot |
| S5-W06-A | 第一次 Vibe Coding：讓 Chat 幫你做起始頁 | EX | 250 | VS Code + Copilot Chat |

### 模組二：專案啟動 + 核心功能堆疊（W7–W12）

> ⚠️ **作品導向規則在本模組正式生效。** W7-B 的「專案宣言」是進入後續所有任務的前提條件。
> 每個任務的核心流程都是：**描述 → Chat 實作 → 測試 → 迭代**，不是「學習寫程式碼」。

| 任務 ID | 名稱 | 類型 | 金幣 | 工具 |
|---------|------|------|------|------|
| S5-W07-A | Vibe Coding 工作流開箱（PM + 工程師框架） | EX | 150 | VS Code + Copilot Chat |
| S5-W07-B | 我的專案方向宣言 🔑 | EX | 100 | VS Code + Lab Terminal |
| S5-W08-A | 功能一：從菜單選，用 Chat 實作 | EX | 150 | VS Code + Copilot Chat |
| S5-W08-B | 功能一：測試 + 迭代（讓它更符合你要的） | EX | 100 | VS Code + Copilot Chat |
| S5-W09-A | 功能二：從菜單選，用 Chat 實作 | EX | 150 | VS Code + Copilot Chat |
| S5-W09-B | 功能二：測試 + 迭代 | EX | 100 | VS Code + Copilot Chat |
| S5-W09-C | 功能二進階：邊界情況處理（選做，不計入 250）| EX | 50 | VS Code + Copilot Chat |
| S5-W10-A | 新增 Welcome Page | EX | 100 | VS Code + Copilot Chat |
| S5-W10-B | 第一個新功能/修正 | EX | 80 | VS Code + Copilot Chat |
| S5-W10-C | 第二個新功能/修正 | EX | 70 | VS Code + Copilot Chat |
| S5-W10-D | 第三個新功能/修正（進階，不計入 250）| EX | 50 | VS Code + Copilot Chat |
| S5-W11-A | 確認專案有至少 3 個 HTML 頁面 | EX | 75 | VS Code + Copilot Chat |
| S5-W11-B | 功能整合：讓所有頁面可以互相連結 | EX | 100 | VS Code + Copilot Chat |
| S5-W11-C | 加入導航列（Navigation Bar） | EX | 75 | VS Code + Copilot Chat |
| S5-W12-A | 製作登入頁面（login.html） | EX | 75 | VS Code + Copilot Chat |
| S5-W12-B | 用 localStorage 記住登入使用者 | EX | 100 | VS Code + Copilot Chat |
| S5-W12-C | 加入登出功能 | EX | 75 | VS Code + Copilot Chat |

### 模組三：進階功能（W13–W18）

> 技術無上限——能做到什麼取決於學生的描述能力和迭代耐心。
> localStorage、外部 API、Firebase、Supabase 都在選項範圍內。

| 任務 ID | 名稱 | 類型 | 金幣 | 工具 |
|---------|------|------|------|------|
| S5-W13-A | 雲端資料庫：用 Supabase 把資料寫上雲（老師統一提供金鑰） | EX | 150 | VS Code + Copilot Chat + Supabase |
| S5-W13-B | 從雲端讀取顯示 + 跨裝置同步驗證 | EX | 100 | VS Code + Copilot Chat + Supabase |
| S5-W14-A | 部署上線：用 Git 推上 GitHub Pages，拿到公開網址 | EX | 150 | VS Code + Git（CLI）+ GitHub Pages |
| S5-W14-B | 認識網路廣告 + 寫未來廣告計畫（18+/家長框架） | EX | 100 | Lab Terminal |
| S5-W15-A | 連接外部 API：選一個免費 API 串接並顯示 | EX | 250 | VS Code + Copilot Chat |
| S5-W16-A | 進階功能一（自選：進階 API / 其他） | EX | 250 | VS Code + Copilot Chat |
| S5-W17-A | 進階功能二（自選） | EX | 250 | VS Code + Copilot Chat |
| S5-W18-A | 進階功能里程碑：讓進階功能完整可用 | EX | 250 | VS Code + Copilot Chat |

### 模組四：專案深化與完善（W19–W22）

| 任務 ID | 名稱 | 類型 | 金幣 | 工具 |
|---------|------|------|------|------|
| S5-W19-A | 作品功能盤點：還缺什麼？ | EX | 250 | Lab Terminal |
| S5-W20-A | 加入一個新功能 | EX | 250 | VS Code + Copilot Chat |
| S5-W21-A | 作品視覺優化（讓 Chat 幫你改好看） | EX | 250 | VS Code + Copilot Chat |
| S5-W22-A | 本地展示版 Demo 錄影 | EX | 250 | VS Code + 錄影工具 |

### 模組五：學期收尾（W23–W24）

| 任務 ID | 名稱 | 類型 | 金幣 | 工具 |
|---------|------|------|------|------|
| S5-W23-A | 作品錄影 + 說明文件 | EX | 250 | VS Code + 錄影工具 |
| S5-W24-MS | 小五上里程碑｜開發者初心（里程碑週，不適用 250 規則） | MS | 320 | — |

---

> 最後修改：2026-06-10，原因：套用第二十一節「每堂課主線金幣固定 250」規則，全學期 W01–W23 每週主線總額調為 250（單任務週 A250；兩任務週 A150/B100；三任務週 A100/B80/C70；W11/W12 原已是 250）；選做/進階任務（W09-C、W10-D）改標「不計入 250」；W24-MS 里程碑維持 320 不受此限。

> 最後修改：2026-06-10，原因：模組三順序與工具調整。(1) **W13 改用 Supabase**（先前曾改為 Firebase，但 Firebase 帳號有年齡限制、小五學生無法登入而停用）——改為老師統一建立 Supabase 專案、提供 Project URL/anon 金鑰、設好 RLS，學生不註冊帳號（第十六節學校統管）。localStorage 持久化已於 W12 及前一週完成，故 W13 為雲端資料庫，依 Cascade 規則 5 重算金幣 A60/B40。(2) **W14 改為「網頁部署（GitHub Pages，CLI 優先）+ 網路廣告知識」**：上週已有學生成功部署，故把第十六節 S7 的部署概念提前到 S5；廣告依查證（AdSense 須滿 18 歲、未成年由家長申請）設計為概念+未來計畫，呼應 S8 獲利與家長框架。(3) 原 W14「外部 API」順延至 **W15**（與原 W15 顯示任務合併）；W16–18 進階功能順序不變

> 最後修改：2026-05-13，原因：S5 全面改版為 Vibe Coding 工作流——核心哲學從「學習寫函式」轉為「PM 描述功能、Copilot Chat 實作、學生測試迭代」；模組二任務結構大幅重組；移除「寫函式」類型任務；加入功能菜單概念；技術天花板移除（localStorage / 外部 API / Firebase / Supabase 皆可）；新增 [[vibe-coding]] 與 [[feature-menu]] 概念節點
