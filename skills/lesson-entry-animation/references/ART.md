# 主題包美術

一個主題包服務多堂課（例：小熊麵包坊 P1U W13～W18）。素材放 `public/lesson-entry/kits/<主題>/`。

| 現有主題包 | 用於 |
|---|---|
| `bakery` | P1U 小熊麵包坊 |
| `sea` | P1 海底城 |
| `glyphica` | P1U 字母要塞 |
| `detective` | S2 阿問偵探社 |
| `digital-lab` | S2 逃離數碼界 |
| `classroom` | S2 教室場景（S2-W07） |

## 來源優先順序

1. **遊戲本體現成的圖**：縮成 WebP 放進主題包，遊戲原檔保持原樣。
2. **遊戲的 3D 模型**：用 `scripts/boss-render/` 預渲染成姿勢圖（`render.html` 以 three.js 正交相機渲染、套遊戲貼圖；`pack.py` 裁成共用畫布＋腳底錨點的 WebP）。
3. **AI 生圖**（遊戲裡沒有的角色、道具）：給負責人英文提示詞，由負責人在 ChatGPT 生成；同一個對話連續生，讓風格一致。

## 生圖提示詞

每張都包含：

- **風格**：照該課遊戲的畫風描述（配色、描邊、質感）。
- **輸出**：`ONE image, landscape 3:2, pure green #00FF00 background, no gradient, no ground line, no shadow; 6 poses in a 3×2 grid, each pose complete and not touching grid lines, same scale and view; no green on the character.`
- **文字**：`Absolutely no text, letters, numbers, logos, watermark.`

姿勢固定六個：`idle talk wave cheer puzzled point`。生第二個角色時上傳第一張，要求 `same art style, face grammar, grain texture and proportions`。背景分層生成：遠景、主建築、前景（才能做景深與環境動畫）。

## 切圖

```bash
uv run --with pillow --with numpy --with scipy python scripts/lesson-entry/slice_collage.py <姿勢表.png> <輸出資料夾>
uv run --with pillow --with numpy --with scipy python scripts/lesson-entry/slice_sheet.py <姿勢表.png> <輸出資料夾> [--keep-yellowgreen] [--contact <預覽圖>] [--detached]
```

- AI 生的表不會照等寬格排，預設用 `slice_collage.py`（依連通區切、自動分開相黏的物件、丟遠處雜點）。
- 輸出 WebP＋`meta.json`（`size`、`anchor`＝腳底中心）。
- 切完做**棋盤格底＋紅框**接觸圖逐張檢查（有沒有被切掉的耳朵、夾帶隔壁的東西）；接觸圖放 public 以外的地方。

## 規格

- WebP；長邊 ≤ 1600 px；單檔 ≤ 250 KB；整包 ≤ 3 MB。
- 同一角色在每個畫面要一致；兩個角色要像同一個世界。
- 角色顏色與背景色要有明顯對比。
- 暫代素材在回報中標明，列入待補清單。
- 提示詞與生成日期記在 `docs/lesson-entry/kits/<主題>/KIT.md`。
