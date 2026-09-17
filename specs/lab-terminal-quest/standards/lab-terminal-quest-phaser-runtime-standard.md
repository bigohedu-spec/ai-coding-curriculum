# Lab Terminal Quest｜Phaser Runtime 標準（工作流程與工程基準）

> 給「開發 AI／工程負責人」共用的正典：規定一個 Lab Terminal Quest 關卡**用什麼跑、程式怎麼切、
> 兩半怎麼講話、素材與世界尺寸怎麼定、驗收怎麼跑**。
>
> 本檔與另兩份互補，三份合起來才是完整的關卡正典：
>
> | 文件 | 管的事 |
> |---|---|
> | [[lab-terminal-quest-production-workflow]] | 四層內容的**產生順序與存放位置**（①內容美術／②教案／③題目 JSON／④關卡設計） |
> | [[lab-terminal-quest-level-design-standard]] | ③④ 兩層的**設計正確性**（鐵則 A 答案可達性／B 互動性指標／C 小遊戲定位、V-1～V-14） |
> | **本檔** | ③④ 落地成**可執行程式**的工程契約（鐵則 R、P-1～P-14） |
>
> 適用範圍：任何「地圖探索 ＋ 可移動角色 ＋ 右側答題卡」的 Lab Terminal Quest 關卡。不適用於
> S3 一般答題版（見 [[S3-答題版學習單新架構規格]]，那是一題一卡的不同資料模型）。
>
> 建立原因：2026-09-09 負責人裁決 **Phaser 成為 Lab Terminal Quest 的預設 runtime**，Gamma iframe
> 路線停止用於新關卡。換 runtime 不是換函式庫而已——它同時解掉了既有正典裡三個「已知但無解」的
> 結構性問題（跨裝置尺寸、B 鐵則五態無法渲染、鍵盤焦點被 iframe 吃掉），也開出一組新的、必須寫下來
> 的工程約束。本檔就是那組約束。

---

## §0 治理定位【規定】

本檔是 [[lab-terminal-quest-production-workflow]] 四層模型的**執行層規範**，不是第五層內容。
它不改變「哪一層放什麼、誰先誰後」，只改變「④落地到程式」那一格的實作契約。

### §0-1 明確覆寫既有正典

負責人 2026-09-09 裁決：**Phaser 為預設 runtime，所有新關卡（含 S3W05 重建）一律採用。**
據此，下列既有條款被本檔覆寫，其餘未觸及部分一律以原正典為準：

| 被覆寫的位置 | 原文 | 改為 |
|---|---|---|
| [[lab-terminal-quest-production-workflow]] §0 表格「①GAMMA 學習單內容」列 | 正典存放位置＝Gamma 文件；落地位置＝`worksheet.gammaUrl` | 正典存放位置＝**靜態美術素材目錄＋場景繪製程式**；落地位置＝**Phaser `BootScene` 的素材載入／程序生成**。Gamma 若仍用於構圖設計，其地位是「美術上游工具」，定稿必須匯出成已知像素尺寸的靜態檔，不得再以 iframe 形式進入 runtime |
| 同檔 §2「跨裝置一致性鐵則」路線 2 | 【僅限維護現有關卡】固定寬度＋人工測量值＋安全餘裕 | **廢止**。世界尺寸不再是量測值，改由 §5-1 公式從站數推算，本檔 R-6／P-7 強制單一來源 |
| 同檔 §2 路線 1 | 【優先】靜態美術匯出 | **升為唯一路線**，且本檔 §6 補上它缺的部分（程序生成材質同樣受共用畫布／基準線約束） |
| 同檔 §4 末的「實作參考：`S3W05LabQuest.tsx` 的 `currentGoalMessage()`」 | 指向的是死碼（[[lab-terminal-quest-level-design-standard]] §1 附帶發現已確認全檔無呼叫點） | 改為指向本檔 §7-2 的答題卡契約；§4 第 1～4 點的設計要求本身**不變**，仍然有效 |
| 同檔 §5 檢查清單 | 七條 | 追加兩條：「是否通過 [[lab-terminal-quest-level-design-standard]] §7.1 全部斷言」與「是否通過本檔 §9.1 P-1～P-14」 |

### §0-2 不受影響的部分

以下維持原狀，換 runtime 不構成修改理由：

