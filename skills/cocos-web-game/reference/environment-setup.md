# 從零架設：Cocos 開發環境該有什麼

> 對象：**第一次接手 Cocos 遊戲的協作者**（不一定是現在的負責人）。照這份能把「能開編輯器、能建置、能掛進網站測試」的環境架起來。
> 規定在正典 `specs/cocos-web-games/standards/cocos-web-game-standard.md` §2、§3、§9；本檔是**實際做法與核對清單**。可信度標記見 `../SKILL.md`。
> 本檔步驟中，凡標【GUI】者必須由人在圖形介面點選；AI 無法代點（電腦操作工具找不到名為「Cocos Creator」的應用，只看得到 Cocos Dashboard），**停下來條列要點哪裡，等對方回「好了」再繼續**。

## 0. 先搞清楚：你要做的是哪一種工作

| 工作 | 需要哪些環境 |
|------|-------------|
| 只改網站端（外層頁面、學習單、進課動畫） | 第 3 節（網站 repo），不需要 Cocos |
| 改遊戲玩法／數值／文字（TypeScript） | 第 1、2、3、4 節 |
| 改場景、做 prefab、做 3D 模型 | 再加第 5、6 節（MCP、Blender） |
| 開新一款遊戲 | 全部，再加 `new-game.md` |

## 1. 要先取得的東西（人與權限）【重要】

| 項目 | 現況 | 備註 |
|------|------|------|
| 遊戲專案原始碼 | **本 skill 不收錄任何遊戲原始碼**；既有專案的資料夾由專案負責人提供 | 專案是獨立的本機 git repo，位置依第 3 節 |
| 網站 repo | GitHub `hsinyuyen/gpt-clone`（PR 進 `main`） | 需要被加為協作者 |
| 網站環境變數 | 本機 `.env.local`（OpenAI、Gemini、Firebase 等），Vercel 三個環境各一份 | 向負責人取得；**不要把任何金鑰寫進文件或 commit** |
| Firebase 服務帳戶 | gpt-clone 根目錄的服務帳戶 JSON（指到 `FIREBASE_SERVICE_ACCOUNT`），只有撈存檔、跑 `check-lesson-package` 這類本機腳本才需要 | **唯讀使用**；本機腳本寫入就是寫正式站 |
| Vercel 權限 | 專案在 Vercel 團隊下；PR 的 Vercel 檢查曾因協作者帳號沒權限而失敗（不是程式錯） | 部署由負責人或有權限者執行 |
| 課程規格 | 本 repo `specs/cocos-web-games/`（正典、環境紀錄、`p1u-arc3/` 開發規格） | 開發規格 W15 之後落後於程式，以程式為準 |

## 2. 軟體與版本【實做＋文件】

| 軟體 | 版本／位置 | 備註 |
|------|-----------|------|
| Windows | 10/11 | PowerShell 5.1 為預設；腳本字串用英文或存成 UTF-8 BOM |
| Cocos Dashboard | 2.2.2.1515，`winget install Cocos.CocosDashboard`，裝在 `C:\Program Files (x86)\CocosDashboard\` | 【GUI】用來裝編輯器 |
| **Cocos Creator** | **3.8.8**，`C:\ProgramData\cocos\editors\Creator\3.8.8\CocosCreator.exe` | 開案後**不得中途升版**。Dashboard 設定的安裝路徑沒生效，裝到了預設的 `C:\ProgramData\cocos\editors\`，負責人已核准保留（不在桌面／同步資料夾、路徑無空白與中文）；`C:\Dev\Cocos\Editors\` 因此是空的 |
| Node.js | v24.19.0（LTS），npm 11.17.0 | 只用於建置腳本與工具；**遊戲本身不得引入 npm 相依套件** |
| Git | 任何近期版本 | hc-pilot 與 gpt-clone 各自獨立的 repo |
| Blender | **3.6**，`C:\Program Files\Blender Foundation\Blender 3.6\blender.exe` | 只在要重做 3D 模型時需要；帽子腳本 4.5 不相容 |
| Chrome | 近期版本，**要開「使用圖形加速功能」** | 關掉會退成 CPU 模擬，只剩約 20 fps |
| funplay-cocos-mcp | 0.6.4，全域安裝在 `%USERPROFILE%\.CocosCreator\builtin-extensions\3.8.8\funplay-cocos-mcp` | 見 `mcp-funplay-cocos.md` |
| tsc | 借用 `gpt-clone\node_modules\.bin\tsc`（hc-pilot 沒自己的 node_modules） | 先在 gpt-clone 跑過 `npm ci`（**先確認 node_modules 不是 junction**，見 `pitfalls.md` #8） |

## 3. 資料夾佈局【規定，正典 §3】

```
C:\Dev\Cocos\                       ← <COCOS_ROOT>：不得放桌面或雲端同步資料夾（library/、temp/ 會產生大量快取）
├─ Editors\                         ← （Dashboard 預設沒用到，見上）
├─ _installers\                     ← 下載的安裝檔（例：funplay-cocos-mcp-v0.6.4）
└─ Projects\
   └─ <game-id>\                    ← 一款遊戲一個 Cocos 專案、一個獨立 git repo（例 hc-pilot）

