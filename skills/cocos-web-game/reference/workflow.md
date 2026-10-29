# 製作流程：從零到上線

> 可信度標記見 `../SKILL.md`。本檔不重複正典 `cocos-web-game-standard.md` 的協定與目錄規定。

## 1. 專案由哪些部分組成（以 hc-pilot 為例，只說角色，不含原始碼）【實做】

| 部分 | 角色 |
|------|------|
| 編輯器 | Cocos Creator 3.8.8（版本見 `environment-setup.md`） |
| Cocos 專案 | 獨立 git repo，本機；一款遊戲一個專案 |
| 主程式 | 一個單一元件掛在場景根節點，所有物件在這裡生成（行數很大，修改要用「舊字串必須恰好出現一次」的修補方式，見 `pitfalls.md` #19） |
| 數值檔 | **所有手感與經濟數值集中在一個設定檔**，註解寫負責人的調整理由與日期；沒實測的標【假設】 |
| 存檔檢查 | 讀檔時驗證欄位與值域（白名單）；新增欄位或擴大值域要同步改（#15） |
| 問 AI／小考 | 題目與預寫回答的資料檔 |
| 遊玩紀錄 | 有效遊玩時間（掛機、切走分頁不算）、每天一筆、里程碑花的時間、卡關次數；網址加 `?dev=1` 玩的整份標記排除 |
| 配樂 | 配樂模組（與進課動畫共用同一套音樂搬運版時，改曲要通知對方） |
| 模型載入 | 載入 glb 並在失敗時退回程式拼法 |
| 平台層 | `LtBridge`（postMessage 橋接）與 `protocol`（**自動產生，不要手改**） |
| 3D 模型來源 | 放在專案 `_source/` 的 Blender 腳本，用 bpy 產生低模再匯出 glb |
| 網站端 | gpt-clone 的 `public/games/cocos/<game-id>/`（**只是建置產物**）與外層頁面（見 `website-integration.md`） |
| 對象與節奏 | 依課程而定（hc-pilot：小一，一堂 35～40 分鐘；**不是** gpt-clone CLAUDE.md 寫的三到六年級） |

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

做法（hc-pilot 的設計，可套用在「同一款遊戲玩多週」）：
- **同一個專案連做多週**，週次靠**存檔欄位**（目前週、各週過關紀錄、分界道具是否已買）與**任務表**（依週次回傳不同陣列）。
- **用「金額鎖」切週次**：分界道具（例：召喚台、乳牛農場）出現時，價格定成「今天一定賺不到」的數字，下一堂課的「回來獎勵」補到買得起；上週沒做完的學生判定為「補進度」，分界按原價、不叫舉手。
- **改任務表要同步**：存檔任務位置的版本轉換、存檔檢查的白名單、各週項數、隱藏任務期限。
- **加新角色／員工要成對改**：遊戲主程式（型別、雇用、解鎖格、讀檔、面板、順序板、全體清單）＋存檔檢查（排序、種類、步驟）＋小考資料＋重跑注音字型。漏一處就會有「讀檔後某員工消失」或「白名單刪掉新值」。
- 離線獎勵、金額鎖要等讀檔完成才算。
- 改完遊戲，**同一個 commit 一併改 wiki 該週學習單與教案**（CLAUDE.md Cascade 規則 6／第二十三節），並更新 `wiki/implementation-status.md`。

## 6. 本機測試環境（做法）【實做＋記憶】

目的：**用真實學生的存檔測遊戲，但絕不寫回、也不碰正式站**。這套東西放在 repo 之外（含學生資料）。需要有的零件：

| 零件 | 作用／要求 |
|------|-----------|
| 存檔撈取腳本 | 用 firebase-admin 以**唯讀**撈 `gameProgress`，排除老師帳號（ruifei，uid 14775649…）；服務帳戶在 gpt-clone `.env.local`，**不要印出來** |
| 本機伺服器 | 只綁 `127.0.0.1`；`/__test/` 測試頁與存檔 json；**只放行 GET／HEAD，其他一律 405**；遊戲檔優先從獨立的 stub 資料夾取（自己建置的產物），沒有才轉給 gpt-clone dev server |
| 測試頁 | 每位學生一顆按鈕載入其存檔；**收到遊戲的 `save` 訊息一律丟掉**並顯示「已擋下 N 次存檔」→ 測試絕不覆蓋學生存檔；登入時間用「現在」，所以離線獎勵、金額鎖、補進度都照真的登入算 |
| 建置到 stub 的腳本 | 把遊戲目前工作區（含沒 commit）建到 stub，不碰 gpt-clone；**編輯器要關著** |
| 啟動腳本 | 重撈存檔 → 啟動伺服器 |

進階：測試頁提供「跳到第 N 週第 M 項」與額外網址參數；遊戲端要有對應的跳關入口（hc-pilot 內建跳關面板，僅 `?dev=1` 開啟）。**存檔檔含學生資料，絕對不要 commit、也不要放進 `public/`。**

## 7. 動工前 checklist

1. 打開同系列上一週的成品，確認引擎、調色盤、chassis、章節結構 → **fork／延伸它**，不從頭寫。
2. 確認負責人要的數值方向；沒實測的數值標「假設待實測」。
3. 型別檢查 → 注音字型 → 建置（帶 `-GptClone`）→ grep 產物確認 → 用本機測試環境實測。
4. 收尾：改 wiki 學習單／教案、更新 `implementation-status.md`、跑 LINT。
