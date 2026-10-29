# 編輯器 MCP：funplay-cocos-mcp

> **可信度**：
> - 【紀錄】來自負責 Cocos 的 session（「Cocos 網站小遊戲環境初始化」）2026-09-29 的完整對話紀錄，該 session 親手安裝、設定並使用過，數字（呼叫次數、版本、雜湊）取自紀錄。
> - 【文件】來自擴充套件自帶官方文件（`README.md`、`docs/TOOLS.md`、`docs/PROJECT_WORKFLOWS.md`），**該 session 沒有親自驗證**。
> - 【檔案】2026-10-29 用實際檔案核對。
> - 【推測／未驗證】明確標出。
> - 更正紀錄：該 session 先前的交接檔寫「沒裝、沒評估」是錯的（它當時 context 已壓縮，只查了全域設定檔，沒翻對話紀錄；MCP 連線設定本來就放在專案根目錄 `.mcp.json`）。以本檔為準。

## 1. 它是什麼、選它的理由

- **FunplayAI/funplay-cocos-mcp**（MIT 授權，GitHub `FunplayAI/funplay-cocos-mcp`）。Cocos Creator 的**編輯器擴充套件**，內嵌 HTTP MCP 伺服器，讓 AI 透過編輯器 API 操作場景、資產、預覽、截圖與診斷。
- **Editor-only**：只自動化編輯器，不進遊戲建置，不增加最終遊戲的相依。
- 專案規定用它（正典 §2）；**禁用 DaxianLee／cocos-mcp-server**（授權寫明不可商用，與協會收費課程有衝突疑慮）。
- 官方設計重點是 **`execute_javascript` 優先**：一個高彈性的 JS 工具編排場景／執行期與編輯器自動化，避免大量細碎工具呼叫。

## 2. 安裝（實際走通的做法）【紀錄＋檔案】

**來源與版本**：GitHub Release `v0.6.4`（2026-09-19 發布），不是 Cocos Store。包含 `Funplay.CocosMcp.v0.6.4.zip`（218252 bytes）、`SHA256SUMS.txt`、`release-manifest.json`、`RELEASE_NOTES.md`；下載暫存在 `C:\Dev\Cocos\_installers\funplay-cocos-mcp-v0.6.4\`。zip 的 SHA256 `43360f48…26825c8` 與官方 `SHA256SUMS.txt`、manifest 一致（已驗）。`package.json` 的 `dependencies` 是空的，**不需要 `npm install`**。

**步驟**（編輯器內的 GUI 步驟由負責人點，AI 無法代點——電腦操作工具找不到名為「Cocos Creator」的應用，只看得到 Cocos Dashboard）：
1. 先解壓到 `hc-pilot\extensions\funplay-cocos-mcp` 當「跳板」，讓編輯器看得到它；`.gitignore` 加 `extensions/`（用 `git check-ignore` 實測會被忽略）。
2. 負責人在編輯器：擴充 → 擴充管理器 → **Installed**（不是「Cocos Official」分頁，那是官方商店，看不到手動放進去的）→ 打開 `funplay-cocos-mcp` → 選單出現「Funplay」→ **Funplay → MCP Settings → All Projects 區塊按「Install for All Projects」**。
3. 確認全域安裝落地：`%USERPROFILE%\.CocosCreator\builtin-extensions\3.8.8\funplay-cocos-mcp` 一開始是空的，按完才出現，版本 0.6.4。（擴充自己會下載並驗 SHA256；該 session 沒親眼確認它有驗，只確認最後版本是 0.6.4。）
4. 請負責人關編輯器 → 刪掉專案裡的跳板 `extensions\funplay-cocos-mcp` → 從 Dashboard 重開 hc-pilot。
5. 驗證只載入一份：`execute_javascript`（`context:"editor"`）呼叫 `Editor.Package.getPackages({name:"funplay-cocos-mcp"})`，只回一份、path 是全域那份、`enable:true`。

**為什麼選全域**：這是開案任務書的優先順序（能全域就全域；不行才裝進專案 `extensions\` 並 gitignore），不是另外評估的結果。每個 Creator 版本各一份；升版要在新版重新 Install for All Projects。全域與專案副本同時存在會重複載入（面板會顯示警告）。

**遇到的問題**：① 負責人找不到擴充（停在 Cocos Official 分頁）；② 全域資料夾要等他按完「Install for All Projects」才有；③ 在 Git Bash 用 `node -e require('/c/Dev/...')` 失敗（Windows 的 node 不認 `/c/` 路徑），要先 `cd` 再 `require('./package.json')`；④ 負責人不小心按到「構建」，留下只有 `src/polyfills.bundle.js` 的半成品 `build\web-mobile\`（沒進版控，編輯器關著時刪掉）；⑤ 他匯出的建置設定 `md5Cache:false`、`outputName:"web-mobile-001"` 違反正典 D-1／D-3，要重匯並改名成 `build-config/web-mobile.json`。

## 3. 連線設定【紀錄】

- **不要按「One-Click Configure」**：README 寫它會寫進使用者全域的 `~/.claude.json`（release notes 也提到它用「project scope paths」寫入，且 Windows 路徑大小寫／斜線有過 bug，v0.6.4 修過），而任務書要的是**進版控、跟專案走**的 `.mcp.json`。**它的副作用（寫哪個 key、會不會覆蓋別的專案設定）沒有人實測過**【未驗證】。
- 實際設法：負責人從編輯器 **Funplay → MCP Server** 面板把網址貼出來（`http://127.0.0.1:23892/`），再用 `GET /health` 取得 `projectIdentity`；伺服器名稱的後綴＝identity 前 6 碼。
- **專案根目錄 `hc-pilot\.mcp.json`**（已 commit，`3651d5c`）：
  ```json
  { "mcpServers": { "cocos-hc-pilot-b6ae91": { "type": "http", "url": "http://127.0.0.1:23892/" } } }
  ```
