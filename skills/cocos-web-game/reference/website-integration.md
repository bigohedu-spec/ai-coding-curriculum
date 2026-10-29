# 怎麼掛進網站（gpt-clone）

> 對象：要把一款 Cocos 遊戲接上學習網站的人。**協定與邊界的「規定」在正典 §4、§5**，本檔講「網站端到底要有哪些東西、各在哪個檔、資料存哪裡、哪些步驟最常漏」。
> 範本一律是 hc-pilot：外層頁面 `gpt-clone/src/pages/play/hc-pilot.tsx`（288 行）。可信度標記見 `../SKILL.md`。

## 1. 全貌：誰負責什麼

```
學生瀏覽器
 └─ /play/<game-id>                 ← Next.js 外層頁面（React）：登入、進課動畫、載入 iframe、讀寫存檔、記完成、發金幣
     └─ <iframe src=/games/cocos/<game-id>/index.html>   ← 遊戲（Cocos 建置產物，同源）
          ⇅ postMessage（lt-game/1）
Firestore
 ├─ gameProgress/{uid}.<gameId>     ← 存檔（遊戲定義內容，網站原樣存）＋攤到最上層的摘要
 ├─ users/{uid}/progress/lessons    ← 課程完成紀錄 game:<…>
 ├─ coins（用 creditGameCoins，交易 id 冪等）
 └─ worksheets/{id}                 ← 學習單卡片（學生從這裡進到 /play/<game-id>）
```

**鐵則 C**：Cocos 擁有「這一局」，React 擁有其他一切。遊戲不碰 Firebase、不呼叫 `/api/*`（hc-pilot 有暫時偏離，見第 8 節）、不用 localStorage 當存檔。

## 2. 網站端必備清單（新遊戲）

| # | 要做的事 | 在哪 | hc-pilot 的做法 |
|---|---------|------|----------------|
| 1 | 建置產物放進 `public/games/cocos/<game-id>/`（含 `game.manifest.json`） | gpt-clone | `build-web.ps1 -GptClone` 的 robocopy 鏡像 |
| 2 | 協定型別 | `src/types/ltGameProtocol.ts`（**唯一來源**） | Cocos 端 `assets/scripts/platform/protocol.ts` 由 `node scripts/sync-protocol.mjs [gpt-clone 路徑]` 逐字複製，不手改 |
| 3 | 外層頁面 `src/pages/play/<game-id>.tsx` | gpt-clone | 複製 `hc-pilot.tsx` 再改 `GAME_ID`、`GAME_SRC`（見第 3 節） |
| 4 | 存檔欄位 | Firestore `gameProgress/{uid}.<gameId>` | 值＝`{ version, state, savedAt, …摘要 }`；`state` 網站不解讀 |
| 5 | 課程完成鍵與目錄 | `src/data/lessonCatalog.ts` | 例：`game:p1uw13…p1uw18`（每週一個）、`game:p1uw18` 掛 `view`（成果頁）、`skills`（學到什麼） |
| 6 | 學習單卡片（Firestore 文件） | `worksheets/ws_…`，由 `scripts/create-*-worksheet.mjs` 建 | 見第 5 節 |
| 7 | 進課動畫（若有） | `src/components/lessonEntry/lessons/…` ＋ `lessons/index.ts` 登記 ＋ `entryPick.ts` 依存檔選週 | `/play/hc-pilot` 載入前依存檔判斷第幾週並播動畫 |
| 8 | 後台「重做」入口（**只有接了完成鎖才需要**） | `src/pages/admin/students/[id].tsx` 的 `redoRows` | hc-pilot **不寫** `game:hc-pilot` 完成鎖，所以不需要；寫了又沒登記，破關即永久鎖死 |
| 9 | 不要公開的測試頁／學生資料 | `.vercelignore` | 已有 `/public/games/cocos/_*`；`.git/info/exclude` 對 `vercel --prod` 無效 |
| 10 | 上線五元素 | 見 gpt-clone `.claude/skills/worksheet-launch/SKILL.md` | 進課動畫／學習單／複習小考／家長簡介／回家作業，缺一不算上線 |

## 3. 外層頁面要做的事（`/play/<game-id>`）

照 `hc-pilot.tsx` 的結構，核心行為：

