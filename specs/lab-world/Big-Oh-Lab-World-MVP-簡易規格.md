> 副本：正本在 `lab-world-unity/docs/raw-sources/discussions/2026-09-17-lab-world-concept.md`（含 9/17 範疇確認問答附錄）；
> 正式決策與可執行規格以 lab-world-unity 的 `docs/wiki/`、`docs/specs/` 為準。本檔僅供課程端參考。

# Big Oh Lab World｜Unity 區網遊戲 MVP 簡易規格

> 狀態：Draft｜日期：2026-09-17｜暫定名稱：Lab World

## 1. 專案目標

為小四學生建立 Unity 3D 箱庭多人遊戲，將教學、任務、獎勵與消費留在 Big Oh／Lab Terminal 生態內。學生完成課程取得金幣後，可用於角色外觀、房間、釣魚與建造，形成「學習 → 獎勵 → 消費／展示 → 期待下次課程」循環。

MVP 核心：俯視角 3D、五人合作箱庭、基礎戰鬥、有限格狀建造。後續系統：釣魚、房間布置、布娃娃外觀。暫不做自由交易、PvP、開放世界與居家即時多人。

## 2. 系統邊界

```text
ai-coding-curriculum（課程與教案正典）
                ↓
gpt-clone / Lab Terminal（帳號、內容、API、Firestore）
                ↓ 課前下載／課後批次同步
Lab Node（教室 Headless Unity Server + 本地快取）
                ↓ LAN
Unity 學生端（每房建議 5 人）
```

- Lab Terminal：帳號、課程內容、題庫、長期金幣／背包／進度。
- Lab Node：即時同步、戰鬥與答案驗證、掉落／獎勵權威判定、離線事件佇列。
- Unity Client：輸入與畫面呈現，不可自行增加貨幣或物品。
- Firestore 不參與位置、戰鬥或物理同步；Lab Node 透過受信任 API 上傳冪等事件。

## 3. 多人架構

- 網路框架：Mirror；預設 KCP Transport；不依賴 Photon Cloud。
- 模式：Dedicated Server／Server Authority。
- 房間：Additive Scene + Scene Interest Management + 獨立 Physics Scene。
- 同房玩家才互相同步；初始上限 5 人。
- 第一位玩家進入時建立房間；最後一位離開後結算、保存並卸載。空房不跑網路同步、AI 或物理。
- 初始參數：Server 20 tick/s；玩家位置 10–15 Hz；非戰鬥區 5–10 Hz；畫面用 Snapshot Interpolation。
- 攻擊、掉落、購買、獎勵使用可靠事件；短暫 Lag 只做插值、有限外推與平滑校正，不做 Fusion 等級完整回滾。
- LAN Discovery 讓學生端自動找到 Lab Node，不要求輸入 IP。

## 4. Unity 版本決策

目前不鎖版本。只考慮正式 LTS，先建立相容性 Spike，再由負責人確認版本：

1. 安裝固定 Mirror release 與 KCP。
2. Windows Client／Headless Server 均可建置。
3. 五個 Client 可經 LAN Discovery 進入同房。
4. 兩個 Additive 房間可隔離玩家與物理。
5. 空房可安全卸載，重連可恢復玩家狀態。

通過後提交 `ProjectSettings/ProjectVersion.txt`、`Packages/manifest.json`、Mirror 版本與建置說明；禁止團隊自行升級 Unity 或 Mirror。

## 5. Git 與 Repository

建立獨立 repo（暫名 `lab-world-unity`），不要放進 `gpt-clone`，也不要複製另外兩個 repo 的內容。三個 repo 只透過 API／資料 Schema 整合。

```text
lab-world-unity/
├─ Assets/                 # Unity 程式與資產
├─ Packages/
├─ ProjectSettings/
├─ wiki/                   # Obsidian 長期知識庫
├─ specs/                  # 可實作、可驗收規格
├─ raw-sources/            # 原始討論／參考資料，只讀
├─ tools/                  # Build、驗證與測試腳本
├─ AGENTS.md
├─ CLAUDE.md
├─ README.md
└─ .gitignore
```

