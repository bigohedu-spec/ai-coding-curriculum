# CLAUDE.md — AI 程式教育課 LLM Wiki Schema

> 這是 LLM Wiki 的規則入口。每次讀取這個專案時，Claude 必須先讀這份文件，再讀 `wiki/_index.md`，才能進行任何修改。
> 原則：「Obsidian 是 IDE；Claude 是程式設計師；wiki 是程式碼。」
>
> 這份只放**結構、頁面格式、連動與核心原則**。各項細部設計規則（第十～二十二節）拆在 [`rules/`](rules/) 資料夾，
> **依「規則索引」（第五節）判斷這次要讀哪幾份**；動手前沒讀對應規則檔，不得改教案／學習單／規格。
> 節號（第十五節、第十九節…）保持不變，其他文件、skill、commit 引用的「第 N 節」都對應 `rules/` 內同號檔案。

---

## 一、專案結構

```
ai-coding-curriculum/
├── CLAUDE.md                ← 你現在讀的這份（Schema／規則入口）
├── AGENTS.md                ← S3 答題版課程的 agent 指令
├── README.md、CONTRIBUTING.md   ← 簡介；分支／PR／commit 流程
├── RULESFORAI.md、DEPLOYFORAI.md ← Big-Oh Hosting 規範（部署與 window.BO）
├── raw-sources/             ← 原始文件，唯讀，不可修改
├── rules/                   ← 第十～二十二節設計規則（一節一檔）；archive/ 放已作廢規則
├── skills/                  ← 教材生產 skill（見第七節）
├── specs/                   ← 跨課程規格（如 cocos-web-games）
├── docs/                    ← 補充文件
└── wiki/                    ← Claude 維護的知識庫
    ├── _index.md            ← 課程總覽入口
    ├── concepts/            ← 跨學期概念節點（16 頁）
    ├── semesters/           ← 學期頁：P1上／P1下／P2上／P2下、S1–S8（S4–S8 另有合併概覽）
    ├── lesson-plans/        ← 教案與互動設計規格
    │   ├── P1U/、S1/、S2/、S3/、S5/    ← 依系列分資料夾
    │   └── extra/           ← 額外模組：3D-print、ai-picturebook、minecraft-survival
    ├── worksheets/          ← 學習單（P1U、S1、S2、S3、S5、extra/3D-print）
    ├── labterminal-specs/   ← Lab Terminal 互動課程／遊戲開發規格（S1、S2、S3、S5）
    ├── task-definitions/    ← 任務格式（自動審核用）
    └── quiz-bank/           ← 題庫與分班題庫
```

**系列代碼**：`P1U` 是小一的 Cocos 遊戲系列（Arc 制，如小熊麵包坊）；`P1上／P1下／P2上／P2下` 是 P 系列學期頁；`S1–S8` 是主線，每學期 24 週。
**覆蓋狀況**不在這裡維護——以 `wiki/_index.md` 的學期地圖與各資料夾實際檔案為準。

### 檔名慣例

| 類型 | 檔名 | 位置 |
|------|------|------|
| 教案 | `[系列]-W[兩位數週次]-教案.md` | `wiki/lesson-plans/[系列]/` |
| 學習單 | `[系列]-W[兩位數週次]-學習單.md` | `wiki/worksheets/[系列]/` |
| 互動課程規格 | `[系列]-W[週次]-課程規格*.md`、`*-互動設計規格.md` | `wiki/labterminal-specs/` 或 `lesson-plans/` |
| 學期頁 | `[學期代碼]-[年級學期]-[主題].md` | `wiki/semesters/` |
| 概念頁 | 英文 kebab-case（`prompt-engineering.md`） | `wiki/concepts/` |

檔名即 `[[連結]]` 名稱，全 wiki 內不可重複。

---

## 二、資料層定義