1. 需要登入（`useAuth`）；沒登入導向登入頁。
2. `<iframe src="/games/cocos/<game-id>/index.html" allow="microphone; autoplay">`，滿版、`border: 0`。遊戲要錄音（問 AI）才需要 `microphone`。**iframe 必須同源**（協定用 `window.location.origin` 當 `targetOrigin`，禁用 `"*"`）。
3. 訊息處理只收**同源且 `event.source` 是這個 iframe** 的訊息（P-1），`protocol`、`gameId` 不符一律忽略（用 `isLtGameMessage`）。
4. 握手（正典 §5-3）：遊戲送 `ready` → 讀 Firestore 存檔 → 送 `config`（含新 `sessionId`、`save`、`now`、`muted`、`params`）→ 送 `start` → 遊戲送 `started`、`progress`、`save`、`complete`…。重玩要送新的 `sessionId`。
5. **存檔**：收到 `save` 先放暫存，**1.5 秒內沒有新的才寫**（debounce），關頁面時補寫最後一次。讀不到雲端存檔時**這一場不存檔**（避免空白進度蓋掉舊存檔）。
6. 其他：切分頁時送 `pause`／`resume`；靜音狀態以網站為準；`complete` 以 `sessionId` 去重（P-5）。
7. 若遊戲要題目判定或輸入：判定與正解在網站，遊戲只送「選了哪個 id」（C-2）；需要打字時遊戲送 `request-input`，網站顯示 HTML 輸入框（C-4）。

**hc-pilot 另外加的保護（新遊戲有跨課存檔時建議照做）**【實做】
- 進度底線 `hcSaveRegression`：要寫的存檔如果解鎖格倒退、問 AI 或過關紀錄不見 → 不寫。
- 第一次讀到舊版存檔，先備份到 `gameProgress/{uid}.<gameId>-bak`（只寫一次，備份失敗就不存）。
- 遊戲送 `error`（code `save-broken`）→ 這一場不存。
- 時間用伺服器的：載入時打 `/api/time` 量學生電腦時鐘差，`savedAt` 與送給遊戲的 `now` 都校正（離線收入、每週分鐘數、金額鎖都靠兩個時間相減；學校電腦時鐘不準）。
- 兩個分頁／兩台電腦同時開：寫入時用 Firestore **交易**比對 `savedAt`（`saveGameProgressFieldIfUnchanged`），不是上次讀到的就不寫並提示。這兩項（時間校正、交易比對）**只做過型別檢查與邏輯模擬，沒對真 Firestore 測**【未驗證】。

## 4. 存檔與完成紀錄的資料結構

- `gameProgress/{uid}.<gameId>` ＝ `{ version, state, savedAt, prog, pct, coins, done }`：
  - `state`：遊戲自己的存檔，網站不解讀；
  - `prog`：遊戲放在存檔裡的進度摘要＋每週紀錄，網站每次存檔把它**攤到最上層**，給老師全班進度頁（`public/games/p1u-arc3-links.html`）與家長成果頁（`p1u-arc3-recap.html?uid=`）讀（`src/lib/hcPilotProgress.ts`）；
  - `pct`／`coins`／`done`：學習單卡片顯示進度用。
- **每週過關**：遊戲在 `prog.weeks[週]` 記一筆 → 網站記課程完成 `game:p1uwNN`（`markLessonCompleted`，分數＝過關當下的商店等級）＋發平台金幣（`creditGameCoins`，交易 id `p1uarc3_w<N>_pass`，冪等，一週 15 枚、只發一次）。金幣數字是【假設】。
- **不寫總完成鎖 `game:hc-pilot`**：寫了學生隔週進不來；學習單卡片的進度看 `game:hc-pilot` 的 `gameProgress`，各週用 `game:p1uwNN`，**不會鎖卡片**。
- 老師帳號 `ruifei`（uid 14775649…）分析學生資料時要排除。

## 5. 學習單（Firestore）怎麼建

腳本：`scripts/create-hc-pilot-worksheet.mjs`（`ws_p1u_w13`，入口卡片）與 `scripts/create-hc-pilot-week-worksheets.mjs`（逐週隱藏文件）。預設 dry run，`--write` 才寫；已存在就跳過。

入口卡片欄位：`title`、`semester`（例 `"P1"`）、`week`、`gameKey`（**逐字等於遊戲的 `GAMEKEY`／外層頁面存檔欄位名**）、`externalGameUrl`（`/play/<game-id>`）、`isPublished`、`classId`／`classIds`（**從同系列既有 worksheet 撈，不要猜**）、`tasks[]`（`taskId`、`label`、`coins`；合計＝遊戲最大金幣含小老師）、`markdownContent`。