- **四層內容的產生順序**（先鎖內容 → 教案 → 題目 JSON → 反推座標）完全不變。先射座標仍然是錯的。
- **[[lab-terminal-quest-level-design-standard]] 全部條款**。A/B/C 鐵則與 V-1～V-14 是**引擎無關**的設計
  契約，Phaser 只改變它們的**實作與驗收手段**，不改變條款本身。B-1 的「五個必要狀態」在 canvas 裡
  沒有 CSS class 可掛，改用 §6-3 的具名 texture key 落實——**要求沒有放寬，只是換了載體**。
- **主線金幣合計 250**、ECT 50–65 分鐘、教師端與翻轉教育需求（CLAUDE.md）。
- **美術素材正規化鐵則**（原 §3 共用畫布＋共用基準線）。本檔 §6 是它的延伸，不是取代。

---

## §1 為什麼換 runtime：三個結構性理由【背景】

換 runtime 的理由不是「Phaser 比較好寫」，而是既有正典裡有三個問題**在 Gamma iframe 架構下無解**，
換到自有 canvas 之後不是變好解，而是**不再存在**。這一節記錄下來，避免日後有人想「退回去用 iframe」。

| # | 既有問題 | 為什麼在 iframe 下無解 | Phaser 下為什麼消失 |
|---|---|---|---|
| 1 | 跨裝置尺寸不一致（`production-workflow` §2 已列為鐵則但只能給「人工測量」的權宜解） | 同源政策擋死跨網域 iframe 的內容量測與捲動同步，這是瀏覽器安全模型，不是實作難度問題 | 世界尺寸是**我方設定的常數**（§5-1），不是對別人的文件量出來的數字。跨裝置一致是天生的，不是維護出來的 |
| 2 | B-1 五個互動狀態無法真正渲染（`level-design-standard` §1 缺陷 4：線索物件完全沒有 `nearby` 樣式） | 互動點畫在 iframe 內部就碰不到；畫在外面的 DOM 疊層又要跟 iframe 內容對位，回到問題 1 | 互動點與角色在**同一個 canvas 的同一個座標系**，五態是同一批 sprite 換 texture，對位問題不存在 |
| 3 | WASD 移動在點過 iframe 之後失效 | 焦點進了跨網域 iframe，鍵盤事件不再回到父頁，父頁無從得知也無從奪回 | 全畫面只有一個 canvas，焦點沒有第二個去處 |

> **附帶效益**：問題 1 消失後，`level-design-standard` V-13（世界尺寸單一來源）從「要靠紀律維持的
> 六處常數同步」變成「一個 config 常數」——現行 S3W05 的 `10800`／`7400` 分岔（其中 `10800` 還被寫死在
> `types/LabQuest.ts:109` 的 TypeScript 字面型別裡，抽常數解決不了）在重建後自然不復存在。

---

## §2 【鐵則 R】Runtime 邊界契約【規定】

> 一句話：**Phaser 擁有世界，React 擁有交易。兩者只透過事件匯流排講話。**

這是本檔最重要的一節。它的價值不在「架構比較乾淨」，而在於它讓
[[lab-terminal-quest-level-design-standard]] 的兩條最常被違反的鐵則**由結構保證，而不是靠人記得**：

- **A-5（互動不是答案）** 之所以在舊實作被違反（`NativeQuestChallenge.tsx:21` 的
  `solved() → onAnswer(puzzle.answerIndex)` 直接代答），根因是小遊戲元件手上**拿得到** `answerIndex`。
  R-2 讓 Phaser 側從一開始就拿不到正解，代答在物理上做不到。
- **C-2（資料驅動，禁止 `puzzle.id` 字串分支）** 之所以被違反，根因是場景元件同時知道「這是哪一站」
  跟「這站要玩什麼」。R-5 讓場景只知道後者。

