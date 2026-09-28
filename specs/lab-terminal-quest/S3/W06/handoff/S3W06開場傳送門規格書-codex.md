# S3W06 開場傳送門動畫規格書（交付 Codex）

> 2026-09-24．對象：Codex．專案：Next.js ＋ Phaser 3.70（Canvas renderer）
> S3W06 走 `S3W06PhaserQuest.tsx → S3W05Quest.tsx`（內容在 `src/config/s3w06W05Content.ts`）。
> **W05 與 W06 共用同一套引擎，W05 行為一律不能變**：所有新東西都是「有設定才生效」的選填欄位，只有 W06 會設定。
> 美術風格、透明背景、nearest 縮放等共同原則，沿用 `S3W06美術規格書-codex.md` 第 1 節。

---

## 0. 為什麼要做

劇情上，W05 最後一道門打開後，傳送光圈把玩家直接送到瑪雅遺跡的星門。W06 內容裡也寫了這段（`narrative.prologue`），但遊戲一開始就直接出現在地圖上，**沒有任何傳送的畫面**。

另外，現在的出生點是 `S3W06_WORLD.playerStart = (480, 420)`，換算成星門場景是 (480, 40)，也就是畫面最上緣的樹冠裡。開場動畫要在玩家身上播放，出生點必須先移到合理的位置。

## 1. 要呈現的樣子（約 3 秒，只播一次）

第一次進入 W06 時，星門平台前的土路上浮現一圈**地面傳送漩渦**，漩渦往上射出一道光柱。玩家從光柱裡落到地面，火花散開後光柱消失，漩渦收合。接著畫面上出現奇克頭上的「!」，然後才跳出操作教學。

配色沿用終章傳送門的**藍 #5b8cff、紫 #b36bff、金 #ffcf5a**。這樣 W05 終章看到的門，和 W06 開場走出來的門是同一道。

### 時間軸（毫秒）

| 時間 | 事件 |
|---|---|
| 0 | 鎖住移動、玩家先隱藏；鏡頭已經對準星門場景；字幕顯示第 1 句 |
| 0–400 | 鏡頭從黑畫面淡入（沿用現有 `cameras.main.fadeIn`） |
| 400 | 地面漩渦播「開啟」動畫（8 格，16 fps，約 500ms）；播放合成音效「呼——」（選做） |
| 900 | 漩渦切換成「循環」動畫（8 格，12 fps）；光柱在 250ms 內淡入並循環（6 格，10 fps，ADD 混合） |
| 1200 | 玩家出現：alpha 0→1、y 從 −40 到 0、scale 0.7→1，用 `Quad.Out` 在 450ms 內完成；落地瞬間噴一圈火花（約 16 顆，沿用現有 `fireworks-spark` 材質，不用新素材）；字幕換成第 2 句 |
| 1700 | 鏡頭輕微震動 120ms，強度 0.004 |
| 1900 | 光柱在 300ms 內淡出 |
| 2300 | 漩渦倒著播「開啟」動畫收合（500ms），播完就銷毀 |
| 2800 | 結束：解鎖移動、字幕淡出、通知 React「開場播完」，React 再顯示操作教學 |

- **可跳過**：開始播放 300ms 後，按任何鍵或點畫面就直接跳到結束狀態（玩家出現在出生點、特效全部清掉、送出「播完」）。
- **減少動態效果**（`reducedMotion`）：不播動畫。玩家直接出現，字幕顯示 1.5 秒後淡出，一樣送出「播完」。

### 字幕（不新寫文案，直接用內容裡已有的句子）
取 `content.narrative.prologue.villagerLines` 的前兩句，現在的內容是：
1. 「W05 的最後一道門打開了。」
2. 「傳送門正把道路接往瑪雅遺跡的星門。」

用 React 疊在 `.map-pane` 下方置中，樣式比照現有的 `.map-tutorial`（深底、金框）。沒有字幕資料時就不顯示。

---

## 2. 素材（3 張 spritesheet）

放在 `public/assets/s3w06/fx/`，原始檔或產生腳本放 `fx/_source/`。建議延用 `scripts/build-s3w06-art.py` 的寫法：用 numpy 程式產生，確保能無縫循環。產生後**壓到 24 色以內**，並用 nearest 縮放維持像素感。

