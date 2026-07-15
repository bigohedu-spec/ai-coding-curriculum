# MCS Quest Mod｜Minecraft 生存入門 任務 Mod 開發規格

> 給工程 LLM／開發者的建置文本。**本檔只定義規格，不含實作程式碼。**
> 目標：把 [[MCS-模組總覽]] 的 L01–L04 四堂任務寫進一個 Minecraft mod，讓遊戲**自動發任務、在遊戲內引導、自動偵測完成、自動發獎勵**，達成「老師不用引導」。
> ⚠️ 版本假設（請確認）：**Fabric Loader + Fabric API，Minecraft 1.21.x，Java 21**。Forge / NeoForge 對應見 §10。

---

## 0. 建置摘要（先讀這段）

- **是什麼**：一個以資料驅動（data-driven）的任務 mod，四堂課 = 四個 Quest，全部**伺服器端權威偵測**（single-player 與專用伺服器皆支援）。
- **為什麼**：現行驗收是「截圖 + 舉手告知老師」（CLAUDE.md 第十節），需要老師引導與人工驗收。本 mod 把引導與驗收搬進遊戲，對應第九節 task-schema 預留的 `evidence_type: "in_game"`。
- **四大子系統**：`QuestManager`（載入/推進任務）、`DetectionEngine`（事件 + 週期掃描偵測）、`ProgressStore`（每玩家進度持久化）、`GuidanceUI`（任務書 + BossBar + Toast + 座標 HUD）、`RewardService`（金幣整合）、`AdminCommands`（老師端）。
- **關鍵挑戰**：L02「蓋封閉房」與 L03「用座標」無法用現成 advancement 偵測，本規格 §4 給出**具體偵測演算法**（flood-fill 封閉判定、往返行程判定）。

---

## 1. 範圍與對應

| Quest | 對應課次 | 任務 | 主線金幣 | 偵測難度 |
|-------|---------|------|---------|---------|
| Q1 採集與合成 | [[MCS-L01-採集與合成-教案]] | A 工作台+木工具 / B 石工具+熔爐 | 150 / 100 | 低（合成事件） |
| Q2 生存建築 | [[MCS-L02-生存建築-教案]] | A 封閉小屋過夜 / B 照明+床 | 150 / 100 | 高（封閉判定） |
| Q3 座標導航 | [[MCS-L03-座標導航-教案]] | A 記家座標+開座標HUD / B 遠離再返回 | 150 / 100 | 中（往返判定） |
| Q4 探險與回家 | [[MCS-L04-探險與回家-教案]] | A 到新生態域+戰利品 / B 靠座標回家 | 150 / 100 | 中（生態/結構+往返） |

- 進度門檻：Q1 → Q2 → Q3 → Q4 依序解鎖（Q3 的「家座標」是 Q4 回家判定的前置）。
- TA（助教）為社交行為，不由 mod 偵測；mod 只發主線金幣（見 §7）。

---

## 2. 架構總覽

```
玩家事件（挖/放/合成/移動/進生態域…）
        │
        ▼
  DetectionEngine ──(事件式 + 每 N tick 掃描)── 判定 checkpoint 是否達成
        │ 達成
        ▼
   ProgressStore（依 UUID 記錄 completed_checkpoints / coins）
        │
        ├──▶ RewardService  → 發金幣（橋接金幣外掛 / 內建 scoreboard）
        └──▶ GuidanceUI     → Toast/音效/Title + 更新任務書與 BossBar
```

- **權威端**：伺服器（single-player 內含整合伺服器）。所有判定在 server tick 完成，避免作弊。
- **客戶端**：僅負責顯示（任務書 GUI、座標 HUD、BossBar、Toast）與少數輸入（開關座標 HUD、設家的按鍵）。以自訂封包同步狀態。
- **資料驅動**：任務定義放 `data/mcs/quests/*.json`，改任務不必改程式。

---

## 3. 資料模型（沿用第九節 task-schema，擴充 in_game 偵測）

### 3.1 Quest / Checkpoint JSON（擴充欄位以粗體標示）

```json
{
  "task_id": "MCS-L01-A",
  "name": "採集與合成：工作台與木工具",
  "type": "MC",
  "module": "MCS",
  "points": 150,
  "requires": [],                         // 前置 task_id（門檻）
  "checkpoints": [
    {
      "id": "MCS-L01-A-C1",
      "description": "做出工作台",
      "evidence_type": "in_game",         // ← 對應第九節預留類型
      "detection": {                       // ← 本規格新增：機器可判定規則
        "type": "item_crafted",
        "items": ["minecraft:crafting_table"],
        "count": 1
      },
      "evaluation_criteria": "玩家合成出工作台（以合成事件為準，非 /give）",
      "points": 60
    }
  ],
  "skill_tags": ["minecraft-basics", "minecraft-crafting"],
  "unlocks_quiz_tags": ["mc-crafting-basic"]
}
```

