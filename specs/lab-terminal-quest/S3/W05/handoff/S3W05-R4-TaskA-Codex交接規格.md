# S3W05 Lab Terminal Quest｜R4 任務A（河畔農場）工程交接規格

> 交接對象：Codex，接續 Claude 在同一個 repo（`gpt-clone`，Windows 路徑 `C:\Users\COSH\Desktop\CodingClass\gpt-clone`）上的工作。
> 這份文件本身要能獨立讀懂、獨立動工，不依賴任何先前的對話紀錄。

---

## 0. 這份規格解決三個「開工前必須先定案」的問題

在讀任何實作細節之前，先確認下面三件事——這是 Claude 在讀完原始 R4 規格文件、比對現有 repo 程式碼後，發現的三個會讓實作卡死或建錯的衝突點。**每一點都附了建議解法，但都需要人確認才能動工**，因為都牽動既有系統。

### 0.1 世界座標系統衝突（最高風險，會讓整個 Phaser 場景建錯）

原始交接 Prompt（`S3-W05-Lab-Terminal-Quest-Phaser-實作交接Prompt.md`）第「世界常數與位置」節寫死：

```
唯一常數來源是 R3 題庫 JSON 的 world：
WORLD_WIDTH  = 960
WORLD_HEIGHT = 7500
playerBounds = x: 80–880, y: 260–6500
站錨點：河畔(360,1300)、工坊(640,2700)、霧谷(340,4100)、遺跡(520,5500)
```

但這個 repo **目前實際在跑**的 `src/config/s3w05QuestData.json`（`revision: "S3W05-LTQ-R2-20260909"`）是：

```json
"world": { "width": 3600, "height": 3000, "playerBounds": { "left": 160, "right": 3440, "top": 160, "bottom": 2800 } }
```

站是 bridge / windmill / signpost / relic，錨點也完全不同，是舊一世代（R2）的資料，跟交接 Prompt 指名要讀的「R3 JSON」（`S3-W05-Lab-Terminal-Quest-題庫資料.json`，在 `ai-coding-curriculum/specs/lab-terminal-quest/S3/W05/`）是兩份不同世代、不同座標系統的資料。

**這個 repo 裡最近才做完的碰撞區域編輯器（見第 4 節）就是基於現在這份 R2 JSON 的 3600×3000 世界蓋的**——如果直接套用 R3/R4 的 960×7500，那個編輯器的座標系統會整個對不上。

**必須先決定**（人工決策，不是工程判斷）：
- (A) 用 R3 JSON 的 960×7500 完全取代現有 R2 JSON，河畔農場等四站錨點全部改用 R3 版本，舊的 3600×3000 資料與碰撞編輯器一併遷移到新座標系；或
- (B) 現有 3600×3000 才是要繼續維護的正典，R3 JSON 的世界常數段落是舊文件、要更新成跟現況一致再套用。

**Codex 動工前必須先拿到這個決策**，否則不管照哪個座標系走，都有一半機率是在建一個之後要整個作廢重做的場景。

### 0.2 DialogueBox 無法直接承載任務A的對話選單，需要新做一層

`src/phaser/ui/DialogueBox.ts`（已有、可重用元件）目前的資料結構是**單軌序列＋一個游標**：

```ts
private lines: DialogueLine[] = [];
private index = -1;
advance(step: 1 | -1) { /* 只能前後移動 */ }
play(lines: DialogueInput[], opts) { /* 整批取代內容，從頭播 */ }
```

沒有「同時列出 N 個可點選項、各自獨立 done 狀態、選了才展開對應回覆」這種選單概念——這是結構性限制，不是差個參數能解的。

而 R4 任務A（規格 `S3-W05-Lab-Terminal-Quest-R4-序章與任務A內容規格.md` §2、§4，以及交接 Prompt「內容與 UX 不可變條件」第 2 條）要的是：

- 四句提問**同時**在右側對話框可選（不是排隊播放）
- 每句有獨立的「已問過 / done」狀態，選過的仍可重聽，不影響其他三句的狀態
- 選了才顯示阿穗的 `replyLines`，然後解鎖對應句卡去複製、貼進自由 prompt