| 條款 | 規則 |
|---|---|
| **R-1 職責分割** | Phaser 負責**世界**：座標、碰撞、移動、鄰近判定、動畫、粒子、鏡頭、就地提示。React 負責**交易**：來源卡、題目、作答、線索筆記、金幣帳、進度狀態機。任一側都不得長出對方的職責 |
| **R-2 Phaser 不得持有正解** | 傳進場景的資料**不得包含** `answerIndex`、`acceptedAnswers`、`answerEvidence`、`optionMisconceptions`、`clue.requirement`。小遊戲場景只收到 `interaction` 這一個物件（含選項的 `isFact` 之類的呈現用旗標），完成後只回報「完成了」，由 React 決定那代表什麼 |
| **R-3 事件封閉清單** | 兩側只能使用 §4 表列的事件名。要新增事件必須先更新本檔再實作——這是防止兩半悄悄長出私下協定的唯一手段 |
| **R-4 無孤兒事件** | 每個事件在**發送端與接收端都必須有註冊**。只發不收（或只收不發）視同壞掉，由 P-3 擋下 |
| **R-5 場景不得用內容 id 字串分支** | 場景程式碼裡不得出現 `if (id === 'bridge-do')`、`switch (station.code)` 這類分支。行為差異一律由資料欄位（`interaction.kind`、`gate.id` 之外的語意欄位）驅動。**新增一站不得需要修改任何場景檔案** |
| **R-6 世界尺寸單一來源** | 世界寬高只有一個定義處（§5-1），其餘位置一律引用。禁止在場景、React、規格文件裡各寫一份數字 |
| **R-7 素材正規化含程序生成** | `production-workflow` §3 的「共用畫布＋共用基準線」對 `generateTexture()` 產生的材質**同樣適用**。不得在 runtime 加縮放／位移校正表（§6） |
| **R-8 五態具名 texture** | B-1 的五個狀態各自對應一個具名 texture key，NPC 與線索互動點**兩者都要**（§6-3） |
| **R-9 React 不得持有 Phaser 物件** | Phaser 的 `Game`／`Scene`／`GameObject` 一律放 `useRef`，不得進 `useState`／`useMemo` 的相依陣列，不得跨元件傳遞 |
| **R-10 生命週期可重入** | 場景 `shutdown` 必須清掉自己建立的 tween、timer、事件監聽；React 卸載時必須 `game.destroy(true)`。做不到就會在 React 18 StrictMode 的雙次掛載下出現兩個世界疊在一起 |

### 反例（實際發生過，不要重蹈）

```ts
// ❌ 違反 R-2 + R-5：場景拿到正解，又用 id 字串決定玩什麼
if (puzzle.id === 'bridge-do') startDragGame();
const solved = () => onAnswer(puzzle.answerIndex);

// ✅ 場景只知道「要玩哪一種」，完成後只說「完成了」
this.scene.launch('mini-game', { txId, interaction });   // interaction.kind 決定玩法
bus.emit('quest:miniGameCleared', { txId });             // 由 React 決定這代表解鎖④提問
```

---

## §3 場景切分基準【規定】

四個場景，職責互斥。**允許的相依方向只有「場景 → bus」，場景之間不得互相 import。**

| 場景 | key | 責任 | 明確不做 |
|---|---|---|---|
| `BootScene` | `boot` | 產生／載入全部材質與動畫，完成後 `scene.start('map')` | 不含任何遊戲邏輯。所有材質集中在此，是 §6 共用畫布規則唯一能被檢查的前提 |
| `MapScene` | `map` | 世界繪製、玩家移動、碰撞、閘門、鄰近判定、五態渲染、就地提示、獎勵掉落與拾取 | 不判定對錯、不存分數、不知道題目存在 |
| `MiniGameScene` | `mini-game` | ③理解階段。依 `interaction.kind` 呈現一種玩法，完成後回報 | 不發線索、不知道正解、不碰金幣（C-1、A-5） |
| `CombatScene` | `combat` | Boss 段的**表演**：血條、出招、受擊、結束演出 | 不判定勝負。勝負由 React 算完再叫它演（R-1） |

規則：

1. `MiniGameScene` 與 `CombatScene` 一律用 `scene.launch()` **疊加**在 `map` 之上，不用 `scene.start()`
   取代——玩家要看得見自己站在世界的哪裡，關掉小遊戲時世界狀態不該重來。
2. 疊加場景結束時自己 `scene.stop()` 並 `scene.resume('map')`，不由外部代勞。
3. 場景之間要溝通一律經 bus，不得 `this.scene.get('map')` 之後直接改對方的物件。

---

## §4 事件匯流排契約【規定】

匯流排是一個 `Phaser.Events.EventEmitter`，由 React 建立、透過 `game.registry.set('bus', bus)` 交給
場景。**下表是封閉清單（R-3）**，新增一列必須先改本檔。

### React → Phaser（命令：叫世界做事）

