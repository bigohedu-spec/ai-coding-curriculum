#!/usr/bin/env node
/* 進課動畫配音（ElevenLabs 版，S2 模組二「逃離數碼界」起用；做法照 S2-W12）：
 *   node scripts/lesson-entry/voice-eleven.mjs S2-W07            # 只生成新的／改過的句子（依「文字＋聲線」快取）
 *   node scripts/lesson-entry/voice-eleven.mjs S2-W07 --only p1-goal,p4-try   # 只重生指定幾句
 *   node scripts/lesson-entry/voice-eleven.mjs S2-W07 --force    # 全部重生
 * 輸入：scripts/lesson-entry/voice-lines/<堂代號>.json
 *   voices.<角色>＝{ provider:"elevenlabs", voice:<voice_id>, model:"eleven_v3" }（小研究員＝男聲 C、同學＝女聲 A，兩個聲線 id 與 W12 相同）
 *   lines[]＝{ id, who, text, tag? }：text 就是字幕原文；tag 是 eleven_v3 的情緒標籤（excited／curious／cheerful／surprised…），只影響語氣、不會被念出來也不進字幕。
 * 流程：①逐句呼叫 /text-to-speech/<voice>/with-timestamps，取得音檔＋每個字的發聲時間 → ②voice_post_eleven.py：統一音量、放慢（tempo 0.88，音高與共振峰不變）、
 *   重算字幕時間 → 輸出
 *     public/lesson-entry/voice/<堂代號>/<id>.mp3
 *     src/config/lessonEntry/voice/<堂代號>.json（who／text／dur／每字時間 at，字幕與頁面用）
 * 原始回應快取在 scripts/lesson-entry/.voice-cache/（不進 repo）。金鑰只從 .env.local 讀（ELEVENLABS_API_KEY），不會印出來。
 * 台詞規則同 VOICE-TTS.md：只用中文字與 ，。！？、～：；；「AI」念成「人工智慧」、英文工具名用中文（Lab Terminal＝實驗終端機）。 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execFileSync } from "child_process";

const ROOT = path.resolve(".");
const code = process.argv[2];
if (!code) { console.error("用法：node scripts/lesson-entry/voice-eleven.mjs <堂代號> [--only id,id] [--force]"); process.exit(1); }
const FORCE = process.argv.includes("--force");
const onlyArg = process.argv.indexOf("--only");
const ONLY = onlyArg > 0 ? new Set(process.argv[onlyArg + 1].split(",")) : null;
const env = Object.fromEntries(fs.readFileSync(path.join(ROOT, ".env.local"), "utf8").split(/\r?\n/).filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).replace(/^"|"$/g, "")]));
if (!env.ELEVENLABS_API_KEY) { console.error("缺 ELEVENLABS_API_KEY（.env.local）"); process.exit(1); }
const spec = JSON.parse(fs.readFileSync(path.join(ROOT, `scripts/lesson-entry/voice-lines/${code}.json`), "utf8"));
const CACHE = path.join(ROOT, "scripts/lesson-entry/.voice-cache");
const RAW = path.join(CACHE, `${code}-raw`);
fs.mkdirSync(RAW, { recursive: true });
const PUNCT = /[，、。！？～：；\s]/;

const rawMetaPath = path.join(CACHE, `${code}-raw.json`);
const rawMeta = fs.existsSync(rawMetaPath) ? JSON.parse(fs.readFileSync(rawMetaPath, "utf8")) : {};

let made = 0, reused = 0;
for (const ln of spec.lines) {
  const v = spec.voices[ln.who];
  if (!v) throw new Error(`沒有這個角色：${ln.who}`);
  if (v.provider !== "elevenlabs") throw new Error(`${ln.id}：這支工具只處理 elevenlabs 聲線`);
  if (/[A-Za-z]/.test(ln.text)) throw new Error(`${ln.id}：台詞不能有英文字母（字幕時間會對不上）：${ln.text}`);
  const speech = (ln.tag ? `[${ln.tag}] ` : "") + ln.text;
  const body = { text: speech, model_id: v.model, language_code: "zh", voice_settings: { stability: 0.5, similarity_boost: 0.75 } };
  const hash = crypto.createHash("sha256").update(JSON.stringify([v.voice, body])).digest("hex").slice(0, 16);
  const cacheFile = path.join(CACHE, `eleven-${hash}.json`);
  const wanted = !ONLY || ONLY.has(ln.id);
  let j;
  if (fs.existsSync(cacheFile) && !(FORCE && wanted)) { j = JSON.parse(fs.readFileSync(cacheFile, "utf8")); reused++; }
  else {
    if (ONLY && !wanted) { if (!rawMeta[ln.id]) throw new Error(`--only 時，${ln.id} 還沒有舊檔可沿用`); continue; }
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${v.voice}/with-timestamps?output_format=mp3_44100_128`, {
      method: "POST", headers: { "xi-api-key": env.ELEVENLABS_API_KEY, "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error(`ElevenLabs ${ln.id} 失敗：HTTP ${r.status} ${(await r.text()).slice(0, 200)}`);
    j = await r.json();
    fs.writeFileSync(cacheFile, JSON.stringify(j));
    made++; console.log(`生成 ${ln.id}「${ln.text}」`);
  }
  // 每個「有聲字」的開始時間：沿著 alignment 的字元依序對上字幕的字（標籤 [..] 跳過）
  const a = j.normalized_alignment || j.alignment;
  const chars = Array.from(ln.text).filter((c) => !PUNCT.test(c));
  const at = []; let cursor = 0, inTag = false;
  for (let i = 0; i < a.characters.length && cursor < chars.length; i++) {
    const ch = a.characters[i];
    if (ch === "[") { inTag = true; continue; }
    if (ch === "]") { inTag = false; continue; }
    if (inTag) continue;
    if (ch === chars[cursor]) { at.push(a.character_start_times_seconds[i]); cursor++; }
  }
  if (cursor !== chars.length) throw new Error(`${ln.id}：字幕和配音的字對不上（${cursor}/${chars.length}）`);
  fs.writeFileSync(path.join(RAW, `${ln.id}.mp3`), Buffer.from(j.audio_base64, "base64"));
  rawMeta[ln.id] = { who: ln.who, text: ln.text, dur: Math.max(...a.character_end_times_seconds) + 0.1, at, provider: "elevenlabs" };
}
fs.writeFileSync(rawMetaPath, JSON.stringify(rawMeta, null, 2));
console.log(`語音：新生成 ${made} 句、沿用快取 ${reused} 句`);

const jobs = path.join(CACHE, `${code}-eleven-jobs.json`);
const ids = spec.lines.map((l) => l.id);
fs.writeFileSync(jobs, JSON.stringify({ ids, raw_dir: RAW, raw_meta: rawMetaPath, out_dir: path.join(ROOT, `public/lesson-entry/voice/${code}`), out_json: path.join(ROOT, `src/config/lessonEntry/voice/${code}.json`), ffmpeg: execFileSync("node", ["-e", "process.stdout.write(require('ffmpeg-static'))"], { encoding: "utf8" }) }));
execFileSync("uv", ["run", "-q", "--with", "numpy", "--with", "soundfile", "python", path.join(ROOT, "scripts/lesson-entry/voice_post_eleven.py"), jobs], { stdio: "inherit", env: { ...process.env, PYTHONIOENCODING: "utf-8" } });
