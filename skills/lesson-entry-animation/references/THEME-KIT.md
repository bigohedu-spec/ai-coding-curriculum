# 新主題包（美術）怎麼做

一個主題包服務很多堂課（小熊麵包坊一包用 W13～W18）。**美術是每個主題做一次的素材包**，動畫程式共用。完整實例：`docs/lesson-entry/kits/bakery/KIT.md`（提示詞全文與生成紀錄）、`STYLE.md`（風格拆解）。

## 流程

1. **風格鎖定（Gate K）**：沿用「風格 C」（剪影純色塊、角色無描邊、紙張顆粒、3～4 色群、一個標誌配件）。新主題只換色票與角色，不換畫風。
2. **我給提示詞，負責人在 ChatGPT 生圖**（同一個對話，讓它記住風格）。提示詞用**英文**，**不要讓 AI 畫文字**。順序：
   - P1 主角姿勢表 → 通過後上傳再生 P2 第二角色（要求 same art style, face grammar, grain texture and proportions）。
   - P3a 遠景、P3b 主建築、P3c 前景（分層，才能做景深與環境動畫）；P3d 夜景、P3e 室內等用到再做。
   - P4 道具貼紙。
3. 負責人下載最大尺寸 PNG 放到指定資料夾（`C:\Users\COSH\Desktop\ref-kit\<主題>\v2\`）。
4. **我用 `slice_sheet.py` 切圖去背**：
   ```bash
   uv run --with pillow --with numpy --with scipy python scripts/lesson-entry/slice_sheet.py <姿勢表.png> <輸出資料夾> [--keep-yellowgreen] [--contact <預覽圖路徑>] [--detached]
   ```
   輸出 WebP＋`meta.json`（每張的 `size`、`anchor`＝腳底中心），放進 `public/lesson-entry/kits/<主題>/…`。
5. 把每張用的提示詞與日期記到 `docs/lesson-entry/kits/<主題>/KIT.md`。
6. 負責人看過（兩個角色像不像一家人、背景合不合）才進動態。

## 共同提示詞區塊（每張都貼）

**STYLE_C**（英文原文在 `kits/bakery/KIT.md` §1，複製使用，改色票即可）：flat 2D editorial illustration…，solid flat color shapes，**NO black outline around the character**，NO gradients/glossy/3D，統一臉部語法（兩顆實心黑圓眼各一個小白點、淺色嘴鼻區、一條微笑線），每個角色**一個**色塊配件當記號，微弱紙與鉛筆顆粒，道具與背景可有細的手繪線，色票 3～4 色群，**Absolutely no text, letters, numbers, logos, watermark**。

**OUTPUT_SHEET**：ONE image, landscape 3:2，**純綠 #00FF00 背景**無漸層無地線無陰影；六個姿勢 3 欄 2 列等大格，每個姿勢完整、不碰格線、同比例同視角；角色身上**不可有綠色**。

姿勢固定六個：`idle talk wave cheer puzzled point`。

## 檔案預算

WebP；長邊 ≤ 1600 px；單檔 ≤ 250 KB；整包 ≤ 3 MB。

## 現有主題包

| 主題包 | 內容 | 服務課程 | 缺的素材（暫代中） |
|---|---|---|---|
| bakery（小熊麵包坊） | 小兔、小熊（各六姿勢）、遠景、店面、前景（灌木／漿果叢／花／麥穗／柵欄／盆）、道具（麵包、可頌、麵團、果醬、三明治、麥穗、金幣、鈴鐺） | P1U W13～W18 | **W14 美術規格已開：`docs/lesson-entry/kits/bakery/ART-SPEC-W14.md`（P5～P11 提示詞）**；待生圖：小松鼠、小狐狸、AI 機器人、搬運機器人、工廠道具、步驟圖示、工廠場景；其他：頭部表情表、夜景、室內 |