| 事件 | payload | 何時發 | 場景該做什麼 |
|---|---|---|---|
| `quest:stateUpdate` | `MapSnapshot`（見下） | 每次 React 狀態改變 | 依快照重繪五態、閘門開合、進度標記。**場景的視覺狀態一律由快照推導，不得自行記帳** |
| `quest:lockMovement` | `boolean` | 開啟／關閉任何作答面板 | `true` 時速度歸零，且 **WASD 與 E 同時失效**（只鎖移動不鎖 E 會讓玩家在答題中觸發下一個互動點） |
| `quest:startMiniGame` | `{ txId, interaction }` | 玩家在有小遊戲的互動點按 E | `scene.launch('mini-game', payload)`；已在執行中則忽略 |
| `quest:startCombat` | `{}` | 進入 Boss 段 | 玩家速度歸零、`scene.launch('combat')` |
| `quest:spawnReward` | `{ rewardId, total, x?, y? }` | 一筆交易或一站完成 | 生成可拾取金幣。**`rewardId` 必須做冪等**（同一個 id 只生成一次，見 P-11） |
| `quest:resetMap` | `{}` | 重玩／回起點 | 清空獎勵、玩家歸位、動畫停止、鏡頭置中 |
| `quest:move` | `{ x, y }` | 觸控搖桿 | 與 WASD 等價相加（B-7 的觸控替代操作） |
| `quest:triggerInteract` | `{}` | 觸控「調查」鈕 | 與按 E 等價 |
| `combat:claim` | `{ roundIndex, text }` | Boss 說出一個主張 | 播放 Boss 出招演出 |
| `combat:choice` | `{ roundIndex, correct }` | React 判定完玩家的選擇 | 播放命中／落空演出（**Phaser 收到的是判定結果，不是選項**） |
| `combat:end` | `{ win }` | 戰鬥結束 | 播放結束演出，自行 `stop` 並 `resume('map')` |

### Phaser → React（事實回報：世界發生了什麼）

| 事件 | payload | 何時發 | React 該做什麼 |
|---|---|---|---|
| `quest:nearby` | `{ kind, questId, transactionId } \| null` | 跨越互動半徑的那一刻（進入與離開各一次） | 更新「當前目標」與提示；**同一狀態不得重複發送**（每幀發一次會打爆 React） |
| `quest:interact` | `{ kind, questId, transactionId }` | 玩家按 E／點觸控鈕 | 開啟**來源卡**（②閱讀階段），不是直接開題目（A-1） |
| `quest:miniGameCleared` | `{ txId }` | 小遊戲完成 | 解鎖④提問。**不得解讀為答對**（A-5） |
| `quest:coinCollected` | `{ rewardId, value }` | 玩家撿到一枚金幣 | 記帳。**金幣的唯一真相在 React**，場景只負責讓它看起來被撿到了 |

### `MapSnapshot` 的最低欄位

```ts
interface MapSnapshot {
  activeStationId: string | null;
  /** 每站狀態，供 NPC 五態渲染 */
  stationStatus: Record<string, 'locked' | 'available' | 'active' | 'done'>;
  /** 每筆交易狀態，供線索互動點五態渲染。B-4 要求未輪到的也必須渲染成 locked，不得不畫 */
  txStatus: Record<string, 'locked' | 'available' | 'active' | 'done'>;
  /** 閘門開合 */
  gatesOpen: Record<string, boolean>;
  /** B-5 進度可數：本站第幾條／共幾條、第幾站／共幾站 */
  progress: { stationIndex: number; stationTotal: number; txIndex: number; txTotal: number };
}
```

> `nearby` 不在快照裡——它是 Phaser 算出來的事實，往 React 流，不是 React 告訴 Phaser 的。
> 資料方向搞反會產生一幀的來回震盪。

---

## §5 世界與座標基準【規定】

### §5-1 世界尺寸由內容反推，不是量出來的

```text
WORLD_WIDTH  = 960                                   // 固定，直向捲動關卡的視覺寬度
WORLD_HEIGHT = 上邊界留白 + Σ(每站所需高度) + 下邊界留白
每站所需高度 = NPC 區塊 + (該站交易數 × 互動點間距) + 站間過場距離
```

- 這個式子**每次內容變動時重算一次**，寫進同一個常數檔（`WORLD_HEIGHT`），其餘所有位置引用它。
- 這就是 V-13 在 Phaser 下的解法：不是「同步六處常數」，而是「只有一處」。
- 站與交易的 `worldY` 一律由站的錨點加上**相對位移**（`worldOffset`）算出，不要在資料裡到處寫絕對座標
  ——插一站進去時才不用重排全部數字。

### §5-2 depth 分層表

canvas 沒有 z-index，靠 `setDepth()`。**分層固定如下**，新物件挑最接近的一層，不要自創數字：