**建議解法**（沿用交接 Prompt 自己定義的 Phaser/React 邊界，不需要額外討論）：
1. **新做一個 React 端的選項選單元件**（右側對話框，任務A專用）：同時渲染四個 `InquiryChoice`，各自追蹤 `done: boolean`，點擊後標記 done 並展開該筆 `replyLines`。這塊完全不碰 Phaser。
2. **`DialogueBox` 繼續用在 Phaser 側，但只負責「阿穗說話」這一個演出動作**——選了一句提問後，React 透過 `quest:showDialogue` 事件把該句的 `replyLines` 丟給 Phaser 場景裡的 `DialogueBox` 實例 `play()`，做出有情緒、逐字顯示的演出；`getPlainText()` / `getCurrentText()` 把原文吐回給 React，餵進可複製句卡。
3. 重聽＝對同一 `evidenceId` 再送一次 `quest:showDialogue`，不需要 DialogueBox 支援「跳回選單」這種語意——它從頭到尾都只播一小段，播完由 React 的選單狀態機接手。

這個解法**不需要改 DialogueBox 本體**，只需要在它外面包一層 React 選單 + 一個新的資料傳遞事件。是否照這個方向做，或是有別的偏好（例如乾脆不用 DialogueBox、任務A的阿穗對話完全走 React DOM），請先定案。

### 0.3 `quest:showDialogue` 事件不在封閉事件清單裡（既有 bug，順手一起修）

`src/phaser/eventContract.ts` 的 `QUEST_EVENTS`（唯一合法事件白名單，共 15 個）目前是：

```ts
export const QUEST_EVENTS = [
  "quest:stateUpdate", "quest:lockMovement", "quest:startMiniGame", "quest:startCombat",
  "quest:spawnReward", "quest:resetMap", "quest:move", "quest:triggerInteract",
  "combat:claim", "combat:choice", "combat:end", "quest:nearby", "quest:interact",
  "quest:miniGameCleared", "quest:coinCollected",
] as const;
```

但 `quest:showDialogue` 已經在 `PhaserGame.tsx` 和 `MapScene.ts` 裡實際 emit/on 了，卻不在這個清單裡——這是舊有、與這次任務無關的既有落差，**不是這次改動造成的**，但既然任務A的對話流程會重度依賴這個事件，建議這次一併把它加進 `QUEST_EVENTS`，否則任何依賴這份白名單做型別檢查或 P-1～P-14 驗收的機制都會漏掉它。

---

## 1. 交接文件位置（都在使用者機器上，已確認存在且完整）