### 3.2 偵測規則型別（`detection.type` 列舉）

| type | 參數 | 判定 |
|------|------|------|
| `item_crafted` | `items[]`, `count`, `distinct?` | 由合成結果事件累計（**非**背包持有，防 /give） |
| `item_obtained` | `items[]`, `count` | 取得（拾取/合成皆算），用於戰利品 |
| `block_placed_count` | `blocks[]`, `count` | 玩家「自己放置」的方塊數（追蹤 place 事件） |
| `advancement` | `id` | 綁定原生/自訂 advancement 觸發 |
| `shelter_enclosed` | 見 §4-Q2 | flood-fill 封閉判定 |
| `home_set` | `method` | 記錄家座標（設家機制） |
| `hud_coord_opened` | – | 座標 HUD 曾被開啟 |
| `round_trip` | `min_out`, `return_radius`, `anti_teleport` | 遠離家 ≥min_out 後返回 ≤return_radius |
| `biome_changed` | `exclude_home_biome` | 進入與家不同的生態域 |
| `structure_entered` | `structures[]` | 進入村莊/其他結構 |
| `distance_from_home` | `min` | 目前離家水平距離 ≥ min |

複合條件用 `"all": [ … ]` / `"any": [ … ]` 包裝多個 detection。

### 3.3 每玩家進度（沿用第九節 Progress Record，持久化）

```json
{
  "player_uuid": "…",
  "completed_tasks": ["MCS-L01-A"],
  "completed_checkpoints": ["MCS-L01-A-C1"],
  "home": { "x": 100, "y": 64, "z": 200, "dim": "minecraft:overworld" },
  "coins": 150,
  "flags": { "hud_coord_opened": true }
}
```

- 儲存：`PersistentState`（世界層級，Map<UUID, Record>）或每世界 JSON。跨場景以 UUID 為鍵，共用世界不互相污染。

---

## 4. 逐堂偵測規格（核心）

> 全部 `evidence_type: "in_game"`。每個 checkpoint 給：偵測規則、參數、邊界情況。

### Q1 採集與合成（事件式，最單純）
- **A-C1 工作台**：`item_crafted {minecraft:crafting_table} ×1`
- **A-C2 木工具**：`item_crafted distinct {wooden_pickaxe, wooden_axe, wooden_sword, wooden_shovel} ≥3`
- **B-C1 石工具**：`item_crafted any {stone_pickaxe, stone_axe, stone_sword, stone_shovel} ≥1`
- **B-C2 熔爐**：`item_crafted {minecraft:furnace} ×1`
- **邊界**：以「合成結果事件」計數（Fabric：監聽 crafting result 取出），避免 creative /give 直接過關。

### Q2 生存建築（flood-fill 封閉判定，最難）
**目標語意**：玩家在夜晚待在一個「自己蓋的、封閉、有門、有頂」的空間裡。

**A-C1 封閉小屋 `shelter_enclosed`** 演算法：
1. 觸發時機：夜晚（`!isDay`）且每 N=40 tick 掃描一次，玩家腳下方塊為空氣時啟動。
2. 從玩家腳下空氣格做 **BFS flood-fill**，只擴散「可通行格」（空氣/非固體透明方塊），半徑上限 `R=12`。
3. **封閉判定**：flood-fill 過程中
   - 若任一格 `canSeeSky()==true` → **不封閉（有洞/沒屋頂）**，失敗。
   - 若 BFS 在到達邊界固體前先撞到 `R` 上限 → 空間過大，失敗（避免把整個地表當室內）。
   - 全部可通行格都被固體包圍且無天空 → **封閉**。
4. **「自己蓋的」判定**（區分天然洞穴）：封閉邊界方塊中，`block_placed_count`（玩家放置紀錄）≥ `min_player_placed=12`，**或** 邊界含 `minecraft:*_door` 至少 1（洞穴通常沒有門）。
5. **室內合理體積**：可通行格數 `min_volume=8 ≤ V ≤ max_volume=200`。
6. 玩家需在此封閉區內、且維持到 `survive_ticks=100`（撐過一小段夜晚）→ C1 達成。
- 參數：`R=12, min_volume=8, max_volume=200, require_door=true, min_player_placed=12, survive_ticks=100`。
- **邊界**：天然洞穴（無門、放置方塊少）不過關；露天圍牆（有天空）不過關；門沒關也算未封閉（門為空氣通道則 flood-fill 會漏到天空→失敗，符合「要關門」語意）。