**逐週隱藏文件不能省**：多週共用一個入口（只建一張卡片，避免學生分不出要點哪個）時，仍須每週建一份**不發布**的學習單（`isPublished:false`、`gameKey` 對齊遊戲完成鎖 `p1uwNN`）。因為下課後「今日待發」是一堂一堂找學習單來產生家長簡介與 AI 小考，沒有它會顯示「找不到這堂的學習單」。內容要隨遊戲更新，過時會讓簡介與小考依舊設計產生（P1U 的 `ws_p1u_w08`～`w12` 目前就有此問題）。

> **寫入就是寫正式站**（專案只有一個 Firebase 專案 `gpt-clone-68b9f`，且腳本內是公開的 Web API key 走 Firestore REST）。任何 `--write` 前先給使用者看內容並取得明確同意；同意只算那一次。

wiki 端學習單位置固定在 `wiki/worksheets/<系列>/`（後台 AI 出題讀它），每週要有 `## 本週學習重點`。

## 5b. 課程銜接

- 學習單卡片 → `/play/<game-id>`（`externalGameUrl`）。
- 進課動畫：外層頁面載入遊戲前依存檔判斷第幾週，播對應動畫；`?entry=P1U-W15` 強制指定、`?skipIntro=1` 跳過（測試用）。`worksheetEntry.ts` 註記哪些學習單不需登記。
- `lessonCatalog.ts` 是「課程目錄」，新增 key 才會出現在後台作品總表與家長作業通知。

## 6. 部署

- 產物跟著 gpt-clone 一起 commit、一起部署；**不放外部 CDN**（正典 D-5）。
- 網站**不得**加 COOP／COEP header，遊戲**不得**用 `SharedArrayBuffer`（會讓 Firebase 登入彈窗與外部圖片失效）。
- **部署方式目前有兩份互相矛盾的文件**【待負責人確認】：`gpt-clone/docs/deploy.md`（2026-08-22）寫「`main` 進 PR、`production` 分支是正式站，**不要用 `vercel --prod`**」；但 gpt-clone 的 CLAUDE.md 與近期實務（小熊麵包坊記憶）是從 `gpt-clone-bakery` worktree 用 `vercel --prod` 部署，且 `series-conventions.md` 註明「Vercel 沒接 GitHub，main 會跟正式站分歧」。**以負責人當下說法為準**。
- 上課時段不部署；新增環境變數要同時加到 Vercel 三個環境。
- 正式站網址（CLAUDE.md 記載）：`https://gpt-clone-beta-six.vercel.app/`。

## 7. 驗收：網站端

- [ ] 直接開 `/games/cocos/<game-id>/index.html`（無父頁）能玩完一局（C-5）。
- [ ] 嵌入後 `ready → config → start → started → complete` 全流程，網站端只記一次（K-5）。
- [ ] 送錯 origin／錯 protocol 的訊息被忽略（K-6）。
- [ ] 存檔：換電腦／重整後接得上；兩個分頁不互蓋；空白進度不蓋舊存檔。
- [ ] 過關：課程完成鍵與金幣只記一次（重玩、重整都不會重發）。
- [ ] 沒有新增 COOP／COEP、沒有新增 npm 相依（K-10）。
- [ ] 上線五元素齊全（跑 `npx tsx scripts/check-lesson-package.ts <堂代號>`，只讀）。

## 8. 與正典的已知偏離（prototype 限定，正式上線前要改）【文件：開發規格 §8】

| 條款 | hc-pilot 目前 | 正式要改成 |
|------|--------------|-----------|
| C-1 遊戲不得呼叫 `/api/*` | 問 AI 時遊戲自己呼叫 `/api/transcribe`（語音轉文字） | React 外層錄音、辨識，透過 `lt-game/1` 傳結果 |
| C-2 題目判定在 React | 解鎖題、失敗原因題、問 AI 小考的正解都在遊戲裡 | 題目資料放 gpt-clone，React 判定 |
| P-4 15 秒內沒收到 `ready` 要顯示載入失敗 | `hc-pilot.tsx` 未見此邏輯【未驗證】 | 補上逾時提示 |
| S-2 主要輸入是指標、iPad 必須能玩 | 主要操作是 WASD＋空白鍵；有無觸控支援沒查到紀錄【未驗證】，也未列入開發規格 §8 | 待負責人確認 |
| 語音念題 | 未實作 | 待決定 |

## 9. 還沒回答的

1. 第二款遊戲是否共用一份 Cocos 引擎檔以省流量（目前每款各帶一份）。
2. 完成鎖的使用規則（hc-pilot 不寫總鎖）能否當通則。
3. 每週平台金幣與總額的最終數字。
