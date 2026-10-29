# 成果頁的形式、入口與資料

> 可信度標記見 `../SKILL.md`。檔案路徑都在 gpt-clone repo。

## 1. 有哪幾種「成果」頁面

| 種類 | 對象 | 形式 | 位置／入口 | 登入 |
|------|------|------|-----------|------|
| **靜態 recap（slide deck）** | 家長 | 單一 HTML，整頁滑動（`scroll-snap`，一頁一畫面），可列印、可分享 | `public/games/p1u-arc3-recap.html?uid=`（小熊麵包坊）、`p1u-arc2-recap.html`（字母要塞）、`s2-w06-recap.html`（S2 秘笈）、`recap.html`（P1U Arc 1 W06「成果發表」，**寫死 p1uw01..p1uw06，不可給別系列用**） | 不用 |
| **S3 W06 紀念頁** | 學生／家長 | React 頁；學生版需登入，家長版 `/courses/S3/W06/parent?uid=`，另有 token 分享頁 `/showcase/s3w06/[token]` | `src/pages/courses/S3/W06/`、`src/pages/showcase/s3w06/`、`src/components/s3w06/` | 學生版要；家長版與 token 頁不用 |
| **家長作品頁** | 家長 | 把學生做過的作品排成卡片（新到舊，沒點開過的顯示 NEW） | `/profile/works?uid=`（學生自己登入看是 `/profile/works`），`ParentWorkGallery.tsx`／`WorkGallery.tsx` | 分享模式不用 |
| **老師全班進度頁** | 老師 | 全班每位學生的週次、任務、卡關次數；可匯出 CSV | `public/games/p1u-arc3-links.html`（選班級） | 老師帳號 |
| **課後複習頁** | 學生 | W18 打完 → 複習 → 成果頁的中間站 | `public/games/p1u-arc3-review.html?uid=` | 經遊戲導入 |

> 老師全班進度頁與成果頁讀**同一份** `prog`；但成果頁 session 沒有實際打開過進度頁，不知道它受不受「舊紀錄缺欄位」影響【未驗證】。

## 2. 從作品頁怎麼連到成果頁

- 目錄在 `src/data/lessonCatalog.ts`：每個課程完成鍵（例 `game:p1uw18`）有 `kind`（`score`／`page`／`book`…）、`entry`（學習單進入網址）、`view(uid)`（成果頁網址）、`skills`（這堂學會的技能，固定文字）、`cover`（固定縮圖：成果頁沒有學生自己的圖可用時，作品卡片顯示這張）。
- `kind:"page"` 的項目在作品頁卡片上顯示「成果頁」，按鈕「打開作品」連到 `view(uid)`。
- 作品頁怎麼拼出來：`src/lib/studentWorks.ts` 把完成紀錄（`users/{uid}/progress/lessons`，很薄）與各處的成品（繪本、`gameProgress/{uid}[gameKey]`）跨 collection 拼起來；**只讀、不寫**。封面／立繪是 data URL，一件作品只取一張縮圖（一個班 30 人會吃光瀏覽器記憶體）。
- **從分享連結（`?uid=`）進來的家長不能被導去學生登入頁**：`public/games/parent-back.js` 在分享模式把「回學習單」改成「回作品頁」（用 capture 階段攔截，連 `onclick="location.href='/worksheets'"` 也攔得到）。新成果頁要載入它，並讓「回學習單」的按鈕走 `/worksheets`。

## 3. 分享與隱私：兩種模式

| 模式 | 做法 | 安全性 |
|------|------|--------|
| **`?uid=`（現行，幾乎所有成果頁）** | 網址帶學生 uid，頁面直接用 Firebase compat SDK 讀 Firestore（前端公開設定），沒有後端 API | **任何拿到網址的人都看得到**；Firestore 規則目前讀寫全開、沒有 Firebase Auth，這不是單一頁造成的，要收緊得整站一起處理【文件：程式註解】 |
| **不透明 token（S3 W06 的做法）** | 學生按「分享」→ 產生 24 位元組隨機 token（URL-safe base64）；Firestore 只存 **SHA-256 雜湊**；連結 30 天到期；可撤銷；頁面 `noindex,nofollow`；快照 `schemaVersion` 控制舊格式 | 比 `?uid=` 安全，仍受限於規則全開【程式】 |