| 層 | 位置 | 誰改 | 用途 |
|----|------|------|------|
| Raw Sources | `raw-sources/` | **Claude 永遠不修改** | 事實來源，ingest 時讀取 |
| Wiki | `wiki/` | Claude 維護，依本 Schema 更新 | 已編譯知識，每次對話的記憶體 |
| Rules | `rules/` | 使用者修改，Claude 遵守 | 第十～二十二節設計規則 |
| Schema | `CLAUDE.md` | 使用者修改，Claude 遵守 | 結構、格式、連動規則 |

---

## 三、Wiki 頁面格式規範

### 教案頁（`S*-W**-教案.md`）

```markdown
# [學期] W[週次]｜[任務名稱] 教案

## 基本資訊
- 年級 / 學期 / 週次 / 模組 / 時間 / 任務 ID / 工具 / 金幣

## 教學目標
（2–3 條具體可觀察的目標）

## 三大核心概念對應
- 🎮 遊戲化：（本週具體應用）
- 🤖 AI 優先：（本週 Lab Terminal 使用方式，或預告）
- 🔄 翻轉教育：（本週助教機制）

## 課前準備
- 教師：
- 學生：

## 課堂流程
| 時間 | 活動 | 說明 | 教師角色 |
（最後一行必須是 60–90 分鐘自由遊玩，見第十三節）

## Lab Terminal Prompt 建議
（本週使用 Lab Terminal 的方式；課堂不含 Minecraft）

## 翻轉教育流程
（先行者流程 / 進行中學生 / TA 金幣計算）

## 成功條件
| 任務 ID | 金幣 | 成功條件 |

## 老師筆記
- 常見問題 / 延伸挑戰 / 教學重點提醒

## 連結
- 所屬學期、前一週、後一週（如有）、對應學習單
```

### 學習單頁（`S*-W**-學習單.md`）

```markdown
# [學期] W[週次]｜[任務名稱] 學習單

## 今天的冒險          （1–2 句遊戲化介紹；S1–S4 依第十九節改為 Hook）
## 課堂大綱            （時間／活動／說明）
## 本週任務            （任務說明＋步驟＋成功條件＋金幣）
## 問 AI 的方式（Lab Terminal）   （2–3 個提問起點，非預寫答案，見第十七節）
## 翻轉教學時間        （先完成者／進行中學生）
## 今天學到什麼？      （反思問題）
## 老師筆記            （常見問題／延伸挑戰）
## 連結                （對應教案、所屬學期）
```

> 學習單定稿前還要過：工作量 ECT 驗證（第十八節，附 HTML 注釋於檔尾）、金幣總額（第二十一節）。
> **PR #16 會再新增「## 本週學習重點【必填】」一節與第二十三節**；該 PR 合併後，本頁格式與規則索引需同步補上。

### 學期頁（`semesters/*.md`）

必備：學期概覽（年級／週數／核心目標／前置與下一學期連結）、模組列表（模組／週次／主題／核心技能）、概念連結、里程碑成就（名稱／解鎖條件／解鎖內容）、任務清單（ID／名稱／類型／金幣）。

### 概念頁（`concepts/*.md`）

必備：定義、首次出現（學期連結＋週次）、跨學期進展表（學期／深度等級／對應任務）、相關概念連結。

---

## 四、Cascade 更新規則

當任何層級發生改變，Claude 必須向下傳播（高層改→往下查；低層改→往上確認一致）。

| # | 觸發 | 必須同步檢查／更新 |
|---|------|------------------|
| 1 | 學期頁「核心目標」改變 | 該學期各模組描述；`wiki/_index.md` 學期概述；相關 `concepts/` 的「跨學期進展」 |
| 2 | 模組「主題」或「核心技能」改變 | 模組下所有任務的說明與成功條件；工具選擇是否仍符合；金幣難度是否匹配 |
| 3 | 新增任務類型 | `wiki/concepts/task-types.md` |
| 4 | 工具替換 | 所有受影響任務；`wiki/concepts/ai-tools.md`；在 `wiki/_index.md` 加「工具更新記錄」 |
| 5 | 難度曲線調整 | 重新評估該學期金幣（一般週固定 250，僅 MS 里程碑週需校準，見第二十一節） |
| 6 | 教案、遊戲任務或 AI 問答內容改變 | 同一個 commit 一併改該週學習單（與 PR #16 的第二十三節一致） |
| 7 | 與已上線成品（遊戲、Lab Terminal 課程）衝突 | **以成品為準**並回填 wiki；推得的值標「推定」，難度手感標「假設待實玩校準」 |