路徑根目錄：`C:\Users\COSH\Desktop\CodingClass\ai-coding-curriculum\specs\lab-terminal-quest\`

| 文件 | 相對路徑 | 用途 |
|---|---|---|
| R4 序章與任務A內容規格 | `S3\W05\S3-W05-Lab-Terminal-Quest-R4-序章與任務A內容規格.md` | **本次改動的唯一內容正典**，優先讀 |
| 建置規格（R3，其餘三站） | `S3\W05\S3-W05-Lab-Terminal-Quest-建置規格.md` | 河畔農場以外三站（工坊/霧谷/遺跡）的正典，這次不動，但要保持相容 |
| 題庫資料 JSON（R3） | `S3\W05\S3-W05-Lab-Terminal-Quest-題庫資料.json` | 機讀資料來源；任務A要遷移成 R4 模型，不可直接套用舊 `transactions[]` 欄位 |
| 世界觀規格 | `S3\S3-世界觀規格-溪谷鎮.md` | 角色聲音與世界觀；反例角色內容不再使用 |
| NPC/題型契約 | `standards\lab-terminal-quest-question-npc-contract.md` | 唯二題型（`choice`/`fill`）與站級 NPC 行為協議 |
| 關卡設計標準 | `standards\lab-terminal-quest-level-design-standard.md` | A/B/C 分級與 V-1～V-14 驗證規則定義 |
| Phaser runtime 標準 | `standards\lab-terminal-quest-phaser-runtime-standard.md` | R-1～R-10、P-1～P-14 工程契約 |
| Phaser 工程交接 Prompt | `S3\W05\S3-W05-Lab-Terminal-Quest-Phaser-實作交接Prompt.md` | 這次任務的原始總體交接文件（範圍、驗收、邊界規則全在這） |

**歷史版本，不可當內容來源**（交接 Prompt 自己列的）：`v3-階梯題目與QA.md`、`v4-NPC對話題目與QA.md`、`QA與答案來源.md`。

Codex 動工前務必先讀「R4 序章與任務A內容規格.md」全文，再讀「Phaser-實作交接Prompt.md」全文——這份規格文件只是摘要+落地方案，不是取代原文。

---

## 2. 本次任務範圍（明確邊界）

**只做**：序章 + 河畔農場（任務A）的 R4 模型重建。

**不做**：工坊／霧谷／遺跡三站——這三站繼續用現行 R3 的 `transactions[]` + `choice`/`fill` 題型模式，資料結構不變，只需要保證任務A的新資料形狀（discriminated union）不會破壞這三站的既有型別與驗證。

---

## 3. 任務A的核心內容正典（逐字，來自 R4 規格 §2）

### 序章

| 追蹤碼 | 文字 |
|---|---|
| `prologue.problem` | 橋面太窄又不安全，菜車無法過河，農場的菜也送不到工坊。 |
| `prologue.villagerLines.0` | 農夫阿穗：「橋太窄，菜車過不了河。」 |
| `prologue.villagerLines.1` | 農夫阿穗：「先問清楚需要什麼，再請它畫。」 |
| `prologue.playerMission` | 到河畔農場問阿穗，把重要句子貼進你的 prompt。 |

### 河畔農場抵達對話

- 阿穗：「菜車卡在河邊，菜還沒送走。」
- 阿穗：「你想知道什麼，就直接問我。」

### 四個提問選項（`choice`，可任意順序選，全部都是有效提問，沒有正解/錯誤之分）

| 學生台詞 | 阿穗回答（逐字可複製） | `evidenceId` |
|---|---|---|
| 「這座橋是拿來做什麼的？」 | 「這座橋要讓載菜的菜車過河。」「菜車比人寬，橋面要夠寬。」 | `bridge-use` |
| 「菜車要怎麼安全過橋？」 | 「橋面要鋪平木板，兩邊都接好。」「再用粗繩把木板綁緊。」 | `bridge-build` |
| 「修橋時，有什麼不能出錯？」 | 「橋面不能有破洞、尖刺或鬆掉的木板。」「不然菜車會卡住或翻倒。」 | `bridge-safety` |
| 「橋修好後，你希望完成什麼？」 | 「我要在天黑前把菜安全送到工坊。」 | `bridge-delivery` |

規則：每次選擇後 NPC 要看向玩家、說出對應回答、右側解鎖可複製句卡；已問過的顯示「已問過」但仍可重聽；**不可標示正確/錯誤**，也不可暗示下一句該問什麼。

### 自由 prompt 填充（`fill`）

- 問題提示：「橋面太窄又不安全，菜車無法過河。」
- 任務提示：「問阿穗，把重要句子貼進你的橋梁 prompt。」
- 欄位初始文字：`請畫一座橋。`
- 操作：點選或拖曳可把整張回答句卡插入欄位；學生可刪除、重貼、任意排序。
- 送出前提示：`每一句都可能讓橋更能幫上忙。`
- 驗收規則：送出內容必須包含四張已解鎖句卡的 `evidenceId`；**不可用分類格、固定欄位順序、關鍵詞順序或文字美感判定**。
- 完成對話：阿穗：「菜車能過河了，工坊也等得到菜了！」
- 世界後果：完整藤橋出現；菜車駛過橋前往工坊。

### 教學判準（R4 規格 §1，這是這次改動的精神，要貫穿所有實作）

- 四種需求分類（做什麼/怎麼做/不能做什麼/目標）只供**內容作者**檢查完整性，**不顯示給學生、不要求學生排序或分類**。
- `choice` 是學生說出口的自然提問，不是三選一猜答案。
- `fill` 是把已取得的原句貼進自由編輯的 prompt，不是填分類格，不是背誦改寫。
- 完成判定＝四張已問出的句卡都插入 prompt 並送出附件驗收，**不是四格放對位置**。

---

## 4. 現有 repo 狀態（Codex 接手前，這些是本 session 已經完成、已提交到裝置的東西）

- `src/pages/admin/s3w05-quest-editor.tsx`：admin 專用關卡編輯器，含逐項編輯／JSON／即時模擬／正典檢視／地圖碰撞五個分頁，走 `previewMode` + `contentOverride` 沙箱、不影響正式資料。
- `src/utils/s3w05ContentCanon.ts`：把目前內容（正式或編輯中草稿）即時轉成 Markdown 正典文件的 formatter。
- `src/utils/collisionZones.ts` / `src/utils/s3w05CollisionSuggestions.ts`：純函式的碰撞多邊形判定＋規則式建議產生器（非 AI）。
- `src/phaser/scenes/MapScene.ts`：加了 `resolveCollisionZones()`、`playerStart` 資料化、碰撞區域的每軸滑動處理。
- `src/config/s3w05QuestValidation.ts`：`validateS3W05LabQuestDefinition()`，目前已有 V-1～V-18（V-15～V-18 是這次碰撞編輯器加的，跟任務A無關）。

**這些都是基於現有 R2（3600×3000）世界資料蓋的**，直接呼應第 0.1 節的座標系衝突——這也是為什麼那個決策必須先拿到才能動工：如果換成 R3/R4 的 960×7500，上面這些既有功能（尤其碰撞編輯器）的座標假設會需要跟著遷移。

`src/types/S3W05Quest.ts` 目前的核心型別（任務A新增 `InquiryChoice`/`FreeformPromptFill` 時要以此為基礎擴充，不要整個重寫）：

```ts
export interface S3W05QuestData {
  revision: string;
  world: { width: number; height: number; playerBounds: PlayerBounds; playerStart: WorldPoint; collisionZones: CollisionZone[] };
  stations: QuestStation[];  // 現行 R3/R2 的站定義，含 transactions[]
}
```

`QuestStation.transactions: QuestTransaction[]` 是舊模型（`requirement`/`question.answerIndex`/`clueText` 四格）。**任務A那一站不能再用這個形狀**，需要 R4 規格 §3 定義的 discriminated union：

```ts
type InquiryChoice = {
  id: string;
  type: 'choice';
  studentLine: string;
  replyLines: string[];
  evidenceId: string;
  copyText: string;
  coverageTag: 'purpose' | 'construction' | 'safety' | 'outcome'; // 僅內容驗收用，不可傳給學生 UI
};