- 新做的成果頁預設沿用 `?uid=` 以保持一致，但**內容不要比現有更敏感**（不放真實全名、學校、照片以外的個資）。
- 想做私密分享：用 token 模式，記得一併做**撤銷**與**到期**的畫面（已撤銷、已到期、找不到各一種文案）。
- 文件／PR／截圖裡不要貼學生 uid 或存檔內容。

## 4. 資料從哪來（以小熊麵包坊為例）

- **讀取**：頁面用 `?uid=` 讀 `gameProgress/{uid}`：
  - `["hc-pilot"].prog`：遊戲的進度摘要＋每週紀錄（每週過關那一刻由遊戲 `recordWeek(w)` 記一筆；次數類欄位是「這一週的」，用上一週累計值相減）；
  - `["hc-pilot"].coins`：平台金幣（過關週數 × 15）；
  - 文件最上層 `name`：學生名字。
- **寫入**：`src/pages/play/hc-pilot.tsx` 每次存檔把 `prog` 攤到最上層；型別與每週紀錄欄位在 `src/lib/hcPilotProgress.ts`（`HcProg`、`HcWeekRec`）。
- **欄位分兩批**：
  - 一直都有：`sec`、`days`、`earn`、`shop`、`sickle`、`staff`、`bots`、`ai[]`、`wo`、`fail`、`teach`、`cum`；
  - 2026-10-21／22 起才有：`blocked`、`made`、`flow`（每位員工排的步驟卡）、`routes`（每隻機器人搬什麼、放哪）、`cum.blocked`、`cum.mk`。在這之前過關的週沒有這些欄位。

## 5. 缺欄位的補齊規則【實做；程式註解標【推估】】

畫面上直接顯示數字，**不加「約」**（負責人 2026-10-28）。

| 缺什麼 | 補法 |
|--------|------|
| 秒數不到 2 分鐘 | 當作沒量到，用其他週平均；全部沒有用 40 分鐘（現在畫面不顯示時間，推估仍在算） |
| 金幣是 0 | 用其他週平均 |
| 沒有 `made`，或全是 0 | 用那週賺的金幣平均分給那週賣得到的商品，再除以售價（售價要跟遊戲設定檔同步）。**準確度沒有對照真實計數驗證，只確定不會出現 0 和 NaN** |
| 整週沒有紀錄，但後面的週過關了（跳關、補進度） | 算過關 |
| 客人等補貨（`blocked`）沒有 | 不顯示那一格，不猜 |
| 排錯、做壞、請老師 | 取「最新一週累計值」與「每週加總」較大的那個 |
| 流程（`flow`）沒有 | 用「在工作的員工」對回正確順序（在工作＝順序排對了） |
| 流程記到的人比在工作的員工少 | 沒記到的員工也用正確順序補上 |

**每一格都要有數字的做法**：數字是 0 的格子整格不放；數字一律經過「轉數字＋非有限數當 0」的格式化；有存檔但一週都沒過 → 「先過第一週再回來看」。

## 6. 新增一個成果頁的步驟

1. 確定成果要讀的存檔欄位；遊戲端沒有就先請遊戲端記（過關那一刻記，附 `recordWeek`／同等機制）。
2. 在 `lessonCatalog.ts` 加 `view(uid)` 與 `skills`，`kind:"page"`。
3. 做頁面：載入 `/courses/bpmf.css`（注音字型）、`parent-back.js`；`?uid=` 缺少時顯示「這個連結少了一個代號」，不要白畫面。
4. 補齊規則寫成純函式並加測試情境（見 `verification-and-restyle.md`）。
5. 作品頁卡片能點進來；列印版與手機版驗過。
6. 更新 wiki：學程首頁、`implementation-status.md`。
