#!/usr/bin/env node
/* 重新生成指定幾句配音（刪掉那幾句的原始 wav 快取，再跑 voice-build）。
 *   node scripts/lesson-entry/voice-redo.mjs S2-W05 p9-q4 p9-hint
 * 用在：voice-check 抓到念錯／念歪的句子，想換一個版本（同模型、同聲線、同語氣）。 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execFileSync } from "child_process";

const [code, ...ids] = process.argv.slice(2);
const spec = JSON.parse(fs.readFileSync(path.resolve(`scripts/lesson-entry/voice-lines/${code}.json`), "utf8"));
for (const id of ids) {
  const ln = spec.lines.find((l) => l.id === id);
  if (!ln) throw new Error(`沒有這句：${id}`);
  const v = spec.voices[ln.who];
  const spoken = Object.entries(spec.say ?? {}).reduce((s, [a, b]) => s.split(a).join(b), ln.text);
  // 快取檔名要跟 voice-build.mjs 同一套算法（ElevenLabs 的參數不一樣）
  const key = v.provider === "eleven" ? [spoken, "eleven", v.voice, v.model ?? "eleven_v3", v.speed ?? 1, v.stability ?? 0.5] : [spoken, v.voice, v.style];
  const h = crypto.createHash("sha1").update(JSON.stringify(key)).digest("hex").slice(0, 12);
  const f = path.resolve(`scripts/lesson-entry/.voice-cache/${h}.wav`);
  if (fs.existsSync(f)) { fs.unlinkSync(f); console.log(`刪除快取 ${id}`); }
}
execFileSync("node", ["scripts/lesson-entry/voice-build.mjs", code], { stdio: "inherit" });
