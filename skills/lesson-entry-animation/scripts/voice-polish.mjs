#!/usr/bin/env node
/* 配音挑「最清楚的那一版」（ElevenLabs 同一句每次念得都不一樣；負責人 2026-10-16：整體有咬字不清）。
 *   node scripts/lesson-entry/voice-polish.mjs S5-W01 [--min 0.95] [--takes 4] [--only p4-q2,p8-a]
 * 做法：每一句先把「目前版本」交給 whisper 聽寫、跟台詞比對（只比中文字，英文、數字不算，避免「十六／16」假警報）；
 *   低於 --min 的句子，再多生成最多 --takes 個版本，每個都聽寫打分，留下分數最高的那一版（含原本那版）寫回原始快取；
 *   最後請自己再跑 voice-build.mjs <堂代號> 重新後製。整句都 ≥ --min 就不會花錢。
 * 只抓得到念錯、含糊；破音字讀音與好不好聽仍要人耳聽。 */
import fs from "fs";
import path from "path";
import crypto from "crypto";

const ROOT = path.resolve(".");
const code = process.argv[2];
if (!code) { console.error("用法：node scripts/lesson-entry/voice-polish.mjs <堂代號> [--min 0.95] [--takes 4] [--only id,id]"); process.exit(1); }
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > 0 ? process.argv[i + 1] : d; };
const MIN = Number(arg("min", 0.95)), TAKES = Number(arg("takes", 4)), ONLY = arg("only", "")?.split(",").filter(Boolean);
const env = Object.fromEntries(fs.readFileSync(path.join(ROOT, ".env.local"), "utf8").split(/\r?\n/).filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).replace(/^"|"$/g, "")]));
const spec = JSON.parse(fs.readFileSync(path.join(ROOT, `scripts/lesson-entry/voice-lines/${code}.json`), "utf8"));
const CACHE = path.join(ROOT, "scripts/lesson-entry/.voice-cache");

/* ── 跟 voice-build.mjs 同一套（快取檔名、ElevenLabs 呼叫）── */
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
  for (let i = 0; i < 3; i++) {
    const r = await retry(() => fetch(`https://api.elevenlabs.io/v1/text-to-speech/${v.voice}?output_format=pcm_24000`, { method: "POST", headers: { "xi-api-key": env.ELEVENLABS_API_KEY, "Content-Type": "application/json" }, body: JSON.stringify(body) }));
    if (r.ok) return pcmToWav(Buffer.from(await r.arrayBuffer()), 24000);
    console.warn(`  ElevenLabs 重試 ${i + 1}：${r.status} ${(await r.text()).slice(0, 160)}`);
    await new Promise((s) => setTimeout(s, 1500 * (i + 1)));
  }
  throw new Error("ElevenLabs 生成失敗：" + text);
}
/** 網路偶爾斷線（ECONNRESET）：重試 */
async function retry(fn, tries = 4) { for (let i = 0; ; i++) { try { return await fn(); } catch (e) { if (i >= tries) throw e; await new Promise((r) => setTimeout(r, 1500 * (i + 1))); } } }
/** whisper 常把「十六」寫成 16：聽寫結果的阿拉伯數字（0～99）換回中文數字再比，才不會被當成念錯 */
const CN = "零一二三四五六七八九";
const numToCn = (n) => (n < 10 ? CN[n] : n < 20 ? "十" + (n % 10 ? CN[n % 10] : "") : CN[Math.floor(n / 10)] + "十" + (n % 10 ? CN[n % 10] : ""));
const fixNums = (s) => String(s).replace(/\d{1,2}/g,(m) => numToCn(Number(m)));
const cjk = (s) => Array.from(String(s)).filter((c) => /[一-鿿]/.test(c)).join("");
const lcs = (a, b) => { const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0)); for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]); return dp[a.length][b.length]; };
// 只比中文字：分數＝（正確聽到的字數）÷（台詞字數與聽到字數較大者），聽成多餘的字也會扣分
const score = (text, heard) => { const a = cjk(text), b = cjk(fixNums(heard)); return a.length ? lcs(a, b) / Math.max(a.length, b.length) : 1; };
async function listen(wav) {
  const fd = new FormData();
  fd.append("file", new Blob([wav], { type: "audio/wav" }), "x.wav");
  fd.append("model", "whisper-1"); fd.append("language", "zh"); fd.append("prompt", "以下是繁體中文。");
  const r = await retry(() => fetch("https://api.openai.com/v1/audio/transcriptions", { method: "POST", headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}` }, body: fd }));
  return r.ok ? (await r.json()).text : "";
}

let regen = 0, improved = 0, kept = 0;
for (const ln of spec.lines) {
  if (ONLY.length && !ONLY.includes(ln.id)) continue;
  const v = spec.voices[ln.who];
  if (v.provider !== "eleven") continue;
  const spoken = Object.entries(spec.say ?? {}).reduce((s, [a, b]) => s.split(a).join(b), ln.text);
  const hash = crypto.createHash("sha1").update(JSON.stringify([spoken, "eleven", v.voice, v.model ?? "eleven_v3", v.speed ?? 1, v.stability ?? 0.5])).digest("hex").slice(0, 12);
  const raw = path.join(CACHE, `${hash}.wav`);
  let best = fs.existsSync(raw) ? fs.readFileSync(raw) : await ttsEleven(spoken, v);
  let heard = await listen(best), bestScore = score(ln.text, heard), first = bestScore;
  if (bestScore >= MIN) { kept++; fs.writeFileSync(raw, best); continue; }
  for (let t = 0; t < TAKES && bestScore < MIN; t++) {
    const w = await ttsEleven(spoken, v); regen++;
    const h = await listen(w), s = score(ln.text, h);
    if (s > bestScore) { best = w; bestScore = s; heard = h; }
  }
  fs.writeFileSync(raw, best);
  if (bestScore > first) improved++;
  console.log(`${bestScore >= MIN ? "✓" : "△"} ${ln.id}  ${first.toFixed(2)} → ${bestScore.toFixed(2)}  聽成「${heard}」`);
}
console.log(`完成：本來就清楚 ${kept} 句、重生成 ${regen} 次、變好 ${improved} 句。接著跑：node scripts/lesson-entry/voice-build.mjs ${code}`);
