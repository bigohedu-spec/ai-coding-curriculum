# S3W06 美術補完規格書（交付 Codex）

> 2026-09-24．對象：Codex（能用 shell、Python、圖片生成 API 的 coding agent）
> 專案：Next.js（pages router）＋ Phaser。S3W06 走 `S3W06PhaserQuest.tsx → S3W05Quest.tsx`
> （內容覆寫在 `src/config/s3w06W05Content.ts`）。**W05 與 W06 共用同一套引擎。**
> 只有 NPC 素材（P0）完全不用改程式；P1、P2 各有「程式接線」小節（3.4、4.4），P3 只改程式（第 5 節）。

---

## 0. 現況盤點（已經對照過實際檔案）

| 項目 | 現況 | 本次要做 |
|---|---|---|
| 四站背景 `public/assets/s3w06/worlds-v2/{ribbon,forest,square,finale}-{damaged,repaired}.png` | ✅ 已完成（1536×1024，品質好） | **不要動** |
| 成果頁星空背景 `public/assets/s3w06/s3w06-space-bg.webp` | ✅ 已完成 | 不要動 |
| **四站 NPC 說話動畫** | ❌ 缺。引擎會去讀 `/assets/lab-terminal-quest/npcs/{stationId}/talk/frame_00N.png`，W06 四站沒有檔案，畫面上顯示的是程式畫的灰色方塊人偶 | **P0：畫 4 個 NPC × 4 格** |
| **互動點「記憶門」／「最終回覆台」** | ❌ 四站都是程式畫的通用方塊圖示 | **P1：畫 4 個互動物 × 2 種狀態＋接線** |
| **終章傳送門動畫** | ❌ finale-repaired 只有靜態漩渦 | **P2：做透明循環特效序列圖＋接線** |
| 家長 A4 列印報告抬頭插圖 `CarriageArt` | ⚠️ 是舊主題的 SVG「故事花車」，和 W06 內容不符 | P3（選做）：換成現有 finale 背景裁切，不用新圖 |
| 快照 `heroImage.assetRef` | ⚠️ 指向不存在的 `/images/s3w06/valley-finale-placeholder.png`（目前沒有被顯示） | P3：改指向現有 finale 圖 |

**做事順序：P0 → P1 → P2 → P3。** 每做完一項就照第 6 節驗收，再做下一項。

---

## 1. 共同原則（所有素材都要遵守）

1. **畫風要和現有素材一樣**：Stardew Valley 式高視角像素風，飽和、溫暖，有深色描邊。每次生成都要附風格參考圖：
   - 角色：`public/assets/lab-terminal-quest/player/idle/south/frame_000.png`（玩家，52×52）
   - NPC 範例：`public/assets/lab-terminal-quest/npcs/{bridge,windmill,signpost,relic}/talk/frame_000.png`
   - NPC 原始大圖範例：`public/assets/lab-terminal-quest/npcs/_generated-sheets/*.png`
   - 場景：`public/assets/s3w06/worlds-v2/*-repaired.png`
2. **對象是國小四年級學生**：可愛、友善，不恐怖、不陰森。不能有武器，不能有血。
3. **素材裡不能有任何可讀文字**：不要字母、數字、Logo 或浮水印。
4. **背景透明**：角色、互動物和特效都用 RGBA PNG，背景完全透明（alpha = 0），不能有底色或殘留的棋盤格。
5. **小像素圖一律用 nearest-neighbor 縮放**，不要用 bilinear。縮小後的顏色要壓到 32 色以內，邊緣才不會糊。
6. **不要覆蓋 W05 的任何檔案**，也不要動 `worlds-v2/` 的背景圖。
7. 原始大圖存進 `_generated-sheets/` 或 `_source/` 資料夾，方便日後重修。

---

## 2. P0：四站 NPC 說話動畫（不用改程式，檔案放好就生效）

### 2.1 硬性規格（和 W05 的 NPC 完全一樣，引擎寫死了）

- 路徑：`public/assets/lab-terminal-quest/npcs/{stationId}/talk/frame_000.png` ～ `frame_003.png`
  - stationId 只有這四個：`ribbon`、`forest`、`square`、`finale`
