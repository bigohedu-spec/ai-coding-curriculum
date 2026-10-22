"""阿問的機器人聲後製 v2：乾淨的機器人質感，不刺耳、不破音。

    uv run --with numpy --with scipy --with librosa python scripts/lesson-entry/robotize.py <raw 資料夾> <輸出資料夾>

v1（環形調變＋降取樣顆粒）被負責人退件：「太電了、會破音」。原因量過：
  - 環形調變（35～50 Hz）＝嗡嗡電流聲；降取樣＝沙沙顆粒。
  - 後製版被正規化到峰值 0.89，比原音（峰值 0.16）大聲約 11 dB，和偵探接著播很刺耳。
v2 做法（都保留原本的語速）：
  - 主聲音稍微升調（相位聲碼器，不變快）。
  - 疊一層「高八度」的淡淡和聲＝晶片／電子感，取代環形調變。
  - 很短的金屬回音（10 ms、低回授）＝機殼共鳴。
  - 喇叭等化：切掉 150 Hz 以下與 7 kHz 以上的刺耳高頻。
  - 頭尾 15 ms 淡入淡出（不爆音）、柔性限幅、**所有檔案統一響度**（RMS −20 dB、峰值 ≤ 0.7）。
三種強度：R1 輕、R2 中、R3 明顯。偵探原音也輸出統一響度的版本（det-*.wav）。
"""
import sys
from pathlib import Path

import librosa
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

TARGET_RMS_DB = -20.0
PEAK_LIMIT = 0.7


def load(p):
    sr, x = wavfile.read(p)
    x = x.astype(np.float32) / 32768.0
    if x.ndim > 1:
        x = x.mean(axis=1)
    return sr, x


def shift(x, sr, semis):
    return librosa.effects.pitch_shift(x, sr=sr, n_steps=semis) if semis else x


def slap(x, sr, ms, fb, mix):
    d = max(1, int(sr * ms / 1000))
    y = np.zeros_like(x)
    buf = x.copy()
    # 有限次數的回授（4 次），不用逐點迴圈
    g = 1.0
    for k in range(1, 5):
        g *= fb
        y[k * d:] += g * buf[: len(buf) - k * d]
    return x + mix * y


def eq(x, sr, lo=150, hi=7000):
    sos = butter(2, [lo, hi], btype="band", fs=sr, output="sos")
    return sosfilt(sos, x)


def fade(x, sr, ms=15):
    n = int(sr * ms / 1000)
    x = x.copy()
    x[:n] *= np.linspace(0, 1, n)
    x[-n:] *= np.linspace(1, 0, n)
    return x


def loudness(x):
    rms = np.sqrt(np.mean(x ** 2)) or 1e-9
    x = x * (10 ** (TARGET_RMS_DB / 20) / rms)
    # 柔性限幅：超過門檻的部分用 tanh 壓，不硬切
    t = PEAK_LIMIT * 0.8
    over = np.abs(x) > t
    x[over] = np.sign(x[over]) * (t + (PEAK_LIMIT - t) * np.tanh((np.abs(x[over]) - t) / (PEAK_LIMIT - t)))
    return x


PRESETS = {
    "R1": dict(semis=1.0, octave=0.10, ms=10, fb=0.25, mix=0.20),
    "R2": dict(semis=1.5, octave=0.18, ms=11, fb=0.35, mix=0.28),
    "R3": dict(semis=2.0, octave=0.28, ms=12, fb=0.45, mix=0.36),
}


def robot(x, sr, semis, octave, ms, fb, mix):
    main = shift(x, sr, semis)
    hi = shift(x, sr, semis + 12)
    y = main + octave * hi
    y = slap(y, sr, ms, fb, mix)
    return eq(y, sr)


def save(p, sr, y):
    y = loudness(fade(y, sr))
    wavfile.write(p, sr, (y * 32767).astype(np.int16))


def main():
    src, dst = Path(sys.argv[1]), Path(sys.argv[2])
    dst.mkdir(parents=True, exist_ok=True)
    for f in sorted(src.glob("bot-*.wav")):
        sr, x = load(f)
        save(dst / f"{f.stem}-R0.wav", sr, eq(x, sr))  # 原音（統一響度）
        for tag, p in PRESETS.items():
            save(dst / f"{f.stem}-{tag}.wav", sr, robot(x, sr, **p))
        print("ok", f.stem)
    for f in sorted(src.glob("det-*.wav")):
        sr, x = load(f)
        save(dst / f.name, sr, eq(x, sr, 80, 10000))
        print("ok", f.stem)


if __name__ == "__main__":
    main()
