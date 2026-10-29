# 製作流程：從零到上線

> 可信度標記見 `../SKILL.md`。本檔不重複正典 `cocos-web-game-standard.md` 的協定與目錄規定。

## 1. 環境與位置【實做】

| 項目 | 內容 |
|------|------|
| 編輯器 | Cocos Creator **3.8.8**，`C:\ProgramData\cocos\editors\Creator\3.8.8\CocosCreator.exe`（Dashboard 預設路徑，偏離正典 §3，已核准） |
| 專案 | `C:\Dev\Cocos\Projects\hc-pilot`（本機 git，**無遠端**；分支 master、feat/bgm-layers、feat/w16-cake…） |
| 主程式 | `assets/scripts/game/BakeryArcade.ts`（約 1.4–1.8 萬行，單一元件） |
| 數值單一真相 | `assets/scripts/game/ArcadeConfig.ts`（註解寫負責人的調整理由與日期） |
| 其他腳本 | `SaveCheck.ts`（存檔檢查／白名單）、`AiMissions.ts`／`QuizData.ts`（問 AI 與小考）、`PlayStats.ts`（遊玩紀錄）、`BgMusic.ts`（配樂）、`ModelLib.ts`（模型載入） |
| 平台層 | `assets/scripts/platform/LtBridge.ts`（postMessage 橋接）、`protocol.ts`（**自動產生，不要手改**） |
| 3D 模型來源 | `_source/blender/*.py`（bpy 腳本產生低模，匯出 glb） |
| 網站端 | `gpt-clone`：`public/games/cocos/hc-pilot/`（**只是建置產物**）、`src/pages/play/hc-pilot.tsx`（外層頁面）、`src/lib/hcPilotProgress.ts`、`src/lib/firestore.ts` |
| 其他 | Node v24（LTS）、Blender 3.6、Cocos Dashboard 2.2.2.1515（winget `Cocos.CocosDashboard`） |
| 對象 | P1 上（小一），一堂 35～40 分鐘（不是 gpt-clone CLAUDE.md 寫的三到六年級） |

## 2. 專案設定【實做】

- `game.manifest.json`：`gameId: "hc-pilot"`、`protocol: "lt-game/1"`、1280×720、橫向。`gameId` 必須小寫 kebab-case（建置腳本會檢查）。
- `build-config/web-mobile.json`：從編輯器「構建」面板匯出。建置腳本強制 `md5Cache=true`、`debug=false`、`sourceMaps=false`（正典 D-1），不符就中止。
- **沒開 Cocos 物理引擎模組**（`physics: inherit`）。需要物理的東西（足球）是自己寫的簡易剛體；開引擎模組會多 0.5～2 MB 下載。
- 這款用 **Empty (3D)** 模板；渲染是「一個共用 Unlit＋頂點色＋GPU Instancing 材質」，立體感是假光影（頂點色烘進亮暗），場景沒有燈光（見 `model-pipeline.md`）。

## 3. 建置與部署【實做】

**建置前一定做兩件事**
1. 型別檢查（hc-pilot 沒自己的 node_modules，借 gpt-clone 的 tsc）：
   ```bash
   C:\Users\COSH\Desktop\CodingClass\gpt-clone\node_modules\.bin\tsc -p tsconfig.json --noEmit --skipLibCheck | grep "^assets/"
   ```
   沒輸出＝沒錯（引擎宣告檔本身有一堆無關錯誤，只看 `assets/` 開頭）。**tsc 抓不到 Babel 問題**，見 `pitfalls.md`。
2. 有新增任何會顯示的中文字 → `node scripts/build-zhuyin-font.mjs`（把新字加進注音字型 `assets/art/fonts/bpmf-game.ttf`；沒跑就缺字）。

