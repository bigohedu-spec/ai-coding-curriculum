---
name: lesson-entry-animation
description: 製作進課動畫（每堂課開始前播的網頁動畫，gpt-clone 的 /entry/play/<堂代號>）。用於新增一堂課的進課動畫，或調整進課動畫的頁面、旁白配音、字幕、配樂、互動題、主題包美術。不用於遊戲本體或後台。
---

# 進課動畫製作

一支進課動畫 = 一份腳本 + 一個頁面清單檔 + 配音／配樂資料。程式框架、主題包、工具都是共用的，每堂課只寫資料與少數特殊頁。

| 需要時讀 | 檔案 |
|---|---|
| 檔案位置、時間模型、怎麼寫頁面 | [references/ARCHITECTURE.md](references/ARCHITECTURE.md) |
| 旁白：S 系列配音、P 系列動物語 | [references/VOICE.md](references/VOICE.md) |
| 主題包美術、切圖 | [references/ART.md](references/ART.md) |
| 自檢指令與驗收項目 | [references/CHECKLIST.md](references/CHECKLIST.md) |
| 環境與工具的地雷 | [references/GOTCHAS.md](references/GOTCHAS.md) |

## 流程

每一關由負責人確認通過才進下一關。

1. **資料盤點**：找本週學習單、教案、上週學習重點、口訣。打開遊戲本體（`public/games/…`）確認角色、台詞、配色、美術檔與機制；規格與遊戲不一致時以遊戲為準，差異寫進腳本。缺的資料列為「缺口＋預設」。
   完成條件：腳本的「來源與缺口」表每一列都有來源或預設。
2. **建骨架**（在 gpt-clone 根目錄）：
   ```bash
   node scripts/lesson-entry/new-lesson.mjs --code <堂代號> --title "<標題>" --cuts <頁數> [--grade 1] [--kit <主題包>] [--interactive 2,8] [--chant 6] --dry-run
   ```
   確認後去掉 `--dry-run`。產生 `docs/lesson-entry/<代號>/script.md`、`review-log.md`、`src/components/lessonEntry/lessons/<ID>.ts`，並登記到 `lessons/index.ts` 與 `config/lessonEntry/musicPlan.ts`。完成後重啟 dev server（否則審稿頁 404）。
3. **Gate A 腳本**：填 `script.md` 分鏡表（每頁：畫面、動作、旁白、互動、音樂），最後列「待決定」並標推薦。
4. **Gate K 主題包**：確認 `public/lesson-entry/kits/<主題>/` 有本課所需角色與道具；缺的照 ART.md 補，補齊前用暫代素材並在回報標明。
5. **頁面**：寫 `lessons/<ID>.ts(x)`。一般頁用範本（P 系列 `makeTalkPage`；S 系列 `DetKit.makeScene`、`makeChoicePage`），特殊頁自己寫元件。見 ARCHITECTURE.md。
6. **旁白＋字幕**：P 系列動物語，S 系列語音生成配音。見 VOICE.md。
7. **配樂**：從 `musicPlan.ts` 的 `autoPlan` 起手，依腳本調整；音樂風格在 `MUSIC_STYLE` 登記。
8. **自檢**：CHECKLIST 的 A～E 全部通過。
9. **接學習單**：`src/config/lessonEntry/worksheetEntry.ts` 加一行（學習單 id → 堂代號）；學生點學習單會經 `/entry/go/<堂代號>?next=<教材>` 先播動畫。
10. **Gate G**：負責人在真實 Chrome 看完並操作一輪；逐項處理回報的修改，回報每項「做了／沒做」。

## 規則

### 結構與內容

- 順序：直接進主題 → 複習上週 → 故事與今天目標 → 課程重點 → 口訣 → 出發。第一句就進故事。
- **P 系列（小一、小二）**：故事 60％／重點 30％／複習 10％。複習是隱晦的：讓學生做一次上週學的動作（例如用鍵盤打名字），不出題、不點明在複習。
- **S 系列（小三以上）**：明確的「上週複習」（上週重點全部帶到＋互動題＋上週口訣）與「本週重點」（像筆記逐條寫上並打勾），約複習 20％、重點 45％。
- 防洩漏：遊戲的正確順序、答案、失敗後果不預先演出。
- 口訣照學習單原文。
- 個資：學生輸入的名字只留在記憶體，只回報相符與否、次數、舉手。

### 互動題

