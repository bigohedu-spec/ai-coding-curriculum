# 開新一款 Cocos 遊戲

> 對象：要在 hc-pilot 之外**另開一款**網站小遊戲的人。把 hc-pilot 開案那天（2026-09-29）實際走過的步驟，加上正典的規定，整理成可照做的 checklist。
> 先讀 `environment-setup.md`（環境）與 `website-integration.md`（網站端）。可信度標記見 `../SKILL.md`；開案經過來自 Cocos session 的對話紀錄。
> **同系列既有遊戲優先 fork／延伸**（見 `workflow.md` §5）；本檔是「真的要另開專案」時用。

## 0. 動工前先確定（正典 §12：由負責人決定，AI 不得自行定案）

- [ ] `game-id`（小寫 kebab-case、全平台唯一、發布後不改名）。
- [ ] 玩法、對象年級、一局多久、方向（橫式 1280×720 或直式 720×1280）、2D 還是 3D。
- [ ] 要不要跨課存檔（要 → 需要 `save` 協定與存檔保護；不要 → 只送 `complete`）。
- [ ] 要不要發金幣、金幣是否計入主線 250、要不要記課程完成鍵、要不要進課動畫。
- [ ] 需不需要問 AI、錄音、打字輸入（會牽涉 C-1／C-2／C-4，見 `website-integration.md`）。
- [ ] 是否給小一（要注音字型）。

## 1. 建專案

1. 【GUI】Cocos Dashboard → 新專案，Creator 版本選 **3.8.8**，路徑 `C:\Dev\Cocos\Projects\<game-id>`（hc-pilot 用 **Empty (3D)**、1280×720 橫式、物理先關閉；若做 2D 超休閒，原規劃是 2D／720×1280 直式）。
2. 專案資料夾 `git init`，`.gitignore` 至少忽略 `library/`、`temp/`、`local/`、`build/`、`node_modules/`（**不得**忽略 `settings/` 與 `.meta`），做第一次 commit。
3. 在 `specs/cocos-web-games/` 新增 `<game-id>/` 資料夾放開發規格，並更新 `README.md` 的遊戲清單與環境紀錄表。

## 2. 專案設定

1. **引擎功能裁剪（B-1）**：關掉用不到的模組，只留需要的。hc-pilot 的做法是用 MCP 的 `execute_javascript`（`context:"editor"`）呼叫 `Editor.Profile.getProject/setProject('engine','modules')` 改 `includeModules`，**寫回後重讀確認**。hc-pilot 關了 3D／2D 物理、Spine、DragonBones、粒子、影片、WebView、TiledMap、地形、WebSocket；保留 3D、2D／UI、動畫、tween、音效。不要開物理引擎（會多 0.5～2 MB）。
2. **構建設定**：【GUI】編輯器「構建」面板，平台 `web-mobile`，`debug=false`，**勾 MD5 Cache**，關 source map；匯出成 `build-config/web-mobile.json`（檔名預設是 `buildConfig_web-mobile.json`，要改名；`outputName`／`taskName` 要是 `web-mobile`，不是 `web-mobile-001`）。**不要按「構建」本身**（會留下半成品 `build\web-mobile\`）。
3. **`game.manifest.json`**（專案根目錄）：
   ```json
   { "gameId": "<game-id>", "protocol": "lt-game/1", "title": "（顯示用中文名稱）",
     "designWidth": 1280, "designHeight": 720, "orientation": "landscape", "defaultParams": {} }
   ```
4. **建置腳本**：從 hc-pilot 複製 `scripts/build-web.ps1`（前置檢查、D-1 檢查、啟動 CLI、檢查結束碼 36、robocopy 鏡像、gzip 估計）。預設值（編輯器路徑、`-GptClone`）依你的環境調整，並讓它**讀設定檔的 outputName**。
5. **平台層**：複製 `assets/scripts/platform/LtBridge.ts`，跑 `node scripts/sync-protocol.mjs <gpt-clone 路徑>` 產生 `protocol.ts`（不手改）。`LtBridge` 在沒有父頁面時什麼都不送，遊戲仍能玩（C-5）。
6. **字型**：Label 一律用系統字型（`"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif`），不打包 CJK 字型檔（T-1／T-2）。給小一的畫面需要注音時，才用 hc-pilot 的子集字型流程（`scripts/build-zhuyin-font.mjs` 與 `assets/art/fonts/bpmf-game.ttf`；新增中文字就要重跑）。
7. **編輯器 MCP**：見 `mcp-funplay-cocos.md` §2、§3（全域安裝已完成的話，只需讓新專案產生自己的 `.mcp.json`；伺服器名稱與連接埠要從該專案的 `Funplay > MCP Server` 面板抄）。