| depth | 內容 |
|---|---|
| `-10` | 地表底圖、地形色帶 |
| `-5` | 區域標題文字（溪谷入口／河畔農場／山腰工坊） |
| `-3` | 環境動畫（風車葉片等背景動態） |
| `0` | 地面裝飾、閘門碰撞體 |
| `2` | 閘門視覺（橋面、升降台） |
| `4` | 玩家、NPC、線索互動點 |
| `5` | 閘門說明文字 |
| `6` | 就地提示（B-2 的「E 調查」，必須在物件旁，不是畫面角落） |
| `8` | 掉落中／可拾取的獎勵 |
| `11` | 慶祝粒子 |
| `12` | 飄字（`+5`） |

疊加場景（`mini-game`／`combat`）是獨立 Scene，不佔用本表。

### §5-3 鏡頭與互動半徑

- 鏡頭 `startFollow(player, true, 0.12, 0.12)`；不要用 `lerp = 1`（會暈），也不要低於 `0.08`（會拖）。
- 互動半徑寫在交易資料的 `interactionRadius`，**不得寫死在場景**。
- 半徑判定每幀只算「最近的一個」並與上一幀比較，狀態沒變就不發事件（見 §4 `quest:nearby`）。
- 跨越半徑必須有**一次明確的視覺變化**（外框／縮放／圖示三選一，B-6），不能只換文字。

---

## §6 素材與程序生成基準【規定】

本節延續 [[lab-terminal-quest-production-workflow]] §3，補上它沒涵蓋的「程序生成」情形。

### §6-1 共用畫布與共用基準線，程序生成一樣要遵守

S3W05 角色曾連續出兩個 bug（移動忽大忽小、腳浮空），根因都是「匯出批次之間不一致，靠程式碼在後面補洞」。
換成 `graphics.generateTexture()` 產生材質**不會讓這個問題消失**——它只是把「匯出畫布」換成「程式裡寫的
畫布參數」，一樣可以寫歪。

1. 同一角色／物件的**所有影格、所有方向、所有狀態**，`generateTexture(key, W, H)` 的 `W`／`H` 必須相同。
   S3W05 現行值：`52 × 52`。
2. 需要「站在地面上」的素材，所有影格的**接地像素列**對齊同一條基準線。S3W05 現行值：**第 49 列**。
   繪製時把基準線寫成具名常數，不要每個影格各自微調數字。
3. **正規化在繪製端完成，不在 runtime**。已經出現的縮放／位移校正表視為技術債，下次更新素材時一併移除。
4. **物理碰撞框由基準線推導**：`setSize()/setOffset()` 的數字必須從畫布尺寸與基準線算出來，不得目測。
   目測的碰撞框會在換影格時漂移——這正是「腳浮空」bug 的同一個根因換個位置重演。
5. **陰影**（前瞻，偽物理拖曳關卡）：陰影的錨點要內建在素材座標裡，隨高度縮放時縮放中心對齊地面接觸點。
   詳見 `production-workflow` §3 第 4 點，本檔不重複。

### §6-2 靜態美術匯出 vs 程序生成

| | 用在哪 | 條件 |
|---|---|---|
| **靜態匯出**（優先） | 角色、NPC、地標、場景插畫 | 定稿後匯出成已知像素尺寸的 PNG／SVG。這是 `production-workflow` §2 的優先路線，現在是唯一路線 |
| **程序生成** | 原型期的暫代圖、純幾何元素（閘門、色帶、粒子、金幣） | 允許，但受 §6-1 全部約束。**不得成為正式關卡的角色與 NPC 最終素材**——程序生成的角色不可能通過美術驗收 |

> 原型階段可以整關都用程序生成先跑通流程（這是它的正當用途），但**進入正式內容前必須換成靜態素材**，
> 且換的時候尺寸與基準線不變，才不會又要回頭改碰撞框。

### §6-3 五態的 texture 命名（B-1 的 canvas 版）【規定】

CSS class 在 canvas 裡不存在，B-1「五個必要狀態、每個狀態不得只靠顏色區分」改用具名 texture key 落實。
**NPC 與線索互動點兩者都要五個，缺一不可**（舊實作只有 NPC 有 `nearby`，線索物件完全沒有，正是
`level-design-standard` §1 缺陷 4）：

| 狀態 | NPC | 線索互動點 | 最低視覺要求（沿用 B-1，不得放寬） |
|---|---|---|---|
| `locked` | `npc-locked` | `obj-locked` | 低飽和 ≤30% ＋ 鎖圖示 ＋ 不接受互動 |
| `available` | `npc-available` | `obj-available` | 常駐微光／脈動（2.5 秒週期）；reduced-motion 時改靜態高亮邊框 |
| `nearby` | `npc-nearby` | `obj-nearby` | 高對比外框 ＋ 物件旁渲染「E 調查」 |
| `active` | `npc-active` | `obj-active` | 維持高亮，其餘物件降低視覺權重 |
| `done` | `npc-done` | `obj-done` | ✓ 標記 ＋ 停止脈動 ＋ 仍可重看（A-8 重看不罰） |