- Codex：備份 `~/.codex/config.toml` 後在尾端加 `[mcp_servers.cocos-hc-pilot-b6ae91]` ＋ `url = "http://127.0.0.1:23892/"`。
- **伺服器名稱與連接埠每個專案不同**，要從面板抄，不要照抄 `b6ae91`／`23892`。連接埠官方文件說由專案路徑推導（範圍 20000–29999）【文件】；該 session 自己沒驗證這句話【未驗證】。
- 可選設定檔：專案根目錄 `funplay-cocos-mcp.config.json`（`host`、`port`、`toolProfile`、`enableConsoleLogging`、`executeJavascriptSafetyChecks`、`autostart`…）；環境變數 `COCOS_MCP_HOST`／`COCOS_MCP_PORT`／`COCOS_MCP_PROFILE`【文件】。

## 4. 怎麼呼叫：實際用的是 curl，不是原生掛載【紀錄】

該 session **沒有**靠 `.mcp.json` 讓 Claude Code 原生掛載工具；它自己寫 `mcpcall.sh`（curl 包 JSON-RPC）呼叫。`.mcp.json` 是留給之後的 session／其他人用的。**Claude Code 原生掛載這條路沒人走過**【未驗證】。

curl 的做法：
- `POST /`，標頭 `Content-Type: application/json`、`Accept: application/json, text/event-stream`、`MCP-Protocol-Version: 2025-06-18`。
- 先 `initialize`（回 serverInfo `Funplay Cocos MCP - hc-pilot` 0.6.4）→ `notifications/initialized` → 再 `tools/call`（例：`get_hierarchy` 回 Main Light、Main Camera 等節點）。
- 唯讀除錯端點：`GET /health`、`GET /tools`（`/tools` 在 `core` 模式回 39 個工具）。
- **編輯器沒開時 MCP 沒回應**（`/health` 無回應）；請負責人從 Dashboard 重開專案。

## 5. 工具與實際用過的

