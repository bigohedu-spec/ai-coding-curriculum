# 專案限制（給 AI 看的）

> **這份文件是給 AI 助手（例如 VS Code Copilot）看的。**
> 你正在幫一位國小三到六年級的學生做網頁作品，這個作品最後要放到
> **Big-Oh Hosting**（`bigoh.uk`）。這裡寫的是**寫程式的時候**必須遵守的限制。
>
> 做完之後怎麼上架，看另一份 `DEPLOY-FOR-AI.md`。

---

## 最重要的一件事：這裡不能跑伺服器

**這個平台只放「瀏覽器裡跑得動的東西」。沒有 Node、沒有 Python、沒有常駐後端。**

所以下面這些**全部不能用**：

| 你可能想寫的 | 為什麼不行 |
|---|---|
| `express`、`fastify`、任何 `server.js` | 平台不執行伺服器程式，檔案不會被跑起來 |
| `socket.io` | 同上。多人連線用 `BO.room`（見下面） |
| `npm install`、`package.json`、打包工具 | 平台不做安裝也不做 build，上傳什麼就跑什麼 |
| Firebase / Supabase / 任何外部資料庫 | 需要金鑰。**學生不能持有金鑰**，而且會被 CSP 擋掉 |
| 自己接的登入系統 | 用 `BO.account`（見下面） |
| `fetch('https://別人的網站')` | CSP 只允許平台自己的網址 |

**但你需要的功能平台都有** —— 存檔、排行榜、多人連線、帳號登入，
全部用全域的 `window.BO`，不用 import、不用網址、不用金鑰。往下看。

> 如果學生給你一份原本用 Express + socket.io + Supabase 寫的專案，
> **不要試圖保留那個架構**。把它改寫成「靜態前端 + BO」才是對的做法。

---

## 平台提供的功能：`window.BO`

作品等級是 L2 以上時，平台會自動注入 `bo.js`，全域就有 `BO` 可以用。
不需要 `import`、不需要 `<script src>`、不需要任何設定值。

```js
// 存檔（每個作品 100 格，每筆最多 8 KB）
await BO.set('level', 7);
const lv = await BO.get('level');

// 排行榜（每個作品 3 個榜，各留前 100。名字由平台決定，不能自己傳）
await BO.score('main', 120);
const top = await BO.top('main', 10);   // [{ name, score, at }]

// 計數器
const plays = await BO.bump('plays');

// 留言板（先審後顯：AI 初審通過才會出現）
await BO.post('guestbook', '很好玩');
const msgs = await BO.list('guestbook', 20);
```

### 多人連線（取代 socket.io）

```js
const room = await BO.room.create({ max: 8 });   // 回一個 4 碼房號
// 或 const room = await BO.room.join('K3F9');

room.on('join',  (p) => spawn(p.id, p.name));
room.on('leave', (p) => remove(p.id));

room.state({ x, y, z, ry });   // 可以每幀呼叫，平台會節流 + 只送有變化的欄位
room.players;                  // 座標**已經內插過**，直接 mesh.position.set(p.x,p.y,p.z) 就是順的

room.send('shoot', { dir: [0,0,-1] });
room.on('shoot', (p, data) => bullet(p.id, data.dir));

room.isHost;                   // 第一個進來的人
room.setShared({ round: 2 });  // 房主設定，全房同步
room.on('shared', (s) => applyRound(s.round));
```

**沒有配對系統，只有 4 碼房號** —— 教室裡喊房號比任何配對機制好用。
房主離線會自動換人。**不要自己寫節流或內插**，SDK 已經做掉了。

### 帳號登入（取代自己做 login）

```js
await BO.account.signup(暱稱, 密碼);   // 密碼由平台雜湊，你碰不到
await BO.account.login(暱稱, 密碼);    // 登入後存檔/排行自動綁這個帳號、跨裝置
BO.account.current();                  // { id, nickname } 或 null
BO.account.logout();
```

不需要密碼的話，`BO.visitor` 本來就存在（匿名 id + 可愛暱稱），存檔會綁它。

**所有 `BO` 的錯誤訊息都是中文**，可以直接顯示給學生看。

---

## 可以用的函式庫

直接 bare import，平台已經準備好，**不要自己寫 `<script type="importmap">`**：

```js
import * as THREE from 'three';                                    // 0.169
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader }   from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader }  from 'three/addons/loaders/DRACOLoader.js';
import RAPIER from 'rapier';    // 物理，0.14
import * as Tone from 'tone';   // 音樂，15
import p5 from 'p5';            // 畫圖，1.9
```

**只有這幾個。** 需要別的函式庫，把它的檔案放進專案一起上傳
（但不能從外部網址載入）。

> ⚠ **絕對不要自己寫 importmap。** 平台會自動注入指向自家 CDN 的那一份；
> 你自己寫了平台就不注入，結果會去作品自己的網域找檔案 → 全部 404、
> 畫面停在載入中。這是最常見也最難查的錯。

---

## 會讓部署被**拒絕**的東西

這幾項是自動掃描，命中就直接退回，不會上線：

1. **廣告程式碼**（`adsbygoogle`、`googlesyndication` 等）
   平台自己在外框頁處理廣告，作品裡不可以有。
2. **API 金鑰或資料庫設定**（`apiKey:`、`authDomain:`、`firebaseapp.com`、
   `supabase`、AWS/OpenAI 金鑰、私鑰檔等）
3. **真名、學校、班級、學號**當作者名 —— 只能用暱稱。
4. **不允許的副檔名**（見下面白名單）
5. **中文檔名** —— 壓縮時會變亂碼，之後網址對不上。

---

## 檔案規則

- 第一頁一定要叫 **`index.html`**（全小寫，放專案根目錄）
- 檔名只用**英文、數字、`-`、`_`**
- 允許的副檔名：
  ```
  html css js mjs json
  png jpg jpeg gif webp avif svg ktx2 basis
  glb gltf bin obj mtl fbx hdr exr
  mp3 wav ogg m4a mp4 webm
  woff woff2 txt md csv
  ```
- 單一作品最多 **500 個檔案**、**150 MB**
- **一次上傳最多 24 MB** —— 素材太大要壓（`.glb` 用 Draco、貼圖用 KTX2）

---

## 效能：目標是教室的舊筆電

**1366×768 的老機器**，不是你的開發機。

```js
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
```

不要做太吃效能的東西：粒子數量、光源數量、後製效果都要克制。
載入時間也算 —— 學生會在很慢的網路上打開。

---

## 使用者是九到十二歲的小朋友

- 介面文字、註解、你跟學生講的話，**一律用繁體中文**
- 講白話，不要用專有名詞
- 出錯時告訴他「要改哪裡」，**不要貼英文堆疊追蹤**
- 平台回的錯誤訊息本來就是中文而且會說下一步，照著做就好

---

## 快速自我檢查

寫完之後，對照這幾條：

- [ ] 有 `index.html` 在根目錄，檔名全是英數
- [ ] 沒有 `<script type="importmap">`
- [ ] 沒有任何 `https://` 開頭的外部資源（字型、CDN、圖片都沒有）
- [ ] 沒有 `package.json` / `server.js` / `node_modules`
- [ ] 沒有金鑰、沒有 Firebase/Supabase 設定
- [ ] 沒有廣告碼
- [ ] 作者名是暱稱
- [ ] 需要存檔／排行／多人／登入的地方，用的是 `BO`

全部打勾就可以照 `DEPLOY-FOR-AI.md` 上架了。