## 3. 第一個場景與腳本

1. 用 MCP 建場景與節點（`create_scene`，或 `execute_javascript` 內 `Editor.Message.request('scene','create-node'|'set-property'|'save-scene')`），**改前先 commit、改後截圖確認再 commit**（A-2）。不手改 `.scene`／`.prefab`／`.meta`（A-1）。
2. 玩法腳本放 `assets/scripts/game/`，平台層放 `assets/scripts/platform/`。新增腳本後用 MCP `asset-db refresh-asset` 讓編輯器匯入並產生 `.meta`，一起 commit（A-4）。
3. 遊戲開頭送 `ready`；收到 `config` 讀 `save`／`now`；收到 `start` 開局；進度有變送 `save`（每 10 秒最多 1 次，切到背景立刻送）；結束送 `complete`（每個 `sessionId` 只送一次）。
4. 診斷：`run_script_diagnostics` 會回一堆引擎型別宣告的錯（88 個，與專案無關），**只看檔案路徑含 `assets` 的**。
5. **數值集中**在一個設定檔（hc-pilot 就是這樣做），註解寫負責人的調整理由與日期，沒實測的標【假設】。

## 4. 建置、上網站、驗收

1. 型別檢查 → （有新增中文字）重建注音字型 → 建置（編輯器關著）→ 確認結束碼 36 → grep 產物確認程式碼真的進去。
2. 網站端依 `website-integration.md` 第 2 節做完 10 項。
3. 驗收（正典 §11，全部通過才算）：

| 編號 | 斷言 |
|------|------|
| K-1 | `assets/scripts/**` 內找不到 `firebase`、`/api/`、`localStorage.setItem`（純偏好鍵除外）、`SharedArrayBuffer`（hc-pilot 因問 AI 暫時偏離 `/api/`，見 `website-integration.md` §8） |
| K-2 | 場景內沒有 EditBox 元件 |
| K-3 | `build-web.ps1` 結束碼 36，產物已鏡像 |
| K-4 | 直接開 `index.html`（無父頁）能玩完一局 |
| K-5 | 嵌入網站後 `ready → config → start → started → complete` 全流程，網站只記一次 |
| K-6 | 送錯 origin／protocol 的訊息被忽略 |
| K-7 | 首次下載量 ≤ 5 MB、總量 ≤ 8 MB（DevTools Network，停用快取） |
| K-8 | **iPad Safari** 能用觸控玩完一局（S-2：主要輸入是指標） |
| K-9 | 切分頁再回來有暫停、沒瞬移或扣分 |
| K-10 | 網站沒新增 COOP／COEP header，也沒新增 npm 相依 |

   另外：教室實機（內顯電腦）量幀率（目標 60、最低 30）、從點開到可玩 ≤ 5 秒。

> ⚠ **hc-pilot 對 S-2 的狀況未明**：它的主要操作是 WASD＋空白鍵，教室用電腦；是否支援觸控、能不能在 iPad 玩，我沒有查到紀錄【未驗證】，也沒列在開發規格 §8「暫時偏離」裡。另開的新遊戲若要在平板玩，要從一開始設計指標操作。

## 5. 上線前最後確認

- [ ] 上線五元素齊全（`worksheet-launch` skill）。
- [ ] wiki：教案、學習單（含「本週學習重點」）、`implementation-status.md`、學程首頁都已更新（`labterminal-course-spec/reference/spec-governance.md` 的回填流程）。
- [ ] 學生存檔與測試頁沒進 `public/`、`.vercelignore` 有涵蓋。
- [ ] 專案原始碼有備份（遠端 repo 或其他方式，由專案負責人決定）。
