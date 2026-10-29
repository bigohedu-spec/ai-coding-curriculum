# Lab Terminal Quest｜關卡設計標準（答案可達性與互動性指標）

> 給「開發 AI／關卡內容作者」共用的正典：規定一個 Lab Terminal Quest 關卡的**題目怎麼問、答案
> 從哪裡來、玩家怎麼知道可以互動**。本檔與 [[lab-terminal-quest-production-workflow]] 互補——
> 工作流程管「四層內容的產生順序與存放位置」，本檔管「③題目 JSON／④關卡設計 兩層內部的設計正確性」。
>
> 適用範圍：任何採「地圖／插畫左欄 ＋ 可移動角色 ＋ 右側答題卡」架構的週次（目前唯一實例：
> S3W05「失落規格的溪谷」）。不適用於 S3 一般答題版（見 [[S3-答題版學習單新架構規格]]）。
>
> 建立原因：2026-09-08 逐檔比對 S3W05 現行實作後，確認關卡設計缺少兩條本來就該存在、卻從未
> 被寫下來的契約——「答案必須可達」與「互動必須有指標」。缺了這兩條，內容更新可以在無人察覺的
> 情況下讓題目失去答案，玩家也無法從畫面判斷哪裡可以互動。本檔把這兩條補成可自動檢查的規則。

> 題型與 NPC 行為的封閉資料協議見 [[lab-terminal-quest-question-npc-contract]]；其 `choice`／`fill`
> 分流與 `npcProtocol` 是本檔 §6、§7 的具體實作要求。

---

## §0 治理定位【規定】

本檔在 [[lab-terminal-quest-production-workflow]] §0 的四層模型中，是**橫跨 ③④ 兩層的設計約束層**，
不是第五層內容。與既有正典的裁決規則如下，其餘未觸及部分一律以原正典為準：

| 對象 | 裁決規則 |
|---|---|
| [[S3-W05-Lab-Terminal-Quest-建置規格]] §G 的「唯一正典」宣告 | 仍成立，但**限於 S3W05 的故事、內容與數值**。本檔規定的是「任何關卡的題目與互動必須滿足的形式條件」，兩者衝突時以本檔為準，並回頭修正建置規格。 |
| [[lab-terminal-quest-production-workflow]] | 上游。該檔 §5 檢查清單須追加一條「是否通過本檔 §6 全部斷言」；該檔 §4 第 2 點的「當前目標」示例須依本檔 B-3 改寫。 |
| [[S3-W05-Lab-Terminal-Quest-建置規格]] | 實例。S3W05 已收束為 Runtime 單一來源；本檔的階段順序仍優先於任何實例內容。 |

---

## §1 這份標準要解決的五個已確認缺陷

以下全部是在 S3W05 現行程式碼中實際核對到的。新標準的每一條鐵則都對應其中至少一項。

| # | 缺陷 | 現場證據 | 對應條款 |
|---|---|---|---|
| 1 | 內容覆蓋層洗掉了答案來源，題目卻留著 | `s3w05NativeContent.ts:18` 的 `applyNativeContent()` 整段覆寫 `bridge.dialogue`；覆蓋前有「農夫說：小推車得先過河。」（`s3w05LabQuest.ts:81`），覆蓋後這句消失，而 `bridge-do` 仍問「農夫**最先說出**的困難是什麼？」——題幹的順序錨點失去指涉對象 | A-1、A-4、V-8 |
| 2 | 題幹的前提在世界中不存在 | (a) 計量詞無對應項目：`bridge-how`（哪一組）、`bridge-goal`（哪一張）、`windmill-do`／`windmill-avoid`／`signpost-avoid`（哪一種）、`signpost-how`（哪三樣）共 6 題，世界每題只渲染一個 `.prop`。(b) 物件未被畫出：`bridge-avoid` 問「警示牌寫的是什麼危險」，但警示牌從未渲染，只出現在小遊戲通關按鈕的文字裡 | A-3、V-5 |
| 3 | 小遊戲繞過自己的題目 | `NativeQuestChallenge.tsx:21` `const solved = () => onAnswer(puzzle.answerIndex)`；`:22-24` 用 `puzzle.id` 字串比對決定小遊戲類型；`:52` 題目文字被小遊戲標題取代。17 題中只有 4 題有小遊戲 | A-5、C-1、C-2、C-4 |
| 4 | 走到線索物件旁邊零視覺回饋 | `NativeQuestMap.module.css` 全檔只有一條 `.nearby` 規則（`.nearby .flag{…}`，第 8 行），且 `.flag` 只存在於 NPC；線索物件 `.prop`（第 10 行）沒有任何鄰近態樣式 | B-1、B-2、B-6 |
| 5 | 看不到本站還剩幾個點，右欄當前目標不指名 | `NativeQuestMapRuntime.tsx:104` 的 `if(i>nextIndex&&nextIndex>=0)return null` 讓**未輪到的**線索物件完全不渲染。右欄那一行不指名物件；左側地圖泡泡（`:116`）與「我卡住了」（`S3W05LabQuest.tsx:498`）**已經指名**，落差只在右欄 | B-3、B-4、B-5 |

