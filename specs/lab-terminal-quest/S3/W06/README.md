# S3 W06 Lab Terminal Quest｜異域探險：喚醒記憶（W01～W05 總複習）

> 狀態：Runtime 已實作（`S3W06-VALLEY-REVIEW-20260924-r20-ghost-crossing-endless`）；課程 wiki 已於 2026-09-29 同步：[課程規格](../../../../wiki/labterminal-specs/S3/S3-W06-課程規格-Lab-Terminal-Quest.md)、[教案](../../../../wiki/lesson-plans/S3/S3-W06-教案.md)、[學習單](../../../../wiki/worksheets/S3/S3-W06-學習單.md)。

## 1. 唯一來源與範圍

| 項目 | 正典 |
|---|---|
| 題目、答案、NPC 對白、問答題、終章紀念圖 | `../gpt-clone/src/config/s3w06W05Content.ts` |
| 地圖錨點、金幣、場景投影 | `../gpt-clone/src/config/s3w06QuestData.ts`（只借地圖層，內容鏈不再使用） |
| Phaser／React 實作 | `../gpt-clone/src/components/phaser/S3W05Quest.tsx`（與 W05 共用，`contentOverride` 分流） |
| 問答審核 | `../gpt-clone/src/pages/api/s3w06-review-ask.ts` |
| 家長成果頁 | `../gpt-clone/src/components/s3w06/`、`/courses/S3/W06/result` |
| 最終 Runtime 驗收 | `../gpt-clone/docs/S3W06-CANONICAL-RELEASE.md` |
| 內容驗證 | gpt-clone `npm run test:s3w06-content` |

本資料夾不複製題幹或答案；修改題目只改 Runtime 機讀來源。

## 2. 目前設計摘要

- 四站：星門遺跡（W02）→ 午夜車站（W03）→ 顛倒博物館（W04）→ 溪谷鎮（總結）。
- 每站 6 題選擇題（共 24 題），答完才解鎖本站互動點。
- 前三站各 1 題問答：學生到 Lab Terminal 問，把 AI 完整回答貼回，gpt-5.4 審核通過才完成。
- 終章：學生自己打圖片指令（禁止貼上），到 Lab Image 生成「我的 AI 冒險紀念圖」，上傳後放進家長成果頁。
- 三個加碼小遊戲：蜂鳥飛行、幽靈過鐵軌、策展人的鑑定台。

## 3. 交接與設計紀錄（`handoff/`）

2026-09-23～24 從 gpt-clone `docs/handoff/` 移入，屬過程文件；與上方正典衝突時以正典為準。

- `S3W06題目協作.md`、`S3W06題目設計建議-小四AI使用邏輯.md`：題目設計協作稿
- `S3W06美術規格書-codex.md`：場景美術規格
- `S3W06開場傳送門規格書-codex.md`、`S3W06開場時門規格書-v2-codex.md`：開場動畫規格