規則：`nearby` 是**獨立 texture**，不是「available 加個外框物件」——加疊層會讓 B-6 的「跨越半徑一次明確變化」
退化成只有文字改變。

---

## §7 React 整合基準【規定】

### §7-1 掛載與生命週期

| 規則 | 為什麼 |
|---|---|
| 用 `dynamic(() => import(...), { ssr: false })` 載入遊戲元件 | Phaser 在 import 時就碰 `window`，SSR 會直接爆 |
| `new Phaser.Game()` 放在 `useEffect`，instance 存 `useRef` | R-9 |
| cleanup 必須 `game.destroy(true)` | React 18 StrictMode 開發模式會掛載兩次，不清就有兩個世界疊著跑（R-10） |
| `scale: { mode: Phaser.Scale.RESIZE }` | 讓 canvas 跟著容器走，尺寸一致性由世界常數保證，不靠縮放硬湊 |
| `physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 } } }` | 俯視地圖無重力；要重力的是未來的偽物理拖曳關，屆時另立規格 |
| bus 用 `game.registry.set('bus', bus)` 傳入 | 場景取得 bus 的唯一合法途徑；不要用模組層級的全域單例（會跨 instance 洩漏） |

### §7-2 答題卡契約（承接 `production-workflow` §4，全部仍然有效）

1. **永遠只顯示一個作答表面**；分頁邏輯在所有螢幕寬度下一致，不做「桌面全展開／手機才分頁」兩套。
2. **固定顯示「當前目標」一行**，由狀態機算出，不是靜態文字。
3. **關鍵狀態轉換時自動切換分頁**（線索收齊 → 自動切到筆記）。
4. 分頁數量不強制三個，但 1～3 點的框架不變。
5. **【本檔強化】當前目標必須指名 `sourceLabel`，且左欄地圖泡泡與右欄答題卡措辭一致**（B-3）：
   - ✅ `回到地圖，走向「木匠工作台」並按 E 調查。`
   - ❌ `回到左側地圖，找到下一個線索點並按 E 調查。`
6. **【本檔新增】作答面板開啟時必須送出 `quest:lockMovement: true`**，關閉時送 `false`。忘了關會讓玩家卡住，
   忘了開會讓玩家在讀題時走到下一個互動點——兩種都在測試時很難察覺，列入 P-13 自動檢查。

---

## §8 生產工作流程（不可跳步）

沿用 `production-workflow` §1 的精神（**內容先行，座標反推**），改寫成 Phaser 版本：

```text
1. 鎖①內容：故事、每站的「阿修爛 Prompt → 失敗畫面」、每筆交易的來源卡原文
2. 用①反推②：教案，確認每站教學目標與 60–90 分鐘課堂結構
3. 用①②寫③：任務鏈、四種需求分類、每筆交易的 sourceCard / interaction / question /
   answerEvidence / clueText、金幣（合計 250）
4. ★ 先跑資料驗證：V-1～V-14 全過才准動程式。此時還沒有任何場景程式碼
5. 用③反推④：§5-1 公式算世界高度、各站錨點與交易的相對位移
6. 素材：依 §6 決定靜態匯出或程序生成，鎖定共用畫布與基準線
7. 實作場景：BootScene → MapScene → MiniGameScene → CombatScene，全程遵守 R-1～R-10
8. 接 React 答題卡：§7-2 契約；bus 兩端對齊 §4 封閉清單
9. 驗收：P-1～P-14 自動檢查 ＋ §9.2 五態快照 ＋ ECT 50–65 分鐘 ＋ 學生／教師視角各走一次
```

**第 4 步是本流程與舊流程最大的差異。** 舊流程把驗證放在最後，結果是「內容已經蓋成程式了才發現題目
沒有答案」，修起來要同時改資料與畫面。資料驗證不依賴任何 runtime，本來就可以在寫第一行場景程式碼之前
跑完——把它提前是零成本的。

---

## §9 驗收條款

### §9.1 可自動檢查【規定】

除了 [[lab-terminal-quest-level-design-standard]] §7.1 的 V-1～V-14（資料層，仍然全部必跑），Phaser
runtime 另外必須通過下列斷言。可用 lint 規則、單元測試或建置期腳本實作。

