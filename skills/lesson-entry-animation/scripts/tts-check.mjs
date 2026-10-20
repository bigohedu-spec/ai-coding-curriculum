#!/usr/bin/env node
/* 配音聽寫檢查：用 whisper-1 把每段試聽音檔轉回文字，跟原句比對（客觀檢查「聽不聽得懂、有沒有念錯」）。
 *   node scripts/lesson-entry/tts-check.mjs
 * 讀 public/lesson-entry/_audition/s2w03/manifest.json，檢查 v2/（robotize.py v2 輸出）底下所有 wav，結果寫到 check.json。
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(".");
const env = Object.fromEntries(fs.readFileSync(path.join(ROOT, ".env.local"), "utf8").split(/\r?\n/).filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).replace(/^"|"$/g, "")]));
const DIR = path.join(ROOT, "public/lesson-entry/_audition/s2w03");
const manifest = JSON.parse(fs.readFileSync(path.join(DIR, "manifest.json"), "utf8"));
const norm = (s) => String(s).replace(/[\s，。、！？!?,.；;：:「」]/g, "");
// 字元層級相似度（LCS / 原句長度）
const sim = (a, b) => {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp[a.length][b.length] / a.length;
};

async function transcribe(file) {
  const fd = new FormData();
  fd.append("file", new Blob([fs.readFileSync(file)], { type: "audio/wav" }), path.basename(file));
  fd.append("model", "whisper-1");
  fd.append("language", "zh");
  fd.append("prompt", "以下是繁體中文。");
  const r = await fetch("https://api.openai.com/v1/audio/transcriptions", { method: "POST", headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}` }, body: fd });
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  return (await r.json()).text;
}

const jobs = [];
for (const m of manifest) {
  jobs.push({ ...m, path: path.join(DIR, "v2", m.file.startsWith("det") ? m.file : m.file.replace(".wav", "-R0.wav")), fx: "原音" });
  if (m.role === "bot") for (const t of ["R1", "R2", "R3"]) jobs.push({ ...m, path: path.join(DIR, "v2", m.file.replace(".wav", `-${t}.wav`)), fx: t });
}
const out = [];
let i = 0;
await Promise.all(Array.from({ length: 4 }, async () => { while (i < jobs.length) {
  const j = jobs[i++];
  const heard = await transcribe(j.path);
  out.push({ role: j.role, voice: j.voice, n: j.n, fx: j.fx, text: j.text, heard, sim: +sim(norm(j.text), norm(heard)).toFixed(2) });
} }));
out.sort((a, b) => (a.role + a.voice + a.fx + a.n).localeCompare(b.role + b.voice + b.fx + b.n));
fs.writeFileSync(path.join(DIR, "check.json"), JSON.stringify(out, null, 1));
const groups = {};
for (const o of out) (groups[`${o.role}-${o.voice}-${o.fx}`] ??= []).push(o);
for (const [k, v] of Object.entries(groups)) {
  const avg = v.reduce((s, o) => s + o.sim, 0) / v.length;
  console.log(`${k.padEnd(20)} 平均相似度 ${avg.toFixed(2)}　` + v.filter((o) => o.sim < 0.9).map((o) => `#${o.n} 聽成「${o.heard}」`).join("　"));
}
