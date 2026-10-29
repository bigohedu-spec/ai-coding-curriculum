# Lab Terminal Quest｜題型與 NPC 行為契約

> 適用於所有「地圖探索＋右側答題卡」的 Lab Terminal Quest。它補強 [[lab-terminal-quest-level-design-standard]]：題目不只要有可達答案，還必須屬於封閉題型，且 NPC 的說話與行為必須可由資料驅動。

## 1. 一筆交易的固定流程

```text
NPC 看向玩家 → 學生選一句自然的提問（choice）
→ NPC 說出可重聽的來源原文 → 學生複製原句
→ 將原句貼進自由 prompt（fill） → 驗收後造成世界改變
```

來源卡的句子是 NPC 真正說出的話；它不是旁白、提示詞或題目旁的補充說明。四種需求僅由內容資料的不可見覆蓋標籤檢查，學生不可被要求分類或按固定順序排列。

## 2. 題型：只有兩種

`question.type` 是封閉欄位，只能是 `choice` 或 `fill`。題目 renderer 只能依此欄位選擇 UI，禁止依交易 id、站 id 或題目文字分支。

| 題型 | 適用 | 學生操作 | 必填資料 | 不可做 |
|---|---|---|---|---|
| `choice`（選擇） | 學生選一句自然提問，向 NPC 調出對應資訊 | 點選學生會說的問句；每個已問項可重聽 | `studentLine`、`replyLines`、`evidenceId` | 不可把選項寫成猜答案、不可標示正誤、不可固定詢問順序。 |
| `fill`（填充） | 把已取得的 NPC 原句放進自由編輯的 prompt | 點選、拖曳或貼上完整句卡 | `initialText`、`requiredEvidenceIds`、`acceptsEvidenceOrder: 'any'` | 不得改成分類格、固定欄位或依句子順序判錯。 |

### `choice` 資料形狀

```ts
type QuestInquiryChoice = {
  type: 'choice';
  id: string;
  studentLine: string;
  replyLines: string[];
  evidenceId: string;
};
```

### `fill` 資料形狀

```ts
type QuestPromptFill = {
  type: 'fill';
  mode: 'freeform-copy';
  initialText: string;
  requiredEvidenceIds: string[];
  acceptsEvidenceOrder: 'any';
};

type AnswerEvidence = { lineIndex: number; keywords: string[] };
```

### 填充題的可達性規則

每一張可插入的句卡必須逐字等於該 `QuestInquiryChoice.replyLines` 的一行或完整串接；送出時以插入的 `evidenceId` 集合檢查是否包含 `requiredEvidenceIds`，不檢查插入順序。學生不用猜老師指定的分類或句序：他要放進 prompt 的話，已經由 NPC 說過且能直接複製。

## 3. NPC 行為協議

每一站必須有一個 `npcProtocol`。來源卡、題型與 NPC 演出都由它和交易資料驅動；場景程式不得為某位角色或某道題寫 if/switch。

```ts
type NpcProtocol = {
  onApproach: NpcBeat;
  /** NPC 選中的學生提問逐句說 replyLines。 */
  onSourceCard: { action: 'pointAtSource'; speaker: string; speaks: 'inquiryChoice.replyLines' };
  onChoice: { action: 'watchChoice' };
  onFill: { action: 'holdBlankBoard' };
  /** 已問出回答後才揭露同一句可複製句卡。 */
  onCorrect: NpcBeat;
  /** 答錯後重播同一來源卡，不說答案 */
  onWrong: NpcBeat;
  onStationComplete: NpcBeat;
};

type NpcBeat = { action: NpcAction; lines: string[] };
type NpcAction =
  | 'lookAtPlayer'
  | 'pointAtSource'
  | 'watchChoice'
  | 'holdBlankBoard'
  | 'nodAndRevealClue'
  | 'replaySource'
  | 'celebrate';
```

行為的責任固定：

| 事件 | NPC 必做行為 | 不可做 |
|---|---|---|
| `onApproach` | 看向玩家，說一個不超過 25 字的處境句。 | 說分類名或未解鎖回答。 |
| `onSourceCard` | 對應學生問句，逐句說 `inquiryChoice.replyLines`。 | 改寫來源句、臨時加新內容。 |
| `onChoice` | 面向選項，等待學生選一個問題。 | 用表情或動作把某一問題標成正解。 |
| `onFill` | 指向自由 prompt 區，等待插入句卡。 | 顯示分類格、指定句卡次序。 |
| `onCorrect` | 點頭、揭露同一句可複製句卡。 | 代替學生組 prompt 或直接開下一站。 |
| `onWrong` | 重播已選問題的來源回答。 | 換題、扣金幣或說出未問內容。 |
| `onStationComplete` | 慶祝，呼叫該站已定義的世界改變。 | 用「答對幾題所以門開」取代物理後果。 |

## 4. 題目、對白與行為的單一對應

每筆交易必須能走出以下可追溯鏈：

```text
inquiryChoice.id
  → studentLine（學生選擇說出的問題）
  → replyLines（NPC 說的原句）
  → evidenceId（可複製句卡）
  → promptFill.requiredEvidenceIds（自由 prompt 的完成檢查）
  → onStationComplete（驗收後的世界改變）
```

任何一段缺失都不能發布。特別禁止：提問選項不是學生會說的話、NPC 口頭說了另一句、句卡不是 NPC 原句，或以四格／順序取代自由 prompt。

## 5. 驗收

在 [[lab-terminal-quest-level-design-standard]] 的 V-1～V-14 基礎上：

- `choice` 必須通過 V-4、V-5、V-14 的選項檢查。
- `fill` 必須通過 V-4、V-14 的句板回填檢查。
- 每一站 `npcProtocol` 七個階段完整，且來源卡由 `onSourceCard` 唯一輸出。
- `onWrong.action` 必須是 `replaySource`；`onCorrect.action` 必須是 `nodAndRevealClue`。
- 每次題型／NPC 行為新增或修改後，重新跑資料驗證；Phaser 實作後再跑 P-1～P-14。

> 建立：2026-09-09，原因：S3W05 先前版本雖已保證答案可達，但未把題型與 NPC 行為做成封閉、可驗證的資料協議，工程端仍可能漂移。