C:\Users\<你>\Desktop\CodingClass\
├─ gpt-clone\                       ← 網站 repo 主資料夾（常被別的 session 占用，別在這裡建置）
├─ gpt-clone-bakery\                ← 小熊麵包坊專用 worktree（分支 feat/hc-pilot-bakery）
├─ <本機測試環境>                  ← 學生存檔測試環境（不在任何 repo；含學生資料，絕不 commit）
└─ ai-coding-curriculum\            ← 課程 wiki／規格 repo
```

- `<COCOS_ROOT>` 的實際路徑記錄在 `specs/cocos-web-games/README.md` 的環境紀錄表；腳本以參數為準，不要寫死。
- `<game-id>` 小寫 kebab-case、全平台唯一、發布後不得改名（存檔與統計以它為鍵）。
- Cocos 專案**不得**放進 gpt-clone；gpt-clone 只收建置產物 `public/games/cocos/<game-id>/`。
- `.gitignore` 至少忽略 `library/`、`temp/`、`local/`、`build/`、`node_modules/`；**不得**忽略 `settings/` 與任何 `.meta`。

## 4. 架設步驟（接手既有專案）

1. 拿到專案資料夾後放到 `C:DevCocosProjects<game-id>`，`git status` 確認是乾淨的 repo。
2. 【GUI】安裝 Cocos Dashboard → 裝 Creator **3.8.8** → 從 Dashboard 開啟該專案（第一次開會產生 `library/`、`temp/`，需要幾分鐘）。
3. 確認編輯器能開專案的主場景，預覽能玩。
4. 網站端：`git clone` gpt-clone，建立 `.env.local`（向負責人取），`npm ci`，`npm run dev`（port 3000）。小熊麵包坊的工作請建 worktree：`git worktree add ..\gpt-clone-bakery feat/hc-pilot-bakery`（若已存在就直接用）。
5. 試跑建置（編輯器**關著**）：
   ```powershell
   powershell -File C:\Dev\Cocos\Projects\hc-pilot\scripts\build-web.ps1 -GptClone <你的 gpt-clone 或 worktree 路徑>
   ```
   看到結束碼 36 與 `gzip` 那行才算成功；再用 `http://localhost:3000/games/cocos/hc-pilot/index.html` 與 `http://localhost:3000/play/hc-pilot`（要登入）確認。
6. 建立本機測試環境（零件與做法見 `workflow.md` §6；需要服務帳戶才能撈存檔，**測試環境不在 repo，需自行建立或向負責人取得**）。
7. 型別檢查：`gpt-clone\node_modules\.bin\tsc -p tsconfig.json --noEmit --skipLibCheck | grep "^assets/"`。

## 5. 編輯器 MCP 架設

見 `mcp-funplay-cocos.md` §2、§3。重點：全域安裝（編輯器內【GUI】按 Install for All Projects）、專案根目錄 `.mcp.json`、**不要按 One-Click Configure**、連接埠與伺服器名稱每個專案不同要從面板抄。

## 6. 3D 模型工具

見 `model-pipeline.md`。bpy 腳本在 `_source/blender/`，用 Blender 3.6 `--background --python` 執行。

## 7. 環境驗收清單（自己打勾）

- [ ] Creator 3.8.8 能開專案、預覽能玩。
- [ ] `build-web.ps1` 結束碼 36，產物已進 `public/games/cocos/<game-id>/`，grep `assets/main/index.*.js` 看得到新程式碼。
- [ ] 網站 `/play/<game-id>` 能登入、載入遊戲、存檔寫進 Firestore（用測試帳號，**別拿學生帳號**）。
- [ ] `tsc` 對 `assets/` 無錯。
- [ ] （若要用 MCP）`curl http://127.0.0.1:<port>/health` 有回應，`tools/call get_hierarchy` 能讀到節點。

## 8. 還沒有人走過的

- 在**全新電腦**上完整照本檔架設一次——本檔是由現有環境與紀錄整理，沒有在乾淨環境驗證過【未驗證】。
