# S3W06 時門開場＋傳送門場景轉場 規格書 v2（交付 Codex）

> 2026-09-24．對象：Codex．接續《S3W06開場傳送門規格書-codex.md》（v1，已完成）。
> **v1 做好的傳送門效果（地面漩渦＋光柱＋落地）使用者確認 OK，素材和手感都不要改。** 本規格做兩件事：
> 1. **新增一段轉場**：W05 遺跡的時門打開 → 時光隧道 → 接到 v1 的星門落地（第 1 節 A、B、C 三幕）。
> 2. **把 v1 的傳送門變成通用轉場**：之後每一次站與站之間的場景移動，都改用傳送門（第 5 節）。
> W05 與 W06 共用引擎。新增內容一律是選填設定，只有 W06 會設定，**W05 的行為和檔案都不能改動**。只能讀取 W05 的圖片素材，不能修改。

---

## 0. 使用者的需求

> 希望連結 W05 最後結局的地圖，把後面的時門打開，連接回馬雅；這個過程要有完整的動畫，讓學生知道自己發生了什麼。

v1 的問題是學生一開始就站在馬雅星門，不知道自己從哪裡來、為什麼到了這裡。v2 要讓學生看到完整的過程：
1. **我在哪裡**：畫面先回到 W05 最後的地圖「溪谷鎮古老遺跡」，學生會認得這個地方。
2. **發生了什麼**：遺跡後方那扇圓形石門，也就是「時門」，亮起來後打開，裡面變成傳送門，玩家走了進去。
3. **要去哪裡**：穿越時光隧道的途中，依序閃過 W05、W04、W03 的記憶卡，最後停在 W02 的瑪雅星門。
4. **到了**：接上 v1 的落地動畫，玩家出現在瑪雅星門。

---

## 1. 分幕與時間軸（全長約 12.5 秒，每位學生只播一次，可跳過）

### 第 A 幕：W05 溪谷鎮古老遺跡，時門開啟（0～5.4 秒）
場景直接用 W05 的 `public/assets/s3w05/stage-d/relic-repaired.png`（修好的樣子，也就是學生在 W05 最後看到的畫面），縮放成 960×640 顯示。

座標一律用 960×640 的顯示座標。下面的數字是我量過的估計值，**請再開原圖確認一次**。原圖座標換算成顯示座標要乘 0.625。

| 物件 | 位置（顯示座標） | 說明 |
|---|---|---|
| 時門（圓形石門）中心 | 約 (480, 142)，半徑約 40 | 原圖約 (768, 227)，半徑 64 |
| 時門上方的修復節徽章 | 約 (478, 62) | 原圖約 (765, 100) |
| 門檻（玩家走到的位置） | 約 (480, 196) | 門下緣往下一點的平台 |
| 玩家起點 | (480, 330) | 廣場中央十字紋上，面朝北 |
| 羅盤守門靈（W05 NPC） | (560, 380) | W05 的 relic 站 anchor (520, 5500) 加上 npcOffset (40, 60)，再減掉 area 位置，和 W05 裡站的地方一樣 |
| 三座台座（發光） | 約 (280, 230)、(680, 230)、(480, 410) | 請量準 |

| 時間 | 事件 |
|---|---|
| 0.0 | 從黑畫面淡入（400ms）。React 顯示地點標籤「W05｜溪谷鎮古老遺跡」和字幕第 1 句。玩家站在起點（idle，朝北），守門靈站在他的位置（沿用 W05 素材 `npcs/relic/talk/frame_000.png`，不能改這張圖） |
| 0.8 | 三座台座各飛出一顆光球（ADD 混合，用程式畫的小圓加拖尾），沿著弧線在 1.0 秒內飛進時門 |
| 1.8 | 門上的符文亮起（`w05-gate-runes.png` 以 8 fps 循環），徽章後面浮現金色光暈。鏡頭用 800ms 從 zoom 1.0 推到 1.15，中心移向時門 |
| 2.8 | 時門開啟：門上閃一下白光（120ms），門板 sprite 在 400ms 內放大到 1.08 倍並淡出，同時噴出 24 顆火花。門後的 `w05-gate-cavity.png` 露出來，再疊上 `fx/portal-swirl.png` 開始旋轉（ADD，10 fps，縮放成時門的大小）。地面鋪上一片藍紫色的淡光（ADD 橢圓） |
| 3.4 | 玩家自動往北走到門檻（播 walk/north 動畫，1.2 秒） |
| 4.6 | 玩家被吸進門裡：500ms 內移到門中心，scale 1→0.2、alpha 1→0，並略微旋轉 |
| 5.1 | 全畫面白光閃一下（300ms），然後進第 B 幕 |

