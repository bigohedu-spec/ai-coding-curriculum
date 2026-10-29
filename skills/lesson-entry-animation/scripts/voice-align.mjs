#!/usr/bin/env node
/* 字幕與配音對時：用 whisper 的「字詞時間」重算每個字的發聲時間（取代 voice_post.py 的估算）。
 *   node scripts/lesson-entry/voice-align.mjs S5-W01 [--only p2-a,p2-b] [--check]
 * 為什麼：voice_post.py 靠「聲音段數＝小句數」把字平均分配在每一段裡；ElevenLabs 的停頓常常不在逗號上
 *   （S5-W01 46 句有 28 句、S5-W02 61 句有 31 句段數對不上），分錯段就會讓字幕比配音慢到 1 秒以上（負責人 2026-10-16：第 2 頁字幕與配音搭不上）。
 * 做法：對 public/lesson-entry/voice/<堂代號>/<id>.mp3 跑 whisper-1（word timestamps），把「中文字／英文單字」跟台詞做最長共同子序列比對，
 *   比對上的字用 whisper 的開始時間；沒比對上的（whisper 聽錯、寫成簡體）在前後有時間的字之間依序內插；英文單字依音節數平均排開。
 *   結果寫回 src/config/lessonEntry/voice/<堂代號>.json 的 at（原本的 at 備份在 scripts/lesson-entry/.voice-cache/<堂代號>-at-before-align.json）。
 *   whisper 結果依 mp3 內容快取，重跑不會再花錢。--check＝只報告差多少、不寫入。
 * 限制：whisper 字詞時間本身有 0.1～0.2 秒誤差，但比估算穩定得多；整句比對率 < 60％ 的句子保留原本的 at。 */
import fs from "fs";
import path from "path";
import crypto from "crypto";

const ROOT = path.resolve(".");
const code = process.argv[2];
if (!code) { console.error("用法：node scripts/lesson-entry/voice-align.mjs <堂代號> [--only id,id] [--check]"); process.exit(1); }
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > 0 ? process.argv[i + 1] : d; };
const ONLY = (arg("only", "") || "").split(",").filter(Boolean), CHECK = process.argv.includes("--check");
const env = Object.fromEntries(fs.readFileSync(path.join(ROOT, ".env.local"), "utf8").split(/\r?\n/).filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).replace(/^"|"$/g, "")]));
const JSON_PATH = path.join(ROOT, `src/config/lessonEntry/voice/${code}.json`);
const CACHE = path.join(ROOT, "scripts/lesson-entry/.voice-cache");
// Optional script-only character normalization for timestamp matching. Original ASR stays intact.
const orthoPath = arg("orthography", "");
const ORTHO = orthoPath ? JSON.parse(fs.readFileSync(path.resolve(ROOT, orthoPath), "utf8")) : {};
const orthographicKey = (ch) => ORTHO[ch] ?? ch;
fs.mkdirSync(CACHE, { recursive: true });
const V = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
const { englishUnits } = await import(new URL("../../src/lib/lessonEntry/englishSyllables.ts", import.meta.url));

