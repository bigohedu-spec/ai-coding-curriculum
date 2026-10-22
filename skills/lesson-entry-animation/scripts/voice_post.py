"""進課動畫配音後製：統一響度、（阿問）機器人後製、算出每個字的發聲時間（卡拉 OK 字幕用）、存成 mp3。

    uv run --with numpy --with scipy --with librosa --with soundfile python scripts/lesson-entry/voice_post.py <jobs.json>

jobs.json（由 voice-build.mjs 產生）：{ "out_audio": 資料夾, "out_json": 檔案, "items": [{id, who, text, raw, robot}] }
輸出：
  <out_audio>/<id>.mp3
  <out_json>：{ id: { who, text, dur, at: [每個「有聲字」的開始秒數] } }
    「有聲字」＝ animalese.tokenize() 的 token：標點（，。！？、～：；）與空白不算；本系列台詞只用中文字（不用英文字母）。

每個字的時間怎麼算：
  1. 用 10 ms 的能量包絡找「有聲音的段落」（中間靜音 ≥ 90 ms 才算斷開）。
  2. 台詞依標點切成小句；小句數＝段落數時一句對一段，否則把所有有聲時間依字數比例分給小句。
  3. 小句裡的字平均分配在那一段裡。
"""
import json
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

sys.path.insert(0, str(Path(__file__).parent))
from robotize import PRESETS, eq, fade, load, loudness, robot  # noqa: E402

PUNCT = set("，。！？、～：；,.!?:; ")


def voiced_segments(x, sr, frame_ms=10, gap_ms=90, thr_db=-38):
    n = int(sr * frame_ms / 1000)
    frames = len(x) // n
    rms = np.array([np.sqrt(np.mean(x[i * n:(i + 1) * n] ** 2)) for i in range(frames)]) + 1e-9
    db = 20 * np.log10(rms / rms.max())
    on = db > thr_db
    segs, start, silent = [], None, 0
    for i, v in enumerate(on):
        if v:
            if start is None:
                start = i
            silent = 0
        elif start is not None:
            silent += 1
            if silent * frame_ms >= gap_ms:
                segs.append([start, i - silent + 1])
                start, silent = None, 0
    if start is not None:
        segs.append([start, frames])
    return [(a * frame_ms / 1000, b * frame_ms / 1000) for a, b in segs if (b - a) * frame_ms >= 40]


def chunks_of(text):
    out, cur = [], []
    for ch in text:
        if ch in PUNCT:
            if cur:
                out.append(cur)
                cur = []
        else:
            cur.append(ch)
    if cur:
        out.append(cur)
    return out


def char_times(text, segs, sizes=None):
    if sizes:
        # 有英文的台詞（S5 起）：voice-build.mjs 已依字幕的切法（英文依音節）算好每個小句的有聲字數
        ch = [[None] * n for n in sizes]
    else:
        ch = chunks_of(text)
        for c in ch:
            for x in c:
                if x.isascii():
                    raise ValueError(f"台詞只能用中文字（字幕時間對不上英文）：{text}")
    if not segs:
        return []
    if len(segs) != len(ch):
        # 段落數對不上：把全部有聲時間串起來，依字數比例分
        total = sum(b - a for a, b in segs)
        n = sum(len(c) for c in ch)
        times, acc = [], 0.0

        def at(t):  # 把「有聲時間軸上的第 t 秒」換回真實時間
            for a, b in segs:
                if t <= b - a:
                    return a + t
                t -= b - a
            return segs[-1][1]

        for c in ch:
            for _ in c:
                times.append(at(acc))
                acc += total / n
        return times
    times = []
    for c, (a, b) in zip(ch, segs):
        step = (b - a) / len(c)
        times += [a + i * step for i in range(len(c))]
    return times


def pace(y, sr, gap=None, rate=None):
    """S5 起（負責人 2026-10-15：小五不用像低年級那麼慢）：語氣指示叫不快，改在後製加快。
    gap＝句中停頓最長留幾秒（多的剪掉，交界做 10 ms 交叉淡化）；rate＝整體加速倍率（librosa 時間伸縮，不變調）。都沒給就原樣。"""
    if gap:
        segs = voiced_segments(y, sr)
        if len(segs) > 1:
            parts, xf = [], int(0.01 * sr)
            keep = int(gap * sr)
            last = 0
            for (a, b), (a2, _) in zip(segs, segs[1:]):
                end = int(b * sr)
                parts.append(y[last:end])
                g0, g1 = end, int(a2 * sr)
                if g1 - g0 > keep:
                    half = keep // 2
                    parts.append(y[g0:g0 + half])
                    last = g1 - (keep - half)
                else:
                    last = end
            parts.append(y[last:])
            out = parts[0]
            for p in parts[1:]:
                if len(out) > xf and len(p) > xf:
                    ramp = np.linspace(0, 1, xf)
                    mid = out[-xf:] * (1 - ramp) + p[:xf] * ramp
                    out = np.concatenate([out[:-xf], mid, p[xf:]])
                else:
                    out = np.concatenate([out, p])
            y = out
    if rate and abs(rate - 1) > 1e-3:
        import librosa
        y = librosa.effects.time_stretch(y.astype(np.float32), rate=rate)
    return y


def main():
    jobs = json.loads(Path(sys.argv[1]).read_text("utf-8"))
    out_audio = Path(jobs["out_audio"])
    out_audio.mkdir(parents=True, exist_ok=True)
    result = {}
    for it in jobs["items"]:
        sr, x = load(it["raw"])
        y = robot(x, sr, **PRESETS[it["robot"]]) if it.get("robot") else eq(x, sr, 80, 10000)
        y = pace(y, sr, it.get("gap"), it.get("rate"))
        y = loudness(fade(y, sr))
        # 頭尾的靜音修掉一點（留 60 ms），旁白才準時開口
        segs = voiced_segments(y, sr)
        if segs:
            a = max(0.0, segs[0][0] - 0.06)
            b = min(len(y) / sr, segs[-1][1] + 0.12)
            y = y[int(a * sr):int(b * sr)]
            segs = voiced_segments(y, sr)
        sf.write(out_audio / f"{it['id']}.mp3", y.astype(np.float32), sr, format="MP3", subtype="MPEG_LAYER_III")
        times = char_times(it["text"], segs, it.get("sizes"))
        result[it["id"]] = {"who": it["who"], "text": it["text"], "dur": round(len(y) / sr, 3), "at": [round(t, 3) for t in times], "segs": len(segs)}
        print(f"ok {it['id']:12} {len(y) / sr:5.2f}s 段落 {len(segs)} / 小句 {len(chunks_of(it['text']))}")
    Path(jobs["out_json"]).write_text(json.dumps(result, ensure_ascii=False, indent=1), "utf-8")


if __name__ == "__main__":
    main()