### 第 B 幕：時光隧道，記憶倒轉（5.4～9.4 秒）
背景全黑。從畫面中心不斷生出同心橢圓光環往外擴散並淡出，顏色輪流用藍 #5b8cff、紫 #b36bff、金 #ffcf5a，做出往前飛的感覺（每 120ms 生一圈）。React 字幕換成第 2 句。

**記憶卡**：依序從中心飛出來。每張卡是一個 16:10 的圓角框，框線金色，裡面是該地點的背景縮圖，卡片下方有兩行字。

| 順序 | 卡片圖 | 第 1 行（地點） | 第 2 行（沿用內容裡的句子） |
|---|---|---|---|
| 1 | W05 `relic-repaired.png` | W05｜溪谷鎮 | `STAGES.finale.problem` |
| 2 | W06 `square-repaired.png` | W04｜顛倒博物館 | `STAGES.square.problem` |
| 3 | W06 `forest-repaired.png` | W03｜午夜車站 | `STAGES.forest.problem` |
| 4 | **W06 星門場景目前的材質**（第一次來是 damaged 版） | W02｜瑪雅星門 | `STAGES.ribbon.problem` |

- 第 1～3 張：每張 0.8 秒，從中心的小卡（寬 120）放大到寬 360，同時往四個角落其中一個飄走並淡出。
- 第 4 張：從中心出現後在 1.2 秒內放大到**剛好填滿 960×640**（卡片的框和字在放大過程中淡出）。因為這張就是 MapScene 星門場景接下來要顯示的材質，放大到滿版時畫面會一模一樣，直接淡出 OpeningScene，就能無縫接到第 C 幕。
- 第 2 行文字要從內容設定讀取，不要寫死。沒有對應的內容就只顯示第 1 行。

### 第 C 幕：瑪雅星門落地（9.4～12.2 秒）
沿用 v1 已經做好的 `MapScene.playOpening()`，只是**跳過一開始的黑畫面淡入**（畫面已經是星門了）。從地面漩渦開啟開始，順序照 v1：漩渦開啟 → 光柱 → 玩家落地 → 火花 → 漩渦收合。

React 顯示地點標籤「W02｜瑪雅遺跡・星門」和字幕第 3 句，結束時淡出，然後才出現奇克的「!」和操作教學。

### 字幕與標籤
- 字幕沿用 `content.narrative.prologue.villagerLines` 的第 1、2、3 句，對應 A、B、C 三幕。
- 地點標籤放在 opening 設定裡（見 3.1），用 React 顯示在 `.map-pane` 左上角，樣式比照 `.map-goal`。播放期間把原本的「當前目標」框藏起來。
- **字幕和標籤的切換改由 Phaser 送事件驅動**，不再由 React 自己計時（見 3.3）。v1 的 React 1200ms 計時器要拿掉，因為場景圖載入慢時，字幕會跑在動畫前面。

### 跳過、減少動態效果、失敗保護
- 播放期間右下角顯示 React 按鈕「跳過動畫 ▶▶」。按下去，或播放 300ms 之後按任意鍵，都直接跳到最後狀態：玩家站在星門出生點、所有特效清掉、送出 complete。
- **減少動態效果**：不播 A、B 兩幕的動作。改成三張靜態畫面交叉淡入，每張 1.5 秒：W05 遺跡（時門換成 cavity 加上 swirl 第 1 格）配字幕 1 → 記憶卡四張排成一列配字幕 2 → 星門配字幕 3，最後結束。
- **失敗保護**：React 端設 25 秒的看門狗計時。25 秒內沒收到 complete 就當作播完，避免學生被鎖住不能動。素材載入失敗時，Phaser 直接送 complete。

---

## 2. 素材

放在 `public/assets/s3w06/opening/`，產生腳本加進 `scripts/build-s3w06-art.py`（函式 `build_w05_gate()`）。**只從 W05 原圖讀取，不能寫回 W05 的檔案。** 三張圖都用**原圖解析度**裁切和輸出，程式顯示時和背景一樣乘 0.625，像素才會對齊。

