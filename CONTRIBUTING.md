# 協作與版控指南（CONTRIBUTING）

> 這個 repo 是課程知識庫，內容幾乎全是 Markdown。目標：**每次改動都留痕、可審查、不打架**，並守住 [`CLAUDE.md`](CLAUDE.md) 的規則與 cascade 連動。

## 0. 環境（每人第一次）
1. **不要放在 OneDrive/iCloud 同步資料夾**（會弄壞 `.git`）。
2. 裝 [Git](https://git-scm.com/) 與 [Git LFS](https://git-lfs.com/)：`git lfs install`（一次即可）。
3. `git clone <repo 網址>` 到本機非同步位置。
4. 用 Obsidian「Open folder as vault」打開這個資料夾。
5. **非工程夥伴**：在 Obsidian 裝 **Obsidian Git** 社群外掛 → 設定自動 pull、每 10 分鐘自動 commit、手動 push。這樣不用碰指令列也能版控。

## 1. 分支策略（簡單為主）
- `main`＝**永遠可用的正典**，**受保護、禁止直接 push**。
- 改動一律開分支：`git switch -c <類型>/<簡述>`
  - 例：`lesson/s2-w03-字數控制`、`spec/繪本-換批上限`、`fix/連結修正`
- 改完 → push 分支 → 開 **Pull Request** → **至少一人審核** → 合併進 `main`。

## 2. Commit 訊息慣例
格式：`類型(範圍): 摘要`
- 類型：`lesson`（教案）/`worksheet`（學習單）/`spec`（規格）/`skill`（設計準則）/`rule`（CLAUDE.md）/`fix`/`docs`
- 例：
  - `lesson(S2-W03): 新增字數控制五案`
  - `spec(繪本): 換批上限改為 3 次`
  - `rule(§22): 新增 motor_practice 動作類型`
- 一個 commit 做一件事；訊息寫「為什麼」比「改了什麼」更重要。

## 3. PR 審查清單（對照 CLAUDE.md）
合併前，審核者逐項確認：
- [ ] **cascade 連動完整**：改了高層（學期主題/模組/工具）有往下傳；改了低層有往上確認一致（CLAUDE.md 第四節）。
- [ ] **正典/成品即真相**：與已上線成品衝突處，以成品為準並回填；推得值標「推定」、難度手感標「假設待實玩校準」。
- [ ] **In/Out of Scope**：沒把別週/別課的內容吸進來。
- [ ] **`wiki/_index.md` 更新記錄**：有新增/大改就補一行日期與摘要。
- [ ] **雙向連結**：新頁的 `[[連結]]` 指向存在的頁面。
- [ ] **工具政策（第十四節）**：只用 Lab 系列/允許清單。

## 4. 大型檔案
- `.pdf/.docx/.png/...` 由 **Git LFS** 追蹤（見 `.gitattributes`），不要塞進一般 commit。
- 純文字（`.md/.py/.html/.json`）走一般 Git。

## 5. 衝突處理
- Markdown 衝突就是純文字衝突，開檔手動選段落即可。
- 每次開工先 `git pull`（或 Obsidian Git 自動 pull），減少衝突。

## 6. 不要做的事
- ❌ 直接 push 到 `main`（走 PR）。
- ❌ 把 repo 放進 OneDrive/iCloud。
- ❌ 改 `raw-sources/`（唯讀原始文件）。
- ❌ 把密鑰/密碼寫進任何檔案（repo 可能公開/多人）。