---

## 五、規則索引（第十～二十二節，在 `rules/`）

做以下事情前，先讀對應規則檔。

| 節 | 檔案 | 什麼時候要讀 | 標記 |
|----|------|------------|------|
| 十 | [10-課後Minecraft複習](rules/10-課後Minecraft複習.md) | 設計課後 Minecraft 題庫複習（課堂不再有 MC 任務；細節多數待定） | 2026-10-28 新 |
| 十一 | [11-工具替換](rules/11-工具替換.md) | 任務裡出現 ChatGPT／Claude／Canva AI 等第三方工具 | |
| 十二 | [12-作品導向](rules/12-作品導向.md) | S5 模組二（W7）起的 EX 任務 | 不可違反 |
| 十三 | [13-課堂時間結構](rules/13-課堂時間結構.md) | 寫任何教案（60 分鐘任務＋30 分鐘自由時間；課堂不含 Minecraft） | 強制 |
| 十四 | [14-工具使用政策](rules/14-工具使用政策.md) | 任何用到 AI 或雲端的任務（Lab 系列、`window.BO`） | 不可違反 |
| 十五 | [15-學習單步驟詳細度](rules/15-學習單步驟詳細度.md) | 學習單的**工具操作**步驟（VS Code、Copilot） | 不可違反 |
| 十六 | [16-部署政策](rules/16-部署政策.md) | 部署、雲端、廣告、家長協作 | S7 里程碑 |
| 十七 | [17-開放式學習目標](rules/17-開放式學習目標.md) | S5 起學習單的**學習目標**（要開放，不拆成步驟） | 不可違反 |
| 十八 | [18-工作量ECT](rules/18-工作量ECT.md) | 學習單定稿前驗證（主線 50–65 分鐘） | 不可違反 |
| 十九 | [19-低年級學習單](rules/19-低年級學習單.md) | S1–S4 學習單與教案 | 強制 |
| 二十 | [20-WebApp互動設計](rules/20-WebApp互動設計.md) | Lab Terminal 互動課程頁面（含 7-screen 骨架、防作弊、雙難度） | 所有年級；S3 答題版有例外 |
| 二十一 | [21-金幣總額](rules/21-金幣總額.md) | 設定任一週金幣（主線 250） | 標準 |
| 二十二 | [22-活動耗時模型](rules/22-活動耗時模型.md) | 估算內容太長／太短（動作級秒數） | 設計輔助 |

**怎麼配對**：寫 S1–S4 學習單＝13＋19＋18＋21（再加 20 若是互動課）；寫 S5+ 學習單＝13＋15＋17＋18＋21；課後 Minecraft 複習＝10（目前多項待定）；牽涉雲端／部署＝14＋16。

> 已作廢的舊規則放 `rules/archive/`（目前：舊第十節 Vanilla MC 任務驗證）。第十八、十九、二十二節仍含舊 Minecraft 任務的 ECT 與範例，待第 3 階段清理，新寫內容不得照用。

**S3 答題版例外**：`gamma-answer-worksheet`（S3 GAMMA＋答題卡）不套用第二十節的 7-screen 骨架，改依 `wiki/labterminal-specs/S3/S3-答題版學習單新架構規格.md` 與 `skills/s3-answer-sheet-course/SKILL.md`；細節見 `AGENTS.md`。

---

## 六、課程核心設計原則（勿違反）

1. **遊戲化閉環**：課堂內學習都在 Lab Terminal 等課堂遊戲介面發布任務、驗收、給獎勵；**Minecraft 不在課堂，只在課後做題庫複習**（第十節，2026-10-28 決策）
2. **興趣為主軸**：從小三的「興趣清單」到小六的「獲利嘗試」，脈絡不能斷
3. **AI 協作重於工具使用**：每個 EX 任務都要體現「怎麼 prompt AI 得到你要的結果」
4. **作品真實可累積**：學生每學期都有可以帶走的作品
5. **難度螺旋上升**：同樣的技能（例如 Prompt）在不同學期用更高要求重現

