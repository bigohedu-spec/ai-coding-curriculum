# 自檢與驗收

先把不用耳朵也能驗的全部驗完，剩下的交給負責人。除錯函式在審稿頁 `/entry/play/<堂代號>` 的 console，要先**真實點擊**「點一下開始」。

| 函式 | 用途 |
|---|---|
| `await __go(頁, 拍)` | 跳到某頁某拍並定格 |
| `__scan()`／`__scanAll()` | 目前畫面超出舞台的文字／所有元素 |
| `__overlap()` | 目前畫面 UI 與角色道具的遮擋 |
| `await __sweep(頁, 長度拍, 間隔拍)` | 逐拍掃整頁的超出 |
| `await __sweepOverlap(頁, 長度拍, 間隔拍)` | 逐拍掃整頁的遮擋 |
| `await __cueCheck(頁)` | 每句旁白的起訖拍 |
| `await __musicCheck(8)` | 8 小節音樂峰值與 RMS |
| `__A`、`__stepInfo` | 音訊 API、本頁 cues |

## A. 每次改完

- [ ] `npx tsc --noEmit -p .` 0 error。
- [ ] 審稿頁回 200：`curl -s -o /dev/null -w "%{http_code}" http://localhost:3210/entry/play/<堂代號>`。
- [ ] console 沒有新的錯誤。

## B. 版面（每頁）

- [ ] `__sweep(頁, 長度, 0.5)` 回傳空的（含元素：角色從畫面外進場也算超出，改成畫面內淡入）。
- [ ] `__sweepOverlap(頁, 長度, 0.5)` 回傳空的。規則：`data-ui` 蓋住 `data-spr` 超過 18％、角色道具彼此重疊超過 40％ 會列出；刻意的重疊在回報中說明。
- [ ] UI 疊 UI（卡片角落的標籤被後畫的卡片蓋住）：對標籤內部水平 25／50／75％、垂直置中三點用 `document.elementFromPoint` 確認最上層是它自己。
- [ ] 容器內的字：`容器右緣 − (字的 left + scrollWidth) ≥ 0`；段落 `scrollHeight ≤ clientHeight`；短字加 `whiteSpace: nowrap`。
- [ ] 互動頁用超長輸入（20 個字母）再掃一次。

## C. 音樂

- [ ] `__musicCheck(8)` 峰值 < 0.9、各小節 RMS 穩定。
- [ ] 編曲：逐頁加一層；互動頁不變；口訣頁 bass／clap／pad；最後一頁柔和。
- [ ] 內容播完 2 拍後換頁。

## D. 旁白與字幕

- [ ] `__cueCheck(頁)`：每句不撞下一句、不超過頁長。
- [ ] 字幕沒有 `，、；：。～`：逐拍讀 `[data-ui=sub]` 文字，`/[，、；：。～,;:.~]/` 0 筆。
- [ ] 每句旁白都有字幕（S 系列）：一次跑一兩頁，回傳空陣列才算過。
  ```js
  window.__subChk = async (n) => { const miss = []; await __go(n, 0);
    for (const c of __stepInfo.cues) { const chars = [...c.text].filter((ch) => !/[，。！？、：； ]/.test(ch));
      for (const k of [0.2, 0.5, 0.85]) { await __go(n, Math.round((c.beat + (c.dur / 0.6) * k) * 2) / 2);
        const t = document.querySelector("[data-stage] [data-ui=sub]")?.textContent || "";
        if (!chars.some((ch) => t.includes(ch))) miss.push(c.text); } }
    return miss; };
  ```
- [ ] S 系列：`voice-check.mjs` 通過；網路請求 `/lesson-entry/voice/<堂代號>/` 每個 mp3 都 200。
- [ ] `charBeat` 索引核對：台詞去標點與空白後第 i 個字就是關鍵字。
- [ ] P 系列：沒有缺字典的字；英文名字依音節亮起；旁白時音樂壓低。

## E. 互動頁

- [ ] 旁白與題目內容播完前，點擊、Enter、空白鍵都無效；按住鍵盤到解鎖後放開不會送出；解鎖後可正常作答；下一題重新鎖定。
- [ ] 每 3 秒亂按一次、持續 30 秒：全程沒有發光提示。停手 15 秒：只重念題目；再 15 秒：提示句＋發光（S 系列）。
- [ ] 同一頁重新整理玩兩次，題目與按鈕順序不同；相鄰題正確答案不同顆。
- [ ] 題目卡三段齊全，答對後換成正確結果，卡片字沒被切掉。
- [ ] 練習操作要真的做到才換頁；最後一題的回饋與結語播完（約 8～10 秒）才換頁。
- [ ] 打名字：只收 A～Z、需按 Enter、不符可重打；回報只有相符與否、次數、舉手。

## F. 結尾

- [ ] 兩個按鈕：開始遊戲、再看一次。
- [ ] 再看一次：回到第 1 頁，音樂拍數約 0.7 秒內從 0 起算，輸入清空。

## G. 交給負責人

音質與讀音、片長、動作與拍子的感覺、美感與風格、在真實 Chrome 與不同解析度的表現。

## 回報格式

> 做了：…（逐項對應要求）
> 我驗了什麼：…（數字、截圖、拍數）
> 沒驗什麼：…
> 請你看：網址、哪幾頁、要判斷什麼
> 暫代／待決定：…
