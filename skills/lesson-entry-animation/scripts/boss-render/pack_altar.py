"""把 render.html 的 renderAltar() 渲染出的 altar.png 裁成 altar.webp，縮放比例與巨型機器人姿勢圖一致（同樣的像素／單位），
並把 altar 加進 boss/meta.json。先跑 pack.py（產生 boss 的 meta），再跑這個。
用法：uv run --with pillow --with numpy python scripts/lesson-entry/boss-render/pack_altar.py"""
import json, os
import numpy as np
from PIL import Image

SRC = "C:/tmp/boss-render/"
OUT = "public/lesson-entry/kits/bakery/boss/"
NAMES = ["stand", "walk", "slam", "charge", "panting", "defeated"]
PAD, MAX_H = 8, 640
def bbox(im):
    a = np.asarray(im.convert("RGBA"))[..., 3]; ys, xs = np.where(a > 8); return xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
# 與 pack.py 同一套算法，得到同一個縮放比例 f
bs = [bbox(Image.open(SRC + n + ".png")) for n in NAMES]
y0 = max(0, min(b[1] for b in bs) - PAD); y1 = min(1000, max(b[3] for b in bs) + PAD)
f = min(1.0, MAX_H / (y1 - y0))
im = Image.open(SRC + "altar.png").convert("RGBA")
x0, ya, x1, yb = bbox(im)
c = im.crop((x0 - PAD, ya - PAD, x1 + PAD, yb + PAD)); w, h = int(round(c.width * f)), int(round(c.height * f))
c = c.resize((w, h), Image.LANCZOS); p = OUT + "altar.webp"; c.save(p, "WEBP", quality=90, method=6)
meta = json.load(open(OUT + "meta.json"))
ay = int(round((yb - ya + PAD) * f))  # 底部（落地點）
meta["items"]["altar"] = {"anchor": [w // 2, ay], "file": "altar.webp", "size": [w, h], "feet_y": ay, "bytes": os.path.getsize(p)}
json.dump(meta, open(OUT + "meta.json", "w"), ensure_ascii=False, indent=2)
print("altar", w, "x", h, "f=%.3f" % f)