| ID | 斷言 | 擋下的問題 | 對應鐵則 |
|---|---|---|---|
| **P-1** | `src/phaser/**` 底下不得出現 `answerIndex`／`acceptedAnswers`／`answerEvidence`／`optionMisconceptions`／`requirement` 這些識別字 | 場景拿得到正解 → 代答 | R-2、A-5 |
| **P-2** | 程式碼中所有 `bus.emit()`／`bus.on()` 的事件名，都在 §4 表列的封閉清單內 | 兩半長出私下協定 | R-3 |
| **P-3** | 每個事件名至少各有一處 `emit` 與一處 `on` | 孤兒事件（只發不收／只收不發） | R-4 |
| **P-4** | §6-3 的十個 texture key 全部在 `BootScene` 產生或載入 | 五態缺角，退回「只有 NPC 有提示」 | R-8、B-1 |
| **P-5** | 所有 `generateTexture()` 呼叫中，同一素材群組的寬高參數一致 | 影格忽大忽小 | R-7 |
| **P-6** | 玩家 `setSize()/setOffset()` 的數字由畫布與基準線常數算出，不是字面量 | 腳浮空／碰撞框漂移 | R-7 |
| **P-7** | `WORLD_WIDTH`／`WORLD_HEIGHT` 各只有一處定義，其餘為引用 | 常數分岔（現行 10800／7400 分岔） | R-6、V-13 |
| **P-8** | `src/phaser/**` 不得出現與內容 id 比對的字串常數 | 新增一站要改場景 | R-5、C-2 |
| **P-9** | 建立 `Phaser.Game` 的 `useEffect` 必有回傳 cleanup 且呼叫 `destroy(true)` | StrictMode 雙世界 | R-10 |
| **P-10** | 遊戲元件的引入點使用 `ssr: false` | SSR 期間存取 `window` | §7-1 |
| **P-11** | `quest:spawnReward` 的處理端以 `rewardId` 去重 | 重複發金幣（金幣須 idempotent） | §4 |
| **P-12** | 每個場景的 `shutdown` 清掉自己建立的 tween／timer／`bus.on` | 重玩後動畫殘留、監聽疊加 | R-10 |
| **P-13** | `movementLocked` 為真時，移動與 E 鍵**兩者**都被擋下 | 讀題時走掉／答完卡住 | §7-2 第 6 點 |
| **P-14** | `prefers-reduced-motion` 時脈動改為靜態高亮 | 無障礙（B-1、B-7） | B-7 |

### §9.2 人工／快照驗收（B 鐵則的 canvas 版）

每次改動場景或素材必跑一次：

- [ ] 五個狀態各截一張圖，五張肉眼可分辨，且 **NPC 與線索互動點兩組都要截**。
- [ ] 走進／走出互動半徑各截一張，兩張必須可分辨（B-6）。
- [ ] 灰階模式下五態仍可區分（不只靠顏色）。
- [ ] 本站所有未完成互動點在同一畫面上都看得到，未輪到的呈 `locked`（B-4）。
- [ ] 右欄「當前目標」與左欄地圖泡泡措辭一致，且都指名了 `sourceLabel`（B-3）。
- [ ] 鍵盤 Tab 能走完所有可互動物件；觸控模式的「調查」鈕等價於 E（B-7）。

### §9.3 執行時機【規定】

1. **內容作者存檔時**：跑 V-1～V-14，不通過標紅但允許繼續編輯。
2. **發布時**：跑 V-1～V-14，不通過即擋下發布。
3. **提交程式碼時**：跑 P-1～P-14。
4. **學生端載入時**：跑 V-1～V-14 當最後防線，不通過退回內建預設定義。
5. **CI**：V 與 P 全跑一次，作為回歸測試。

---

## §10 開發環境基準【規定】

| 項目 | 值 | 備註 |
|---|---|---|
| 套件 | `phaser` ^3.70 | 鎖 minor，升版要跑一次 §9.2 快照 |
| 框架 | Next.js 13 pages router（沿用現有專案） | 遊戲頁一律 `ssr:false` |
| 開發埠 | 專案預設 3000；**若已有其他站台佔用，用 `next dev -p 3001`** | 埠號寫進 `package.json` 的 `dev` script，不要每次口頭交代 |
| 原型頁位置 | `pages/dev/s{N}w{NN}-phaser.tsx` | `dev/` 底下不進正式路由 |
| 目錄 | `src/phaser/`（引擎層）、`src/components/phaser/`（React 層）、`src/config/`（關卡資料） | P-1／P-8 的檢查範圍就是 `src/phaser/**`，目錄分界即檢查邊界 |

