# Cocos Web Games 規格

此目錄是「用 Cocos Creator 製作、嵌入 gpt-clone 網站的小遊戲」的唯一規格區，與課程 wiki 分離。

| 目錄            | 內容                                       |
| ------------- | ---------------------------------------- |
| `standards/`  | 跨遊戲共用的工程規範（版本、目錄、網站串接協定、預算、AI 協作、驗收） |
| `<game-id>/`  | 各款遊戲的建置規格、玩法數值、QA 紀錄（開案時建立）              |

正典：[`standards/cocos-web-game-standard.md`](standards/cocos-web-game-standard.md)（試點中）。

## 環境紀錄

安裝後由負責人或 CLI 填寫，升版時更新：

| 項目 | 版本 | 安裝位置 | 紀錄日期 |
|---|---|---|---|
| `<COCOS_ROOT>` | — | `C:\Dev\Cocos\`（負責人確認） | 2026-09-29 |
| Cocos Dashboard | 2.2.2.1515（winget `Cocos.CocosDashboard`） | `C:\Program Files (x86)\CocosDashboard\` | 2026-09-29 |
| Cocos Creator | 3.8.8 | `C:\ProgramData\cocos\editors\Creator\3.8.8\CocosCreator.exe`（⚠ 偏離 §3，見下方） | 2026-09-29 |
| funplay-cocos-mcp | 0.6.4（GitHub Release，SHA256 已驗） | 全域：`%USERPROFILE%\.CocosCreator\builtin-extensions\3.8.8\funplay-cocos-mcp` | 2026-09-29 |
| Node.js | v24.19.0（LTS）；npm 11.17.0 | — | 2026-09-29 |

**已核准的偏離與試點決定（2026-09-29，負責人裁決）**

- 編輯器未放在 `<COCOS_ROOT>\Editors\`：Dashboard 安裝時路徑設定未生效，裝到 Dashboard 預設的
  `C:\ProgramData\cocos\editors\`。負責人決定保留（不在桌面／同步資料夾、路徑無空白與中文，符合 R-0 的理由，
  僅不符 §3 目錄佈局）。`build-web.ps1` 的 `-CocosCreatorExe` 預設值用此路徑；`C:\Dev\Cocos\Editors\` 目前為空。
- hc-pilot 改用 **Empty (3D)** 模板、**1280×720 橫式**、**物理先關閉**（原規劃為 2D／720×1280 直式）。
- MCP 連線：Claude Code 用專案根目錄 `.mcp.json`，Codex 用 `~/.codex/config.toml`；伺服器名稱
  `cocos-hc-pilot-b6ae91`，網址 `http://127.0.0.1:23892/`（連接埠由專案路徑推導）。

## 遊戲清單

| game-id | 名稱 | 狀態 | Cocos 專案位置 | 網站路徑 |
|---|---|---|---|---|
| hc-pilot | 環境試點（空專案） | 初始化中 | `<COCOS_ROOT>\Projects\hc-pilot\` | `/games/cocos/hc-pilot/` |
| p1u-arc3（暫定） | 小熊麵包坊（P1 上 W13–W18，量增自動化，教先後順序） | 開發規格草案，待決協定擴充 | （未建立） | `/games/cocos/p1u-arc3/` |

規格：[`p1u-arc3/P1U-Arc3-小熊麵包坊-開發規格.md`](p1u-arc3/P1U-Arc3-小熊麵包坊-開發規格.md)