每一格先依「顯示尺寸」畫，再用 nearest **放大 2 倍**存檔。這樣程式用 `setDisplaySize` 縮回原尺寸時會剛好是整數倍，畫面乾淨。

| 檔名 | 格數（水平一列） | 每格存檔尺寸 | 顯示尺寸 | 混合 | 內容 |
|---|---|---|---|---|---|
| `opening-portal-open.png` | 8 | 256×128 | 128×64 | NORMAL | 俯視 3/4 角度的地面橢圓漩渦，從一個光點長到完整大小。中心是深紫藍色的「洞」，外圈是藍、紫、金三色旋轉光環。第 8 格要和 loop 的第 1 格完全一樣 |
| `opening-portal-loop.png` | 8 | 256×128 | 128×64 | NORMAL | 完整大小的漩渦持續旋轉（每格 45°），第 8 格要能接回第 1 格 |
| `opening-light-beam.png` | 6 | 96×320 | 48×160 | ADD | 從地面往上的柔和光柱，底部最亮、往上淡出到透明；每格亮度和寬度微微起伏；只有光，沒有邊框 |

共同要求：
- 背景完全透明；四邊 4 px 內 alpha 為 0；不能有文字。
- 漩渦的**橢圓中心**在每格的正中央。光柱的**底部中央**對齊每格底邊往上 8 px。
- 漩渦整體要夠暗、夠飽和，放在叢林土路上看得清楚。光柱則靠 ADD 混合發亮。

---

## 3. 程式接線

### 3.1 資料（只有 W06 設定）
1. `src/types/S3W05Quest.ts`：在 `S3W05QuestData.world` 和 `PhaserQuestData.world` 都加上選填欄位：
   ```ts
   opening?: {
     id: string;                 // "s3w06-arrival-portal"
     areaId: string;             // 在哪一張場景播，W06 是星門場景的 area id（ribbon-page-v2）
     /** 世界座標，同時也是玩家出生點（地面漩渦中心＝玩家腳底） */
     spawn: WorldPoint;
     portalOpenUrl: string;  portalLoopUrl: string;  beamUrl: string;
     portalFrame: { width: number; height: number; displayWidth: number; displayHeight: number };
     beamFrame: { width: number; height: number; displayWidth: number; displayHeight: number };
   };
   ```
2. `src/config/s3w06WorldData.ts`：`playerStart` 從 `{ x: 480, y: 420 }` 改成 **`{ x: 480, y: 860 }`**，也就是星門場景的 (480, 480)，平台台階正下方的土路（奇克站在 (480, 340)，兩者相距 140，不會一出生就觸發對話）。註解也要改成實際的位置。星門場景的 `entryPoint` 會跟著一起變（`s3w06QuestData.ts` 用的就是 `playerStart.y`）。
3. `src/config/s3w06QuestData.ts` 的 `createS3W06PhaserQuestData()`：在回傳的 `world` 加上 `opening`，其中 `spawn` 直接用 `S3W06_WORLD.playerStart`。`createPhaserQuestData()` 會把 `world` 原樣帶過去，所以 `s3w05QuestData.ts` 應該不用改；如果發現沒有帶到，就補上。

### 3.2 Phaser
4. `BootScene.ts`：`world.opening` 有值時，用 `load.spritesheet` 載入三張圖，key 為 `opening:portal-open`、`opening:portal-loop`、`opening:beam`。
5. `eventContract.ts`：新增事件 `quest:playOpening`（React → Phaser，payload `{ nonce: number }`）和 `quest:openingComplete`（Phaser → React）。寫法照 `quest:setFireworks` 和 `rewardRequest` 那套。
6. `MapScene.ts` 新增 `playOpening()`：
   - 沒有 `world.opening` 或材質不存在時，直接送出 `openingComplete`，當作沒事。
   - 依第 1 節的時間軸播放。漩渦 depth 放在背景之上、玩家之下（例如 3.5）；光柱在玩家之上（例如 4.5）。
   - 播放期間 `movementLocked` 固定為 true，也不能觸發附近的互動提示。
   - 監聽按鍵和點擊來跳過；結束或跳過時都要清掉所有 sprite、tween、timer，並恢復玩家的 alpha、scale、位置。
   - `shutdown()` 裡也要清乾淨，照 fireworks 的寫法。
   - 音效（選做）：照現有 fireworks 用 Web Audio 合成的方式，做一聲 0.6 秒的柔和「呼——」（濾波白噪音加上升頻率）。要遵守現有的靜音設定。
