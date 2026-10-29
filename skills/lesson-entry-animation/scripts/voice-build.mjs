#!/usr/bin/env node
/* 進課動畫的配音（語音生成版，S2 起用）：台詞清單 → OpenAI gpt-4o-mini-tts → 後製（響度、機器人）→ mp3 ＋ 每個字的時間。
 *   node scripts/lesson-entry/voice-build.mjs S2-W03            # 只生成改過的句子（依文字＋聲線＋語氣快取）
 *   node scripts/lesson-entry/voice-build.mjs S2-W03 --force    # 全部重生
 * 輸入：scripts/lesson-entry/voice-lines/<堂代號>.json（voices：誰用哪個聲線／語氣／機器人後製；lines：id、who、text）
 * 輸出：public/lesson-entry/voice/<堂代號>/<id>.mp3、src/config/lessonEntry/voice/<堂代號>.json（dur、每字時間 at）
 * 原始 wav 快取在 scripts/lesson-entry/.voice-cache/（不進 repo）。後製在 voice_post.py。
 * 破音字：台詞 JSON 的 say＝「送去語音生成時」的替換表（例：長度→嘗度，嘗只有ㄔㄤˊ一個讀音；負責人 2026-10-12 建議）。
 *   字幕仍顯示原文；替換字要同字數，每字時間才對得上。「校長」這類本來就念ㄓㄤˇ的不要放進表。
 * 只想重生某幾句（念歪了）：node scripts/lesson-entry/voice-redo.mjs <堂代號> <id> …
 * 會花錢（很少）：每句約 2 秒語音；整堂 36 句約新台幣 1 元以內。 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execFileSync } from "child_process";

const ROOT = path.resolve(".");
const code = process.argv[2];
if (!code) { console.error("用法：node scripts/lesson-entry/voice-build.mjs <堂代號> [--force]"); process.exit(1); }
const FORCE = process.argv.includes("--force");
const env = Object.fromEntries(fs.readFileSync(path.join(ROOT, ".env.local"), "utf8").split(/\r?\n/).filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).replace(/^"|"$/g, "")]));
const spec = JSON.parse(fs.readFileSync(path.join(ROOT, `scripts/lesson-entry/voice-lines/${code}.json`), "utf8"));
if(Object.values(spec.voices).some(v=>v.provider && !["openai","eleven"].includes(v.provider)))throw new Error("不支援的聲線供應商（只有 openai、eleven）；S2W12 使用 s2w12-apply-eleven.mjs");
const CACHE = path.join(ROOT, "scripts/lesson-entry/.voice-cache");
fs.mkdirSync(CACHE, { recursive: true });

async function tts(text, voice, instructions) {
  for (let i = 0; i < 3; i++) {
    const r = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST", headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gpt-4o-mini-tts", voice, input: text, instructions, response_format: "wav" }),
    });
    if (r.ok) return Buffer.from(await r.arrayBuffer());
    console.warn(`  重試 ${i + 1}：${r.status} ${(await r.text()).slice(0, 160)}`);
    await new Promise((s) => setTimeout(s, 1500 * (i + 1)));
  }
  throw new Error(`生成失敗：${voice} ${text}`);
}

/* ElevenLabs（S5 起，負責人 2026-10-15）：voices 裡寫 provider:"eleven"、voice＝voice_id、model（預設 eleven_v3）、speed（0.7～1.2）。
 * 要 PCM（44.1kHz 16bit 單聲道）自己包成 wav，後製（voice_post.py）才讀得到。 */
function pcmToWav(pcm, sr) {
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + pcm.length, 4); h.write("WAVE", 8); h.write("fmt ", 12);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(sr, 24); h.writeUInt32LE(sr * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
  h.write("data", 36); h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}
