---
name: labterminal-quest-phaser
description: |
  把一週的教學內容做成／重建成 Phaser 版 Lab Terminal Quest 地圖探索關卡：從內容資料（線索交易、來源卡、answerEvidence）→ 跑 V-1～V-14 資料驗證 → 世界座標與素材 → 四場景實作與事件契約 → P-1～P-14 工程驗收，一條龍。當使用者提到要做／重建 Lab Terminal Quest 關卡、地圖探索關卡、Phaser 關卡、「W05 用 Phaser 重做」、「幫我把這站蓋成可以走的地圖」、「線索交易的資料要怎麼填」、「小遊戲場景怎麼寫」、「關卡驗證跑不過」、或任何 S3W05／失落規格的溪谷的開發請求時，立即觸發此 skill。
  產出是可執行的關卡程式碼與資料（不是規格文件）。設計正確性以 lab-terminal-quest-level-design-standard 為準，工程契約以 lab-terminal-quest-phaser-runtime-standard 為準，本 skill 只負責「套用」，不複製條文。
---

# Lab Terminal Quest｜Phaser 關卡建置

## 你的產出是什麼

**可執行的關卡**：關卡資料檔 ＋ 四個 Phaser 場景 ＋ React 答題卡 ＋ 兩組驗證。
不是規格 Markdown——規格已經寫好了（見第一步），你的工作是照著蓋。

> 如果使用者要的是「這週的建置規格文件」而不是程式碼，那不是本 skill，
> 改用 `skills/labterminal-course-spec/`。

---

## 第一步：讀取正典（必做，按順序，不可略過）

1. `specs/lab-terminal-quest/standards/lab-terminal-quest-phaser-runtime-standard.md` — **工程契約，本 skill 的最高準則**。
   重點：§2 鐵則 R-1～R-10、§4 事件封閉清單、§5 世界座標、§6 素材、§9 P-1～P-14。
2. `specs/lab-terminal-quest/standards/lab-terminal-quest-level-design-standard.md` — **設計正確性契約**。
   重點：§2 線索交易五階段、鐵則 A／B／C、§6 資料模型、§7.1 的 V-1～V-14。
3. `specs/lab-terminal-quest/standards/lab-terminal-quest-production-workflow.md` — 四層內容的順序與位置。
   ⚠️ 該檔 §0 表格①列、§2 兩條路線、§4 實作參考已被 phaser-runtime-standard §0-1 覆寫，以後者為準。
4. `specs/lab-terminal-quest/standards/lab-terminal-quest-art-spec.md` — 素材尺寸與命名。
5. 目標週次的內容來源：`wiki/worksheets/S{N}/S{N}-W{NN}-學習單.md`、
   `wiki/lesson-plans/S{N}/S{N}-W{NN}-教案.md`、`specs/lab-terminal-quest/S{N}/W{NN}/S{N}-W{NN}-*建置規格.md`。
6. 若是**重建**既有關卡：先讀現行實作，列出「保留／取代／不要動」三欄再動手
   （S3W05 的版本已寫在 phaser-runtime-standard §11，直接用）。

> **單一事實來源**：不要在程式碼註解或新文件裡複製正典條文。要引用就寫條款編號（如 `// A-1`），
> 條文本身只有一份。

---

## 第二步：確認範圍（必問，除非使用者已指定）

- 這是**新關卡**還是**既有關卡重建**？重建的話，答題卡是保留改造還是重寫？
- 這一輪要做到哪裡？（① 只做資料層 ② 資料＋可走的地圖 ③ 全部含小遊戲與 Boss）
- 有沒有既有的素材，還是原型期先用程序生成？

沒問清楚就開始蓋，最後常常整段重做。

---

## 第三步：內容 → 線索交易資料

把該週內容整理成 `QuestClueTransaction[]`。**一筆交易 = 一個互動點 = 一張來源卡 = 一題 = 一條線索。**

每一筆必填：

| 欄位 | 內容 | 卡住時看哪一條 |
|---|---|---|
| `sourceLabel` | 玩家在地圖上看到的互動點名稱 | 站內唯一，且**不得與該站 NPC 同名**（V-12） |
| `worldOffset` | 相對該站錨點的位移，不是絕對座標 | phaser-runtime-standard §5-1 |
| `interactionRadius` | 互動半徑 | 寫在資料，不得寫死在場景 |
| `sourceCard.lines` | **答案的原文**，逐句一元素，每句 ≤ 25 中文字 | A-1、V-1 |
| `interaction` | `{ id, kind, config }`，`kind` 只能是 `none`/`pick`/`order`/`rotate`/`drag-snap`/`path` | C-3、V-9 |
| `question` | 題幹＋選項＋正解 | A-7：每個錯誤選項至少一個關鍵詞不出現在來源句 |
| `question.answerEvidence` | `{ lineIndex, keywords }` | **最容易漏、也最關鍵**，見下 |
| `clueText` | 收錄進筆記的中性線索 | V-7：必須能從 `sourceCard.lines` 完整取得 |