7. `PhaserGame.tsx`：新增 prop `openingRequest?: { nonce: number }` 和 `onOpeningComplete?: () => void`，接到上面兩個事件。

### 3.3 React（`S3W05Quest.tsx`）
8. `S3W05RuntimeState` 加上選填欄位 `openingSeen?: boolean`。舊存檔沒有這個欄位，視為 false。**不需要**調整 `S3W06_REVISION`。
9. 播放條件：`questData.world.opening` 有值、`!state.openingSeen`、**還沒有任何一站完成**，而且 `panelStage === "map"`。條件成立時就在載入後送一次 `openingRequest`，並用 ref 防止重送。
   - 已經玩到一半的學生（有完成的站）**不會補播**，但要在存檔裡把 `openingSeen` 設成 true。
10. 收到 `onOpeningComplete` 後，把 `openingSeen` 設成 true 並存檔。
11. 操作教學要等開場播完才出現：`showControlsTutorial` 多加一個條件 `(state.openingSeen || !questData.world.opening)`。
12. 字幕 overlay：播放期間顯示，時間照第 1 節（第 1 句在 0ms、第 2 句在 1200ms、2800ms 淡出）。字幕由 React 自己計時，或讓 Phaser 另外送進度事件也可以。
13. Preview 工具列加一個按鈕「測試開場傳送門」：把開場狀態清掉並送一次 `openingRequest`。「重設 Preview」之後也要會重播。

---

## 4. 驗收

**自動檢查**（加進 `scripts/check-s3w06-art.py`）：
- [ ] 三張圖的尺寸：open 2048×128、loop 2048×128、beam 576×320，都是 RGBA
- [ ] 每一格四邊 4 px 都是透明
- [ ] open 第 8 格和 loop 第 1 格逐像素相同
- [ ] loop 第 8 格旋轉 45° 後，和第 1 格的差異要很小（確認可以無縫循環）
- [ ] 顏色數 ≤ 24

**目視檢查**：輸出一張總覽圖。把星門背景縮到 960×640，在 (480, 480) 依序疊上漩渦 open 第 4 格、loop 第 1 格加光柱加玩家，確認漩渦剛好在土路上、光柱沒有蓋住奇克的臉。

**實機**（`npm run dev`，開 `/dev/s3w06-quest`）：
- [ ] 按「重設 Preview」後進入，會自動播開場；約 3 秒後可以移動，然後才出現操作教學
- [ ] 播放中按任意鍵會立刻跳到結束狀態，之後也能正常移動
- [ ] 重新整理頁面，不會再播一次
- [ ] 開啟系統的「減少動態效果」後，不播動畫，只顯示字幕，可以正常開始
- [ ] 已完成第 1 站的存檔進入時不會播
- [ ] **W05（`/dev/lab-terminal-quest`）完全沒有變化**，也不會播任何開場
- [ ] console 沒有新的錯誤或 404；`npx tsc --noEmit` 沒有新的錯誤

## 5. 交付清單

```
public/assets/s3w06/fx/opening-portal-open.png
public/assets/s3w06/fx/opening-portal-loop.png
public/assets/s3w06/fx/opening-light-beam.png
public/assets/s3w06/fx/_source/（產生腳本或原始檔）
src/types/S3W05Quest.ts、src/config/s3w06WorldData.ts、src/config/s3w06QuestData.ts
src/phaser/scenes/BootScene.ts、src/phaser/scenes/MapScene.ts、src/phaser/eventContract.ts、src/phaser/PhaserGame.tsx
src/components/phaser/S3W05Quest.tsx
scripts/build-s3w06-art.py、scripts/check-s3w06-art.py
```
回報時請附上：總覽圖、自動檢查輸出、一段開場播放的錄影或逐秒截圖，以及 W05 的對照截圖。
