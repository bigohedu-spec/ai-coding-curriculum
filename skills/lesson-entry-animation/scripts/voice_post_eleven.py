"""ElevenLabs 配音後製（voice-eleven.mjs 呼叫）：統一音量 → 放慢 0.88（音高與共振峰不變）→ 重算字幕時間與音檔長度。
做法照 S2-W12（scripts/lesson-entry/s2w12-pace-audio.py）：
  - 音量：rms ≤ 0.1、峰值 ≤ 0.8，只往下調，不拉高。
  - 放慢：ffmpeg rubberband tempo=0.88 pitch=1 formant=preserved（負責人 2026-10-14 要求對話放慢）。
  - 字幕時間 at 要除以 0.88（音檔變長了），長度 dur 用輸出的 mp3 實際量。
  - 逐句驗證：字數＝有聲字數、時間單調遞增、最後一個字在音檔裡。"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

RATE = 0.88
PUNCT = "，、。！？～：； "

job = json.loads(Path(sys.argv[1]).read_text("utf-8"))
raw_dir, out_dir, ffmpeg = Path(job["raw_dir"]), Path(job["out_dir"]), job["ffmpeg"]
meta_raw = json.loads(Path(job["raw_meta"]).read_text("utf-8"))
out_dir.mkdir(parents=True, exist_ok=True)

meta = {}
for clip in job["ids"]:
    line = dict(meta_raw[clip])
    src = raw_dir / f"{clip}.mp3"
    x, sr = sf.read(src)
    if x.ndim > 1:
        x = x.mean(axis=1)
    peak, rms = float(np.max(np.abs(x))), float(np.sqrt(np.mean(x * x)))
    gain = min(1.0, 0.1 / (rms + 1e-9), 0.8 / (peak + 1e-9))
    dst = out_dir / f"{clip}.mp3"
    subprocess.run([ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-i", str(src), "-af",
                    f"volume={gain},rubberband=tempo={RATE}:pitch=1:formant=preserved",
                    "-codec:a", "libmp3lame", "-b:a", "96k", "-ac", "1", str(dst)], check=True)
    y, sr2 = sf.read(dst)
    if y.ndim > 1:
        y = y.mean(axis=1)
    line["dur"] = round(len(y) / sr2, 3)
    line["at"] = [round(t / RATE, 4) for t in line["at"]]
    expected = len([c for c in line["text"] if c not in PUNCT])
    assert len(line["at"]) == expected, (clip, "字數", len(line["at"]), expected)
    assert all(a <= b for a, b in zip(line["at"], line["at"][1:])), (clip, "時間不是遞增")
    assert not line["at"] or max(line["at"]) < line["dur"], (clip, "字幕超出音檔")
    line["peak"] = round(float(np.max(np.abs(y))), 4)
    meta[clip] = line

# 檔案裡不放 peak（只在這裡報告），保持跟其他堂一樣的格式
peaks = {k: v.pop("peak") for k, v in meta.items()}
Path(job["out_json"]).parent.mkdir(parents=True, exist_ok=True)
Path(job["out_json"]).write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", "utf-8")
total = sum(v["dur"] for v in meta.values())
size = sum(f.stat().st_size for f in out_dir.glob("*.mp3")) / 1024
print(f"完成 {len(meta)} 句：總長 {total:.1f} 秒、最大峰值 {max(peaks.values())}、mp3 共 {size:.0f} KB（tempo {RATE}、音高不變）")
