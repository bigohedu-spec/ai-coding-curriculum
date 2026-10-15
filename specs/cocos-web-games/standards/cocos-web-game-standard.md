# Cocos Web Game｜網站 × Cocos Creator 串接標準

> 給「開發 AI／工程負責人」共用的正典：規定一款用 Cocos Creator 做、嵌進 gpt-clone 網站的小遊戲
> **用什麼版本做、檔案放哪、遊戲和網站怎麼講話、誰負責存檔、多大算太大、AI 可以碰什麼**。
>
> 條款分級沿用 spec-governance：**【規定】** 不可違反；**【推定】** 預設值，有理由可改但要記錄；
> **【假設】** 尚待試點實測校準的數字。
>
> 建立：2026-09-29。原因：負責人評估 Phaser 開發成本過高（沒有視覺編輯器，擺位／碰撞／動畫都要寫
> 程式或填數字），決定下一款網站遊戲（超休閒遊戲）改用 Cocos Creator 試點。

---

## §0 治理定位【規定】

### §0-1 適用範圍

- **適用**：嵌在 gpt-clone 網站頁面裡、以 iframe 載入的獨立小遊戲（超休閒、單一畫面、單局數分鐘）。
- **不適用**：地圖探索 Lab Terminal Quest（S3W05／S3W06 那類「可走動地圖＋右側答題卡」關卡）。
  那條線的正典仍是 [`lab-terminal-quest-phaser-runtime-standard.md`](../../lab-terminal-quest/standards/lab-terminal-quest-phaser-runtime-standard.md)，
  本檔**不覆寫**它的任何條款。是否把 Quest 也搬到 Cocos，要等本檔試點通過後由負責人另行裁決。

### §0-2 狀態

**試點中**。§11 驗收斷言全數通過、且負責人在教室實機確認後，才改為「新網站小遊戲的預設 runtime」。
在此之前，§8 所有【假設】數字都可能被實測改寫。

---

## §1 為什麼是 Cocos【背景】

| 需求 | Cocos Creator 的對應 |
|---|---|
| 負責人要能自己在編輯器裡擺位、調手感，不必每次都寫程式 | 有視覺編輯器，概念與 Unity 一一對應（Node／Component／Prefab） |
| 流量要省（Vercel 額度） | 網頁原生引擎，可用「功能裁剪」關掉不用的模組 |
| 繁中顯示與輸入 | Label 可用瀏覽器系統字型，不必打包 CJK 字型檔 |
| AI 協作 | 腳本是 TypeScript；編輯器有社群 MCP，可讓 AI 透過編輯器 API 操作場景 |
| 不碰多執行緒 | 不需要 COOP／COEP header（開了會讓 Firebase 登入彈窗、外部圖片失效） |

已評估但未採用：Unity 6 Web（打包較大、打包時間長；ECS／Burst 多執行緒在網頁上需要 COOP／COEP）、
Godot 4 Web（只能 GDScript、引擎本體約 10 MB 不易縮小）、繼續用 Phaser（無編輯器）。

---

## §2 版本與工具鏈【規定】

| 項目 | 固定值 | 備註 |
|---|---|---|
| 編輯器 | **Cocos Creator 3.8.8** | 2026-09-29 官方下載頁上最新的穩定版。一個遊戲開案後**不得中途升版**；要升版須整批評估並更新本表 |
| 安裝管理 | Cocos Dashboard | 由負責人以 GUI 安裝 |
| Cocos 4 | **暫不採用** | 2026-01 發布的新架構（引擎與編輯器分離、編輯器改走 CLI＋新 IDE），生態與社群 MCP 仍以 3.8 為主；待負責人另行評估 |
| 編輯器 MCP | **FunplayAI／funplay-cocos-mcp**（MIT） | 安裝版本號記錄在 [`../README.md`](../README.md) |
| 禁用 MCP | DaxianLee／cocos-mcp-server | 授權寫明不可商用，與協會收費課程有衝突疑慮 |
| 腳本語言 | TypeScript | 不使用 JavaScript 元件 |
| Node.js | LTS | 只用於編輯器擴充套件與建置腳本；**遊戲本身不得引入 npm 相依套件**，除非負責人核准 |