- 畫布：**52×52 px RGBA**，背景透明
- 方向：只有正面朝南，和玩家的鏡頭角度一樣
- 對齊：四格的**腳底都在 y = 48～49**（透明畫布的可見最底列是 y=48），水平中心在 x ≈ 25～26。四格的身體位置、輪廓、顏色要**完全相同，只有嘴巴（或鳥喙）不一樣**
- 四格內容：`000` 閉嘴（也是待機圖）→ `001` 微張 → `002` 張開 → `003` 快閉上。以 5 fps 循環播放
- 大小：人形角色可見高度約 44～47 px、寬約 24～30 px；生物型角色寬度可以到 40 px。要和玩家（寬 25、高 44）站在一起不突兀

### 2.2 建議做法（W05 當初就是這樣做的，照做最穩）

1. 用圖片 API 生成一張 **1024×1024（或 1254×1254）的 2×2 說話表情圖**，背景透明，附上 1.1 的風格參考圖。存到 `npcs/_generated-sheets/{assetId}.png`。
2. **推薦**：只拿左上那格當 frame_000，另外三格用腳本**只改嘴巴區域的像素**來做（複製 frame_000，在嘴巴的矩形範圍貼上張嘴或微張的像素）。AI 生成的四格常常身體會跑位或變色，用腳本做才能保證只有嘴巴在動。
3. 縮圖：四格用**同一個**裁切框（取四格可見範圍的聯集）和同一個縮放比例，用 nearest 縮到目標高度，再貼到 52×52 畫布，底部對齊 y=48、水平置中。
4. 壓到 32 色以內。輪廓不清楚的話，補 1 px 深色描邊（#1b1410 左右），和玩家的描邊一致。
5. 更新 `npcs/manifest.json`：在 `characters` 陣列**新增**四筆（格式照現有的四筆），不要刪掉原本 W05 的四筆。

### 2.3 四個角色設定（內容對齊 W02～W05 的真實教材）

所有 prompt 都先接這段共用前綴（和 manifest 的 sharedPrompt 一致）：

```
Four-frame 2x2 pixel-art talking sprite sheet. Match the supplied player sprite's south/front
camera, chibi proportions, pixel density, dark outline and earthy palette. Keep the full body
and feet fixed; change only the mouth or beak. Transparent background. No props floating
separately, no text, no scenery, no grid lines, no eight-direction variants.
```

**① ribbon — 奇克（星門遺跡．W02）** assetId：`ribbon-stone-hummingbird`
- 依據：W02 教材裡「醒來陪你解開封印」的**石雕蜂鳥奇克**。星門背景左下已經有一座大型石雕蜂鳥雕像，NPC 是「活過來的小奇克」，外型要和那座雕像一致。
- 設計：小型石雕蜂鳥，灰綠色的石頭質感，有青苔點綴。胸口和翅膀刻著會發光的天空藍紋路（**#4FC3F7**），眼睛是亮藍色。站在一小塊刻有新月紋的石座上（這樣腳底對齊才穩）。
- 動畫：只有鳥喙張合。翅膀固定，不要拍動。
```
A tiny friendly carved-stone hummingbird that has come to life, perched upright on a small
round stone pedestal engraved with a crescent moon. Grey-green weathered stone body with small
moss patches, long thin beak, glowing sky-blue (#4FC3F7) carved glyph lines on its chest and
folded wings, bright blue eyes. Cute, gentle, curious expression.
```

**② forest — 記憶回聲（午夜車站．W03）** assetId：`forest-memory-echo`
- 依據：W03 的月光號、第 4 月台、銀藍色月亮車票、藍燈、列車長。「記憶回聲」是車站裡由回憶化成的半透明小精靈。
- 設計：半透明的銀藍色小精靈，下半身像一縷霧，但畫面上要有明確的底部可以對齊。戴一頂小小的深藍列車長帽，帽徽是月亮圖案。一手提著亮藍色的燈籠，另一手拿一張銀藍色的月亮車票。表情溫和，不像鬼。
- 半透明要用**較淺、較亮的藍白色**來表現，不要真的用 alpha 做半透明（縮圖後會變髒）。
```
A small gentle memory-echo spirit at a moonlit train station: soft silvery-blue glowing body
whose lower half fades into a curl of mist (with a clear flat bottom to stand on), wearing a
tiny dark-navy train conductor cap with a crescent-moon badge, holding a small blue glowing
lantern in one hand and a silver-blue crescent-moon train ticket in the other. Friendly calm
smile, not ghostly or scary.
```