| 檔名 | 內容 | 規格 |
|---|---|---|
| `w05-gate-door.png` | 從 `relic-repaired.png` 精準裁出圓形門板（包含外圈深色描邊），圓外全透明 | 正方形，邊長 = 門板直徑 + 8 px。裁切框的左上角和圓心寫進 layout JSON |
| `w05-gate-cavity.png` | 和 door 同一個框、同一個圓：圓內畫深靛色的漩渦洞口（中心最暗，往外帶一點紫色，點綴幾顆星點），圓外全透明 | 圓的半徑比門板多 2 px，完全蓋住原圖的門板，不能露出底圖的門 |
| `w05-gate-runes.png` | 門板上十字、內圈、外圈這些深色線條「發光」的版本，4 格水平排列，亮度 40%→100%→70%→100% 循環，ADD 用 | 每格和 door 同尺寸。做法：從 door 圖挑出暗線條的像素，改成青色 #7fe9ff，外面加 1 px 金色 #ffcf5a 光暈 |
| `w05-gate-layout.json` | 記錄 `source`、`doorBox`（原圖座標 x, y, w, h）、`doorCenter`、`doorRadius`、`threshold`、`medallion`、`pedestals`（以上是原圖座標），以及換算後的顯示座標 | 程式的座標要和這份 JSON 一致 |

其他全部**重複使用現有素材或用程式畫**：`fx/portal-swirl.png`（門內漩渦）、火花材質 `fireworks-spark`（OpeningScene 裡沒有的話自己產生一份）、W05 守門靈、玩家走路動畫、隧道光環和光球（Graphics 畫）、記憶卡（直接用已載入的背景材質）。

**v1 的傳送門素材（`opening-portal-open/loop.png`、`opening-light-beam.png`）不要修改。**

---

## 3. 程式接線

### 3.1 資料（`src/types/S3W05Quest.ts`、`src/config/s3w06QuestData.ts`）
在 `QuestOpening` 加上選填欄位 `prelude?`，只有 W06 設定：
```ts
prelude?: {
  w05: {
    backgroundUrl: string;               // /assets/s3w05/stage-d/relic-repaired.png
    doorUrl: string; cavityUrl: string; runesUrl: string; swirlUrl: string;
    doorBox: { x: number; y: number; width: number; height: number };   // 顯示座標
    doorCenter: WorldPoint; doorRadius: number; threshold: WorldPoint;
    medallion: WorldPoint; pedestals: WorldPoint[];
    playerStart: WorldPoint;
    guardian: { spriteUrl: string; position: WorldPoint };
  };
  memoryCards: Array<{ label: string; line?: string; imageUrl?: string; textureKey?: string }>;
  labels: { w05: string; arrival: string };   // "W05｜溪谷鎮古老遺跡"、"W02｜瑪雅遺跡・星門"
};
```
- `memoryCards` 第 2 行的文字（`line`）來自 `STAGES.*.problem`。`s3w06QuestData.ts` 讀不到 STAGES 的話，就在 `s3w06W05Content.ts` 組 questData 時把 prelude 補完整。重點是不重複寫文案。
- 第 4 張卡用 `textureKey`，指向星門 area 當下的材質 key。

### 3.2 Phaser
1. **新增 `src/phaser/scenes/OpeningScene.ts`**，負責第 A、B 兩幕，並在 Phaser game config 註冊（照現有 scene 的註冊方式）。
   - 素材由 BootScene 在 `opening.prelude` 有值時預先載入：W05 背景、door、cavity、runes（spritesheet）、守門靈。swirl 在 v1 已經載入過。
   - 這個 scene 蓋在 MapScene 上面播放，自己有一個 960×640 的鏡頭。播放期間 MapScene 保持暫停渲染，或被完全遮住。
   - 播完第 B 幕後送出 `opening:preludeDone`（scene 內部事件），自己停止，MapScene 接著播第 C 幕。
2. `MapScene.playOpening()`：有 `prelude` 時先 `this.scene.launch("opening")`，等 prelude 播完再跑 v1 流程，但跳過 fadeIn，直接從漩渦開啟開始。沒有 prelude 時，行為和 v1 完全一樣。
3. 跳過：MapScene 已有的 `skipOpening()` 也要負責停掉 OpeningScene，並清掉它的 tween、timer、sprite。
4. `eventContract.ts` 新增兩個事件：
   - `quest:openingPhase`（Phaser → React），payload `{ phase: "w05" | "tunnel" | "arrival" }`
   - `quest:skipOpening`（React → Phaser）
5. `shutdown()` 和場景重設時，都要把 OpeningScene 停掉並清理乾淨。

