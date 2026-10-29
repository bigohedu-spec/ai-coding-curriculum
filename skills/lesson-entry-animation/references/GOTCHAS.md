# 地雷

## 環境（Windows）

| 狀況 | 做法 |
|---|---|
| 沒有 python／ffmpeg | `uv run --with pillow --with numpy --with scipy python …`；mp3 輸出用 `--with soundfile`，ffmpeg 用 `--with imageio-ffmpeg` |
| Python 印符號出現 cp950 錯誤 | 設 `PYTHONIOENCODING=utf-8` |
| 與標準函式庫同名的檔案（如 `wave.py`）會蓋掉模組 | 腳本放在獨立資料夾執行 |
| Bash 長 heredoc、長 `node -e` 引號壞掉 | 寫成檔案再執行 |
| 新課登記後審稿頁 404 | `getStaticPaths` 在啟動時固定，重啟 dev server |
| 存檔觸發 HMR，頁面回到「點一下開始」 | 改完重新點開始；批次改完再驗 |
| `node_modules` 全站共用 | 不自行安裝新套件，需要時先問負責人 |
| 主資料夾同時有其他工作 | 開工前 `git branch --show-current`；不切分支、不 `git reset`；不重開別人開的 dev server |

## 瀏覽器

- 「點一下開始」要真實點擊；程式送的 click 解不開 `AudioContext`，其餘按鈕可以用 JS 點。
- 預覽窗格被隱藏時，畫面時鐘幾乎停住、CSS 動畫不前進、截圖慢一拍：先截一張小圖喚醒，`__go` 後等 0.8～1 秒再截；跳字用 `innerText` 檢查。
- 長時間的 JS 可能被中斷：每次呼叫跑一兩頁（< 40 秒），結果直接回傳。
- 用 `isTrusted` 分辨是不是負責人正在操作，避免誤判成 bug。

## 網站 CSS

- 全站把所有元素設成等寬字，子元素不繼承：每個顯示中文的元素都自己設 `fontFamily`。
- 全站 `img{max-width:100%}`：定位用的圖加 `max-width: none`。
- `<style>` 用 `dangerouslySetInnerHTML` 放，避免 hydration 錯誤。
- 注音字的描邊 ≤ 字級的 4～5％，否則蓋住注音。

## 聲音

- `AudioContext.resume()` 在沒有使用者操作時不會結束，不要 await；用「點一下開始」解鎖。
- 排程音符用絕對音訊時間，不用 `setTimeout` 對拍。
- 「再看一次」要換掉各層輸出節點來作廢已排的音；`stop()` 的延遲清除用世代 token。關閉前檢查 `state !== "closed"`。

## 畫面

- 頁內動作讀 `b`（相對本頁），場景晃動讀 `useAbsBeat()`（絕對拍），兩者不混用。
- `popScale(p)` 在 `p ≤ 0` 回傳 0：字幕要用 `Math.max(0.06, p)`，否則第一格字消失。
- 進場放大倍率 ≤ 1.7，否則靠邊的字衝出舞台。
- 使用者輸入限制顯示（最後 14 字、`maxLength`、泡泡內自動縮小）。
- 突出卡片外的小標籤給 `zIndex`，或寫在卡片元素之後。
- 格子與卡片共用同一組座標，都用 `box-sizing: border-box`。
- 對話框、牌子、卡片與場景同一質感（紙張、暖棕細邊、柔影）。
- 場景圖上畫死的煙等效果，用遮罩挖掉再疊動態版（`SHOP_CLIP`）。
