#!/usr/bin/env node
/* S2-W03 配音試聽：用 OpenAI gpt-4o-mini-tts 生成偵探（多個候選聲線）與阿問（底音）的試聽句，存成 wav。
 *   node scripts/lesson-entry/tts-audition.mjs            # 生成（已存在的跳過）
 *   node scripts/lesson-entry/tts-audition.mjs --force    # 全部重生
 * 輸出：public/lesson-entry/_audition/s2w03/raw/<角色>-<聲線>-<句號>.wav（_audition 在 .gitignore，不進 repo）
 * 機器人後製另外跑 scripts/lesson-entry/robotize.py。
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(".");
const env = Object.fromEntries(fs.readFileSync(path.join(ROOT, ".env.local"), "utf8").split(/\r?\n/).filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).replace(/^"|"$/g, "")]));
const KEY = env.OPENAI_API_KEY;
if (!KEY) throw new Error("缺 OPENAI_API_KEY");
const FORCE = process.argv.includes("--force");
const OUT = path.join(ROOT, "public/lesson-entry/_audition/s2w03/raw");
fs.mkdirSync(OUT, { recursive: true });

const DETECTIVE_STYLE = "請用台灣國語的口音說話（不要大陸腔、不要翻譯腔）。你是一位堅定、沉穩、有自信的少年偵探，語氣果斷但溫暖，像在跟小學生夥伴說話。語速自然，句尾乾淨俐落，不要誇張的戲劇腔、不要播音腔、不要拖長音。";
const ROBOT_STYLE = "請用台灣國語的口音說話（不要大陸腔）。你是一台開朗、熱心的小機器人助手，語氣輕快有精神，咬字清楚，語速稍快一點但每個字都清楚。不要誇張。";

const LINES = {
  det: ["慶典前一夜，皇冠不見了！", "明天早上就要用。我們只有今晚！", "問對長度，才挖得出線索！"],
  bot: ["嗶嗶！小偵探，你來了！", "太長，重點被淹沒；太短，缺了一角。", "剛剛好，挖到了！"],
};
const VOICES = { det: ["onyx", "ash", "echo", "cedar", "verse"], bot: ["coral", "alloy"] };

async function tts(text, voice, instructions) {
  for (let i = 0; i < 3; i++) {
    const r = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gpt-4o-mini-tts", voice, input: text, instructions, response_format: "wav" }),
    });
    if (r.ok) return Buffer.from(await r.arrayBuffer());
    const msg = await r.text();
    console.warn(`  重試 ${i + 1}：${r.status} ${msg.slice(0, 160)}`);
    await new Promise((s) => setTimeout(s, 1500 * (i + 1)));
  }
  throw new Error(`生成失敗：${voice} ${text}`);
}

const manifest = [];
for (const role of Object.keys(LINES)) {
  for (const voice of VOICES[role]) {
    for (let n = 0; n < LINES[role].length; n++) {
      const file = `${role}-${voice}-${n + 1}.wav`;
      const p = path.join(OUT, file);
      if (FORCE || !fs.existsSync(p)) {
        const buf = await tts(LINES[role][n], voice, role === "det" ? DETECTIVE_STYLE : ROBOT_STYLE);
        fs.writeFileSync(p, buf);
        console.log(`✓ ${file}（${(buf.length / 1024).toFixed(0)} KB）`);
      }
      manifest.push({ role, voice, n: n + 1, text: LINES[role][n], file });
    }
  }
}
fs.writeFileSync(path.join(OUT, "..", "manifest.json"), JSON.stringify(manifest, null, 1));
console.log(`完成 ${manifest.length} 段`);