### 3.3 React（`S3W05Quest.tsx`、`PhaserGame.tsx`）
1. 拿掉 v1 的 1200ms 字幕計時器，字幕和標籤改由 `onOpeningPhase(phase)` 切換：
   - `w05` → 第 1 句加 W05 標籤
   - `tunnel` → 第 2 句，不顯示標籤
   - `arrival` → 第 3 句加 W02 標籤
2. 加上「跳過動畫 ▶▶」按鈕，按下去送出 `quest:skipOpening`。
3. 加上 25 秒看門狗；收到 complete 或按跳過時要清掉它。
4. 播放期間隱藏「當前目標」框；播完之後才顯示操作教學（沿用 v1 的條件）。
5. Preview 的「測試開場傳送門」按鈕改成播完整三幕。

---

## 4. 驗收

**自動檢查**（加進 `scripts/check-s3w06-art.py`）：
- [ ] door、cavity 都是 RGBA，而且尺寸相同；圓外 alpha 為 0
- [ ] cavity 的不透明範圍要完全蓋住 door 的不透明範圍
- [ ] 把 door 疊回 `relic-repaired.png` 的 doorBox 位置，和原圖逐像素比對，圓內差異要是 0（證明裁得準）
- [ ] runes 是 4 格，每格尺寸和 door 相同
- [ ] v1 的三張傳送門素材 hash 沒有改變
- [ ] **W05 的素材檔（`public/assets/s3w05/**`、`npcs/relic/**`）的 hash 和修改前一樣**

**目視總覽圖**：
- W05 遺跡疊上 door、疊上 runes 第 2 格、換成 cavity 加 swirl，三張並排
- 第 B 幕四張記憶卡的排版
- 第 4 張卡放大到滿版時的最後一格，和 MapScene 星門畫面並排比對（要一樣）

**實機**（`/dev/s3w06-quest`，按「重設 Preview」後進入）：
- [ ] 完整三幕依序播放；字幕和地點標籤跟著幕別切換
- [ ] 第 B 幕最後接到星門時沒有跳動或閃爍
- [ ] 「跳過動畫」按鈕和按任意鍵都能在任何一幕跳到結尾，之後可以正常移動，操作教學會出現
- [ ] 減少動態效果時是三張靜態畫面；重新整理後不會再播
- [ ] 有進度的舊存檔不會播
- [ ] **W05（`/dev/lab-terminal-quest`）完全沒有變化**
- [ ] console 沒有錯誤或 404；`npx tsc --noEmit` 沒有新的錯誤


---

## 5. 站與站之間的傳送門轉場（重用 v1 效果）

### 5.1 現況
現在 W06 每站完成後，場景最下方會出現文字「↓ 前往下一頁・某某站」，那是一塊看不見的觸發區（場景底部 60 px、中心左右各 130 px）。走進去就用 260ms 黑幕淡出淡入，把玩家換到下一張場景最上方的 (480, 80)（`MapScene.checkAuthoredTransitions()`）。

### 5.2 改成
**出發（離開這一站）**：
1. 站點完成後，出口位置**看得到一個地面傳送門**，播 v1 的 loop 動畫（open 開啟一次後接 loop）。原本的「↓ 前往下一頁・某某站」文字留著，放在傳送門上方。
2. 觸發區改成**傳送門本身**：以漩渦中心為準，左右 ±40、上下 ±24。
3. 玩家踩上去：鎖住移動，200ms 把玩家吸到漩渦中心，接著光柱淡入。
4. 玩家升空消失（v1 落地的倒放）：y 往上 40、scale 1→0.7、alpha 1→0，450ms，`Cubic.easeIn`。同時噴火花。
5. 黑幕淡出（260ms，沿用現有流程），切換 area。

**抵達（下一站）**：
6. 黑幕淡入後，在下一站的**抵達點**播放 v1 落地流程，但縮短成約 1.8 秒：漩渦開啟 → 光柱 → 玩家落下 → 火花 → 光柱淡出 → 漩渦收合 → 解鎖移動。
7. 抵達時，畫面上方中央顯示 1.6 秒的地點橫幅「抵達・{下一站的 station.name}」，例如「抵達・午夜車站｜W03」。用 Phaser text 顯示，樣式比照現有的 transition guide（深棕底、淡金字）。
8. 抵達後照原本流程送出 `quest:stationEnter`。

**跳過和減少動態效果**：
- 抵達的動畫播放中按任意鍵可以直接跳到結尾。
- `reducedMotion` 時整段維持現在的黑幕淡出淡入，出口傳送門只顯示靜態的 loop 第 1 格。