**B-C1 照明 + 睡眠處**：`all [ 區內光照 ≥7 或 含 torch/lantern ; 區內含 minecraft:*_bed 或 任一 chest ]`
- 以 A 判定出的封閉區格集合為範圍掃描。

### Q3 座標導航（往返判定 = 用座標的功能代理）
> F3 是客戶端除錯畫面、伺服器看不到。改用 mod 內建**永遠可開的座標 HUD** 取代 F3 依賴，並用「遠離後返回」作為「會用座標找路」的可偵測代理。

- **A-C1 開座標 HUD**：`hud_coord_opened`（客戶端首次開啟座標 HUD 時送封包記 flag）。
- **A-C2 設定家座標 `home_set`**：玩家用「設家」按鍵/自訂物品（如「座標羅盤」）或睡過一次床時，記錄目前 XYZ 為 `home`。
- **B-C1 往返 `round_trip`**：以 `home` 為基準，`min_out=50`（水平距離先到 ≥50 格），再 `return_radius=6`（回到離家 ≤6 格）→ 達成。
  - `anti_teleport=true`：偵測到 `/tp`、指令傳送、末影珍珠瞬移造成的座標跳變（單 tick 位移 > 8 格）則不累計該段行程，需靠實際移動。
- **邊界**：沒設家不能進 B（門檻）；把「用座標」定義為「離開再靠位置資訊回來」，功能上驗證了目的。

### Q4 探險與回家（生態/結構 + 往返）
- **A-C1 抵達新地點**：`all [ distance_from_home ≥ 80 ; any [ biome_changed(exclude_home_biome=true) ; structure_entered {minecraft:village} ] ]`
- **A-C2 當地戰利品**：`item_obtained any {依生態域的代表物，如 sand, snowball, kelp, cactus, emerald(村莊交易) …}`（給一組 loot set，取得任一）。
- **B-C1 回家**：`round_trip(min_out=80, return_radius=6, anti_teleport=true)`（沿用 Q3 機制，門檻需 Q3 已完成、已有 home）。
- **邊界**：探險距離門檻 80 格與 Q3 的 50 格區別開；回家判定同樣防瞬移。

---

## 5. 進度與獎勵

- **門檻**：`requires` 串成 Q1→Q2→Q3→Q4；任務書對未解鎖 Quest 顯示鎖頭與解鎖條件。每堂 A、B 可並行，B 若依賴 A（如 Q2-B 需 A 的封閉區）則 A 為前置。
- **金幣**：每個 checkpoint 達成即時發對應 `points`；每堂主線合計 **250**（A150/B100），對應第二十一節。進階挑戰不寫入 mod（不佔 250）。
- **完成儀式**：checkpoint → Toast + 音效；整堂完成 → Title「你完成了 ____！」＋金幣結算動畫。

---

## 6. 引導 UI（取代老師引導的關鍵）

- **任務書（Quest Book）**：給每位玩家一本自訂書（或 `/mcs book`）。內容 = 當前 Quest 的目標 + **逐步操作引導文字**（把原教案「老師示範」的內容搬進來，繁體中文），例如 Q1：「① 對著樹按住左鍵砍木頭 → ② 按 E 打開背包把原木變木板 → ③ 用木板做工作台…」。
- **BossBar / ActionBar**：常駐顯示當前目標與進度（例：「木製工具 2/3」「離家 34/50 格」）。
- **座標 HUD**：常駐可開關（Q3 用），顯示 XYZ 與離家距離，取代 F3。
- **卡關提示**：某 checkpoint 超過 `stuck_minutes=8` 無進度 → 任務書跳出「試著問 Lab Terminal：___」的 AI 優先提示（呼應第八節 ai-first）。
- **語言**：全繁體中文，字串放 `lang/zh_tw.json`，可翻譯。

---

## 7. 金幣整合（RewardService）

- 定義介面 `RewardService.grant(playerUuid, points, sourceCheckpointId)`。
- **主要**：橋接你們現有「金幣外掛 / Lab Terminal 點數」——採 (a) 指令橋（呼叫外掛指令）或 (b) 共用 scoreboard 目標，二擇一由整合方決定。規格提供 adapter 介面，不綁死。
- **後備**：mod 內建 scoreboard `mcs_coins`，並可 `/mcs export` 匯出符合第九節 Progress Record 的 JSON，供大任務系統整合。

---

## 8. 老師端（可視化，不需引導）

- `/mcs status <player>`：列出該生已完成 checkpoint 與金幣。
- `/mcs class`：全班進度總覽（每人各 Quest 完成度）。
- `/mcs reset <player> [quest]`：重置。
- `/mcs export`：匯出全班進度 JSON（對接 §9 系統）。
- 定位：老師從「引導者」變「觀察者」，只在安全或極端卡關時介入（呼應翻轉教育）。

