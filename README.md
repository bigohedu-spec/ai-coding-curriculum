# 程式教育課｜AI 程式教育課程 LLM Wiki

用 Obsidian 維護、由 LLM 協作編寫的 AI 程式教育課程知識庫（課綱、教案、學習單、互動課程 spec、遊戲 spec、教材生產 skill）。

## 這個 repo 怎麼運作
> 原則：**「Obsidian 是 IDE；LLM 是程式設計師；wiki 是程式碼。」**
- **規則的唯一真相在 [`CLAUDE.md`](CLAUDE.md)**（Schema／二十多條課程設計規則／cascade 連動）。改任何內容前先讀它。
- **wiki 的入口在 [`wiki/_index.md`](wiki/_index.md)**（學期地圖、概念節點、最後更新記錄）。
- 教材生產的可重用規則在 `skills/`（如 labterminal-course-spec 的設計準則）。

## 目錄結構
```
程式教育課/
├── CLAUDE.md              ← 規則/Schema（唯一真相）
├── raw-sources/           ← 原始文件（唯讀）
├── wiki/                  ← 課程知識庫
│   ├── _index.md          ← 入口
│   ├── concepts/          ← 跨學期概念
│   ├── semesters/         ← 學期頁 P1–S8
│   ├── lesson-plans/      ← 教案（含 extra/ 額外模組）
│   ├── worksheets/        ← 學習單
│   ├── labterminal-specs/ ← Lab Terminal 互動課/遊戲開發 spec
│   ├── task-definitions/  ← 任務格式（自動審核用）
│   └── quiz-bank/         ← 題庫
└── skills/                ← 教材生產 skill 與設計準則
```

## 團隊協作 / 版控
請先讀 **[`CONTRIBUTING.md`](CONTRIBUTING.md)**：分支＋PR 流程、commit 慣例、改動時的 CLAUDE.md 審查清單、Obsidian Git 設定。

> ⚠️ **不要把這個資料夾放在 OneDrive／iCloud 等即時同步資料夾**——會和 Git 打架、弄壞 `.git`。用 Git 當唯一的協作同步管道。