### 5.3 位置
原本的抵達點是場景最上緣 (480, 80)，光柱會超出場景頂端被切掉，所以要換位置。下面是建議的座標（以各場景左上角為原點的 960×640 座標），**請疊圖確認都落在看得到、走得到的空地，而且 160 px 高的光柱不會被切掉**：

| 場景 | 出口傳送門（離開） | 抵達點 |
|---|---|---|
| ribbon 星門 | (480, 560) | ——（開場由第 C 幕處理） |
| forest 午夜車站 | (480, 560) | 約 (200, 370)，月台左側 |
| square 顛倒博物館 | (480, 560) | 約 (560, 260)，字塊地板右上 |
| finale 溪谷鎮 | ——（最後一站沒有出口） | 約 (360, 410)，廣場左側 |

要避開這些位置：
- 各站 NPC (480, 340)
- 互動點：`PROMPT_OFFSET` 換算後，ribbon (600, 430)、forest (320, 370)、square (360, 290)、finale (600, 420)
- 獎勵鑽石 (480, 450)

抵達點不能落在任何互動半徑 90 px 之內，免得一落地就觸發對話。

### 5.4 程式接線（只有 W06 會設定，W05 維持黑幕轉場）
1. `AuthoredWorldArea.transitions[]` 加上選填欄位：
   ```ts
   style?: "fade" | "portal";   // 沒寫就是 fade（W05 現況）
   portalPoint?: WorldPoint;    // style 為 portal 時的出口漩渦中心（世界座標），觸發區由它推算
   ```
   `destinationPoint` 改成上表的抵達點，換算成世界座標。
2. `src/config/s3w06QuestData.ts`：產生 transitions 時設定 `style: "portal"`、`portalPoint`、新的 `destinationPoint`。原本用 `station.anchor.x ± 130` 和底部 60 px 算的 trigger，改成由 `portalPoint` 推算（±40, ±24）。新加的 `S3W06_ARRIVAL_POINT` 表要放在 `s3w06QuestData.ts`，和現有的 `S3W06_AREA_ART` 放在一起。
3. `MapScene.ts`：
   - 把 v1 `playOpening()` 裡的落地流程抽成共用方法 `playPortalArrival(point, { fadeIn, durationScale, onDone })`，再寫一個 `playPortalDeparture(point, onDone)`。第 C 幕和站點轉場都呼叫它們。開場的時間軸和效果**要跟現在完全一樣**。
   - `checkAuthoredTransitions()`：`style === "portal"` 且不是 `reducedMotion` 時，走「出發 → 切換 area → 抵達」；否則維持原本的 fade 流程，一行都不動。
   - 出口傳送門 sprite 在 `createTransitionGuides()` 一起建立，在 `renderTransitionGuides()` 決定要不要顯示（出口可用時才播 open → loop，不可用時隱藏）。
   - 轉場期間 `transitionInFlight` 為 true、移動鎖住、附近互動提示和 NPC「!」都隱藏。結束時一定要還原：玩家 alpha 和 scale 回到 1、移動解鎖、sprite 和 tween 清掉。`shutdown()` 和場景重設也要清。
4. Preview 的站點跳轉按鈕（A站～D站）維持現在的直接跳，不播轉場。

### 5.5 驗收
- [ ] 完成星門後，出口出現旋轉的傳送門；踩上去後玩家升空消失，接著在午夜車站的抵達點落下，並出現「抵達・午夜車站｜W03」
- [ ] forest → square、square → finale 都一樣；三個抵達點的光柱都完整、沒被切掉，玩家落地時沒有觸發任何互動
- [ ] 還沒完成的站看不到出口傳送門，也走不過去（沿用 `activeWhen`）
- [ ] 抵達動畫播放中按任意鍵可以跳過，之後能正常移動
- [ ] 減少動態效果時維持黑幕淡出淡入
- [ ] 重新整理後停在任何一站，都能正常繼續，不會卡在鎖住的狀態
- [ ] **W05 的所有場景轉場仍是原本的黑幕淡出淡入**

回報時請附上：總覽圖、自動檢查輸出、開場三幕各 2～3 張的逐秒截圖（或錄影）、一次站點傳送門轉場的逐秒截圖，以及 W05 的對照截圖。

**做事順序**：先做第 5 節（重用現有效果，風險較低），確認轉場沒問題後，再做第 1～3 節的時門開場。