Git 規則：

- `main` 永遠可建置；工作使用 `feature/*`、`fix/*`、`docs/*`。
- Unity 設定為 Visible Meta Files + Force Text。
- 不提交 `Library/`、`Temp/`、`Logs/`、`UserSettings/`、`Builds/`。
- `.psd`、`.blend`、大型 `.fbx/.wav/.mp4` 使用 Git LFS；導入後的必要遊戲資產才進 repo。
- 每次功能提交需同步修改對應 spec 狀態與驗收結果。

## 6. Obsidian Wiki 與 Specs

沿用 `ai-coding-curriculum` 的「Wiki 是長期知識」和 `specs/` 的「工程正典」分層：

```text
wiki/
├─ _index.md
├─ vision/                 # 玩家、產品目標、核心循環
├─ systems/                # 戰鬥、建造、釣魚、房間、外觀、經濟
├─ architecture/           # LAN、Lab Node、Lab Terminal 整合
└─ decisions/              # ADR／重要決策

specs/
├─ _index.md               # 規格列表、狀態、負責人、相依項
├─ mvp/
├─ networking/
├─ data-contracts/
└─ testing/
```

每份 Wiki 使用 `[[雙向連結]]`；每份 Spec 至少包含：目標、In/Out of Scope、依賴、核心規則、驗收條件、Open Questions。修改架構時先新增 Decision，再更新受影響 Wiki／Spec。

## 7. 必建規格列表

| 優先 | 規格 | 內容 |
|---|---|---|
| P0 | MVP 垂直切片 | 移動、五人房、怪物、獎勵、返回大廳 |
| P0 | Mirror 網路 | 權限、同步頻率、房間生命週期、重連 |
| P0 | Lab Terminal Contract | 登入 Token、課程包、獎勵事件、冪等鍵 |
| P0 | Git／Build | Unity 版本、套件鎖定、Client／Server Build |
| P1 | 經濟與消費 | 金幣來源、外觀／房間消耗、防重複結算 |
| P1 | 教學內容管線 | Curriculum → Lab Terminal → Lab Node → Unity |
| P2 | 釣魚／房間／外觀 | MVP 後分階段加入 |

## 8. 討論資料正典摘要

- 目標玩家為小四；不是所有學生都喜歡 Minecraft，需要戰鬥、蒐集、創作、外觀等多種投入方式。
- 世界採多張有明確功能的箱庭地圖，不做無縫開放世界。
- 學生通常五人一組；不同房間不交換即時狀態，空房完全休眠／卸載。
- 教室區網優先，低延遲 PvE 不需要昂貴的雲端 Relay、CCU 或完整回滾預測。
- Lab Terminal 是內容與長期資料來源；Lab Node 是課堂期間的即時權威。
- 課程完成後需保留 5–10 分鐘獎勵消費／展示階段，提高下次上課期待。

完整原始討論應另存於 `raw-sources/discussions/2026-09-17-lab-world-concept.md`，只讀保存；正式決策需轉寫到 `wiki/decisions/`，不可直接以聊天記錄取代規格。

## 9. MVP 驗收

- 全新 clone 後可依 README 建置 Client 與 Headless Server。
- 至少 10 個 Client 分為兩個五人房；彼此不可見、不可碰撞、不可收到對方狀態。
- 最後一人離房後，該房 AI、物理與網路物件停止並卸載。
- Client 無法直接修改 HP、掉落、金幣與背包。
- 斷外網仍可完成一場；恢復後獎勵事件只同步一次。
- Wiki、Spec index、決策記錄與 Git 規則可由 Claude 依 `CLAUDE.md` 維護。

## 10. 待決策

- 正式產品名稱與 repo 名稱。
- Unity LTS／Mirror 固定版本與目標 Client OS。
- Lab Node 硬體、Server OS、每班最大同時人數。
- Lab Terminal API 驗證方式與離線 Token 有效期。
- MVP 是否只做戰鬥，或同時納入建造／外觀消費。