**建置**
```powershell
powershell -File C:\Dev\Cocos\Projects\hc-pilot\scripts\build-web.ps1 -GptClone C:\Users\COSH\Desktop\CodingClass\gpt-clone-bakery
```
- 參數：`-CocosCreatorExe`（預設 3.8.8 路徑）、`-GptClone`、`-ProjectPath`、`-ConfigPath`（預設 `./build-config/web-mobile.json`）。
- **不要帶 `-ExecutionPolicy Bypass`**（自動模式會擋；直接執行即可）。
- 腳本流程：前置檢查 → `CocosCreator.exe --project <path> --build configPath=...`（`Start-Process -PassThru` 取結束碼，**不用 `-Wait`**，因為建置結束偶爾留孤兒子程序會卡住）→ **結束碼 36＝成功**（32 參數錯、34 建置期錯誤，其他一律中止、不複製）→ `robocopy /MIR build\web-mobile → <GptClone>\public\games\cocos\hc-pilot\` 並複製 `game.manifest.json` → 印產物大小與 gzip 估計（對照正典 §8 預算）。
- **看到那行 `gzip` 才代表 robocopy 已完成**。
- 改了 `.ts` 或新增素材，建置前要讓編輯器重新整理資產（用 MCP 呼叫 `Editor.Message.request("asset-db","refresh-asset","db://assets/scripts")`；見 `mcp-funplay-cocos.md` §5）。
- **同一時間只能一個 session 跑建置**，且先確認編輯器是否開著（開著可能成功也可能 `EPERM` 失敗）。

**建完要驗證真的上線了**：grep `public/games/cocos/hc-pilot/assets/main/index.*.js` 看新程式碼在不在（檔名雜湊每次都變；曾有別的 session 反覆重建，拿到舊檔）。

**commit**：建置產物是壓縮 JS＋json，GitHub 上幾乎看不出差異；`git add -A public/games/cocos/hc-pilot` 會有幾百行 `LF will be replaced by CRLF` 警告（無害）。**真正看得懂的原始碼在 hc-pilot 本機 repo，不在 gpt-clone 的 PR 裡**（這是 PR 看起來「沒改東西」的原因）。部署（`vercel --prod`）也從 gpt-clone-bakery worktree 做。

## 4. 網站與遊戲怎麼接【實做；協定細節見正典 §5】

- 流程：遊戲送 `ready` → 外層頁面讀 Firestore `gameProgress/{uid}.hc-pilot` → 送 `config`（含 `save`、`now`）→ 送 `start`。遊戲進度有變送 `save` → 外層等 **1.5 秒沒有新的**才寫（debounce），關頁面時補寫。
- **遊戲不自己存**（不用 localStorage）；沒有網站包著（直接開 `index.html`）就不存不讀。
- 保護機制（`hc-pilot.tsx`）：① 進度底線 `hcSaveRegression`（解鎖格倒退、問 AI 或過關紀錄不見 → 不寫）② 第一次讀到舊版存檔先備份 `hc-pilot-bak` ③ 遊戲送 `error`（code `save-broken`）→ 這一場不存 ④ 讀不到雲端存檔 → 唯讀。
- 2026-10-15 PR #30（**是否已合併請查**）：`/api/time` 量學生電腦時鐘差、`savedAt`/`now` 校正；`saveGameProgressFieldIfUnchanged` 用 Firestore 交易比對 `savedAt`，兩個分頁／兩台電腦時後存的不覆蓋。這兩項**只做過型別檢查與邏輯模擬，沒對真 Firestore 測**【未驗證】。
- **每週過關**：`prog.weeks[週]` 記錄 → 外層頁面記課程完成 `game:p1uwNN` 並發平台金幣（一週 15 枚，同一週只發一次）。**不寫 `game:hc-pilot` 完成鎖**。
- **進課動畫**：外層頁面載入遊戲前，依存檔判斷這次是第幾週並播對應進課動畫（`?entry=P1U-W15` 強制、`?skipIntro=1` 跳過）。
- 協定型別同步：`node scripts/sync-protocol.mjs [gpt-clone 路徑]`（唯一來源在 `gpt-clone/src/types/ltGameProtocol.ts`，逐字複製，不手改）。

## 5. 開下一週（不是複製專案）【記憶＋實做】

- W13～W18 是**同一個專案**：週次靠存檔欄位（`questWeekShown`、`w3`＝買召喚台＝W15 開、`w4`＝買乳牛農場＝W16 開、`w5`／`w6`＝W17／W18、`prog.weeks`）與任務表（`quests()` 依週次回傳 `w13/w14/…` 陣列）。
- **分界設計：金額鎖**。分界道具（召喚台、乳牛農場）出現時定成「今天一定賺不到」的價格，下一堂課的「回來獎勵」補到買得起；上週沒做完的學生判定為「補進度」，分界原價、不叫舉手。
- **改任務表要同步**：`QUEST_VER`（存檔任務位置轉換）、`SaveCheck.ts` 的白名單、`WEEK_TASKS` 項數、隱藏任務期限 `ARCADE.hidden.due`。
- **加新員工要成對改**：`BakeryArcade.ts`（型別、`hireWorker`、`pads`、`applyUnlock`、`load` 的 byKind、`openPanel`、`boardZoneOf`、`allWorkers`）＋ `SaveCheck.ts`（`PAD_ORDER`／`KINDS`／`STEPS`）＋ `QuizData.ts` ＋ 重跑注音字型。
- 離線獎勵、金額鎖要等讀檔完成才算（週次、過關紀錄、`decoOwn` 都讀完）。
- 分支：W16 之後在 hc-pilot `feat/w16-cake`；gpt-clone 端放 `gpt-clone-bakery` worktree（分支 `feat/hc-pilot-bakery`）。
- 改完遊戲，**同一個 commit 一併改 wiki 該週學習單與教案**（CLAUDE.md Cascade 規則 6／第二十三節），並更新 `wiki/implementation-status.md`。

## 6. 本機測試環境 hc-test-env【實做＋記憶】

位置：`C:\Users\COSH\Desktop\CodingClass\hc-test-env`（**不在任何 repo；`saves.json` 含學生資料，絕對不要 commit／放進 `public/`**）。

| 檔案 | 作用 |
|------|------|
| `dump-saves.mjs` | 用 firebase-admin（服務帳戶在 gpt-clone `.env.local`，**不要印出來**）**唯讀**撈 `gameProgress`，排除老師帳號 ruifei（uid 14775649…） |
| `server.mjs` | 只綁 `127.0.0.1:3300`；`/__test/` 測試頁、`/__test/saves.json`；**只放行 GET/HEAD，其他一律 405**；遊戲檔優先從 `gpt-stub/public`（`build.bat` 建的）取，沒有才轉 gpt-clone dev server（3000） |
| `index.html` | 上排每位學生一顆鈕；**收到遊戲的 `save` 訊息一律丟掉**並顯示「已擋下 N 次存檔」→ 測試不會覆蓋學生存檔；登入時間用「現在」，所以離線獎勵、金額鎖、補進度都照真的登入算 |
| `build.bat` | 把 hc-pilot 目前工作區（含沒 commit）建到 `gpt-stub`，不碰 gpt-clone；**Cocos 編輯器要關著** |
| `start.bat` | 重撈存檔 → 啟動伺服器 |

進階：測試頁有「跳到 W16/W17/W18 ▸ 第 N 項」與「額外網址參數」欄；用 `?jump=W-N`（N 為 1 起算的任務編號）。

## 7. 動工前 checklist

1. 打開同系列上一週的成品，確認引擎、調色盤、chassis、章節結構 → **fork／延伸它**，不從頭寫。
2. 確認負責人要的數值方向；沒實測的數值標「假設待實測」。
3. 型別檢查 → 注音字型 → 建置（帶 `-GptClone`）→ grep 產物確認 → 用 hc-test-env 實測。
4. 收尾：改 wiki 學習單／教案、更新 `implementation-status.md`、跑 LINT。
