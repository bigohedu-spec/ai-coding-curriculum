# 程式教育課｜AI 程式教育課程 LLM Wiki

用 Obsidian 維護、由 LLM 協作編寫的 AI 程式教育課程知識庫（課綱、教案、學習單、互動課程 spec、遊戲 spec、教材生產 skill）。

## 這個 repo 怎麼運作
> 原則：**「Obsidian 是 IDE；LLM 是程式設計師；wiki 是程式碼。」**
- **規則的入口在 [`CLAUDE.md`](CLAUDE.md)**（Schema／頁面格式／cascade 連動／規則索引），細部設計規則在 [`rules/`](rules/)。改任何內容前先讀它。
- **wiki 的入口在 [`wiki/_index.md`](wiki/_index.md)**（學期地圖、概念節點、最後更新記錄）。
- 教材生產的可重用規則在 `skills/`（如 labterminal-course-spec 的設計準則）。

## 目錄結構
```
ai-coding-curriculum/
├── CLAUDE.md              ← 規則入口／Schema
├── rules/                 ← 第十～二十三節設計規則（一節一檔）
├── raw-sources/           ← 原始文件（唯讀）
├── skills/                ← 教材生產 skill 與設計準則
├── specs/                 ← 跨課程規格（Cocos 網頁遊戲）
├── archive/               ← 未使用的舊檔，僅供查閱
└── wiki/                  ← 課程知識庫
    ├── _index.md          ← 入口
    ├── implementation-status.md ← wiki × 正式站對照
    ├── programs/          ← 學程（P1U、S1、S2、S3、S5、extra）：首頁／教案／課程規格
    ├── worksheets/        ← 學習單（路徑固定，gpt-clone 後台讀取）
    ├── semesters/         ← 學期設計頁 P1–S8
    ├── concepts/          ← 跨學期概念
    ├── task-definitions/  ← 任務格式（自動審核用）
    └── quiz-bank/         ← 題庫
```

## 團隊協作 / 版控
請先讀 **[`CONTRIBUTING.md`](CONTRIBUTING.md)**：分支＋PR 流程、commit 慣例、改動時的 CLAUDE.md 審查清單、Obsidian Git 設定。

> ⚠️ **不要把這個資料夾放在 OneDrive／iCloud 等即時同步資料夾**——會和 Git 打架、弄壞 `.git`。用 Git 當唯一的協作同步管道。
