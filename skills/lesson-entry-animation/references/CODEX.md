# 給 Codex（或其他代理）接手用

這套 skill 原本是 Claude Code 寫的；裡面提到的「內建瀏覽器」「Explore 子代理」「SendMessage 跨 session」是 Claude 的工具。Codex 沒有的就照下面替代。**規則與製程不變。**

## 0. 環境

- 專案：`C:\Users\COSH\Desktop\CodingClass\gpt-clone`（2026-10-14 起只留這一個資料夾；`gpt-clone-entry` 等 worktree 已移除，進課動畫分支已整合進 `fix/restore-main-stash`）。主資料夾同時有別的工作（小熊麵包坊 build、其他 session），**開工前先 `git branch --show-current` 確認分支，不要隨手切分支、不要 `git reset`**。進課動畫的製作檔（這個 skill、`docs/lesson-entry/`、`scripts/lesson-entry/`、`public/lesson-entry/_audition/`、`src/pages/entry/` 的預覽頁）是本機忽略檔（`.gitignore`＋`.git/info/exclude`），**不要 commit、不要 `git add -f`**。
- `node_modules` 是整個網站共用的，**不要自己 `npm install` 新套件**（要裝先問負責人）。需要的 Python 工具用 `uv run --with pillow --with numpy …`（電腦沒裝 python/ffmpeg，ffmpeg 用 `uv run --with imageio-ffmpeg`）。
- Windows：大段文字用 heredoc 常常壞掉；改用「寫檔工具」或寫成 `.cjs` 檔再 `node` 執行。`C:\tmp\wave.py` 這類同名檔會蓋掉 Python 內建模組，腳本放在別的資料夾跑。
- dev server：`npx next dev -p 3210`。**新增 / 改名頁面（`src/pages/**`）或新增一堂課後要重啟**（`getStaticPaths` 在啟動時就固定了，不重啟會 404）。
- 登入：本機登入要 `FIREBASE_SERVICE_ACCOUNT`（`.env.local` 指向 `gpt-clone/service-account.json` 的絕對路徑）。**不要替使用者輸入密碼**，要測登入後的流程請他自己登入。

## 1. 驗證（沒有內建瀏覽器時）

- 審稿頁 `http://localhost:3210/entry/play/<堂代號>` 有製作列；console 的除錯函式：
  - `window.__scan()`：文字超出舞台；`window.__overlap()`：UI 與角色／道具互相遮擋
  - `window.__sweep(頁, 拍數, 間隔)`、`window.__sweepOverlap(頁, 拍數, 間隔)`：逐拍掃一整頁（回傳空物件＝通過）
  - `window.__go(頁, 拍)`：跳到某頁某拍並定格；`window.__musicCheck(8)`：音樂峰值；`window.__A`：音訊 API
- Codex 可用本機的 Chrome（`C:/Program Files/Google/Chrome/Application/chrome.exe`）headless 截圖，或請使用者在他的 Chrome 開網址看。**使用者要親眼看到才算通過**，每次做完附截圖或請他看。
- **聲音一定要真的點一下**「點一下開始」才會解鎖（瀏覽器規定）；用程式送的 click 解不開 AudioContext。
- 型別：`npx tsc --noEmit -p .`（每次改完都跑；0 個 error 才 commit）。

## 2. 一定要先看遊戲本體

規格文件常跟成品不一樣。做任何一堂之前：
1. 開遊戲（`public/games/*.html` 或 Cocos 的 `public/games/cocos/hc-pilot/`），讀它的繪圖程式（例：字母要塞 `drawCore／drawEnemy／drawKB`）。
2. **畫面照遊戲**：配色、形狀、字型、UI。能直接用遊戲的圖就用（LOGO、徽章）。
3. 遊戲有 **3D 模型**（Cocos `C:\Dev\Cocos\Projects\hc-pilot\assets\resources\models\**.glb`）就**預先渲染成透明 WebP 姿勢圖**（`scripts/lesson-entry/boss-render/`：`render.html`＋`pack.py`），不要在動畫裡跑 3D。
4. 遊戲機制（召喚、預警、升級）照程式碼演，不要自己發明（W15 曾經先演巨型機器人出現、才演放齒輪——順序反了，被負責人抓到）。

## 3. 新做一堂的最短路徑

1. 讀 `SKILL.md`、`references/PITFALLS.md`、`docs/lesson-entry/INDEX.md`（總表：哪些做了、哪些待辦）。
2. `node scripts/lesson-entry/new-lesson.mjs --code <堂代號> --title "<標題>" --cuts <頁數> --dry-run`，確認後去掉 `--dry-run`。
3. 寫 `docs/lesson-entry/<堂代號>/script.md`（S0 盤點＋分鏡表＋待你決定），**給使用者審，他說「通過」才做動畫**。
4. 做頁面 → 旁白字幕 → 配樂（`config/lessonEntry/musicPlan.ts`；字母要塞類用 `MUSIC_STYLE` 的 `focus`）→ 掃描。
5. **接上學習單**：在 `src/config/lessonEntry/worksheetEntry.ts` 加一行 `ws_xxx: { lesson: "<堂代號>" }`（學習單 id 見 INDEX.md）。一張學習單涵蓋多週的（字母要塞、小熊麵包坊）不用加，入口頁會依進度選週。
6. 更新 `docs/lesson-entry/INDEX.md` 那一堂的狀態（`docs/lesson-entry/` 是製作規格，已列入 .gitignore、只留本機，**不要 commit、不要 `git add -f`**；commit 只放程式與素材）；程式與素材 commit（訊息繁中＋ `feat(lesson-entry): …`，結尾加 Co-Authored-By 行）。

## 4. 回報

- 一律繁體中文（台灣用語）。分「我驗了什麼（數字、截圖）」與「沒驗什麼」。
- 要使用者決定的事：選項編號、標推薦。
- **不要 push、不要部署**，除非使用者明講。
