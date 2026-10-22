"""把 render.html 渲染出來的透明 PNG（C:/tmp/boss-render/*.png）裁成同一個畫布大小的 WebP＋meta.json。
所有姿勢共用同一個畫布與腳底錨點，所以不同姿勢放到舞台上大小一致（Spr 的 H＝整張畫布的顯示高度）。
用法：uv run --with pillow --with numpy python scripts/lesson-entry/boss-render/pack.py"""
import json, os
import numpy as np
from PIL import Image

SRC = "C:/tmp/boss-render/"
OUT = "public/lesson-entry/kits/bakery/boss/"
NAMES = ["stand", "walk", "slam", "charge", "panting", "defeated"]
MAX_H = 640  # 輸出畫布高度（像素）
PAD = 8
os.makedirs(OUT, exist_ok=True)
ims = {n: Image.open(SRC + n + ".png").convert("RGBA") for n in NAMES}
boxes = {}
for n, im in ims.items():
    a = np.asarray(im)[..., 3]
    ys, xs = np.where(a > 8)
    boxes[n] = (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)
x0 = max(0, min(b[0] for b in boxes.values()) - PAD); y0 = max(0, min(b[1] for b in boxes.values()) - PAD)
x1 = min(1000, max(b[2] for b in boxes.values()) + PAD); y1 = min(1000, max(b[3] for b in boxes.values()) + PAD)
# 錨點：站姿的腳底中心（畫布座標）；整個畫布用同一個
sb = boxes["stand"]
ax0 = (sb[0] + sb[2]) / 2 - x0; ay0 = sb[3] - y0
f = min(1.0, MAX_H / (y1 - y0))
w, h = int(round((x1 - x0) * f)), int(round((y1 - y0) * f))
meta = {"source": "hc-pilot boss_body/arml/armr.glb（遊戲 3D 模型，正交相機 az22 el9 渲染）", "sheet": [1000, 1000], "items": {}}
for n, im in ims.items():
    c = im.crop((x0, y0, x1, y1)).resize((w, h), Image.LANCZOS)
    p = OUT + n + ".webp"; c.save(p, "WEBP", quality=90, method=6)
    meta["items"][n] = {"anchor": [int(round(ax0 * f)), int(round(ay0 * f))], "file": n + ".webp", "size": [w, h], "feet_y": int(round(ay0 * f)), "bytes": os.path.getsize(p)}
json.dump(meta, open(OUT + "meta.json", "w"), ensure_ascii=False, indent=2)
print("canvas", w, "x", h, "anchor", meta["items"]["stand"]["anchor"], {n: meta["items"][n]["bytes"] for n in NAMES})
