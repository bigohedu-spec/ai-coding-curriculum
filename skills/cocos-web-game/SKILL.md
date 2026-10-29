---
name: cocos-web-game
description: |
  用 Cocos Creator 製作「嵌入 gpt-clone 網站的課程小遊戲」（例如 P1U 小熊麵包坊 hc-pilot）時的作法與知識：從零到上線的流程、建置與部署、與網站的存檔／完成鎖串接、本機測試環境、編輯器 MCP（funplay-cocos-mcp）怎麼用、3D 模型流程、踩過的坑、驗證方式。當使用者提到 Cocos、hc-pilot、小熊麵包坊、Cocos 建置、編輯器 MCP、要做新的 Cocos 週次或新遊戲，或要修改／測試／部署 Cocos 遊戲時使用。
---

# Cocos 網站小遊戲製作

> 這個 skill 補的是**「怎麼做」**。協定、目錄、預算等**規定**在 `specs/cocos-web-games/standards/cocos-web-game-standard.md`（正典），遊戲內容在 `specs/cocos-web-games/p1u-arc3/P1U-Arc3-小熊麵包坊-開發規格.md`（**W15 之後多處落後於程式，以程式為準**）。教案／學習單在 `wiki/programs/P1U/`。
> 資料來源：2026-10-29 向負責 Cocos 的 session（「Cocos 網站小遊戲環境初始化」）取得的製作交接，加上專案記憶檔、hc-pilot 的 `docs/3D模型-交接.md`、funplay-cocos-mcp 的官方文件，並對照實際檔案核對過。
> 每條知識標了可信度：**【實做】**有人親手做過並驗證、**【記憶】**來自專案記憶（別的 session 做的）、**【文件】**來自官方／專案文件、**【未驗證】**沒確認。

## 先讀什麼（依任務）

| 任務 | 先讀 |
|------|------|
| 改遊戲、開新一週、建置、部署、接網站存檔 | `reference/workflow.md` |
| 要讓 AI 透過編輯器改場景、截圖、診斷（編輯器 MCP） | `reference/mcp-funplay-cocos.md` |
| 做／換 3D 模型、美術預算 | `reference/model-pipeline.md` |
| 建置失敗、行為怪怪的、存檔壞掉 | `reference/pitfalls.md` |
| 要證明「真的能玩」、測學生進度 | `reference/verification.md` |
| 課程設計面（開場、評量、低年級原則） | `skills/labterminal-course-spec/reference/`（`shipped-benchmarks.md`、`motor-skill-lesson-design.md`） |

## 一定要守的規則（摘要，細節見正典 §10 與各 reference）

1. **不手改** `.scene`、`.prefab`、`.anim`、`.meta`。要改場景一律透過編輯器 MCP，或請負責人在編輯器裡操作（A-1）。
2. 透過 MCP 改場景前先 `git commit`，改完截圖確認再 commit（A-2）；**同一專案同時只准一個 AI session 透過 MCP 寫入**（A-3）。
3. 可以自由改 `assets/scripts/**/*.ts`；新增檔案後讓編輯器重新整理產生 `.meta`，一起 commit（A-4）。
4. **寫入後重新讀取確認**，不信「寫入成功」（A-5）。
5. 手感數值（速度、判定範圍、難度、價錢）由負責人決定，AI 只提案（A-6）。數值檔單一真相是 `ArcadeConfig.ts`。
6. 建置一定要帶 `-GptClone C:\Users\COSH\Desktop\CodingClass\gpt-clone-bakery`，不然會灌進 gpt-clone 主資料夾（那邊常被別的 session 占用）。
7. **不要寫 `game:hc-pilot` 完成鎖**（寫了學生隔週進不來）；每週過關記在 `prog.weeks[週]`，網站記 `game:p1uwNN`。
8. 學生存檔／`hc-test-env/saves.json` 含個資，**不 commit、不放進 `public/`**。
9. 需要在編輯器 GUI 點選的步驟不要繞過：停下來條列要點哪裡，等負責人回「好了」。
10. 回覆與畫面文字一律繁體中文；給小一看的畫面，文字都要有注音。

## 範圍與已知缺口

- 本 skill 以 **hc-pilot（P1U Arc 3）一款遊戲**的經驗為基礎；第二款 Cocos 遊戲開案時，要回頭檢查哪些是「這款特有」、哪些是通則。
- **funplay-cocos-mcp**：安裝、連線、約 85 次 `execute_javascript` 的實際用法都有紀錄（2026-09-29 開案那天）；缺的是 Claude Code **原生掛載** `.mcp.json`（當時是用 curl 呼叫）、`context:"scene"`、以及 9/30 之後有沒有人用它改場景（見 `mcp-funplay-cocos.md` §9）。
- hc-pilot 原始碼**只在這台電腦、沒有 GitHub 遠端**（負責人 2026-10-15 選擇先不備份）。