> **附帶發現**：`S3W05LabQuest.tsx:58` 的 `currentGoalMessage()` 全檔無呼叫點，是死碼；畫面上真正
> 渲染的是 `:408-411` 的 `currentGoal`。而 [[lab-terminal-quest-production-workflow]] §4 的
> 「實作參考：`currentGoalMessage()`」指向的正是這段死碼——上游正典的參考連結需一併修正。

**根因**：整套規格從未規定「答案必須在玩家已看過的內容裡可被指認」，也從未規定「可互動物件必須
在可互動時給出視覺指標」。因此內容可以單方面漂移，UI 可以單方面省略，兩者都不會被任何檢查擋下。

---

## §2 核心單位：線索交易（Clue Transaction）

一個關卡的最小可設計單位不是「一題」，而是**一筆線索交易**。每一筆交易固定由五個階段組成，
**順序不可調換、不可省略**：

```text
① 抵達  玩家走進互動半徑，物件亮起「可互動」指標
② 閱讀  按 E 後，物件旁先顯示「來源卡」——本題答案的原文，可隨時重看
③ 理解  （可選）一個 8–20 秒的小遊戲，確認學生看懂了來源卡
④ 提問  出題。題目只能問來源卡上已經顯示過的內容
⑤ 收錄  答對後發出中性線索籤，進入線索筆記，供學生分類進規格四格
```

**這條順序的重點在②在④之前。** 玩家看見題目時，答案一定已經在畫面上出現過。學生要做的是
「讀懂並指認」，不是「猜一個沒人告訴過他的東西」。

### 一筆交易的組成邊界【規定】

一筆交易 = **一個互動點**（世界上一個可按 E 的位置）= 一張來源卡 = 一題 = 一條線索。

來源卡本身**可以呈現多個可讀項目**（`sourceCard.lines` 的多個條目，例如三張運貨牌各一句）。
這是 A-3 計量詞題幹唯一合法的實作方式：不是在世界上散落三個互動點，而是**同一個互動點的來源卡
上並列三個可讀項目**。這樣「一筆交易一個互動點」與「題幹可以問哪一張」兩者同時成立。

---

## §3 【鐵則 A】答案可達性契約【規定】

> 一句話：**沒有先給玩家讀過的東西，不能拿來當題目。**

| 條款 | 規則 |
|---|---|
| **A-1 讀在問前** | 任何題目文字出現在畫面上之前，該題答案的原文必須已經以「來源卡」形式在**同一個互動點**上完整顯示過，且玩家可隨時重看。禁止「先問，答案在別處」。 |
| **A-2 單一來源** | 一題一來源。答案不得散落在兩個以上互動點，不得要求跨站記憶，不得依賴玩家記得三分鐘前的一句對話。 |
| **A-3 前提存在** | 題幹提到的任何具體事物，必須已在來源卡上被玩家讀過。題幹使用計量詞（`哪一張`／`哪一個`／`哪一組`／`哪一種`／`哪幾`／`哪三樣` 等）時，來源卡上**同時可讀的同類項目數量**必須 ≥ 選項數；做不到就把題幹改成單數。 |
| **A-4 覆蓋不得孤兒化** | 任何在 runtime 覆蓋內容的函式（如 `applyNativeContent()`）**不得移除或改寫任何被題目引用的來源文字**。內容覆蓋層與題目必須一起改，並由驗證函式在覆蓋**之後**重跑一次全部檢查。 |
| **A-5 互動不是答案** | 小遊戲完成 ≠ 答對。完成小遊戲後仍必須顯示來源卡與題目，由玩家自己作答。禁止 `solved() → onAnswer(answerIndex)` 這類直接代答。 |
| **A-6 不洩需求分類** | 來源卡只呈現**事實原文**，不得把它標示為某一種需求（做什麼／怎麼做／不能做什麼／目標）。學生自然提問可使用這些日常語句，但不能把它們做成分類、排序或四格作答；四種需求是內容端的覆蓋檢核，學生應把原句直接放進自己的 prompt。 |
| **A-7 錯誤選項可排除** | 每個錯誤選項必須能**從來源卡上的資訊被排除**：該選項至少要有一個關鍵詞在來源卡對應句中不出現。錯誤選項至少 2 個。 |
| **A-8 重看不罰** | 來源卡永久可重看，重看不消耗次數、不影響金幣、不觸發任何懲罰。 |