const isCjk = (c) => /[一-鿿]/.test(c);
const PUNCT = new Set(Array.from("，。！？、～：；,.!?:; "));
/** 台詞 → 項目：中文字一個一個、英文單字一個（帶音節數 n）。回傳 { items, tokens＝總有聲字數 } */
function itemsOf(text) {
  const cs = Array.from(text), items = [];
  for (let i = 0; i < cs.length; i++) {
    const ch = cs[i];
    if (PUNCT.has(ch)) continue;
    if (/[A-Za-z]/.test(ch)) { let j = i; while (j < cs.length && /[A-Za-z]/.test(cs[j])) j++; const w = cs.slice(i, j).join(""); items.push({ key: "en:" + w.toLowerCase(), n: englishUnits(w).length }); i = j - 1; continue; }
    items.push({ key: orthographicKey(ch), n: 1 });
  }
  return items;
}
/** whisper 的字詞 → 項目（含開始／結束秒）。多個中文字組成的詞，字平均分配在 [start, end] */
function whisperItems(words) {
  const out = [];
  for (const w of words) {
    const s = String(w.word).trim(), start = w.start, endRaw = w.end;
    const cjk = Array.from(s).filter(isCjk);
    if (cjk.length) {
      const len = cjk.length, span = Math.min(Math.max(endRaw - start, 0.08 * len), 0.32 * len + 0.1);
      cjk.forEach((c, k) => out.push({ key: orthographicKey(c), t: start + (span * k) / len, end: start + (span * (k + 1)) / len }));
    }
    for (const m of s.matchAll(/[A-Za-z]+/g)) out.push({ key: "en:" + m[0].toLowerCase(), t: start, end: endRaw });
  }
  return out;
}
function lcsMatch(a, b) {
  const n = a.length, m = b.length, dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) dp[i][j] = a[i - 1].key === b[j - 1].key ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  const match = new Array(n).fill(-1);
  for (let i = n, j = m; i > 0 && j > 0;) {
    if (a[i - 1].key === b[j - 1].key) { match[i - 1] = j - 1; i--; j--; } else if (dp[i - 1][j] >= dp[i][j - 1]) i--; else j--;
  }
  return match;
}
async function whisperWords(file) {
  const buf = fs.readFileSync(file), h = crypto.createHash("sha1").update(buf).digest("hex").slice(0, 16), cf = path.join(CACHE, `align-${h}.json`);
  if (fs.existsSync(cf)) return JSON.parse(fs.readFileSync(cf, "utf8"));
  for (let t = 0; t < 4; t++) {
    try {
      const fd = new FormData();
      fd.append("file", new Blob([buf], { type: "audio/mpeg" }), "x.mp3");
      fd.append("model", "whisper-1"); fd.append("language", "zh"); fd.append("response_format", "verbose_json"); fd.append("timestamp_granularities[]", "word"); fd.append("prompt", "以下是繁體中文。");
      const r = await fetch("https://api.openai.com/v1/audio/transcriptions", { method: "POST", headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}` }, body: fd });
      if (!r.ok) throw new Error(String(r.status));
      const words = (await r.json()).words || [];
      fs.writeFileSync(cf, JSON.stringify(words));
      return words;
    } catch (e) { await new Promise((s) => setTimeout(s, 1500 * (t + 1))); }
  }
  return null;
}

function align(id, line) {
  return async () => {
    const items = itemsOf(line.text), total = items.reduce((s, x) => s + x.n, 0);
    if (total !== line.at.length) return { id, skip: `有聲字數對不上（台詞 ${total}／原本 ${line.at.length}）` };
    const words = await whisperWords(path.join(ROOT, `public/lesson-entry/voice/${code}/${id}.mp3`));
    if (!words || !words.length) return { id, skip: "whisper 沒回字詞時間" };
    const wi = whisperItems(words), match = lcsMatch(items, wi);
    const matched = match.filter((x) => x >= 0).length;
    if (matched / items.length < 0.6) return { id, skip: `比對率只有 ${Math.round((matched / items.length) * 100)}％（whisper 聽成：${words.map((w) => w.word).join("")}）` };
    // 每個項目的開始時間：比對上的用 whisper；其餘依序內插
    const t = items.map((_, i) => (match[i] >= 0 ? wi[match[i]].t : NaN));
    const endOf = items.map((_, i) => (match[i] >= 0 ? wi[match[i]].end : NaN));
    const idxs = t.map((v, i) => (Number.isNaN(v) ? -1 : i)).filter((i) => i >= 0);
    const cum = []; let c = 0; items.forEach((x) => { cum.push(c); c += x.n; });
    for (let i = 0; i < items.length; i++) {
      if (!Number.isNaN(t[i])) continue;
      const prev = [...idxs].reverse().find((k) => k < i), next = idxs.find((k) => k > i);
      if (prev != null && next != null) t[i] = t[prev] + ((t[next] - t[prev]) * (cum[i] - cum[prev])) / (cum[next] - cum[prev]);
      else if (prev != null) t[i] = Math.min(line.dur - 0.05, t[prev] + 0.22 * (cum[i] - cum[prev]));
      else t[i] = Math.max(0, t[next] - 0.22 * (cum[next] - cum[i]));
    }
    for (let i = 1; i < t.length; i++) t[i] = Math.max(t[i], t[i - 1] + 0.01); // 不倒退
    const at = [];
    items.forEach((x, i) => {
      if (x.n === 1) { at.push(t[i]); return; }
      const nextT = i + 1 < items.length ? t[i + 1] : line.dur;
      const span = Math.min(Math.max((Number.isNaN(endOf[i]) ? nextT : endOf[i]) - t[i], 0.09 * x.n), 0.45 * x.n, Math.max(nextT - t[i], 0.09 * x.n));
      for (let k = 0; k < x.n; k++) at.push(t[i] + (span * k) / x.n);
    });
    // 英文單字的音節可能排到下一個字前面（whisper 對英文的時間較粗）：往前推開，每字至少隔 0.04 秒，且不超過句長
    for (let k = 1; k < at.length; k++) if (at[k] < at[k - 1] + 0.04) at[k] = at[k - 1] + 0.04;
    for (let k = at.length - 1; k >= 0; k--) { const cap = line.dur - 0.01 - 0.01 * (at.length - 1 - k); if (at[k] > cap) at[k] = cap; }
    const old = line.at, diff = at.map((v, k) => Math.abs(v - old[k]));
    return { id, at: at.map((v) => +Math.min(v, line.dur).toFixed(3)), maxShift: Math.max(...diff), meanShift: diff.reduce((s, v) => s + v, 0) / diff.length, matched: Math.round((matched / items.length) * 100) };
  };
}

const ids = Object.keys(V).filter((id) => !ONLY.length || ONLY.includes(id));
const results = [];
for (let i = 0; i < ids.length; i += 4) results.push(...(await Promise.all(ids.slice(i, i + 4).map((id) => align(id, V[id])()))));
const backup = path.join(CACHE, `${code}-at-before-align.json`);
if (!CHECK && !fs.existsSync(backup)) fs.writeFileSync(backup, JSON.stringify(Object.fromEntries(Object.entries(V).map(([k, v]) => [k, v.at]))));
let changed = 0;
for (const r of results) {
  if (r.skip) { console.log(`－ ${r.id}  保留原本：${r.skip}`); continue; }
  if (!CHECK) { V[r.id].at = r.at; V[r.id].align = "whisper"; }
  changed++;
  if (r.maxShift >= 0.4) console.log(`${r.maxShift >= 0.8 ? "✗" : "△"} ${r.id}  字幕時間最多差 ${r.maxShift.toFixed(2)} 秒（平均 ${r.meanShift.toFixed(2)}）  比對率 ${r.matched}％`);
}
if (!CHECK) fs.writeFileSync(JSON_PATH, JSON.stringify(V, null, 1));
const big = results.filter((r) => !r.skip && r.maxShift >= 0.4).length;
console.log(`${CHECK ? "檢查" : "已重算"} ${changed}／${ids.length} 句；其中原本差 0.4 秒以上的有 ${big} 句。${CHECK ? "" : "（原 at 備份：" + path.relative(ROOT, backup) + "）"}`);