- **`core`（預設）39 個**：`execute_javascript`、`execute_scene_script`、`execute_editor_script`、`get_editor_state`、`get_tool_catalog`、`check_for_updates`、`get_selection`／`set_selection`、`get_scene_info`、`get_hierarchy`、`get_project_info`、`get_build_status`、`get_preview_mode`、`create_scene`、`list_scenes`、`open_scene`、`inspect_prefab` 等 prefab／資產檢查、`run_script_diagnostics`、`get_recent_logs`、`search_project_logs`、`clear_logs`、`validate_scene`、`get_performance_snapshot`、`get_runtime_state`、`capture_editor_screenshot`／`capture_scene_screenshot`／`capture_preview_screenshot`、`list_editor_windows`。**`full` 105 個**另含 `create_canvas`、`create_label`、`save_current_scene`、`set_component_property`、`simulate_*`、`pause_runtime` 等【文件；該 session 沒切過 full】。
- **`execute_javascript` 必須帶 `context`**，值 `"scene"` 或 `"editor"`（傳 `target` 會得到 `Unknown execution context 'undefined'`）。editor 端可用 `Editor`、`fs`、`path`、`os`、`require`、`context`、`args`，以及 `helpers.getStatus()`／`listTools()`／`readResource(uri)`／`callTool(name,args)`。`context:"scene"` 沒人實際用過【未驗證】。
- 該 session 2026-09-29 的實際用量：

| 工具 | 次數 | 做了什麼／結果 |
|------|------|--------------|
| `execute_javascript`（多為 `editor`） | 約 85 | ① `Editor.Profile.getProject/setProject('engine','modules')` **做引擎功能裁剪**（關 3D／2D 物理、Spine、DragonBones、粒子、影片、WebView、TiledMap、地形、WebSocket；保留 3D、2D／UI、動畫、tween、音效），寫回後重讀確認；② `Editor.Message.request('scene','create-node'\|'set-property'\|'save-scene')` 建 Canvas＋Label（用 `db://internal/default_prefab/ui/Canvas\|Label.prefab` 的 uuid、`unlinkPrefab:true`）；③ `Editor.Message.request('asset-db','refresh-asset','db://assets/scripts')` **新增或修改 .ts 後由 MCP 觸發重新整理、產生 .meta**，再 `query-asset-info` 確認 `imported:true`；④ 建立／套用材質（unlit 頂點色、GPU instancing）；⑤ 指定注音字型；⑥ `Editor.Package.getPackages` 驗證載入路徑 |
| `run_script_diagnostics` | 16 | 第一次回 88 個 TypeScript 錯誤，**全部來自引擎自己的型別宣告**（如 `@types/jsb.d.ts`）；改成只看檔案路徑含 `assets` → **專案自己 0 錯**。之後每次新增腳本都這樣篩 |
| `create_scene` | 3 | 建立三個場景（先是當前場景，之後各掛主元件的兩個遊戲場景），`mode:"current"`、`openAfterCreate:true` |
| `get_scene_info`／`get_hierarchy` | 3／1 | 確認場景節點、連線驗證 |
| `capture_scene_screenshot` | 指令出現 4 次，只有第 1 次有看過內容細節 | 回傳 base64 PNG，解碼存暫存檔再讀圖確認 Label 出現 |

- **沒用過**：`capture_preview_screenshot`、`capture_editor_screenshot`、`get_recent_logs`、`search_project_logs`、`validate_scene`、`get_performance_snapshot`、`get_runtime_state`、`list_assets`、`inspect_*`、`full` 的工具。
- **FPS／draw call 不是用 MCP 量的**（用瀏覽器與無頭 Chrome）；**WASD 試玩不是在編輯器內跑**，是「refresh → 建置 → 在網站頁面測」。

**做得到**：改專案設定（`Editor.Profile`）、建場景／節點／設屬性／存檔、`refresh-asset`、查資產資訊、跑 TypeScript 診斷、讀節點樹、截編輯器畫面。
**做不到、要靠人**：把擴充裝成全域、啟用擴充、匯出建置設定、按「構建」都要 GUI；**CLI 建置本身不走 MCP**。

## 6. 內建資源、提示、安全【文件】

- 資源：`cocos://project/context`、`cocos://project/summary`、`cocos://scene/active`、`cocos://selection/current`、`cocos://errors/scripts`、`cocos://logs/editor`、`cocos://logs/project`、`cocos://mcp/interactions`。
- 提示：`fix_script_errors`、`create_playable_prototype`、`scene_validation`、`auto_wire_scene`；專案自訂提示放 `<專案>/mcp-prompts/*.md`。
- 內建 Project Skills：`funplay-cocos-mcp-workflow`、`funplay-cocos-ui-composition`；可裝到 `.claude/skills`（會寫入專案資料夾，**先讓負責人確認**；本 repo 以 `skills/cocos-web-game` 為準，內建兩個只當參考）。
- `execute_javascript` 預設有安全檢查（擋刪除、截斷、路徑穿越、使用者／系統絕對路徑、shell 樣式）；檔案工具與 `cocos://asset/...` 限制在專案根目錄內。**所有工具直接執行、沒有核准開關**——靠 A-1～A-6 規則自律。
- 預覽模式 `browser`／`gameView`／`simulator` 用 `get_preview_mode`／`set_preview_mode`／`run_project_preview`；腳本裡別直接呼叫 `scene.editor-preview-set-play`。