---

## §4 【鐵則 B】互動性指標契約【規定】

> 一句話：**玩家不該需要用滑鼠掃過整張地圖去猜哪裡可以按。**

### B-1 五個必要狀態

每個可互動物件（NPC、線索互動點、閘門、設施）都必須能渲染下列五個**互斥**狀態，且每個狀態
**不得只靠顏色區分**，必須同時有形狀、圖示或文字標記：

| 狀態 | 意義 | 最低視覺要求 |
|---|---|---|
| `locked` | 尚未解鎖 | 低飽和（≤ 30%）＋ 鎖圖示＋ 不接受點擊 |
| `available` | 可前往，但玩家還沒走到 | 常駐微光／脈動（2.5 秒週期），reduced-motion 時改為靜態高亮邊框 |
| `nearby` | 玩家已進入互動半徑 | 高對比外框＋「E 調查」字樣**渲染在物件旁**，與 `available` 明顯不同 |
| `active` | 目前開啟中 | 維持高亮，其餘物件降低視覺權重 |
| `done` | 已完成 | ✓ 標記＋ 停止脈動＋ 降低視覺權重，但仍可點開重看 |

### B-2 就地提示

「按 E」提示必須渲染在**物件旁邊**。畫面角落的全域提示列可以存在，但不得是唯一提示，也不得
只說「靠近了，按 E」而不指名靠近的是什麼。

### B-3 指名式當前目標

「當前目標」那一行（[[lab-terminal-quest-production-workflow]] §4.2 已規定必須常駐）**必須指名
下一個具體互動點的 `sourceLabel`**，且**左欄地圖與右欄答題卡兩處的措辭必須一致**：

- ✅ `回到地圖，走向「木匠工作台」並按 E 調查。`
- ❌ `回到左側地圖，找到下一個線索點並按 E 調查。`

> 上游 [[lab-terminal-quest-production-workflow]] §4 第 2 點目前用的正是上面那句 ❌ 作為正面示例，
> 需依本條改寫。

### B-4 路徑可見

本站**所有**尚未完成的線索互動點必須同時可見（未輪到的用 `locked` 樣式），讓玩家看得到「這站還剩
幾個點、大概在哪個方向」。禁止只渲染到當前一個為止。

### B-5 進度可數

HUD 必須同時顯示「本站第幾條／共幾條」與「第幾站／共幾站」。學生任何時候都能回答「我還要做幾件事」。

### B-6 半徑可感知

跨越互動半徑的那一刻必須有**一次明確的狀態變化**（外框、縮放、圖示其中之一），不得只有文字改變。
離開半徑時必須還原。

### B-7 無障礙

- 所有可互動物件有鍵盤 focus 順序與文字替代標籤。
- 觸控模式提供「先點物件、再點目標」的替代操作，等價於拖曳。
- 色盲模式下五個狀態仍可區分（形狀／圖示／文字，不只顏色）。

---

## §5 【鐵則 C】小遊戲的角色定位【規定】