**③ square — 策展人（顛倒博物館．W04）** assetId：`square-curator`
- 依據：W04 顛倒博物館（入口廳的字塊、畫廊的藍色月亮與三顆星、語音館、明亮出口）。
- 設計：親切的中年策展人。深藍色長外套配金色鈕扣（呼應背景的深藍金邊旗幟），圓框眼鏡，胸前別著一個小小的金色新月胸針。一手拿著一支小放大鏡。頭髮帶一點「顛倒」的趣味，例如一撮往上翹的頭髮。
```
A kind middle-aged museum curator, chibi proportions: long deep-navy coat with gold buttons,
round glasses, a small gold crescent-moon brooch, holding a small magnifying glass at chest
height, one playful tuft of hair curling upward. Warm friendly expression.
```

**④ finale — 溪谷鎮守門人（溪谷鎮．總結）** assetId：`finale-valley-gatekeeper`
- 依據：W05 的溪谷鎮修復節。終章場景有一道打開的石拱門傳送門，門兩側掛著深藍底、金色太陽的旗幟。
- 設計：年長、慈祥的守門人。深藍連帽斗篷有金色太陽紋滾邊（和終章旗幟同一套配色）。手持一根木杖，杖頭是一顆小漩渦水晶，顏色取自傳送門的藍、紫、金。腰間掛著一把大鑰匙。
- **不要**畫成 W05 的「羅盤守門靈」：不要石頭身體，也不要羅盤。兩個是不同角色。
```
A kindly elderly town gatekeeper: deep-navy hooded cloak trimmed with a gold sun pattern,
white beard, holding a wooden staff topped with a small swirling crystal in blue, purple and
gold (like a magic portal), a large brass key hanging at the belt. Welcoming, festive, calm.
```

---

## 3. P1：互動點圖示（記憶門 × 3、最終回覆台 × 1）

### 3.1 為什麼要做
目前四站的互動點（學生答完 6 題後要走過去寫問答題的地方）都是程式畫的通用方塊圖示。位置在每張場景的**水平中間、偏下方**（場景顯示座標約 (480, 590)，也就是 1536×1024 原圖的 (768, 944) 附近），通常落在草叢或小路上。

### 3.2 規格
- 路徑：`public/assets/s3w06/interactables/{stationId}-idle.png`、`{stationId}-lit.png`（共 8 張）
- 畫布：**64×64 px RGBA**，背景透明。物件底部貼齊 y=61，水平置中。物件本體高度約 48～56 px
- 視角：和場景一樣的高視角 3/4 俯視，底部畫一個小小的地面陰影橢圓
- 兩種狀態，構圖**完全相同**：
  - `idle`：未解鎖。石頭和金屬是正常顏色，發光部位全部熄滅
  - `lit`：可互動或已完成。發光部位亮起，外圍有柔和光暈（光暈要留在 64×64 畫布內，不能被切掉）
- 引擎本身會對狀態做處理：鎖住時透明度 0.5、可互動時輕微縮放脈動、已完成時透明度 0.76，所以**不需要**額外畫其他狀態

### 3.3 四個互動物

| stationId | 名稱（程式標籤） | 造型 | lit 發光 |
|---|---|---|---|
| ribbon | 記憶門 | 及膝高的迷你馬雅石碑門，門框刻著新月與星星紋 | 刻紋亮起天空藍 #4FC3F7 |
| forest | 記憶門 | 迷你鐵製月台驗票閘門，頂上掛一盞小燈籠，閘門中央嵌一枚月亮車票圖案 | 燈籠亮暖黃色，車票亮銀藍色 |
| square | 記憶門 | 金色小畫框立在石座上，畫面是藍色新月加三顆白星（不能有文字） | 畫框亮金色，畫中的月亮與星星變得鮮明發亮 |
| finale | 最終回覆台 | 小石講台，上面攤著一本空白的書，旁邊插一支羽毛筆，講台掛一小段慶典彩旗 | 書頁發出暖金色光，周圍飄著藍紫色小光點（呼應傳送門配色） |

prompt 共用前綴：
```
Single small pixel-art game prop, high-angle three-quarter top-down view matching Stardew
Valley style, dark outline, small soft ground shadow ellipse at the bottom, centered,
transparent background, no text, no characters.
```
建議先生成 `lit` 版，再用腳本把發光區域熄滅來做 `idle` 版，這樣兩張的構圖一定一致。

