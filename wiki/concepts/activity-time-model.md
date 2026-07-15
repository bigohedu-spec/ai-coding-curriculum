# 活動耗時估算模型｜動作級時間估算

## 定義

把任何教學活動拆成「原子動作 × 年級」來估算所需秒數，用以**量化判斷教案 / 學習單 / Lab Terminal 互動課程的內容是太長還是太短**。這是 [[CLAUDE.md 第十八節 ECT]]（任務級、以分鐘、Copilot 取向）的細粒度補充，規則正式定義於 CLAUDE.md 第二十二節，計算引擎為 skill `activity-time-estimator`。

---

## 年級係數

```
f = (年級 + 1) / 2
```

| 年級 | 一 | 二 | 三 | 四 | 五 | 六 |
|------|----|----|----|----|----|----|
| f | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 |

速度隨 f 變快（時間 ÷ f）；單則指令閱讀字數上限隨 f 變大（× f）。

---

## 三個原語（使用者校準，基準＝一年級）

| 動作 | 計量 | 一年級 | 三年級 | 五年級 | 公式 |
|------|------|--------|--------|--------|------|
| 打字 type | 每字 | 8 秒 | 4 | 2.67 | 8 / f |
| 找元件並點擊 click | 每次 | 8 秒 | 4 | 2.67 | 8 / f |
| 閱讀 read | 每字 | 2 秒 | 1 | 0.67 | 2 / f（打字 1/4） |

**單則指令閱讀上限 = 10 × f 字**（一年級 10、三年級 20、五年級 30）。超過 → 拆成多則或改用圖示/互動。

---

## 衍生與固定動作

| 動作 | 秒數 | 類型 |
|------|------|------|
| 拖拉 drag | 16 / f | 隨年級（找來源 + 找目標 ≈ 2 點擊） |
| Minecraft 移動 mc_navigate | 16 / f | 隨年級（3D 世界尋找/移動） |
| Minecraft 操作 mc_action | 8 / f | 隨年級（挖/放/合成單步） |
| 馬達練習 motor_practice | 25 / f | 隨年級（初學者移動+對準+點擊+重置，含失誤重試；P1–P2 滑鼠/鍵盤週用，勿用 click） |
| 選擇題 select | (讀選項字數×2 + 8) / f | 隨年級（讀選項 + 1 點擊） |
| 截圖 screenshot | 10 | 固定 |
| 舉手告知老師 tell_teacher | 30 | 固定（含等待） |
| 老師驗收 teacher_confirm | 20 | 固定 |
| 思考/決策 think | 15 | 固定（可調） |
| 換頁/動畫 transition | 2 | 固定 |

> 固定動作的設計假設：物理/教室動作與認知停頓主要受教室流程而非打字速度影響，故與年級無關，必要時逐項覆寫。

---

## 判定

合計秒數 → 分鐘，對照目標區間（預設主線 **50–65 分鐘**，與第十八節一致）：

- 低於下限 → **太短**（加大任務 / 增加 repetition / 加 Step Flow 步驟）
- 高於上限 → **太長**（拆到下週 / 標進階可選）
- 區間內 → **剛好**

---

## 如何使用（skill）

計算引擎：`skills/activity-time-estimator/scripts/ect_estimator.py`

```
python3 skills/activity-time-estimator/scripts/ect_estimator.py <spec.json>
python3 skills/activity-time-estimator/scripts/ect_estimator.py --grade 5 --type 40 --read 30 --click 10
```

spec 與動作目錄見 skill 內 `examples/` 與 `reference/action-catalog.md`，索引見 [[llm-skills]]。

---

## 相關概念

- [[llm-skills]]（skill 索引：estimator 與 labterminal-course-spec 的串接）
- [[gamification-system]]（時間 vs 金幣：本模型管時間，金幣固定 250 見 CLAUDE.md 第二十一節）
- CLAUDE.md 第十八節（任務級 ECT）、第十九節（低年級文字上限）、第二十節（Web App 互動規範）

---

> 最後修改：2026-06-24，原因：新增活動耗時估算模型概念頁，對應 CLAUDE.md 第二十二節與 activity-time-estimator skill