---

## §3 目錄與 repo 佈局【規定】

```
<COCOS_ROOT>/                      ← Cocos 專用根目錄，預設 C:\Dev\Cocos\（不得放在桌面或雲端同步資料夾）
├─ Editors/                        ← Cocos Dashboard 的編輯器下載位置（在 Dashboard 設定中指定）
│  └─ Creator/3.8.8/CocosCreator.exe
└─ Projects/
   └─ <game-id>/                   ← 一款遊戲一個 Cocos 專案、一個獨立 git repo
      ├─ assets/
      │  ├─ scenes/                ← 場景（只透過編輯器／MCP 修改）
      │  ├─ prefabs/
      │  ├─ scripts/
      │  │  ├─ platform/           ← PlatformBridge 與協定型別（§5）
      │  │  └─ game/               ← 玩法腳本
      │  ├─ art/
      │  └─ audio/
      ├─ build-config/web-mobile.json   ← 從編輯器「構建」面板匯出的設定
      ├─ game.manifest.json        ← §5-4
      ├─ scripts/build-web.ps1     ← §9
      └─ settings/                 ← 要進版控

<gpt-clone>/                       ← 網站 repo（維持原位置）
└─ public/games/cocos/<game-id>/   ← 唯一的部署落點（建置產物）
```

- **R-0** `<COCOS_ROOT>` 的實際路徑記錄在 [`../README.md`](../README.md) 的環境紀錄表，所有腳本以參數或該值為準，不得寫死在程式碼裡。放在桌面以外的原因：Cocos 專案的 `library/`、`temp/` 會產生大量快取檔，放在桌面或 OneDrive 之類的同步資料夾會拖慢同步、也容易被同步鎖檔導致編輯器出錯；路徑也應避免空白與中文。

- **R-1** `<game-id>` 用小寫 kebab-case，全平台唯一，一經發布不得改名（存檔與統計以它為鍵）。
- **R-2** Cocos 專案**不得**放進 gpt-clone repo 裡；gpt-clone 只收建置產物。
- **R-3** 新遊戲一律放在 `public/games/cocos/`。`public/games/` 根目錄下既有的 `*.html` 舊遊戲（內含寫死的 Firebase 設定）維持原狀，不得當成範本。
- **R-4** `.gitignore` 至少忽略 `library/`、`temp/`、`local/`、`build/`、`node_modules/`；**不得**忽略 `settings/` 與任何 `.meta` 檔。

---

## §4 【鐵則 C】邊界契約【規定】

> 一句話：**Cocos 擁有這一局，React 擁有其他一切。兩者只透過 §5 的協定講話。**

| 編號 | 規定 | 為什麼 |
|---|---|---|
| **C-1** | 遊戲**不得**載入 Firebase、不得呼叫 `/api/*`、不得 `fetch` 自身目錄以外的任何網址 | 帳號、存檔、金幣、AI 呼叫都在 React 端；遊戲碰了就會出現兩份真相 |
| **C-2** | 遊戲內若出現題目，**判定在 React**。遊戲只收「要顯示的內容」，回傳「學生選了哪個 id」，不得持有正解 | 與 Phaser 標準 R-2 同理：拿不到答案就不可能代答或洩題 |
| **C-3** | 遊戲**不得**把 `localStorage`／`IndexedDB` 當存檔來源。只可存純偏好（例如靜音），且讀取失敗時要能正常運作 | 學生換電腦就不見；存檔唯一來源是 React 寫進的 Firestore |
| **C-4** | 遊戲畫面裡**不得**出現文字輸入（不用 EditBox）。需要學生打字時，由遊戲送事件請 React 顯示 HTML 輸入框 | 注音輸入在 canvas 裡最容易出問題，HTML 輸入框最穩 |
| **C-5** | 遊戲在沒有父頁面時（直接開 `index.html` 或編輯器預覽）必須能以預設設定玩完一局 | 讓負責人不必啟動網站也能調手感 |
| **C-6** | 網站**不得**為了遊戲加上 COOP／COEP header，遊戲**不得**依賴 `SharedArrayBuffer` | 會讓 Firebase 登入彈窗與外部圖片失效 |