### 3.4 程式接線（只在有提供素材時才生效，W05 行為不能變）
1. `src/types/S3W05Quest.ts`：`FreeformPromptFill.interactable` 加上**選填**欄位 `art?: { idleUrl: string; litUrl: string }`。`PhaserQuestData` 裡 station 的 `prompt` 也加上同樣的選填欄位 `art?`。
2. `src/config/s3w05QuestData.ts` 的 `createPhaserQuestData()`：產生 `prompt` 時把 `station.promptFill.interactable.art` 原樣帶過去。W05 沒有設定這個欄位，所以結果不會變。
3. `src/config/s3w06W05Content.ts` 的 `fill()`：在 `interactable` 加上 `art: { idleUrl: "/assets/s3w06/interactables/${id}-idle.png", litUrl: "/assets/s3w06/interactables/${id}-lit.png" }`。
4. `src/phaser/scenes/BootScene.ts`：只有 `station.prompt?.art` 有值時才 `load.image`。key 用 `prompt-art:{stationId}:idle` 和 `prompt-art:{stationId}:lit`。
5. `src/phaser/scenes/MapScene.ts`：
   - `createMarkers()`：建立 prompt marker 時，如果兩張材質都存在，就用 art 材質，並在 marker 記錄上存這兩個 key。
   - `renderMarker()`：有 art 的 prompt marker，`locked` 時用 idle，其他狀態用 lit；原本的 alpha、脈動、縮放邏輯照舊。沒有 art 時完全走原本的 `TEXTURE_KEYS.object[state]`。

---

## 4. P2：終章傳送門循環特效

### 4.1 為什麼要做
`finale-repaired.png` 的石拱門裡已經畫了靜態的藍、紫、金漩渦。這次要在它上面疊一層**會轉的透明光效**，讓傳送門「活起來」。

### 4.2 規格
- 路徑：`public/assets/s3w06/fx/portal-swirl.png`（水平排列的 spritesheet），原始檔另存 `public/assets/s3w06/fx/_source/`
- 幀數：**12 格，水平一列**，每格 **192×288 px**（顯示時縮成 96×144），RGBA 透明背景
- 內容：同心的光環，由內往外柔和旋轉，配色是藍 #5b8cff、紫 #b36bff、金 #ffcf5a，外加少量往外飄散的小光點。畫面**只有光**，不能畫到石拱門或場景，邊緣要淡出到完全透明
- **無縫循環**：第 12 格要能接回第 1 格，不能看得出跳格。播放速率 10 fps
- 程式會用加亮（ADD）混合疊在背景上，所以暗的部分等於看不到，亮的部分會讓原本的漩渦發光
- 建議做法：這類抽象光效用**程式產生**（Python ＋ numpy 畫極座標旋轉光環，每格旋轉 30°），會比 AI 生成更好做成無縫循環。不必堅持像素風，但輸出後要用 nearest 縮放，和場景的像素感一致

### 4.3 位置（要自己量）
傳送門開口在 `finale-repaired.png` 原圖的大約 x 905～1035、y 50～250，中心約 (970, 150)。換算成遊戲顯示座標（除以 1.6）大約是中心 (606, 94)，開口約 81×125。
**請自己開原圖量一次開口中心，並用截圖確認特效對準。** 上面的數字只是估計。

### 4.4 程式接線（只有 W06 finale 有設定，W05 不受影響）
1. `src/types/S3W05Quest.ts` 的 `AuthoredWorldArea` 加上選填欄位：
   ```ts
   ambientFx?: Array<{
     id: string;
     spritesheetUrl: string;
     frameWidth: number; frameHeight: number; frameCount: number; frameRate: number;
     /** 以該 area.position 為原點的顯示座標（960×640 空間），為特效中心點 */
     x: number; y: number;
     displayWidth: number; displayHeight: number;
     blend: "add" | "normal";
     /** 只在這張 area 顯示 repaired 背景時出現 */
     showWhen: "repaired";
   }>;
   ```
2. `src/config/s3w06QuestData.ts`：只在 `finale` 那個 area 設定 `ambientFx`，id 用 `finale-portal-swirl`。
3. `BootScene.ts`：有 `ambientFx` 才用 `load.spritesheet` 載入。
4. `MapScene.ts`：
   - 在 area 背景之上、所有 marker 之下（depth 夾在兩者中間）建立 sprite 並循環播放。
   - 只在這張 area 目前顯示 repaired 背景時 `setVisible(true)`。damaged 背景換成 repaired 的那一刻要跟著淡入，可以沿用現有的換背景流程。
   - `reducedMotion` 為 true 時**不要顯示**特效，背景本身已經有靜態漩渦。
   - 場景 shutdown 時要清掉動畫和 tween，照 fireworks 的寫法做。