type FreeformPromptFill = {
  type: 'fill';
  mode: 'freeform-copy';
  initialText: string;
  requiredEvidenceIds: string[];
  acceptsEvidenceOrder: 'any';
};
```

四個 `InquiryChoice` 的 `replyLines` 要完全等於第 3 節表格的回答；`copyText` 是同一筆 `replyLines` 換行串接；`evidenceId` 依序為 `bridge-use`/`bridge-build`/`bridge-safety`/`bridge-delivery`。

---

## 5. Phaser／React 邊界（不可違反，原文照搬）

- **Phaser 端**：世界座標、移動、碰撞、鏡頭、鄰近判定、五態素材、閘門、動畫、就地提示、金幣掉落，以及 NPC 協定指定的**非答案**動作（看向、指向、播放橋生成/菜車/開閘動畫）。
- **React 端**：對話選項、NPC 回答、句卡複製、自由 prompt、附件驗收、金幣帳與進度狀態機。
- 僅以 runtime 標準 §4 定義的封閉 event bus 溝通（見第 0.3 節，`quest:showDialogue` 需要補進白名單）。
- `MapScene`、`MiniGameScene`、`CombatScene` **不得持有答案資料**，也**不得用題目／站 id 字串分支行為**。
- `MiniGameScene` 只接收 `interaction`，完成時只發 `quest:miniGameCleared`；React 才開啟題目。
- Phaser **不得接觸**：`replyLines`、`copyText`、`coverageTag`、`requiredEvidenceIds`，以及後三站的 `answerIndex`、`acceptedAnswers`、`answerEvidence`、`optionMisconceptions`。

---

## 6. NPC 行為表（資料驅動，逐字照搬 R4 規格 §4）

| 事件 | 阿穗的動作與台詞 | React 端行為 |
|---|---|---|
| 靠近 | 看向玩家，說抵達對話 | 開啟四個學生提問選項 |
| 選擇 | 面向玩家，說該選項的 `replyLines` | 解鎖同筆可複製句卡；不計答錯 |
| 重聽 | 重播同一筆 `replyLines` | 保留已複製狀態 |
| 填充 | 指向 prompt 區 | 接受任意順序的句卡插入 |
| 缺句送出 | 指向尚未插入的句卡，不說出內容 | 顯示「還有阿穗說過的句子可以放進來。」 |
| 完成 | 看向已修好的橋，說完成對話 | 播放橋生成、菜車通行與開閘 |

Phaser 只演出看向、指向、橋生成、菜車與五態；對話選項、回覆文字、複製、句卡插入、完成判定與 Lab Image 驗收都留在 React。

---

## 7. 世界常數（待 0.1 節決策定案後套用）

決策前先列出兩邊的真實數字供比對，不預設答案：

**R3/R4 規格主張的（交接 Prompt 原文）**：
```
WORLD_WIDTH  = 960
WORLD_HEIGHT = 7500
playerBounds = x: 80–880, y: 260–6500
站錨點：河畔(360,1300)、工坊(640,2700)、霧谷(340,4100)、遺跡(520,5500)
```

**現有 repo 實際在跑的（`src/config/s3w05QuestData.json`, revision R2）**：
```
width: 3600, height: 3000
playerBounds: { left: 160, right: 3440, top: 160, bottom: 2800 }
```

交易位置一律用 `station.anchor + transaction.worldOffset` 算出，禁止散落第二份絕對座標或世界高度常數——這條規則不受 0.1 節決策影響，兩邊都適用。

---

## 8. 內容與 UX 不可變條件（原文照搬，交接 Prompt 全文）

1. 四站依序為農場、工坊、霧谷、遺跡；後站在前站驗收前仍要可見，但呈 `locked`。
2. 任務A的地圖只需要阿穗與壞橋；四個提問在右側對話框**同時可選**，已問項為 `done` 且可重聽。後三站維持每站 4 個來源物件同時可見；未輪到的顯示 `locked`，不可以直接不渲染。
3. 所有 NPC 與來源物件都要實作 `locked`、`available`、`nearby`、`active`、`done` 五態；不只靠顏色，要有 icon、外框或文字。`nearby` 時物件旁顯示「E 交談」或「E 調查」。
4. 任務A左右兩欄的當前目標固定同步為「問阿穗」或「把句子貼進我的橋梁 prompt」；後三站才使用相同 `sourceLabel` 指名互動點。
5. 任務A的 `choice` 顯示四個自然問句；選後先完整說出回答並解鎖可複製句卡。`fill` 是自由 prompt 區，不顯示單字空格或答錯冷卻。後三站維持 R3 題目流程。
6. 任務A的句卡放進同一自由 prompt 區，來源不得標示分類；不得渲染右側四格。後三站暫時維持 R3 的線索流程。
7. 任務A四張句卡均插入、Lab Image 附件驗收通過後，才播放橋生成、開閘並入帳金幣。不要根據圖片美感判分。
8. 每站直接說明學生要解決的具體問題：橋面無法讓菜車安全通行、風車帶不動升降台、濃霧中的路標方向不清楚、遺跡缺少能呈現修復成果的徽章。成功狀態不可在驗收前預先畫在地圖上。

---

## 9. 驗收清單（合併 R4 規格 §5 + 交接 Prompt 的完成回報格式）

### 任務A內容驗收
- [ ] 學生第一次看到的是菜車卡住與窄木板，不是「四種需求」的說明。
- [ ] 四個選項都像學生會對農夫說的問題，且任選一個都會得到自然回答。
- [ ] 每句回答不超過 25 個中文字；一次回答最多兩句。
- [ ] 所有可貼進 prompt 的文字都由阿穗剛才說出的原句產生，沒有額外答案。
- [ ] UI 沒有「做什麼／怎麼做／不能做什麼／目標」或四格分類。
- [ ] 學生可用任意詢問與貼入順序完成，系統不以順序扣分。
- [ ] 少任一句送出時，橋保持失敗狀態；四句均插入且附件驗收後才出現可通行藤橋。

### 工程驗收（交接 Prompt「實作順序與驗收」節）
1. 載入 R3 JSON，將任務A遷移為 R4 的 discriminated-union `choice`／`fill` 資料；不得把兩種題型揉成以站 id 判斷的 if/else。
2. **寫場景程式前**，先擴充並跑 `validateS3W05LabQuestDefinition()` 的 V-1～V-14（現有 repo 已加到 V-18，新規則要接續編號，不要覆蓋既有的 V-15～V-18 碰撞驗證）：任務A驗證四個自然提問、回答原文、四張可複製句卡與任意順序的自由 fill；後三站保留 R3 驗證，並在實際 adapter／覆蓋層套用後重跑。
3. 依 runtime 標準建立/更新 `BootScene`、`MapScene`、`MiniGameScene`、`CombatScene`，以及 React 的 `S3W05Quest` 狀態機與答題卡。
4. 接 event bus，確認讀卡時 `quest:lockMovement: true`，關卡時回傳 `false`，並同時鎖 WASD 與 E。
5. 跑 P-1～P-14；尤其確認 Phaser 原始碼沒有答案欄位、沒有內容 id 分支、世界尺寸只有單一來源，且所有 event 都有 emit 與 on（含 0.3 節提到的 `quest:showDialogue` 補registration）。
6. 提供五態快照：NPC 和來源物件各自的 `locked / available / nearby / active / done`，以及進出互動半徑、灰階與 reduced-motion 狀態。
7. 以學生與教師身份各走一次完整流程；金幣合計 250 且重整後不重複入帳。

**完成回報格式**：修改檔案、V-1～V-14 與 P-1～P-14 結果、五態快照位置、學生／教師流程測試結果、未完成項目與原因。**不要在未通過任一驗證時宣告完成。**

---

## 10. 站序與金幣總表（全部五站，供上下文對照，這次只動第1站）

| 順序 | 站 | 交易數 | 金幣 | 驗收後的世界改變 |
|---:|---|---:|---:|---|
| 0 | 溪谷入口 | 0 | 10 | 任務旗亮起，河畔農場可前往。 |
| 1 | **河畔農場（本次範圍）** | 4 | 55 | 藤橋生成，菜車前往工坊。 |
| 2 | 山腰工坊 | 4 | 60 | 風車轉動，升降台可用。 |
| 3 | 霧谷山徑 | 4 | 60 | 路標亮起、霧散開，遺跡出現。 |
| 4 | Lab Terminal 遺跡 | 4 | 65 | 徽章浮上石門，指令羅盤出現。 |

主線金幣合計 **250**。

---

## 11. 備註

- CRIE 可讀性分析服務目前回 404：不需要用假資料補可讀性年級，保留來源對白全文，待服務恢復後補測。
- R3 的動作級 ECT 是 55.5 分鐘（小四，目標 50–65 分鐘）。
- 三份 historical 文件（v3/v4/QA與答案來源）不得當內容來源或覆蓋層，只能參考不能照抄。
