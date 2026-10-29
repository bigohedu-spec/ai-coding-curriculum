# 踩坑與鐵則（每條附「為什麼」）

> 來源：負責 Cocos 的 session 交接（標【實做】）與專案記憶檔（標【記憶】）。可信度標記見 `../SKILL.md`。

## A. 建置與 Babel

1. **不要用 `[...new Set(x)]`，改 `Array.from(new Set(x))`**【實做】。
   為什麼：Cocos 3.8.8 的 loose Babel 會把它轉成 `[].concat(set)`，得到「裝著 Set 的陣列」，麥克風答案比對永遠 0 分；**`tsc` 完全不報錯**。
2. **不要對「會被重新賦值的陣列」做 `for...of`**（class 欄位被 `.filter()` 重新賦值又被 `for...of` 迭代也算）【實做】。
   為什麼：會讓建置的型別推論失敗、整個建置中止；`tsc` 也抓不到。現有程式裡 `this.follows`／`this.solids`／`this.floorBgs` 仍有此模式，目前沒爆但屬潛在風險【未驗證會不會爆】。
3. **建置完別用 `Stop-Process CocosCreator` 全關**【記憶】。
   為什麼：負責人自己開著編輯器時會連他的編輯器一起關（`~/.CocosCreator/editor/window.json` 變 0 bytes 可能也是這個原因）。做法：建置前記下已存在的 PID，建置後只關新出現的、再 `taskkill /T` 建置用的 PowerShell；等 log 出現 `gzip` 行才清。
4. **編輯器開著時建置會出現 `EPERM project.log`／`ENOTEMPTY`**【實做】。
   為什麼：兩邊共用同一個專案與執行檔。`build.bat` 因此要求編輯器關著。
5. **建置一定要帶 `-GptClone`**【實做】。
   為什麼：預設會把產物灌進 gpt-clone 主資料夾，弄髒別人的分支；小熊麵包坊一律灌 `gpt-clone-bakery`。
6. **建置指令不要帶 `-ExecutionPolicy Bypass`**【記憶】。
   為什麼：自動模式會擋；直接 `& build-web.ps1 -GptClone ...` 就能跑（一般模式下帶 Bypass 也跑過）。
7. **Windows PowerShell 5.1 讀「無 BOM 的 UTF-8」腳本會亂碼**【實做】。
   為什麼：5.1 預設用系統碼頁；腳本裡的字串用英文，或存成 UTF-8 BOM。
8. **在任何 gpt-clone worktree 跑 `npm ci` 前，先確認 `node_modules` 是不是 junction**【記憶】。
   為什麼：npm 會順著 junction 把目標資料夾的 `node_modules` 清空，別的 session 會整個壞掉。
9. **LF→CRLF 警告**：Windows 上 commit 建置產物會有大量警告，不是錯誤【實做】。

## B. 引擎與場景

10. **合併網格有頂點上限 65535**【實做】：金幣山用 `compositeMesh`，一枚約 70 頂點 → 最多約 880 枚，超過會壞（已加上限）。
11. **碰撞體要跟節點連動**【實做】：消失／隱藏的場景物件如果還在 `solids`，會留下「鬼擋牆」。用 `Solid{node}`＋`solidOn()`（節點無效或 `activeInHierarchy=false` 就跳過）。為什麼：W13 隱藏的鐮刀展示台曾留下看不見的碰撞。
12. **不要開物理引擎模組**【實做】：會多 0.5～2 MB 下載；需要的物理自己寫簡易剛體。
13. **新素材進 repo 前要轉 WebP、縮到實際顯示尺寸**（見正典 §8 預算：gzip 後總大小 ≤ 5 MB、單檔 ≤ 500 KB）。

## C. 存檔與進度（最容易出大事）

14. **存檔欄位讀檔順序有依賴**【實做】：週次旗標、過關紀錄、`decoOwn` 的讀取順序會影響「現在輪到誰」；曾因順序導致 W15 沒開（`w3` 被存檔值蓋回 false）、展示品已付一半的錢消失。改存檔結構要逐欄確認「存了、讀了、讀的順序」。
15. **`SaveCheck.ts` 白名單會刪掉未知值**【實做】：曾因只接受 `qw` 為 1、2，把 W15 的 `qw:3` 讀檔時刪掉 → 任務進度歸零重打勾。新增存檔欄位值域時同步改 `SaveCheck.ts`。
16. **離線獎勵／金額鎖要等讀檔完成才算**【實做】：否則獎勵照錯的目標算。
17. **不要寫 `game:hc-pilot` 完成鎖**【實做】：寫了學生隔週進不來；每週過關記 `prog.weeks[週]`，網站記 `game:p1uwNN`。
18. **進課動畫、教案、遊戲三邊的「週次」要一致**：遊戲週標題（`questTitle`）曾與教案分叉（例如 W17 在教案寫「輸送帶」、遊戲已是「蛋糕自動化」）。改遊戲同一個 commit 要改 wiki。

## D. 檔案與協作

19. **不要信「寫入成功」**【實做】：寫完重新讀檔確認；多個 agent 並行寫同一檔時，檔案會漂移。改 `BakeryArcade.ts` 這種大檔，建議用「舊字串必須恰好出現一次才替換」的 Node 修補腳本，避免 `sed` 在 CRLF／中文／反引號上出事。
20. **學生資料不可進 `public/`**【實做】：測試頁（`_tmp-*.html`）曾把學生存檔直接嵌在 `public/` 下。`.git/info/exclude` 對 `vercel --prod`（從本機上傳）**無效**，要寫進 `.vercelignore`（已加，PR #30）。
21. **Blender 腳本（帽子等）要用 3.6 跑**【記憶】：`_source/blender/bear_outfits.py` 在 Blender 4.5 的 glTF 匯出參數不相容；重匯會讓其他帽子 glb 位元組改變，沒改到的要 `git checkout` 還原。
22. **規格書落後程式**：`P1U-Arc3-小熊麵包坊-開發規格.md` 在 W15 之後多處過時，一律以程式（`ArcadeConfig.ts`、任務表）為準。

## E. 安全（要負責人決定的）

23. `firestore.rules` 的 `gameProgress` 目前 `allow read, create, update: if true`，任何人拿到公開 API key 都能讀改；`chore/harden-firestore-rules` 分支存在，何時上沒定【未驗證現況】。
24. hc-pilot 原始碼只在這台電腦、沒有 GitHub 遠端。