---

## §5 通訊協定 `lt-game/1`【規定】

### §5-1 訊息外殼

```ts
type LtGameMessage<T extends string = string, P = unknown> = {
  protocol: "lt-game/1";
  gameId: string;      // = game.manifest.json 的 gameId
  sessionId: string;   // 由 React 在 config 時產生；遊戲在收到 config 前一律送 ""
  type: T;
  payload: P;
};
```

### §5-2 訊息清單（封閉清單，新增須改本檔）

**遊戲 → 網站**

| type | payload | 時機 |
|---|---|---|
| `ready` | `{ buildVersion: string }` | 引擎與首個場景載入完成 |
| `started` | `{}` | 收到 `start` 且真正開始一局 |
| `progress` | `{ score: number; level?: number }` | 可選；每秒最多 2 次 |
| `complete` | `{ result: "win" \| "lose" \| "quit"; score: number; durationMs: number; stats?: Record<string, number> }` | 一局結束，**每個 sessionId 只送一次** |
| `request-input` | `{ requestId: string; prompt: string; maxLength: number }` | C-4：請 React 顯示輸入框 |
| `answer` | `{ questionId: string; choiceId: string }` | C-2：學生選了什麼，由 React 判定 |
| `error` | `{ code: string; message: string }` | 無法繼續時 |
| `save` | `{ version: number; state: unknown }` | 需要跨課存檔的遊戲才送：進度有變時，每 10 秒最多 1 次；切到背景時立刻送一次。`state` 內容由遊戲定義，React 不解讀，原樣寫進 Firestore `gameProgress/{uid}.<gameId>`（2026-09-30 追加，hc-pilot 要玩 6 週） |

**網站 → 遊戲**

| type | payload | 時機 |
|---|---|---|
| `config` | `{ sessionId: string; mode: "play" \| "practice" \| "preview"; muted: boolean; params: Record<string, unknown>; save?: { version: number; state: unknown; savedAt: string } \| null; now?: string }` | 收到 `ready` 後；每次重玩都送新的 sessionId。`save`＝上次存的進度（沒有是 null；沒有存檔功能的遊戲忽略），`now`＝React 送出時的時間（ISO），遊戲用來和 `savedAt` 算離開多久（2026-09-30 追加） |
| `start` | `{}` | config 之後 |
| `pause` ／ `resume` | `{}` | 頁面失焦、切分頁、老師暫停 |
| `mute` | `{ muted: boolean }` | 使用者切換 |
| `input-result` | `{ requestId: string; text: string \| null }` | 回應 `request-input`（`null`＝取消） |
| `answer-result` | `{ questionId: string; correct: boolean; feedback?: string }` | 回應 `answer` |

### §5-3 握手順序

```
React 建立 iframe（src=/games/cocos/<game-id>/index.html）
  → 遊戲送 ready
  → React 送 config（含新 sessionId）
  → React 送 start
  → 遊戲送 started …（progress / answer / request-input）… complete
  → React 依 sessionId 去重後寫入 Firestore
重玩：React 再送 config（新 sessionId）＋ start
```

- **P-1** 雙方都**必須**檢查 `event.origin === window.location.origin`，遊戲端另檢查 `event.source === window.parent`；`protocol`、`gameId` 不符的訊息一律忽略。
- **P-2** 送出時 `targetOrigin` 一律用 `window.location.origin`，**禁止**用 `"*"`。
- **P-3** 無法辨識的 `type` 靜默忽略，不得報錯中斷遊戲（前向相容）。
- **P-4** React 在 iframe 載入後 15 秒【推定】內沒收到 `ready`，就顯示「遊戲載入失敗，重新整理」並停止等待。
- **P-5** 計分冪等：React 以 `sessionId` 去重，同一局重複送來的 `complete` 只記一次。重玩權由 React 決定，遊戲不得自行開新局後自行回報。
- **P-6** 協定型別的唯一來源是 gpt-clone 的 `src/types/ltGameProtocol.ts`；Cocos 端的 `assets/scripts/platform/protocol.ts` 必須與它逐字一致（由同步腳本複製，不手改）。

