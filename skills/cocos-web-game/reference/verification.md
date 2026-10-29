# 驗證：怎麼證明遊戲真的能玩

> 原則（使用者的驗證手法）：**只有文字的「已完成」不算完成**。視覺或互動的變更要開起來、附截圖；要親手觸發；數值要實算；測的角度要是負責人說的那個；沒有親自核對的不可標成已驗證。
> 來源：負責 Cocos 的 session 交接【實做】與專案記憶【記憶】。

## 1. 自動化 harness（無頭 Chrome＋CDP）【實做】

- 開 `http://localhost:3300/__test/`（hc-test-env），點學生按鈕載入存檔（呼叫頁面的 `load(idx)`），等 `built` 為真。
- Chrome 用 `--headless=new --remote-debugging-port=<port>`，以 WebSocket 發 CDP 指令。`CDP_GPU=1` 用 d3d11 ANGLE（較快），否則 swiftshader；**不同腳本用不同 port**。量 fps 要 `--use-angle=d3d11 --enable-gpu` 才是真的顯卡數字。
- 取遊戲物件（類別名被壓縮，所以用場景節點取）：
  `document.querySelector('iframe').contentWindow.cc.director.getScene().getChildByName('GameRoot').getComponent('BakeryArcade')`
- 操作：**真的鍵盤**（`Input.dispatchKeyEvent`，KeyW/A/S/D）、**真的滑鼠**（`Input.dispatchMouseEvent` 點螢幕座標，例如衣櫃卡片）；也可以直接呼叫 `g.jumpTo(週, 項, false)`、`g.teacherQuest()`、`g.snapshot()`。
- 截圖：`Page.captureScreenshot`（可 `clip` 放大）。內建瀏覽器載入遊戲要 20～30 秒；要放大細節請用 CDP 的 `clip`＋`scale`，不要靠 `computer zoom`（有時不是目標畫面）。
- 攔截技巧：包住 `g.fx`／`g.smoke` 記下每顆粒子的顏色與呼叫堆疊（證明腳步煙混色來自哪裡）；包住 `sfx.tone` 記下音符。

## 2. 每次改動的固定回歸：「六位學生往前推演」【實做】

對每位真實學生：從他的存檔載入 → 做完這一週 → 買下分界 → 進下一週 → 一路到下一個分界，每一步記任務、箭頭、錢、錯誤數。
- 判準：**0 個錯誤、沒有卡住**（任務表空白或箭頭 undefined 要判斷是不是刻意）。
- 兩路並行（不同 port）約 8 分鐘。
- 腳本在該 session 的 scratchpad（**不在 repo**），要重做請依此描述重寫。

## 3. 跨週測試【記憶】

週次開關看「上一週過關紀錄 `prog.weeks[週].day` 早於今天」。
1. 在測試頁用 `window.addEventListener('message')` 攔下遊戲送的 `save` payload（測試頁本來就擋掉不寫回）。
2. 把最後一週的 `day` 改成昨天、拿掉 `w5`／`w6`，push 進測試頁 `S` 陣列再 `load(i)`。全部只在瀏覽器記憶體。
3. 任務表做完要等**加碼任務結束**（`wt.end`）才記過關；測試時呼叫 `g.endBonus()`。

## 4. 其他檢查入口【實做／記憶】

| 參數／做法 | 用途 |
|-----------|------|
| `?dev=1` | 老師工具／跳關；整份標記 `dev`，**不拿來做學習分析**（`PlayStats`） |
| `?audit=1` | 版面檢測 |
| `?lay=` | 版面比較 |
| `?ph=u,v`／`?dh=u,v` | 調農夫的家 |
| `?jump=W-N` | 跳到第 W 週第 N 項（hc-test-env） |
| `?test=hidden17` 等 | 直接測隱藏任務 |

## 5. 數值要實算【實做】

不靠感覺：例如「三明治客人比例改後，每位客人平均要幾個」，先用腳本模擬、再在遊戲內呼叫 `spawnShopper` 1000 次統計。經濟模擬：`scripts/econ-sim.mjs`（用比率算，不含走路距離／排隊／收錢時間，僅粗估）。

## 6. 完成回報的寫法

分成「我驗了什麼」與「請你判斷什麼」。視覺改動附乾淨的截圖（沒有操作外框或工作列）。只用程式數過、沒有看畫面的，要明說（例如「只數了場上煙霧數，沒有截圖」）。

## 7. 尚未量測

- 40 分鐘內做得完 W15 嗎？依教案估算可能不夠（齒輪約 28 分鐘＋買東西）【推算，未實測】。
- 建置時間約 1～2 分鐘，跟編輯器是否開著強相關；沒量過無編輯器的乾淨時間。
- 各週課堂實測時間：W16–W18 的數值全是假設。
