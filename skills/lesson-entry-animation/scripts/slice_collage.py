"""切 GPT 生的「多張表拼成一張」的圖（P1U-W01 sea 主題包用過）。依實際圖形（連通區）切，不假設等寬格子。
用法：改下面的 SRC／OUT 與最後幾行的區塊座標、數量、檔名，然後
  PYTHONIOENCODING=utf-8 uv run --with pillow --with numpy --with scipy python scripts/lesson-entry/slice_collage.py
為什麼不照格子切：GPT 不會把東西放在等寬格子裡，照格子切會切掉超出格線的部分、又把隔壁的東西切進來（2026-10-08 踩過）。
1. 整張表綠幕去背 → 不透明遮罩
2. 小膨脹（4px）後找連通區 → 大塊＝素材主體；小塊（發光線、星星、z）歸給最近的主體
3. 依列（y）再依行（x）排序命名
4. 每張只取自己那幾塊的像素（其他素材的像素一律透明），裁到範圍、加一點邊"""
import json
import numpy as np
from PIL import Image
from scipy import ndimage

SRC = "C:/Users/COSH/Desktop/ref-kit/sea/v1/collage-2026-10-08.webp"
OUT = "C:/Users/COSH/Desktop/CodingClass/gpt-clone-entry-p1/public/lesson-entry/kits/sea/"
full = np.asarray(Image.open(SRC).convert("RGB")).astype(np.float32)

def key(rgb):
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    greenness = g - np.maximum(r, b)
    alpha = np.clip(1 - (greenness - 30) / 60, 0, 1)
    out = rgb.copy()
    spill = np.clip(greenness, 0, None)
    out[..., 1] = np.where(greenness > 0, np.maximum(r, b) + np.clip(greenness - spill, 0, None), g)  # 綠色壓回 max(r,b)：去綠邊
    return out, alpha

