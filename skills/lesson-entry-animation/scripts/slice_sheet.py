#!/usr/bin/env python3
"""進課動畫主題包：把「綠幕姿勢表／道具表」切成一張一張、去背、輸出 WebP。

用法（不需要安裝任何東西，uv 會臨時準備環境）：
  uv run --with pillow --with numpy --with scipy python scripts/lesson-entry/slice_sheet.py \
      <輸入圖> <輸出資料夾> --cols 3 --rows 2 --names idle,talk,wave,cheer,puzzled,point

做的事：
  1. 偵測綠幕顏色（取四個角落的中位數）。
  2. 依「比背景綠多少」算透明度，並對邊緣去綠邊（despill）。
  3. 依格子（cols×rows）把連通的像素分到各格，裁成一張一張，留邊距。
  4. 輸出每張 WebP（透明）＋ meta.json（原圖座標、腳底線）；加 --contact <路徑> 才會另外輸出棋盤格預覽圖（放在 public/ 以外）。
"""
import argparse
import json
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage


def key_color(rgb: np.ndarray) -> np.ndarray:
    h, w, _ = rgb.shape
    patch = 24
    corners = np.concatenate([
        rgb[:patch, :patch].reshape(-1, 3), rgb[:patch, -patch:].reshape(-1, 3),
        rgb[-patch:, :patch].reshape(-1, 3), rgb[-patch:, -patch:].reshape(-1, 3),
    ])
    return np.median(corners, axis=0)


def make_alpha(rgb: np.ndarray, key: np.ndarray, lo: float, hi: float) -> np.ndarray:
    """以「綠色超出紅藍的程度」判斷背景：背景很大、角色（白、粉、紅、棕）幾乎為 0。"""
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    greenness = g - np.maximum(r, b)
    key_green = float(key[1] - max(key[0], key[2]))
    t = greenness / max(key_green, 1.0)  # 0..1，1 = 跟背景一樣綠
    alpha = 1.0 - np.clip((t - lo) / (hi - lo), 0.0, 1.0)
    return alpha


def edge_zone(alpha: np.ndarray, width: int = 4) -> np.ndarray:
    """貼近背景（透明處）width 像素內的區域。去綠邊只在這裡做，才不會把物件本身的綠色（葉子、生菜）壓成灰色。"""
    return ndimage.binary_dilation(alpha < 0.5, iterations=width) & (alpha > 0.0)