### `answerEvidence` 怎麼填（填錯的話 V-3／V-4 會擋下來）

```ts
sourceCard: { lines: ['農夫說：小推車得先過河。', ...] },
question: {
  text: '農夫最先說出的困難是什麼？',
  options: ['小推車得先過河', '橋太窄了', '蔬菜太重了'],
  answerIndex: 0,
  answerEvidence: { lineIndex: 0, keywords: ['小推車', '過河'] },
}
```

`keywords` 必須**同時**出現在 `sourceCard.lines[lineIndex]` 與 `options[answerIndex]`。
它存在的唯一目的，是讓「答案在來源卡裡」變成程式可以斷言的事實，而不是靠人記得。

### 三個最常犯的錯

1. **計量詞題幹配單一項目**（V-5）：題幹寫「哪一張運貨牌」，來源卡卻只有一句。
   正解是**同一張來源卡上並列三個同類項目**，不是在世界上散三個互動點。做不到就把題幹改成單數。
2. **來源卡洩漏需求分類**（A-6、V-6）：來源卡出現「做什麼／怎麼做／不能做什麼／目標」字樣。
   分類是學生的作答動作，不是系統的贈品。
3. **內容覆蓋層把答案洗掉**（A-4、V-8）：任何 `applyXxxContent()` 覆寫對話後，必須**在覆蓋之後**
   重跑一次全部驗證。這是 S3W05 「題目找不到答案」的字面成因。

---

## 第四步：跑資料驗證（門檻，不過不准往下）

實作／執行 `validateS{N}W{NN}QuestDefinition()`，涵蓋 V-1～V-14（清單見 level-design-standard §7.1）。
**此時還不該有任何場景程式碼。** 資料驗證不依賴 runtime，提前跑是零成本的；等蓋完畫面才發現題目
沒有答案，要同時改資料與畫面。

需要自己寫比對邏輯的三條：

```ts
// V-3 正解關鍵詞必須出現在指定來源句（正規化後子字串比對）
keywords.every(k => normalize(lines[lineIndex]).includes(normalize(k)))

// V-4 關鍵詞至少一個出現在正解選項
keywords.some(k => normalize(options[answerIndex]).includes(normalize(k)))

// V-14 正解與來源句的字元重疊率，須嚴格高於每個錯誤選項（建議差距 ≥ 0.15）
// 擋下「兩個選項都說得通」的雙正解題
```

---

## 第五步：世界與座標

```text
WORLD_WIDTH  = 960
WORLD_HEIGHT = 上留白 + Σ(每站高度) + 下留白
每站高度     = NPC 區塊 + (該站交易數 × 互動點間距) + 站間過場距離
```

- **內容決定尺寸，不是尺寸框內容。** 先射座標再回頭改內容是 S3W05 世界高度分岔的根因。
- 常數只定義一次，其餘引用（R-6、P-7）。
- depth 照 phaser-runtime-standard §5-2 的分層表挑，不要自創數字。

---

## 第六步：素材

- 正式關卡用**靜態匯出**；原型期可用 `generateTexture()` 程序生成，但進正式內容前要換掉。
- 不論哪種，**同一素材群組的畫布尺寸與接地基準線必須一致**（S3W05：`52×52`、第 49 列）。
- 碰撞框 `setSize()/setOffset()` 由畫布與基準線**算出來**，不得目測（P-6）。
- 五態 texture key 十個一組，NPC 與線索互動點都要，缺一不可（§6-3、P-4）：
  `npc-locked|available|nearby|active|done`、`obj-locked|available|nearby|active|done`。
  `nearby` 是獨立 texture，不是「available 疊個外框」。

---

## 第七步：場景實作

四個場景，職責互斥，彼此不得 import（phaser-runtime-standard §3）：

| 場景 | 做什麼 | 絕對不做 |
|---|---|---|
| `BootScene` | 全部材質與動畫，完成後 `start('map')` | 任何遊戲邏輯 |
| `MapScene` | 移動、碰撞、閘門、鄰近判定、五態渲染、就地提示、獎勵 | 判對錯、存分數、知道題目 |
| `MiniGameScene` | 依 `interaction.kind` 呈現玩法，完成後回報 | 發線索、知道正解、碰金幣 |
| `CombatScene` | Boss 段的表演 | 判定勝負 |