| 條款 | 規則 |
|---|---|
| **C-1 唯一責任** | 小遊戲的責任是「確認玩家看懂了來源卡」，獎勵是**解鎖提問**，不是直接得到線索。它是理解檢核，不是答案本身。 |
| **C-2 資料驅動** | 小遊戲類型必須由 `puzzle` 資料上的欄位決定（`interaction.kind`），**禁止在 runtime 元件裡用 `puzzle.id` 字串比對分支**。新增一站不得需要改動任何 runtime 元件。 |
| **C-3 有限型別** | 允許的 `interaction.kind` 是一份封閉清單：`none` / `pick` / `order` / `rotate` / `drag-snap` / `path`。要新增型別必須先更新本檔，再實作 renderer。 |
| **C-4 覆蓋率一致** | 同一站內的互動覆蓋率必須一致，三選一：**每筆交易各有自己的小遊戲** ／ **全站共用一個涵蓋所有交易的小遊戲**（以所有交易的 `interaction.id` 相同表示，如遺跡站的「浮雕四格」）／ **全站都沒有**（`kind: 'none'`）。禁止同站內部分有部分沒有。 |
| **C-5 時長與閱讀量** | 8–20 秒可完成；題幹每卡 ≤ 25 個中文字；不得有長篇題幹。 |
| **C-6 失敗不罰** | 放錯、選錯可重來，不扣金幣、不消耗嘗試次數；只有④提問階段的答錯才計入 `attempts` 與冷卻。 |

---

## §6 資料模型最低要求【規定】

任何 Lab Terminal Quest 的關卡資料必須能表達下列結構。欄位名可依實作調整，但**語意欄位不得缺席**
——缺了哪個，§7 的對應驗證條款就無法執行。

```ts
/** ② 閱讀：答案的唯一原文出處 */
interface QuestSourceCard {
  id: string;
  /**
   * 玩家在互動點旁讀到的原文，逐句一個元素（每句 ≤ 25 中文字）。
   * 計量詞題幹（A-3）就是靠這裡並列多個同類項目來成立的。
   */
  lines: string[];
  /** 永遠可重看 */
  replayable: true;
}

/** ③ 理解：可選的小遊戲，資料驅動 */
interface QuestInteraction {
  /** 同站多筆交易共用同一個小遊戲時，填相同的 id（C-4） */
  id: string;
  kind: 'none' | 'pick' | 'order' | 'rotate' | 'drag-snap' | 'path';
  config: Record<string, unknown>;
}

/** ④ 提問：題型只能是 choice 或 fill，詳見 question-npc-contract */
interface QuestChoiceQuestion {
  type: 'choice';
  text: string;
  options: string[];
  answerIndex: number;
  /**
   * 【驗證用，必填】正解出自來源卡的哪一句。
   * 這個欄位存在的唯一目的，是讓 A-1 可以被程式檢查，而不是靠人記得。
   */
  answerEvidence: { lineIndex: number; keywords: string[] };
  /** 為什麼每個錯誤選項是錯的（index 對齊 options，正解為 null） */
  optionMisconceptions?: Array<string | null>;
}

interface QuestFillQuestion {
  type: 'fill';
  /** 恰有一個「＿＿」；填入正解後必須還原來源原句 */
  promptTemplate: string;
  blank: {
    id: string;
    inputMode: 'keyboard';
    acceptedAnswers: string[];
  };
  answerEvidence: { lineIndex: number; keywords: string[] };
}

type QuestQuestion = QuestChoiceQuestion | QuestFillQuestion;

interface QuestNpcProtocol {
  onApproach: { action: 'lookAtPlayer'; lines: string[] };
  onSourceCard: { action: 'pointAtSource'; speaker: string; speaks: 'transaction.sourceCard.lines' };
  onChoice: { action: 'watchChoice' };
  onFill: { action: 'holdBlankBoard' };
  onCorrect: { action: 'nodAndRevealClue'; lines: string[] };
  onWrong: { action: 'replaySource'; lines: string[] };
  onStationComplete: { action: 'celebrate'; lines: string[] };
}

/** 一筆完整的線索交易 */
interface QuestClueTransaction {
  id: string;
  /** 玩家在地圖上看到的互動點名稱，也是 B-3 當前目標要指名的字串 */
  sourceLabel: string;
  worldPosition: { x: number; y: number };
  interactionRadius: number;
  sourceCard: QuestSourceCard;
  interaction?: QuestInteraction;
  question: QuestQuestion;
  /** ⑤ 收錄：可直接貼入 prompt 的原句，不對玩家標示覆蓋標籤 */
  clue: {
    id: string;
    text: string;
    /** 僅供內容覆蓋檢核；不得傳到學生 UI，亦不得決定插入順序。 */
    coverageTag: 'purpose' | 'construction' | 'safety' | 'outcome';
    source: string;
  };
}
```

