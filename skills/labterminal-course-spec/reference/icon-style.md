# Icon 統一生成風格（對應 CLAUDE.md 第二十節）

> 課程內**禁用任何 emoji / Unicode 符號**。所有圖示一律用 text-to-image（Lab Image / Gemini 等）生成 PNG，存 `assets/icons/`。
> 每個圖示 = 「主體描述」+「下方統一風格後綴」，確保全課風格一致。

## 統一風格後綴（每個 icon prompt 都接這段）

```
BOLD modern flat-design vector icon, vibrant saturated colors
(purple #7C3AED, amber #F59E0B, teal #14B8A6, pink #EC4899),
thick black outlines 3-4px, sticker-like with subtle gradient shading,
playful child-friendly Duolingo-style mascot icon,
NO text NO letters NO words in image, centered single subject,
clean white background, square 1:1 ratio, simple distinct shapes, high contrast.
```

## 用法範例

| 想要的圖示 | 完整 prompt |
|-----------|------------|
| 金幣 | `a shiny gold coin with a star, ` + 統一風格後綴 |
| AI 終端機 | `a friendly computer terminal robot face, ` + 統一風格後綴 |
| 技能磚塊 | `a glowing skill badge block, ` + 統一風格後綴 |
| 先行者徽章 | `a winner medal with ribbon, ` + 統一風格後綴 |

## 規則
- 主體一律「單一物件、置中、白底、1:1」。
- prompt 內**不可要求任何文字 / 字母**（NO text）。
- 同一課所有圖示用同一後綴，不可中途換風格。