### 事件匯流排（封閉清單，R-3）

React → Phaser：`quest:stateUpdate`、`quest:lockMovement`、`quest:startMiniGame`、`quest:startCombat`、
`quest:spawnReward`、`quest:resetMap`、`quest:move`、`quest:triggerInteract`、
`combat:claim`、`combat:choice`、`combat:end`

Phaser → React：`quest:nearby`、`quest:interact`、`quest:miniGameCleared`、`quest:coinCollected`

payload 與語意見 phaser-runtime-standard §4。**要新增事件，先改那份文件再實作。**

### 寫程式時反覆確認的四件事

```ts
// ❌ R-2：場景拿到正解 → 代答（S3W05 舊實作的原句）
const solved = () => onAnswer(puzzle.answerIndex);
// ✅ 場景只說「完成了」，由 React 決定那代表解鎖④提問
bus.emit('quest:miniGameCleared', { txId });

// ❌ R-5：用內容 id 字串分支 → 新增一站就要改場景
if (puzzle.id === 'bridge-do') startDragGame();
// ✅ 由資料欄位驅動
this.scene.launch('mini-game', { txId, interaction }); // interaction.kind 決定玩法

// ❌ B-4：未輪到的互動點不渲染 → 玩家看不到這站還剩幾個點
if (i > nextIndex) return null;
// ✅ 未輪到的渲染成 locked

// ❌ 每幀發事件 → 打爆 React
this.bus.emit('quest:nearby', closest);
// ✅ 與上一幀比較，狀態沒變就不發
if (id !== this.nearbyId) { this.nearbyId = id; this.bus.emit('quest:nearby', payload); }
```

---

## 第八步：React 答題卡

- `dynamic(() => import(...), { ssr: false })`；`Phaser.Game` 存 `useRef`；cleanup 呼叫 `destroy(true)`。
- **永遠只顯示一個作答表面**，分頁邏輯在所有螢幕寬度下一致。
- **常駐「當前目標」一行，且必須指名 `sourceLabel`**，左欄地圖泡泡與右欄措辭一致（B-3）：
  ✅「回到地圖，走向『木匠工作台』並按 E 調查。」 ❌「找到下一個線索點並按 E 調查。」
- 面板開啟時送 `quest:lockMovement: true`，關閉送 `false`。**鎖移動要連 E 一起鎖**（P-13）。
- 五階段順序不可調換：①抵達 → ②閱讀來源卡 → ③小遊戲（可選）→ ④提問 → ⑤收錄。
  **②一定在④之前**——玩家看見題目時，答案必須已經在畫面上出現過。

---

## 第九步：驗收

1. **V-1～V-14** 全過（資料層）。
2. **P-1～P-14** 全過（工程層，清單見 phaser-runtime-standard §9.1）。特別容易漏的：
   P-1（場景不得出現 `answerIndex` 等識別字）、P-3（無孤兒事件）、P-4（十個 texture key）、
   P-11（金幣冪等）、P-13（鎖移動連 E 一起鎖）。
3. **五態快照**：NPC 與線索互動點各五張，灰階下仍可分辨（§9.2）。
4. **ECT 動作級估算 50–65 分鐘**：呼叫 `skills/activity-time-estimator/`。未過則回第三步刪減內容，
   不要靠加重複回合灌時長。
5. **學生視角＋教師視角各走一次**：確認沒有洩題、技術失敗有備援。

---

## 不要做的事

- 不要在 `src/phaser/**` 引入任何題目正解相關欄位——這是 P-1 會直接擋下的事，也是 A-5 的結構性保證。
- 不要為了讓某一站「特別一點」而在場景裡加 id 分支。要特別，就加一個 `interaction.kind`，並先更新
  level-design-standard §5 的封閉清單。
- 不要在 runtime 加素材縮放／位移校正表。尺寸不對就回美術端重新輸出。
- 不要動 `config/s3w05QuestLevel.ts` 的 `createDefaultQuestMapObjects()`——它是 S3 答題版
  `GammaAnswerWorksheet.tsx` 仍在使用的活躍程式碼，清了會弄壞答題版編輯器。
- 不要把驗證留到最後。第四步就是門檻。

---

## 相關

- 工程契約：`specs/lab-terminal-quest/standards/lab-terminal-quest-phaser-runtime-standard.md`
- 設計契約：`specs/lab-terminal-quest/standards/lab-terminal-quest-level-design-standard.md`
- 四層流程：`specs/lab-terminal-quest/standards/lab-terminal-quest-production-workflow.md`
- 時長驗證：`skills/activity-time-estimator/`
- 規格文件生成（不同用途）：`skills/labterminal-course-spec/`