async function ttsEleven(text, v) {
  const model = v.model ?? "eleven_v3";
  const body = { text, model_id: model, voice_settings: { stability: v.stability ?? 0.5, similarity_boost: 0.75, speed: v.speed ?? 1 } };
  if (model === "eleven_v3") body.language_code = "zh";
  for (const [fmt, sr] of [["pcm_24000", 24000], ["pcm_44100", 44100]]) {
    for (let i = 0; i < 3; i++) {
      const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${v.voice}?output_format=${fmt}`, { method: "POST", headers: { "xi-api-key": env.ELEVENLABS_API_KEY, "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (r.ok) return pcmToWav(Buffer.from(await r.arrayBuffer()), sr);
      const msg = (await r.text()).slice(0, 200);
      console.warn(`  ElevenLabs ${fmt} 重試 ${i + 1}：${r.status} ${msg}`);
      if (r.status === 403 || r.status === 400) break; // 格式不支援（方案限制）就換下一種格式
      await new Promise((s) => setTimeout(s, 1500 * (i + 1)));
    }
  }
  throw new Error(`ElevenLabs 生成失敗：${text}`);
}

/* 台詞有英文（S5 起：Live Server、GitHub Copilot…）：每個小句有幾個「有聲字」要跟字幕的切法一致——
 * 中文一字一格、英文單字依音節切格（animalese.displayUnits 用的 englishUnits）。算好交給 voice_post.py（sizes）。
 * 台詞裡不要放數字和 @ 這類符號（字幕會逐字亮、句點會被當成斷句）。 */
const { englishUnits } = await import(new URL("../../src/lib/lessonEntry/englishSyllables.ts", import.meta.url));
const PUNCT = new Set(Array.from("，。！？、～：；,.!?:; "));
function chunkSizes(text) {
  const out = []; let n = 0; const cs = Array.from(text);
  for (let i = 0; i < cs.length; i++) {
    const ch = cs[i];
    if (PUNCT.has(ch)) { if (n) out.push(n); n = 0; continue; }
    if (/[A-Za-z]/.test(ch)) { let j = i; while (j < cs.length && /[A-Za-z]/.test(cs[j])) j++; n += englishUnits(cs.slice(i, j).join("")).length; i = j - 1; continue; }
    if (/[0-9@#$%&*+=/\\<>]/.test(ch)) throw new Error(`台詞不要放數字或符號（${ch}）：${text}`);
    n++;
  }
  if (n) out.push(n);
  return out;
}

const ids = new Set();
const items = [];
let made = 0;
for (const ln of spec.lines) {
  if (ids.has(ln.id)) throw new Error(`id 重複：${ln.id}`);
  ids.add(ln.id);
  const v = spec.voices[ln.who];
  if (!v) throw new Error(`沒有這個角色：${ln.who}`);
  const spoken = Object.entries(spec.say ?? {}).reduce((s, [a, b]) => s.split(a).join(b), ln.text); // 送去生成的文字（破音字替換）
  // 中文字數要一樣（每字時間才對得上）；英文單字可以換念法（Ctrl→Control），字幕的切格照原文算
  const zh = (s) => Array.from(s.replace(/[A-Za-z]+/g, "")).length;
  if (zh(spoken) !== zh(ln.text)) throw new Error(`替換後字數不同：${ln.text} → ${spoken}`);
  const eleven = v.provider === "eleven";
  const hash = crypto.createHash("sha1").update(JSON.stringify(eleven ? [spoken, "eleven", v.voice, v.model ?? "eleven_v3", v.speed ?? 1, v.stability ?? 0.5] : [spoken, v.voice, v.style])).digest("hex").slice(0, 12);
  const raw = path.join(CACHE, `${hash}.wav`);
  if (FORCE || !fs.existsSync(raw)) { fs.writeFileSync(raw, eleven ? await ttsEleven(spoken, v) : await tts(spoken, v.voice, v.style)); made++; console.log(`生成 ${ln.id}「${spoken}」`); }
  items.push({ id: ln.id, who: ln.who, text: ln.text, raw, robot: v.robot, ...(v.gap ? { gap: v.gap } : {}), ...(v.rate ? { rate: v.rate } : {}), ...(/[A-Za-z]/.test(ln.text) ? { sizes: chunkSizes(ln.text) } : {}) });
}
console.log(`語音：新生成 ${made} 句、沿用快取 ${items.length - made} 句`);

const outAudio = path.join(ROOT, `public/lesson-entry/voice/${code}`);
const outJson = path.join(ROOT, `src/config/lessonEntry/voice/${code}.json`);
fs.mkdirSync(path.dirname(outJson), { recursive: true });
const jobs = path.join(CACHE, `${code}-jobs.json`);
fs.writeFileSync(jobs, JSON.stringify({ out_audio: outAudio, out_json: outJson, items }));
execFileSync("uv", ["run", "-q", "--with", "numpy", "--with", "scipy", "--with", "librosa", "--with", "soundfile", "python", path.join(ROOT, "scripts/lesson-entry/voice_post.py"), jobs], { stdio: "inherit", env: { ...process.env, PYTHONIOENCODING: "utf-8" } });
// 每個字的發聲時間：voice_post.py 的估算常常對不上（停頓不在逗號上），再用 whisper 字詞時間重算一次（失敗就保留估算）
try { execFileSync("node", [path.join(ROOT, "scripts/lesson-entry/voice-align.mjs"), code], { stdio: "inherit" }); } catch { console.warn("（字幕對時沒完成，沿用估算的時間；可稍後單獨跑 voice-align.mjs " + code + "）"); }
const kb = fs.readdirSync(outAudio).reduce((s, f) => s + fs.statSync(path.join(outAudio, f)).size, 0) / 1024;
console.log(`完成：${outAudio}（共 ${kb.toFixed(0)} KB）、${outJson}`);