**`answerEvidence` 是本標準最關鍵的新增欄位。** 沒有它，「答案在來源卡裡」只是一句願望；有了它，
這件事變成可以在 CI 裡被斷言的事實。

---

## §7 驗收條款

### §7.1 可自動檢查（必須由驗證函式實作）【規定】

關卡驗證函式（S3W05 對應 `validateS3W05LabQuestDefinition`）必須實作下列全部斷言，回傳錯誤清單。

| ID | 斷言 | 擋下的缺陷 |
|---|---|---|
| **V-1** | 每筆交易都有 `sourceCard`，且 `lines` 非空、每句 ≤ 25 中文字；每站都有完整的 `npcProtocol` 七階段 | 沒有來源可讀／NPC 演出漂移 |
| **V-2** | `answerEvidence.lineIndex` 落在 `sourceCard.lines` 範圍內 | 指向不存在的來源 |
| **V-3** | `answerEvidence.keywords` 每一個都出現在 `sourceCard.lines[lineIndex]`（正規化後子字串比對） | 答案不在來源卡裡 |
| **V-4** | `choice`：至少一個 keyword 出現在 `options[answerIndex]`；`fill`：至少一個 keyword 出現在 `blank.acceptedAnswers` | 來源卡與正解對不上 |
| **V-5** | 只對 `choice` 生效：題幹含計量詞（`哪一張`／`哪一個`／`哪一組`／`哪一種`／`哪幾`／`哪N樣` 的正則）時，`sourceCard.lines` 的條目數 ≥ `options.length`；**清單可擴充，新增計量詞須同步更新本檔** | 前提在世界中不存在 |
| **V-6** | `sourceCard.lines` 任一句都不得包含四種需求的分類詞（`做什麼`／`怎麼做`／`不能做什麼`／`目標`） | 洩題 |
| **V-7** | `clue.text` 必須可從 `sourceCard.lines` 完整取得（等於某一句，或為連續數句的串接） | 學生無原文可貼 |
| **V-8** | **任何內容覆蓋層套用之後，V-1 ～ V-14 必須全部重跑並通過** | 覆蓋層孤兒化題目 |
| **V-9** | `interaction.kind` 在 C-3 的封閉清單內，且 runtime 有對應 renderer 註冊 | kind 沒實作 |
| **V-10** | 同一站內覆蓋率一致：全部交易皆有 `interaction`、或全部 `kind:'none'`、或全部共用同一個 `interaction.id`（欄位缺席一律正規化為 `kind:'none'`） | 互動覆蓋率不一致 |
| **V-11** | `worldPosition` 落在 `playerBounds` 內，且不在本站尚未解鎖的 `gate` 之後 | 走不到的線索 |
| **V-12** | `sourceLabel` 在同一站內唯一，**且不得與該站 `npcName` 相同** | B-3 指名歧義 |
| **V-13** | 世界尺寸只有**一個**定義來源，其餘位置一律引用它 | 常數分岔 |
| **V-14** | `choice`：正解選項與來源句的字元重疊率嚴格高於每個錯誤選項（建議差距 ≥0.15）；`fill`：`promptTemplate` 恰有一個 `＿＿`，以第一個 accepted answer 回填後逐字等於來源句 | 雙正解／填充題答案不在對白 |

### §7.2 人工／快照驗收（B 鐵則）

B-1 ～ B-7 是 CSS 與渲染層的規則，無法由資料驗證函式斷言，改由下列方式把關，**每次改動地圖
runtime 或樣式時必跑一次**：

- [ ] 五個狀態（`locked`／`available`／`nearby`／`active`／`done`）各有具名 class，且在樣式表中都有規則。
- [ ] 這五個 class 同時作用於 **NPC 與線索互動點兩者**，不是只有其中一種。
- [ ] 走進／走出互動半徑各截一張圖，兩張必須肉眼可分辨。
- [ ] 灰階模式下五個狀態仍可區分。
- [ ] 本站所有未完成互動點在同一畫面上都看得到。
- [ ] 右欄「當前目標」與左欄地圖泡泡的措辭一致，且都指名了 `sourceLabel`。

### §7.3 執行時機【規定】