def despill(rgb: np.ndarray, alpha: np.ndarray) -> np.ndarray:
    """邊緣的像素混到了綠色：把綠色壓到不超過紅藍的較大值。只作用在邊緣區域。"""
    out = rgb.copy()
    r, g, b = out[..., 0], out[..., 1], out[..., 2]
    limit = np.maximum(r, b)
    zone = edge_zone(alpha)
    g2 = np.where(zone & ((alpha < 0.999) | (g > limit + 6)), np.minimum(g, limit), g)
    out[..., 1] = g2
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("out")
    ap.add_argument("--cols", type=int, required=True)
    ap.add_argument("--rows", type=int, required=True)
    ap.add_argument("--names", required=True, help="由左到右、由上到下，逗號分隔")
    ap.add_argument("--pad", type=int, default=10)
    ap.add_argument("--min-area", type=int, default=60, help="小於這個像素數的碎屑會被丟掉")
    ap.add_argument("--lo", type=float, default=0.18)
    ap.add_argument("--hi", type=float, default=0.55)
    ap.add_argument("--quality", type=int, default=88)
    ap.add_argument("--detached", type=float, default=0.03, help="與主體分離、面積小於主體這個比例的碎塊（動態線、星星等）會被移除；設 0 保留")
    ap.add_argument("--contact", default=None, help="棋盤格預覽圖的輸出路徑（預設不輸出，免得預覽圖跟著 public/ 一起發佈）")
    ap.add_argument("--keep-yellowgreen", action="store_true", help="不要清掉黃綠色邊（預設會清，AI 生圖常在邊緣帶出這種亮邊）")
    a = ap.parse_args()

    names = [n.strip() for n in a.names.split(",")]
    if len(names) != a.cols * a.rows:
        sys.exit(f"名稱數量 {len(names)} ≠ 格數 {a.cols * a.rows}")

    img = Image.open(a.src).convert("RGB")
    rgb = np.asarray(img).astype(np.float32)
    H, W, _ = rgb.shape
    key = key_color(rgb)
    alpha = make_alpha(rgb, key, a.lo, a.hi)
    if not a.keep_yellowgreen:
        r_, g_, b_ = rgb[..., 0], rgb[..., 1], rgb[..., 2]
        sliver = (g_ >= r_ - 12) & ((g_ - b_) > 80) & edge_zone(alpha)
        alpha = np.where(sliver, 0.0, alpha)
    clean = despill(rgb, alpha)
    rgba = np.dstack([np.clip(clean, 0, 255), np.clip(alpha * 255, 0, 255)]).astype(np.uint8)

    # 連通區塊（以 alpha>0.5 為前景），依重心分到格子
    mask = alpha > 0.5
    labels, n = ndimage.label(mask, structure=np.ones((3, 3)))
    cw, ch = W / a.cols, H / a.rows
    cell_pixels = {i: np.zeros((H, W), dtype=bool) for i in range(a.cols * a.rows)}
    sizes = ndimage.sum(mask, labels, index=np.arange(1, n + 1))
    centers = ndimage.center_of_mass(mask, labels, index=np.arange(1, n + 1))
    dropped = 0
    for idx, ((cy, cx), size) in enumerate(zip(centers, sizes), start=1):
        if size < a.min_area:
            dropped += 1
            continue
        cell = int(cy // ch) * a.cols + int(cx // cw)
        cell_pixels[min(cell, a.cols * a.rows - 1)] |= (labels == idx)

    if a.detached > 0:
        for i in range(a.cols * a.rows):
            m = cell_pixels[i]
            if not m.any():
                continue
            lab, k = ndimage.label(m, structure=np.ones((3, 3)))
            areas = ndimage.sum(m, lab, index=np.arange(1, k + 1))
            big = areas.max()
            for j, ar in enumerate(areas, start=1):
                if ar < big * a.detached:
                    cell_pixels[i][lab == j] = False
                    dropped += 1

    os.makedirs(a.out, exist_ok=True)
    meta = {"source": os.path.basename(a.src), "sheet": [W, H], "key_color": [int(v) for v in key], "items": {}}
    thumbs = []
    for i, name in enumerate(names):
        m = cell_pixels[i]
        if not m.any():
            print(f"⚠ {name}：這一格沒有東西", file=sys.stderr)
            continue
        # 稍微擴張，把抗鋸齒的邊緣也包進來
        grown = ndimage.binary_dilation(m, iterations=3)
        ys, xs = np.where(grown)
        y0, y1 = max(ys.min() - a.pad, 0), min(ys.max() + a.pad + 1, H)
        x0, x1 = max(xs.min() - a.pad, 0), min(xs.max() + a.pad + 1, W)
        piece = rgba[y0:y1, x0:x1].copy()
        piece[..., 3] = np.where(grown[y0:y1, x0:x1], piece[..., 3], 0)
        im = Image.fromarray(piece, "RGBA")
        path = os.path.join(a.out, f"{name}.webp")
        im.save(path, "WEBP", quality=a.quality, method=6)
        sel = ys >= ys.max() - 28  # 腳的位置：最底下這一小段的水平中心，當作動畫的對齊點
        anchor_x = int(round(xs[sel].mean() - x0))
        meta["items"][name] = {
            "anchor": [anchor_x, int(ys.max() - y0)],
            "file": f"{name}.webp", "bbox_in_sheet": [int(x0), int(y0), int(x1), int(y1)],
            "size": [int(x1 - x0), int(y1 - y0)], "feet_y": int(ys.max() - y0),
            "bytes": os.path.getsize(path),
        }
        thumbs.append((name, im))

    # 棋盤格預覽：邊緣乾不乾淨一眼就看得出來
    if thumbs and a.contact:
        th = 300
        sheet = Image.new("RGBA", (th * len(thumbs), th + 28), (255, 255, 255, 255))
        for k, (name, im) in enumerate(thumbs):
            tile = Image.new("RGBA", (th, th), (255, 255, 255, 255))
            px = tile.load()
            for yy in range(th):
                for xx in range(th):
                    if ((xx // 12) + (yy // 12)) % 2:
                        px[xx, yy] = (214, 214, 224, 255)
            s = min((th - 10) / im.width, (th - 10) / im.height)
            r = im.resize((max(1, int(im.width * s)), max(1, int(im.height * s))), Image.LANCZOS)
            tile.alpha_composite(r, ((th - r.width) // 2, (th - r.height) // 2))
            sheet.paste(tile, (k * th, 0))
        sheet.convert("RGB").save(a.contact)

    with open(os.path.join(a.out, "meta.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)
    total = sum(v["bytes"] for v in meta["items"].values())
    print(f"完成：{len(meta['items'])} 張，合計 {total/1024:.0f} KB；背景色 {meta['key_color']}；丟掉碎屑 {dropped} 個")


if __name__ == "__main__":
    main()