```text
src/
  phaser/
    types.ts               # 場景用得到的型別（不含正解欄位）
    PhaserGame.tsx         # Game instance 生命週期 + bus 注入
    scenes/
      BootScene.ts         # 全部材質與動畫
      MapScene.ts          # 世界
      MiniGameScene.ts     # ③理解
      CombatScene.ts       # Boss 表演
  components/phaser/
    S{N}W{NN}Quest.tsx     # 狀態機 + 答題卡（唯一知道正解的地方）
  config/
    s{N}w{NN}QuestData.ts  # 關卡資料 + 世界常數（單一來源）
```

---

## §11 S3W05 重建待辦（供工程 agent 排程）

W05 現行實作是 DOM 版的 `NativeQuest*` 系列。改用 Phaser 後的對應關係：

| 現行檔案 | 處置 |
|---|---|
| `NativeQuestMapRuntime.tsx` | **由 `MapScene` 取代**（含 `:104` 未輪到就不渲染的 B-4 違規，改由快照的 `locked` 狀態渲染） |
| `NativeQuestChallenge.tsx` | **由 `MiniGameScene` 取代**（`:21` 直接代答與 `:22-24` 的 `puzzle.id` 分支由 R-2／R-5 結構性排除） |
| `NativeQuestMap.module.css` | **廢除**，五態改為 §6-3 的 texture key |
| `S3W05LabQuest.tsx` | **保留並改造**為 §7-2 的答題卡＋狀態機；`currentGoalMessage()` 死碼刪除，改用實際渲染路徑並依 B-3 指名 |
| `config/s3w05LabQuest.ts` | 補 `sourceCard`／`answerEvidence` 欄位（`level-design-standard` §6），世界常數收斂成單一來源 |
| `config/s3w05QuestLevel.ts` 的 `createDefaultQuestMapObjects()` | **不要動**。它是 S3 答題版 `GammaAnswerWorksheet.tsx:775` 仍在使用的活躍程式碼；只有 `S3W05_QUEST_WORLD_HEIGHT = 7400` 這個常數需要處理 |

順序建議：先補資料層（`sourceCard`／`answerEvidence`）並跑通 V-1～V-14 → 再寫場景（§8 第 4 步的用意）。

---

## §12 對既有正典的修訂需求

| 位置 | 需要改什麼 |
|---|---|
| [[lab-terminal-quest-production-workflow]] | 依本檔 §0-1 修訂 §0 表格①列、§2 兩條路線、§4 實作參考、§5 檢查清單（本輪已加覆寫聲明，逐條改寫待負責人排程） |
| [[lab-terminal-quest-art-spec]] | 需補 §6-3 的五態素材規格（目前只有角色／NPC／地標／陰影）；另該檔「S3W05 尚未有可拖動物件」的敘述已過時（`NativeQuestChallenge.tsx:33-50` 已有 pointer drag） |
| [[S3-W05-Lab-Terminal-Quest-建置規格]] | S3W05 已收束到 Runtime 單一來源；任何後續內容調整都必須依本檔的 React／Phaser 邊界與 `level-design-standard` 驗收。 |

---

## 連結

- **內容生產方法**（本檔吃的建置規格從哪裡來）：[[lab-terminal-quest-narrative-standard]]
- 上游生產流程：[[lab-terminal-quest-production-workflow]]
- 設計正確性契約：[[lab-terminal-quest-level-design-standard]]
- 美術素材規格：[[lab-terminal-quest-art-spec]]
- 對應 skill：`skills/labterminal-quest-phaser/`（見 [[llm-skills]]）
- 實例建置規格：[[S3-W05-Lab-Terminal-Quest-建置規格]]
- 所屬學期：[[S3-小四上-AI建構]]

> 建立：2026-09-09，原因：負責人裁決 Phaser 成為 Lab Terminal Quest 預設 runtime。換 runtime 同時解掉
> 既有正典中三個結構性無解問題（跨裝置尺寸、B 鐵則五態無法渲染、iframe 吃掉鍵盤焦點），並開出一組新的
> 工程約束。本檔把「Phaser 擁有世界、React 擁有交易」寫成鐵則 R，讓 A-5（互動不是答案）與 C-2（資料驅動）
> 從「靠紀律遵守」變成「結構上做不到違反」，並補上 P-1～P-14 可自動檢查的斷言。