1. **內容作者存檔時**（關卡編輯器）：跑 §7.1 全部，不通過標紅但允許繼續編輯。
2. **發布時**（`publish()`）：跑 §7.1 全部，**不通過即擋下發布並列出錯誤**。（現況缺口：
   `quest-editor-test.tsx` 的 `publish()` 未呼叫驗證。）
3. **學生端載入時**：跑 §7.1 全部當最後防線，不通過退回內建預設定義。（已實作。）
4. **CI**：對正式關卡定義跑一次，作為回歸測試。

---

## §8 內容作者檢查清單

開一站新內容或改一題時，逐條確認：

- [ ] 這一題的答案，玩家在看到題目**之前**已經讀過了嗎？在哪個互動點上？（A-1）
- [ ] 題幹用了計量詞嗎？用了的話，來源卡上真的並列了那麼多個項目嗎？（A-3、V-5）
- [ ] 題幹提到的東西（警示牌、材料、路牌），來源卡上真的寫出來了嗎？（A-3）
- [ ] 我改了對話／覆蓋層內容，有沒有哪一題的答案來源被我改掉了？（A-4、V-8）
- [ ] 來源卡有沒有不小心寫出「這是做什麼」這種分類提示？（A-6、V-6）
- [ ] 每個錯誤選項，玩家能不能從來源卡上把它排除掉？（A-7、V-14）
- [ ] 本站各筆交易的小遊戲有無是一致的嗎？（C-4、V-10）
- [ ] 小遊戲是資料設定的，還是我又在 runtime 加了一個 `id ===` 分支？（C-2）
- [ ] `sourceLabel` 在站內唯一，且沒跟 NPC 同名嗎？（V-12）
- [ ] 當前目標那一句，左右兩欄都指名了互動點的名字嗎？（B-3）
- [ ] `answerEvidence` 填了嗎？填的那一句真的含正解關鍵詞嗎？（V-2 ～ V-4）

---

## §9 對既有正典的覆寫與修訂需求

### §9-1 明確覆寫：階段順序反轉【規定】

舊 S3W05 QA 曾規定「**來源文字只能在對應小遊戲完成後**由 Gamma 顯示」，舊建置規格也寫「解一個小謎題**拿**
可複製線索」。這些舊檔已移除。**本檔 §2 的階段順序（②閱讀 → ③理解 → ④提問）仍是唯一規則**，理由見 §1 缺陷 3：
「小遊戲即答案」正是題目找不到答案的成因之一。

連帶必須修訂：

- QA 檔 §3 段首的「只能在小遊戲完成後顯示」→ 改為「小遊戲完成後解鎖**提問**，來源卡在進入互動點時即顯示」。
- QA 檔 §5 的 QA-01 ～ QA-06 六條驗收案例全部建立在舊順序上，需重寫。
- 建置規格 §GL 遊戲迴圈碼塊的「解一個小謎題拿可複製線索」，以及 §「每關理解小遊戲」表的
  **成功獎勵**欄（13 個小遊戲全部寫「成功得到 XX 線索」）→ 改為「解鎖 XX 的提問」。

### §9-2 既有正典內部的不一致（本檔驗證會撞出來）

| 位置 | 問題 |
|---|---|
| QA 檔 §3 D-02（27 字）、D-04（31 字） | 超過 V-1 的「每句 ≤ 25 中文字」，需拆成多行 |
| A-01 的 `sourceText` | QA 檔寫「做一座讓載著蔬菜**的**小推車通過的橋。」，建置規格 `:175` 與 `s3w05LabQuest.ts` 寫的少一個「的」。QA §2 是精確比對，這一字之差會讓 QA-03 直接失敗 |
| [[lab-terminal-quest-art-spec]] | 該檔寫「目前 S3W05 尚未有可拖動物件」，但 `NativeQuestChallenge.tsx:33-50` 已實作 pointer drag。該檔在被本檔 B-1 要求補五態素材時，需先更新這個過時前提 |
| [[lab-terminal-quest-production-workflow]] §4 | 「當前目標」的正面示例正是本檔 B-3 標為 ❌ 的那句；「實作參考：`currentGoalMessage()`」指向死碼 |

---

## §10 S3W05 已知落差清單（供工程 agent 排程）

依本標準核對 S3W05 現行實作。**本檔只定義標準，不規定實作順序**；建議由負責人決定優先序後再交付。

