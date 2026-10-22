#!/usr/bin/env node
/* 配音成品聽寫檢查：把 public/lesson-entry/voice/<堂代號>/ 的每一段 mp3 用 whisper-1 轉回文字，跟台詞比對。
 *   node scripts/lesson-entry/voice-check.mjs S2-W03
 * 只能抓「念錯字、聽不清楚」；破音字讀音（例：長度 ㄔㄤˊ／ㄓㄤˇ）轉成文字一樣，抓不到，要人耳聽。 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(".");
const code = process.argv[2];
const env = Object.fromEntries(fs.readFileSync(path.join(ROOT, ".env.local"), "utf8").split(/\r?\n/).filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).replace(/^"|"$/g, "")]));
const lines = JSON.parse(fs.readFileSync(path.join(ROOT, `src/config/lessonEntry/voice/${code}.json`), "utf8"));
const norm = (s) => String(s).replace(/[\s，。、！？!?,.；;：:「」…]/g, "");
const sim = (a, b) => { const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0)); for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]); return dp[a.length][b.length] / Math.max(a.length, 1); };
const ids = Object.keys(lines);
const out = [];
let i = 0;
await Promise.all(Array.from({ length: 4 }, async () => { while (i < ids.length) {
  const id = ids[i++];
  const fd = new FormData();
  fd.append("file", new Blob([fs.readFileSync(path.join(ROOT, `public/lesson-entry/voice/${code}/${id}.mp3`))], { type: "audio/mpeg" }), `${id}.mp3`);
  fd.append("model", "whisper-1"); fd.append("language", "zh"); fd.append("prompt", "以下是繁體中文。");
  const r = await fetch("https://api.openai.com/v1/audio/transcriptions", { method: "POST", headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}` }, body: fd });
  const heard = r.ok ? (await r.json()).text : `（錯誤 ${r.status}）`;
  out.push({ id, who: lines[id].who, text: lines[id].text, heard, sim: +sim(norm(lines[id].text), norm(heard)).toFixed(2) });
} }));
out.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
const bad = out.filter((o) => o.sim < 0.9);
for (const o of bad) console.log(`✗ ${o.id}（${o.who}）「${o.text}」聽成「${o.heard}」 ${o.sim}`);
console.log(`${out.length} 句，相似度 ≥ 0.9：${out.length - bad.length} 句`);