- **資訊完整才開放作答**：情境、題目內容、題目句與對應旁白播完前，答案鎖定，滑鼠、觸控、鍵盤都無效；鎖定期的輸入直接丟棄。每題重新鎖定，回饋播完才換題。
- **題目卡三段**：情境 → 對方說的話／眼前的具體內容 → 題目句。答對後中間換成正確結果。
- **每次播放重排**：題目順序與每題按鈕順序隨機；3 個以上選項時，相鄰兩題正確答案在不同顆、不呈 1、2、3、4 依序（`DetKit.planOrder()`，`makeChoicePage` 已內建）。
- **選錯可重選、不扣分**：選對＝上升三音＋跳字＋物件飛走；選錯＝柔和音效＋指出該往哪做，用語保持中性。
- **閒置提示**（每次按鍵都重新計時，所以亂點不會觸發）：
  - P 系列：約 9 拍（5.4 秒）沒操作 → 角色換句話再說一次＋正確目標外圍光圈。
  - S 系列：25 拍（約 15 秒）沒操作 → 只重念題目；再 15 秒 → 念提示句＋正確按鈕發光（`DetKit.HINT_AFTER`，`makeChoicePage` 已內建）。
- 每按一下都有立即的視覺（按下、光圈）與聲音（`flow/sfx.ts` 的 tap）回饋。
- 要學生練的操作，學生真的做到才換頁（每招 2 次，進度點可見）；示範動作播放中又按，記下來，播完照做。
- 兩手同時操作的畫面：未按的鍵與滑鼠為灰色，按下變黃（`KeyCap dim`、`LiveMouse`、`useTwoHands`）。
- 打字互動：只收英文字母、需按 Enter；不符時顯示「你的名字好怪喔：〔內容〕」並可重打，次數不限。

### 畫面

- 畫風照該課遊戲本體，優先直接使用遊戲美術（縮成 WebP 放進主題包）。遊戲有 3D 模型就預先渲染成 2D 姿勢圖（`scripts/boss-render/`）。
- 舞台 16:9，座標以 cqw 為單位；舞台整個縮進視窗：`width: min(100%, calc((100vh - 56px) * 16 / 9 + 24px))`。
- 所有文字與元素都在舞台內；字幕、對話框、卡片與角色、道具互不遮擋；底部字幕帶（約 45～54 cqw）不放道具與角色的腳。
- 動作用「兩格一動」＋擠壓拉伸；場景物件跟著音樂拍子晃動；背景要有淡淡、持續的環境動畫（煙、光暈、小鳥…），避開字幕區。
- 字型：P 系列 `Bpmf GenSen`（注音在字右側）；S 系列 `Noto Sans TC`，不加注音。每個元素都自己設 `fontFamily`（全站 CSS 預設等寬字）。
- 畫面上的中文字一律用網頁字型疊上，美術圖裡不含文字。

### 聲音

- **音樂是主時鐘**：從頭播到尾不中斷，畫面與旁白讀「音樂現在第幾拍」。樂器逐頁加一層；等學生操作的頁編曲不變、迴圈；口訣頁只留 bass、clap、pad。
- 說話時音樂自動壓低；峰值 < 0.9。
- **每句旁白都有字幕列**，字幕＝旁白的字，念到哪亮到哪；口訣大字跟著亮起，下方仍保留字幕列。
- 字幕與大字只顯示 ！？，其餘標點（`，、；：。～`）在顯示時移除（`Sub` 的 `TRAIL_HIDE`、大字用 `trimTrail()`）；台詞原文保留標點，供配音停頓與字幕切段。
- 旁白文字只用中文字、`，。！？：；` 與半形空白；列舉用半形空白分隔。

### 換頁

- 每頁內容播完，等 2 拍自動切換；無轉場、無需點擊。
- 最後一頁兩個按鈕：**開始遊戲**、**再看一次**（音樂從第 0 拍重新同步，整支重來，輸入清空）。

## 常用指令

```bash
npx next dev -p 3210                                   # 審稿頁 http://localhost:3210/entry/play/<堂代號>
npx tsc --noEmit -p .                                  # 型別檢查，0 error 才 commit
node scripts/lesson-entry/voice-build.mjs <堂代號>     # S 系列：生成／更新配音（只重生改過的句子）
node scripts/lesson-entry/voice-check.mjs <堂代號>     # S 系列：whisper 聽寫比對
uv run --with pillow --with numpy --with scipy python scripts/lesson-entry/slice_collage.py <png> <輸出資料夾>
```

審稿頁的製作列可跳頁、指定起始拍、定格、開關音樂；console 除錯函式見 CHECKLIST.md。

## 回報與提交

- 回報分三段：**我驗了什麼**（數字、截圖）、**沒驗什麼**、**請負責人判斷什麼**（音質、美感、真實 Chrome 的表現），附可點的審稿網址。
- 需要負責人決定時，選項編號並標推薦。
- commit 只放程式與素材（`src/`、`public/lesson-entry/`），訊息格式 `feat(lesson-entry): <繁中說明>`。`docs/lesson-entry/`、`scripts/lesson-entry/`、`.claude/skills/` 是本機製作檔，不提交到 gpt-clone。