## 7. A-1～A-6 實際操作時的狀況【紀錄】

| 規則 | 實際 | 建議補充（給負責人決定，**不改正典**） |
|------|------|--------------------------------------|
| A-1 不手改場景檔 | 照做：`Main.scene` 的 Canvas／Label 全用 `create-node`／`set-property`／`save-scene`；後來調整只改兩個 .ts | 無 |
| A-2 改前 commit、改後截圖 | 第一次（Main 場景）完整做到（commit `bfe1699`）；建 `BakeryW13` 前先 commit 腳本 | 「改完用 MCP 截圖」對純 .ts 不適用，且 `capture_scene_screenshot` 是編輯器畫面、不是遊戲實際畫面。建議寫成「改場景→截圖；改腳本→以遊戲畫面或測試輸出驗證」 |
| A-3 同時只一個 AI 透過 MCP 寫入 | 沒有兩個 AI 同時寫過；**真實衝突是「CLI 建置 vs 編輯器開著／另一個 session 也在建置」**。9/30 與「3D 模型製作」session 約定同一時間只有一方跑建置（CLI 會搶專案目錄、也會把匯入一半的模型打包進去） | **建議補：CLI 建置也算寫入，同時只能一個 session 跑**，並確認編輯器是否開著 |
| A-4 新增腳本後重新整理 | 用 MCP `asset-db refresh-asset` 觸發，不一定要請人點；開案時請負責人「重新整理」他回「沒有 Refresh」，實際查發現 `.meta` 已被編輯器自動產生 | 寫成「用 MCP `refresh-asset`，或請人按資源管理器的重新整理；也可能已自動產生，先 `find assets -name '*.meta'` 確認」 |
| A-5 寫入後重新讀取 | 照做（grep 實際 `.scene` 確認字串、字型、字號；引擎裁剪寫入後重讀） | 無 |
| A-6 手感數值由負責人決定 | 照做，數值標【假設】 | 無 |

## 8. 與命令列建置的關係【紀錄＋推測】

- 建置走命令列 `build-web.ps1`，**不走 MCP**。建置前可用 MCP `refresh-asset` 讓編輯器先匯入新檔。
- **編輯器開著時建置**：2026-09-29 實測會印 `EPERM: open '...\temp\logs\project.log'` 與 Chromium cache 無法搬移的錯誤，但**那次建置仍成功、新程式碼有進產物**；2026-10-21 另一個 session 記錄過同類 `EPERM`／`ENOTEMPTY`（`pitfalls.md` #4）。所以結果不穩定：**最穩的做法是編輯器關著建置**。
- **CLI 建置的編輯器程序也會載入 Funplay 擴充並起 MCP 伺服器**（建置 log 會夾 `[Funplay Cocos MCP Server] RPC initialize`）；另有 `Rejected GET /: SSE GET streams are not supported`，推測是客戶端以 GET 嘗試開 SSE 被拒（它只支援 POST JSON-RPC），**無害**，沒有證據顯示它造成建置失敗【推測】。

## 9. 還沒回答的問題

1. Claude Code 原生掛載 `.mcp.json`（而非 curl）是否順利。
2. `context:"scene"` 的實際用法與效果。
3. `core` profile 夠不夠用；是否需要 `custom` 加 `simulate_*`／`pause_runtime`。
4. 「小熊麵包坊 3D 模型製作」session 是否真的用 MCP 改過場景——紀錄在它自己那邊，沒查到。
5. 9/30 以後有沒有任何 session 用 MCP 改場景（W13～W18 的改動幾乎都是 `.ts`、Blender 腳本與建置）。
6. 面板一鍵更新（會備份並替換套件）是否與全域安裝衝突。