| 落差 | 涉及檔案 | 違反條款 |
|---|---|---|
| 缺 `sourceCard` 資料層，沒有「先讀再問」階段 | `types/LabQuest.ts`、`config/s3w05LabQuest.ts` | A-1、V-1 |
| 缺 `answerEvidence` 欄位，A-1 無法被驗證 | 同上 | V-2 ～ V-4 |
| `applyNativeContent()` 覆蓋對話後未重跑驗證（`s3w05LabQuest.ts:409` 直接套用） | `config/s3w05NativeContent.ts` | A-4、V-8 |
| 6 題計量詞題幹配單一項目：`bridge-how`、`bridge-goal`、`windmill-do`、`windmill-avoid`、`signpost-avoid`、`signpost-how` | `config/s3w05LabQuest.ts` | A-3、V-5 |
| `bridge-avoid` 的警示牌從未渲染 | `config/s3w05LabQuest.ts`、`NativeQuestChallenge.tsx` | A-3 |
| 小遊戲用 `puzzle.id` 字串比對分支，且 `solved()` 直接代答 | `NativeQuestChallenge.tsx:21-24` | A-5、C-1、C-2 |
| 17 題只有 4 題有小遊戲，且分布在站內不一致 | `NativeQuestChallenge.tsx` | C-4、V-10 |
| 線索互動點無 `nearby` 樣式、無就地 E 提示 | `NativeQuestMap.module.css` | B-1、B-2、B-6、§7.2 |
| 未輪到的線索互動點完全不渲染 | `NativeQuestMapRuntime.tsx:104` | B-4 |
| 右欄當前目標不指名互動點；`currentGoalMessage()` 是死碼（無呼叫點），實際渲染的是 `:408-411` 的 `currentGoal` | `S3W05LabQuest.tsx:58`、`:408-411` | B-3 |
| `sourceLabel` 與 `npcName` 同名：`bridge-do`＝農夫、`windmill-do`＝工坊師傅、`signpost-avoid`＝守路鳥 | `config/s3w05LabQuest.ts` | V-12 |
| 世界高度分岔：`10800` 在 `types/LabQuest.ts:109`（**寫死在 TypeScript 字面型別裡**）、`config/s3w05LabQuest.ts:33`、`quest-editor-test.tsx:173`；`7400` 在 `config/s3w05QuestLevel.ts:14`、`pages/admin/quest-editor.tsx:198`、建置規格 `:65` 與 `:362` | 上列全部 | V-13 |
| 發布前未跑驗證 | `pages/admin/quest-editor-test.tsx` `publish()` | §7.3 第 2 點 |

> **不要動的東西**：`config/s3w05QuestLevel.ts` 的 `createDefaultQuestMapObjects()`（含
> `label: "天空要塞藍圖"`）看起來像舊世代殘留，但它是 **S3 答題版（`GammaAnswerWorksheet.tsx`）
> 路徑仍在使用的活躍程式碼**（`GammaAnswerWorksheet.tsx:775`、`quest-editor.tsx:156,453`）。
> 清理它會弄壞答題版編輯器。只有 `S3W05_QUEST_WORLD_HEIGHT = 7400` 這個常數需要處理。

---

## 連結

- **上游生產方法**（內容從哪裡來；其產出必須通過本檔）：[[lab-terminal-quest-narrative-standard]]
- **下游工程契約**（本檔 A-5／C-2 由該檔鐵則 R 結構性保證）：[[lab-terminal-quest-phaser-runtime-standard]]
- 上游工作流程：[[lab-terminal-quest-production-workflow]]
- 美術素材規格：[[lab-terminal-quest-art-spec]]
- 實例建置規格：[[S3-W05-Lab-Terminal-Quest-建置規格]]
- 實例內容與驗收：[[S3-W05-Lab-Terminal-Quest-建置規格]]
- 所屬學期：[[S3-小四上-AI建構]]

> 建立：2026-09-08，原因：逐檔核對 S3W05 實作後確認關卡設計缺少「答案可達性」與「互動性指標」
> 兩條契約，導致題目可以失去答案、可互動物件可以沒有任何提示。本檔把兩條契約寫成可自動檢查的
> 規則，補上 `answerEvidence` 欄位讓「答案在來源卡裡」從願望變成可斷言的事實，並明確覆寫既有
> 正典中「小遊戲完成後才顯示來源」的階段順序。