### §5-4 `game.manifest.json`

每款遊戲根目錄一份，建置時複製到產物目錄，讓 React 在建立 iframe 前就知道長寬比與預設參數：

```json
{
  "gameId": "hc-pilot",
  "protocol": "lt-game/1",
  "title": "（顯示用中文名稱）",
  "designWidth": 720,
  "designHeight": 1280,
  "orientation": "portrait",
  "defaultParams": {}
}
```

---

## §6 畫面、輸入與聲音

- **S-1【規定】** 設計解析度與方向由每款遊戲在 manifest 宣告，本檔不統一規定。React 端的 iframe 依 manifest 長寬比留框，不得拉伸變形。
- **S-2【規定】** 主要輸入是指標（滑鼠與觸控共用同一套邏輯），iPad 必須能玩。鍵盤只能當輔助，不能是唯一操作方式。
- **S-3【規定】** 第一次點擊前不播任何聲音（瀏覽器自動播放政策）。靜音狀態以 React 送來的 `muted` 為準。
- **S-4【規定】** 收到 `pause` 或 `document.visibilityState === "hidden"` 時，遊戲必須暫停計時與物理，恢復時不得瞬移或扣分。
- **S-5【推定】** 超休閒遊戲一局 30 秒～3 分鐘；失敗後一鍵重來，不經過多層選單。

---

## §7 文字與字型【規定】

- **T-1** Label 一律使用系統字型（`useSystemFont = true`），字體清單：`"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif`。
- **T-2** 不得打包 CJK 字型檔。若美術確實需要特殊字型（例如標題字），只能用點陣圖字或子集化字型，並經負責人核准，列入 §8 預算。
- **T-3** 文字內容以台灣繁體中文撰寫；給小三～小六看的句子要短，一行不超過 16 字【推定】。

---

## §8 效能與流量預算【假設，待試點校準】

| 指標 | 上限 | 量法 |
|---|---|---|
| 首次可玩前的下載量（壓縮後） | **≤ 5 MB** | 瀏覽器 DevTools Network，停用快取，計到出現可點擊的開始畫面 |
| 整款遊戲總下載量 | ≤ 8 MB | 同上，玩完一局 |
| 單一素材檔 | ≤ 500 KB | 超過要在建置規格裡寫理由 |
| 背景音樂 | ≤ 1 MB／首 | 單聲道 mp3 |
| 教室電腦幀率 | 目標 60，最低 30 | 實機量測 |
| 從點開到可玩 | ≤ 5 秒（教室網路、首次） | 實機碼錶 |

落實手段【規定】：

- **B-1** 專案設定的「功能裁剪」關閉所有沒用到的模組（3D、物理、Spine、DragonBones、粒子、影片、WebView、TiledMap 等，用到才開）。
- **B-2** 不透明圖一律不用 PNG；圖片走 Cocos 的自動圖集與壓縮紋理設定。
- **B-3** 素材進專案前先縮到實際顯示尺寸的 1～2 倍，不得把 AI 生圖原檔（常見 1024～2048 px）直接放進去；原檔放在專案外或 `_source/`（不參與建置）。

---

## §9 建置與部署【規定】

- **D-1** 平台固定 `web-mobile`；`debug=false`；開啟 **MD5 Cache**；關閉 source map。
- **D-2** 建置用 `scripts/build-web.ps1`，內部呼叫：
  ```
  <CocosCreator.exe> --project <專案路徑> --build "configPath=./build-config/web-mobile.json"
  ```
  結束碼 **36＝成功**，32＝參數錯誤，34＝建置期錯誤；腳本必須檢查結束碼，非 36 就中止，不得複製半成品。