def slice_sheet(box, n_expected, names, meta, rows):
    x0, y0, x1, y1 = box
    # 修掉區塊邊緣的白色分隔線（超過一半不是綠的列／行）：不修會把整張表的素材連成一塊
    def mostly_solid(reg): return (reg[..., 1] - np.maximum(reg[..., 0], reg[..., 2]) < 60).mean() > 0.5
    while mostly_solid(full[y0:y0 + 1, x0:x1]): y0 += 1
    while mostly_solid(full[y1 - 1:y1, x0:x1]): y1 -= 1
    while mostly_solid(full[y0:y1, x0:x0 + 1]): x0 += 1
    while mostly_solid(full[y0:y1, x1 - 1:x1]): x1 -= 1
    # 分隔帶的模糊邊：邊緣那一列／行只要有 5% 以上是白色（不是綠、也不是素材的深色描邊）就再修掉
    def whitish(reg): return ((reg.min(axis=-1) > 170) & (reg[..., 1] - np.maximum(reg[..., 0], reg[..., 2]) < 60)).mean() > 0.05
    while whitish(full[y0:y0 + 1, x0:x1]): y0 += 1
    while whitish(full[y1 - 1:y1, x0:x1]): y1 -= 1
    while whitish(full[y0:y1, x0:x0 + 1]): x0 += 1
    while whitish(full[y0:y1, x1 - 1:x1]): x1 -= 1
    print("  區塊", (x0, y0, x1, y1))
    rgb, a = key(full[y0:y1, x0:x1])
    a[:3, :] = 0; a[-3:, :] = 0; a[:, :3] = 0; a[:, -3:] = 0  # 最外圈 3px：分隔帶的淺綠模糊邊
    solid = a > 0.35
    grown = ndimage.binary_dilation(solid, iterations=3)
    # 上下（或左右）兩個素材碰在一起時會連成一塊：大小超過其他主體中位數 1.6 倍的，就在它中段最細的地方切開，重算
    for _ in range(6):
        lab, n = ndimage.label(grown)
        sizes = ndimage.sum(np.ones_like(a), lab, range(1, n + 1))
        top = np.sort(sizes)[::-1][:n_expected]
        med = np.median(top)
        big = [i + 1 for i in range(n) if sizes[i] > 1.6 * med]
        if not big: break
        for bidx in big:
            m = lab == bidx
            ys, xs = np.where(m); h, w = ys.max() - ys.min(), xs.max() - xs.min()
            if h >= w * 0.9:  # 直的：找中段最細的一列
                prof = m.sum(axis=1); lo, hi = ys.min() + int(h * 0.3), ys.min() + int(h * 0.7)
                cut = lo + int(np.argmin(prof[lo:hi])); grown[cut - 1:cut + 2, :] &= ~m[cut - 1:cut + 2, :]
            else:
                prof = m.sum(axis=0); lo, hi = xs.min() + int(w * 0.3), xs.min() + int(w * 0.7)
                cut = lo + int(np.argmin(prof[lo:hi])); grown[:, cut - 1:cut + 2] &= ~m[:, cut - 1:cut + 2]
            print("  切開一塊連在一起的（", "上下" if h >= w * 0.9 else "左右", "）")
    order = np.argsort(-sizes)
    mains = [int(i) + 1 for i in order[:n_expected]]
    smalls = [int(i) + 1 for i in order[n_expected:] if sizes[i] > 15]
    assert min(sizes[m - 1] for m in mains) > 3 * max([sizes[s - 1] for s in smalls] + [1]) or not smalls, f"主體和碎片分不開：{sorted(sizes, reverse=True)[:n_expected + 3]}"
    cent = {m: ndimage.center_of_mass(lab == m) for m in mains}
    # 碎片歸給最近的主體（用主體像素到碎片中心的距離）
    group = {m: [m] for m in mains}
    for sidx in smalls:
        cy, cx = ndimage.center_of_mass(lab == sidx)
        pts = np.argwhere(lab == sidx)
        if np.ptp(pts[:, 0]) <= 3 + 6 and np.ptp(pts[:, 1]) > 3 * np.ptp(pts[:, 0]):  # 很扁的橫線（含膨脹的 6px）＝分隔線殘渣
            print("  丟掉橫線殘渣", int(sizes[sidx - 1]), "px"); continue
        dist = {m: np.sqrt(np.min(((np.argwhere(lab == m)[::7][:, None, :] - pts[::5][None, :, :]) ** 2).sum(-1))) for m in mains}
        best = min(dist, key=dist.get)
        if dist[best] <= 28: group[best].append(sidx)  # 太遠的是隔壁素材的殘渣，丟掉
        else: print("  丟掉遠處雜點", int(sizes[sidx - 1]), "px，距離", int(dist[best]))
    # 排序：先分列（rows 列），再依 x
    ys = sorted(mains, key=lambda m: cent[m][0])
    per = n_expected // rows
    ordered = []
    for r in range(rows):
        ordered += sorted(ys[r * per:(r + 1) * per], key=lambda m: cent[m][1])
    for name, m in zip(names, ordered):
        mine = np.isin(lab, group[m])  # 膨脹後的區域（含邊緣反鋸齒）
        aa = np.where(mine, a, 0)
        yy, xx = np.where(aa > 0.03)
        by0, by1, bx0, bx1 = max(0, yy.min() - 2), yy.max() + 3, max(0, xx.min() - 2), xx.max() + 3
        rgba = np.dstack([rgb[by0:by1, bx0:bx1], aa[by0:by1, bx0:bx1] * 255]).clip(0, 255).astype(np.uint8)
        img = Image.fromarray(rgba, "RGBA")
        img.save(OUT + "chars/" + name + ".webp", "WEBP", quality=90)
        w, h = img.size
        # 碰到表格邊界＝原圖本身就被裁到（不是我切壞的），記下來
        edge = by0 == 0 or bx0 == 0 or by1 >= a.shape[0] or bx1 >= a.shape[1]
        meta["items"][name] = {"size": [w, h], "anchor": [w // 2, h], "from": "ref-kit/sea/v1/collage-2026-10-08.webp（縮圖拼貼，依連通區切，暫用版）", "placeholder": True, **({"touches_sheet_edge": True} if edge else {})}
        print(f"{name:14s} {w}x{h}  碎片{len(group[m]) - 1}{'  ⚠碰到表格邊' if edge else ''}")

meta = json.load(open(OUT + "chars/meta.json", encoding="utf-8"))
slice_sheet((0, 0, 766, 344), 6, ["dot-idle", "dot-talk", "dot-wave", "dot-cheer", "dot-sleep", "dot-point"], meta, 2)
slice_sheet((770, 0, 1536, 344), 6, ["rm-normal", "rm-left", "rm-right", "rm-wheel", "rm-press", "rm-hand"], meta, 2)
slice_sheet((0, 369, 766, 673), 8, ["monitor", "cursor", "desk", "shards", "lock", "unlock", "medal", "hand"], meta, 2)
slice_sheet((770, 369, 1536, 673), 6, ["crab-idle", "crab-talk", "crab-wave", "crab-cheer", "crab-puzzled", "crab-point"], meta, 2)
json.dump(meta, open(OUT + "chars/meta.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
