# 編輯器 MCP：funplay-cocos-mcp

> **可信度說明（重要）**：
> - 安裝與設定已用實際檔案核對【文件＋檔案】：版本 0.6.4、全域安裝、`hc-pilot/.mcp.json` 存在。
> - 工具清單與用法來自擴充套件自帶的官方文件（`README.md`、`docs/TOOLS.md`、`docs/PROJECT_WORKFLOWS.md`）【文件】。
> - **端到端實戰紀錄不足**：負責 Cocos 的 session 自己沒有用 MCP 改過 hc-pilot 的場景（它的製作交接寫「沒有針對 Cocos 編輯器的 MCP 可用；建置一律走命令列」，但那與實際安裝狀態不符，已以檔案為準更正）。所以「哪些做得到、哪些踩過坑」多為文件說法，**未經 hc-pilot 驗證**【未驗證】。第一次實際使用時請把結果補回本檔。

## 1. 它是什麼、選它的理由

- **FunplayAI/funplay-cocos-mcp**（MIT 授權）。Cocos Creator 的**編輯器擴充套件**，內嵌 HTTP MCP 伺服器，讓 AI 透過編輯器 API 操作場景、資產、預覽、截圖與診斷。
- **Editor-only**：只自動化編輯器，不會進遊戲建置，不增加最終遊戲的相依。
- 專案規定用它（正典 §2）；**禁用 DaxianLee／cocos-mcp-server**（授權寫明不可商用，與協會收費課程有衝突疑慮）。
- 設計重點是 **`execute_javascript` 優先**：一個高彈性的 JS 工具可編排場景／執行期與編輯器端自動化，避免一堆細碎工具呼叫。

## 2. 目前的安裝狀態【檔案核對，2026-10-29】

| 項目 | 內容 |
|------|------|
| 版本 | 0.6.4（GitHub Release，SHA256 已驗；紀錄在 `specs/cocos-web-games/README.md`） |
| 位置 | **全域**：`%USERPROFILE%\.CocosCreator\builtin-extensions\3.8.8\funplay-cocos-mcp`（每個 Creator 版本各自一份；升版要重新 Install for All Projects） |
| 專案連線 | `C:\Dev\Cocos\Projects\hc-pilot\.mcp.json`：伺服器名 `cocos-hc-pilot-b6ae91`，`type: http`，`http://127.0.0.1:23892/`（連接埠由專案路徑推導，範圍 20000–29999） |
| 啟動 | 編輯器要開著該專案；選單 `Funplay > MCP Server` 可看實際網址與啟停。預設自動啟動 |

> 全域副本與專案內 `extensions/funplay-cocos-mcp` 同時存在會重複載入；面板會顯示重複安裝警告。安裝器不會刪除專案內那份（保護開發 worktree）。

## 3. 怎麼連上

1. 開 Cocos Creator 3.8.8 與 hc-pilot 專案（**GUI 步驟由負責人做**）。
2. `Funplay > MCP Server` 確認伺服器開著、記下實際網址。連接埠被佔用時會先判斷是不是同專案的監聽，否則自動往後找；**以面板顯示的實際網址為準**。
3. Claude Code：專案根的 `.mcp.json`（hc-pilot 已有）。面板的「One-Click Configure」會寫入各客戶端；官方文件說 Claude Code 用 `~/.claude.json` 的 `projects[Git 根目錄].mcpServers`，與本專案採用的 `.mcp.json` 是兩種方式，**以專案現有 `.mcp.json` 為準**。
4. 驗證連線（本機）：`curl http://127.0.0.1:<port>/health`、`curl http://127.0.0.1:<port>/tools`（唯讀除錯端點）。
5. 可選設定檔：專案根目錄 `funplay-cocos-mcp.config.json`（`host`、`port`、`toolProfile`、`enableConsoleLogging`、`executeJavascriptSafetyChecks`、`autostart`…）；環境變數 `COCOS_MCP_HOST`／`COCOS_MCP_PORT`／`COCOS_MCP_PROFILE`。

## 4. 工具怎麼選

- **`core` profile（預設）39 個**：高訊號的常用工具；**`full` 105 個**（含破壞性與低階工具）；`custom` 可依類別或單一工具增減，並可存成命名 profile。
- 核心：`execute_javascript`（`context: "scene"` 或 `"editor"`）、`execute_scene_script`、`execute_editor_script`、`get_editor_state`、`get_scene_info`、`get_hierarchy`、`get_project_info`、`get_recent_logs`、`run_script_diagnostics`、`get_build_status`、`get_runtime_state`、`get_preview_mode`、`create_scene`、截圖三件（`capture_scene_screenshot`、`capture_preview_screenshot`、`capture_editor_screenshot`）、`get_performance_snapshot`。
- 類別（full）：腳本執行、編輯器狀態、專案指示、專案／場景、節點編輯、資產／Prefab、元件、UI、相機、動畫、檔案、診斷與日誌、建置與編輯器、執行期（`pause_runtime`／`resume_runtime`／`set_time_scale`）、互動與事件（`simulate_mouse_click`／`simulate_key_press` 等）、截圖與視窗。
- **推薦順序**（官方）：先 `execute_javascript` 探查／操作，再用專門的截圖、診斷、資產、檢查工具收尾。
- **用法範例**（官方）：
  ```json
  { "context": "scene", "code": "return { sceneName: scene.name, rootCount: scene.children.length };", "args": {} }
  { "context": "editor", "code": "return { projectPath: context.projectPath, toolCount: helpers.listTools().length };", "args": {} }
  ```
  editor 端腳本可用 `Editor`、`fs`、`path`、`os`、`require`、`context`、`args`，以及 `helpers.getStatus()`／`listTools()`／`readResource(uri)`／`callTool(name,args)`。
