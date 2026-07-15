# LLM Skills 索引｜課程內容生產工具鏈

## 定義

本課程用來**生產與維護教材**的 LLM skill 清單。原則沿用 CLAUDE.md：「Obsidian 是 IDE；Claude 是程式設計師；wiki 是程式碼。」每個 skill 都把 CLAUDE.md 的規則自動化，規則本身仍以 CLAUDE.md 為單一事實來源，skill 只負責「套用」。

---

## Skill 清單

| Skill | 用途 | 位置 | 規則依據 |
|-------|------|------|---------|
| `worksheet-generator` | 由學期/週次生成每週**學習單**（整合遊戲化、AI 優先、翻轉教育） | 已安裝（`worksheet-generator.skill`） | 全 CLAUDE.md，重點第十五、十七、十八、十九節 |
| `labterminal-course-spec` | 以**學習單為藍本**，產出給工程 LLM 的 **Lab Terminal 互動課程開發文本**（7-screen 規格） | `skills/labterminal-course-spec/` | 重點第二十節（Web App 互動規範）、第十四節（工具政策） |
| `activity-time-estimator` | **動作級耗時估算**：判斷教案/學習單/課程內容太長或太短 | `skills/activity-time-estimator/` | 第二十二節（[[activity-time-model]]）、第十八節 |

> 個人用途 skill（`bm-error-tracker`、`content`、`fitness-wiki` 等）與本課程無關，不列於此。

---

## 工具鏈如何串接

```
學期頁/週次任務
      │  worksheet-generator
      ▼
   每週學習單  ──────────────┐
      │  labterminal-course-spec
      ▼                      │
Lab Terminal 互動課程開發文本   │
      │  第六步呼叫            │
      ▼                      ▼
 activity-time-estimator ← 驗證 7-screen / 學習單時長（50–65 分鐘）
      │
      ▼
   太長/太短判定 → 回頭調整內容
```

- `labterminal-course-spec` 第六步會呼叫 `activity-time-estimator` 驗證時長，並把結果寫進規格後設資料。
- 三者都讀 CLAUDE.md 為準；規則更新時 skill 自動跟著走（不複製條文）。

---

## 輸出存放位置

| 產物 | 位置 |
|------|------|
| 學習單 | `wiki/worksheets/S{N}/` |
| 互動課程開發文本 | `wiki/labterminal-specs/S{N}/` |
| 耗時估算 spec（暫存/附參） | 由使用者決定，通常隨課程規格附上 |

---

## 安裝方式

`skills/` 下的自訂 skill 需到「設定 → Capabilities」加入對應資料夾後才會在對話中觸發（與既有 `worksheet-generator` 相同）。

---

## 相關概念

- [[activity-time-model]]（耗時模型）
- [[lab-terminal]]（課程目標平台）
- [[ai-first]]、[[flipped-education]]、[[gamification-system]]（skill 整合的核心概念）

---

> 最後修改：2026-06-24，原因：新增 LLM skill 索引頁，登錄 worksheet-generator / labterminal-course-spec / activity-time-estimator 及其串接關係