---

## 9. 防作弊 / 邊界情況（彙整）

- **/give、creative**：合成類一律以「合成事件」計，不看背包持有。
- **天然洞穴冒充蓋房**：封閉判定要求玩家放置方塊數或門（§4-Q2）。
- **瞬移刷往返**：`anti_teleport` 忽略單 tick 大位移的行程累計。
- **共用世界**：進度依 UUID 分離。
- **重複領獎**：checkpoint 完成後標記，不重複發金幣。
- **掛機/離線**：偵測只在玩家在線且在對應維度時進行。

---

## 10. 技術實作註記（版本 / Loader）

- **Fabric 1.21.x（主）**：
  - 事件：`ServerTickEvents.END_SERVER_TICK`（週期掃描：封閉、往返、生態）、合成結果監聽、`PlayerBlockBreakEvents` / 放置追蹤、`ServerEntityEvents`、`ServerPlayerEvents.AFTER_RESPAWN`。
  - 封包：自訂 payload 同步任務書/HUD/BossBar（`PayloadTypeRegistry` + `ClientPlayNetworking`）。
  - 資料：`data/mcs/quests/*.json` 以自訂 reloadable resource 或 config 載入。
  - 持久化：`PersistentState`（世界 saved data）。
- **Forge / NeoForge（備選）**：事件改用 `@SubscribeEvent`（`PlayerTickEvent`、`BlockEvent.EntityPlaceEvent`、`PlayerEvent.ItemCraftedEvent`、`LevelTickEvent`）；封包用 `SimpleChannel`（Forge）/ NeoForge payload；持久化用 `SavedData`。設計層（§3–§9）完全共用，只換 API 綁定。
- **建置**：Gradle + (Fabric) Loom；Java 21；`fabric.mod.json` / `mods.toml` 宣告進入點與相依（Fabric API）。
- **Mixin**：僅在需要攔截原生行為（如客戶端座標 HUD 疊加）時使用，其餘走官方事件。

---

## 11. 交付物清單（開發者要產出的東西；本規格不含實作）

- 主 mod 進入點 + `fabric.mod.json`。
- `data/mcs/quests/`：MCS-L01-A/B … L04-A/B 共 8 個 checkpoint 群的 JSON。
- `DetectionEngine`：§3.2 各 `detection.type` 的判定器（重點：`shelter_enclosed`、`round_trip`）。
- `ProgressStore` / `RewardService`（含 adapter）/ `GuidanceUI`（任務書、BossBar、座標 HUD、Toast）/ `AdminCommands`。
- `lang/zh_tw.json` 全中文字串。

---

## 12. 驗收清單（開發完成後逐項測）

- [ ] Q1：合成工作台/木工具/石工具/熔爐正確觸發；/give 不過關。
- [ ] Q2：自建封閉小屋（有門、有頂、夜晚待滿）過關；**天然洞穴不過關**；露天圍牆不過關。
- [ ] Q2-B：室內有火把+床/箱才過。
- [ ] Q3：開座標 HUD + 設家 + 遠離 50 再回來過關；**/tp 瞬移不算**行程。
- [ ] Q4：到不同生態域/村莊 + 取得戰利品 + 靠座標回家；距離門檻正確。
- [ ] 金幣每堂合計 250；重複不重發。
- [ ] 任務書 + BossBar 能讓學生**在沒有老師引導**下完成全部四堂。
- [ ] 進度依 UUID 持久化；`/mcs export` 產出符合第九節的 JSON。

---

## 13. 連結與連動提醒

- 對應模組：[[MCS-模組總覽]]（L01–L04）
- Schema 依據：[[task-schema]]（`evidence_type: in_game`）、[[gamification-system]]（金幣）、[[lab-terminal]]（點數/求助）
- 設計依據：[[activity-time-model]]（各堂時長已驗）、[[flipped-education]]（老師轉觀察者）

> ⚠️ **Cascade 提醒（需更新 CLAUDE.md 第十節）**：本 mod 導入 `in_game` **自動偵測**驗收，超出第十節現行「截圖 + 舉手告知老師」模型——這正是第十節與第九節預告的「未來：系統自動判定」。導入後，第十節「驗收模型」應新增一層「in_game 自動偵測（mod/plugin 回報）」，並放寬「不得依賴自動偵測」的限制（限本 mod 覆蓋的任務）。本檔僅為規格，未改第十節。

> 最後修改：2026-06-24，原因：新建 MCS Quest Mod 開發規格（Fabric 1.21.x 為主），四堂全自動偵測，含封閉判定與往返判定演算法；沿用第九節 task-schema 的 in_game 類型