- **安全檢查**：`execute_javascript` 預設會擋明顯危險的檔案系統與 shell 樣式（刪除、截斷、原始可寫串流、路徑穿越、使用者／系統絕對路徑…）。檔案工具與 `cocos://asset/...` 資源**限制在專案根目錄內**。所有暴露的工具**直接執行，沒有額外的核准開關**——所以靠本專案的 A-1～A-6 規則自律。
- **預覽模式**：`browser`／`gameView`／`simulator`；用 `get_preview_mode`、`set_preview_mode`、`run_project_preview`。腳本裡別直接呼叫 `scene.editor-preview-set-play`（會繞過工具列同步），用上述工具。暫停／繼續需 full 或 custom profile。

## 5. 內建資源與提示

- 資源：`cocos://project/context`、`cocos://project/summary`、`cocos://scene/active`、`cocos://selection/current`、`cocos://errors/scripts`、`cocos://logs/editor`、`cocos://logs/project`、`cocos://mcp/interactions`。
- 提示（prompts）：`fix_script_errors`、`create_playable_prototype`、`scene_validation`、`auto_wire_scene`；專案自訂提示放 `<專案>/mcp-prompts/*.md`（帶 frontmatter：`name`、`description`、`arguments`），用 `prompts/get` 明確呼叫，不會自動套用。
- 內建「Project Skills」：`funplay-cocos-mcp-workflow`、`funplay-cocos-ui-composition`，可裝到各客戶端的專案 skill 目錄（Claude Code 為 `.claude/skills`）。**安裝前先讓負責人確認**——會寫入專案資料夾。

## 6. 本專案怎麼用（規定＋推論）

| 情境 | 做法 |
|------|------|
| 改場景結構、做 prefab | **只能**透過 MCP 或請負責人在編輯器做（A-1）。改前 `git commit`、改後 `capture_scene_screenshot` 看過再 commit（A-2）；同時只有一個 session 寫入（A-3） |
| 改 `.ts` 腳本 | 直接改檔即可（A-4）；新增檔案後請編輯器重新整理（可用 MCP 呼叫 `asset-db` 的 `refresh-asset`），產生 `.meta` 一起 commit |
| 看腳本錯誤 | `run_script_diagnostics`、`get_recent_logs`、`cocos://errors/scripts`（比跑完整建置快） |
| 看畫面 | `capture_scene_screenshot`／`capture_preview_screenshot`。**注意**：實際進度驗證仍以建置後的網頁版為準（見 `verification.md`），編輯器預覽不等於網站上的樣子 |
| 建置 | **仍走命令列 `build-web.ps1`**（見 `workflow.md`）。`3D模型-交接.md` 的建議是建置前用 MCP refresh 資產 |

**與建置的衝突【推論，未驗證】**：編輯器開著時，命令列建置會 `EPERM project.log`／`ENOTEMPTY`（見 `pitfalls.md` #4）；而 MCP 需要編輯器開著。所以流程要分段：先用 MCP 改完、存檔、commit → 請負責人關編輯器（或確認建置腳本與編輯器共存的做法）→ 再建置。這個交接點尚未實際走過，第一次做請與負責人確認。

## 7. 還沒回答的問題

1. MCP 在 hc-pilot 上實際跑起來是否正常（連線、工具回應、截圖）——**沒有紀錄**。
2. `core` profile 夠不夠用；是否需要 `custom` 加 `simulate_*`／`pause_runtime`。
3. 與 Claude Code 的 `.mcp.json` HTTP 連線在 `GET /`（SSE）上的行為：曾在某次 Cocos 建置日誌看到 `[Funplay Cocos MCP Server] Rejected GET /: SSE GET streams are not supported`，這是伺服器對 SSE GET 的拒絕訊息，**是否影響客戶端未驗證**。
4. 升級流程（面板的一鍵更新會備份並替換套件）是否會與全域安裝衝突。
5. Project Skills 要不要裝進 hc-pilot（`.claude/skills`），以及與本 repo `skills/cocos-web-game` 的關係（建議以本 skill 為準，內建兩個 skill 只當參考）。