---

## 5. P3（選做，只改程式，不用畫新圖）

1. `src/components/s3w06/S3W06ResultView.tsx`：列印報告 evidence-sheet 抬頭的 `<CarriageArt />` 是舊的「故事花車／五枚徽章」SVG。把它換成 `<img src="/assets/s3w06/worlds-v2/finale-repaired.png">`，用 `object-fit: cover` 裁出上半部的傳送門和廣場。原本的 `.carriage-art` 尺寸樣式照用（兩處 CSS：一般版和列印版）。`aria-label` 或 alt 改成「溪谷鎮傳送門，四段記憶全部找回」。
2. `src/components/phaser/S3W05Quest.tsx` 的 `saveFinaleSnapshot()` 和 `src/pages/dev/s3w06-result.tsx`：`heroImage.assetRef` 改成 `/assets/s3w06/worlds-v2/finale-repaired.png`。

---

## 6. 驗收（每一項都要附證據）

**自動檢查**：寫一個腳本 `scripts/check-s3w06-art.py`（可以放在 repo 外），逐條輸出 PASS/FAIL：
- [ ] NPC：4 個 stationId × 4 格都存在；每格都是 52×52 RGBA；四角像素 alpha = 0；可見底列 y ∈ {48, 49}；同一角色四格的可見範圍左右邊界差距 ≤ 1 px；四格之間**不同的像素只出現在嘴巴那一小塊**（不同像素的外框面積 ≤ 12×10）
- [ ] 互動物：8 張都存在；都是 64×64 RGBA；底部 y ∈ {60, 61, 62}；同一站 idle 和 lit 的可見範圍一致
- [ ] 特效：spritesheet 寬 = 192×12、高 = 288；四邊 8 px 內全部透明
- [ ] 所有新 PNG 裡都沒有文字（人工看圖確認）

**目視檢查**：輸出一張總覽圖 `s3w06-art-contact-sheet.png`，內容包括：
- 四張 repaired 背景縮成 960×640，在座標 (480, 340) 貼上該站 NPC 的 frame_000，在 (480, 590) 貼上該站互動物的 lit 版（互動物以底部為基準貼）
- 旁邊放大 4 倍排出每個 NPC 的四格和每個互動物的 idle / lit
- 一張 finale 背景疊上特效第 1 格（ADD 混合）的預覽

**實機檢查**（`npm run dev`，開 `/dev/s3w06-quest`）：
- [ ] 四站 NPC 都顯示新角色；靠近按 E 對話、台詞打字時嘴巴會動；腳底沒有浮空或陷進地面
- [ ] 互動點在答完 6 題前是 idle（半透明），答完後是 lit 並輕微脈動
- [ ] 終章答完後，傳送門光效在轉，而且對準拱門；在系統設定開啟「減少動態效果」時不會出現
- [ ] **W05（`/dev/lab-terminal-quest`）完全沒有變化**：NPC、互動點、背景都和原本一樣，console 沒有新的 404 或錯誤
- [ ] `npx tsc --noEmit` 沒有新的錯誤

---

## 7. 交付清單

```
public/assets/lab-terminal-quest/npcs/ribbon/talk/frame_000~003.png
public/assets/lab-terminal-quest/npcs/forest/talk/frame_000~003.png
public/assets/lab-terminal-quest/npcs/square/talk/frame_000~003.png
public/assets/lab-terminal-quest/npcs/finale/talk/frame_000~003.png
public/assets/lab-terminal-quest/npcs/_generated-sheets/{ribbon-stone-hummingbird,forest-memory-echo,square-curator,finale-valley-gatekeeper}.png
public/assets/lab-terminal-quest/npcs/manifest.json          （新增 4 筆，保留原本 4 筆）
public/assets/s3w06/interactables/{ribbon,forest,square,finale}-{idle,lit}.png
public/assets/s3w06/fx/portal-swirl.png  ＋ fx/_source/
（P1/P2/P3 的程式修改：types、s3w05QuestData.ts、s3w06W05Content.ts、s3w06QuestData.ts、BootScene.ts、MapScene.ts、S3W06ResultView.tsx、S3W05Quest.tsx、dev/s3w06-result.tsx）
s3w06-art-contact-sheet.png（驗收用，不用 commit）
```

最後回報時請附上：總覽圖、自動檢查輸出、四站實機截圖、W05 對照截圖，並列出改過的程式檔。