### 四大核心概念

| 概念 | 一句話 | 詳見 |
|------|-------|------|
| 遊戲化理論 | 進度可見、難度曲線、稱號、社交動力、定時循環、失敗安全 | [[gamification-theory]] |
| AI 優先 | 遇到問題先問 Lab Terminal，不是老師；多 AI 比較也在 Lab Terminal 內建夥伴完成，學生不碰真 Claude／ChatGPT（2026-08-20 決策） | [[ai-first]] |
| 翻轉教育 | 求助順序：學習單 → Lab Terminal → 同學 → 老師（次數有限）；TA 任務領原任務 50% | [[flipped-education]] |
| Vibe Coding | S5 起：你是 PM、Copilot Chat 是工程師；從功能菜單選功能，核心技能是描述、驗收、迭代 | [[vibe-coding]]、[[feature-menu]] |

### 任務格式（Task Schema）

每個任務在 wiki 內要有可接入自動審核與 Quiz 的定義，必填 `checkpoints`（驗收點＋evidence_type＋evaluation_criteria）、`skill_tags`、`unlocks_quiz_tags`。
存放：`wiki/task-definitions/S{N}-tasks.md`、`wiki/quiz-bank/S{N}-quiz-bank.md`；格式見 [[task-schema]]。

---

## 七、三個標準操作

### INGEST（新增原始資料）
1. 閱讀 `raw-sources/` 的新文件
2. 判斷影響哪些 wiki 頁面
3. 更新受影響頁面
4. 在 `wiki/_index.md` 的更新記錄加日期與摘要

### QUERY（查詢）
1. 先查 wiki，不要重讀 raw-sources
2. wiki 找不到才回頭讀 raw-sources，並把結果補進 wiki

### LINT（健康檢查）

定期執行，逐項確認：

- 所有 `[[連結]]` 指向存在的頁面（教案互指「下一週」但下一週尚未建立時，改寫成純文字「（尚未建立）」，不留壞連結）
- 沒有孤兒頁（每頁至少被一個頁面連到，通常是學期頁或 `_index.md`）
- 檔名在全 wiki 內不重複
- 每個學期頁的任務數與 raw-sources／實際教案一致
- 概念頁的「跨學期進展」沒有缺漏學期
- 一般週次主線金幣為 250、ECT 在 50–65 分鐘
- 與已上線成品一致（第四節 cascade 7）

可用 skills 輔助：`skills/activity-time-estimator`（時長）、`skills/labterminal-course-spec`（互動課規格）、`skills/s3-answer-sheet-course`（S3 答題版）。

---

## 八、修改原則

1. **只改 wiki／rules／schema，不改 `raw-sources/`**
2. **有改動就記錄**：受影響頁面底部加 `> 最後修改：YYYY-MM-DD，原因：...`；重大改動同步補 `wiki/_index.md` 更新記錄
3. **連動要完整**：見第四節
4. **保留設計意圖**：修改前先確認該模組的教學目的，不因改細節破壞整體脈絡
5. **改規則時**：改 `rules/` 內對應檔，並同步更新第五節索引；節號不改，避免外部引用失效
6. **分支＋PR**：流程與 commit 慣例見 `CONTRIBUTING.md`（`rule(§N)` 類型用於規則變更）

---

> 最後修改：2026-10-28，原因：wiki 大翻新第 1 階段（並納入負責人決策：Minecraft 退出課堂、只留課後自建伺服器題庫複習，改第六、十、十三節）——CLAUDE.md 由 1473 行精簡為入口，第十～二十二節無損拆到 `rules/`（第十六節除外，已刪作廢的 GitHub Pages／Supabase 條文）；資料夾圖對齊實際結構（P1U、labterminal-specs、quiz-bank 等）；新增檔名慣例、規則索引與具體 LINT 清單。