- **D-3** 成功後以鏡像方式（`robocopy /MIR`）複製 `build/web-mobile/` 到 `<gpt-clone>/public/games/cocos/<game-id>/`（`<gpt-clone>` 路徑為腳本參數），並一併複製 `game.manifest.json`。
- **D-4** 腳本最後輸出產物總大小，以及「gzip 後總大小」的估計，對照 §8。
- **D-5** 產物跟著 gpt-clone 一起 commit、一起用 `vercel --prod` 部署；不得放到外部 CDN。

---

## §10 AI 協作規則【規定】

- **A-1** `.scene`、`.prefab`、`.anim`、`.meta` 等由編輯器管理的檔案，**任何 AI 都不得直接手改文字內容**。要改場景結構，一律透過編輯器 MCP 或由負責人在編輯器內操作。
- **A-2** 讓 AI 透過 MCP 修改場景之前，先 `git commit` 一次；改完後用 MCP 截圖確認結果，再 commit。
- **A-3** 同一個 Cocos 專案，同一時間只允許一個 AI 工作階段透過 MCP 寫入（編輯器是唯一寫入者）。
- **A-4** AI 可以自由新增、修改 `assets/scripts/**/*.ts`；新增腳本後要在編輯器重新整理，讓編輯器產生 `.meta`，並一起 commit。
- **A-5** 寫入後重新讀取確認真的落地，不以工具回報的「成功」為準（沿用 S3W05 多 agent 協作的既有教訓）。
- **A-6** 負責人擁有「手感」：速度、重力、判定範圍、難度曲線等數值，AI 只能提案，不得自行調整後直接定案。

---

## §11 驗收斷言【規定】

試點與每款遊戲發布前都要全數通過：

| 編號 | 斷言 | 驗法 |
|---|---|---|
| K-1 | `assets/scripts/**` 內找不到 `firebase`、`/api/`、`localStorage.setItem`（純偏好鍵除外）、`SharedArrayBuffer` | 文字搜尋 |
| K-2 | 場景內沒有 EditBox 元件 | MCP 查詢或編輯器檢查 |
| K-3 | `build-web.ps1` 結束碼為 36，產物已鏡像到 `public/games/cocos/<game-id>/` | 腳本輸出 |
| K-4 | 直接開 `/games/cocos/<game-id>/index.html`（無父頁）能玩完一局 | 瀏覽器 |
| K-5 | 嵌入網站後完成 `ready → config → start → started → complete` 全流程，React 端收到且只記一次 | 瀏覽器主控台＋Firestore |
| K-6 | 送錯 origin 或錯 protocol 的訊息被忽略 | 手動送測試訊息 |
| K-7 | §8 首次下載量與總量在上限內 | DevTools Network |
| K-8 | iPad Safari 可用觸控玩完一局 | 實機 |
| K-9 | 切到別的分頁再回來，遊戲有暫停、沒有瞬移或扣分 | 實機 |
| K-10 | gpt-clone 沒有新增 COOP／COEP header，也沒有新增 npm 相依套件 | `next.config.js`／`package.json` diff |

---

## §12 未決事項（由負責人決定，AI 不得自行定案）

1. 第一款超休閒遊戲的玩法、`game-id`、方向（直式／橫式）。
2. 遊戲結果寫進 Firestore 的哪個欄位、是否發金幣、金幣是否計入主線 250。
3. 多款遊戲是否共用一份 Cocos 引擎檔以省流量（目前每款各帶一份）。
4. 何時評估 Cocos 4。
5. Lab Terminal Quest 是否也遷移到 Cocos（需另開裁決，本檔不處理）。

---

> 最後修改：2026-09-29，原因：§3 改為獨立的 `<COCOS_ROOT>`（預設 `C:\Dev\Cocos\`），Cocos 編輯器與專案都不放桌面。
> 建立：2026-09-29，原因：負責人決定下一款網站超休閒遊戲以 Cocos Creator 3.8.8 試點。
