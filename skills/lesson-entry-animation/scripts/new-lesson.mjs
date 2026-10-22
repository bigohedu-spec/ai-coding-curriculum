#!/usr/bin/env node
/* 進課動畫：新增一堂課的骨架（量產用）。
 *
 * 用法（在 repo 根目錄）：
 *   node scripts/lesson-entry/new-lesson.mjs --code P1U-W14 --title "小熊麵包坊 第2週" --cuts 8 [--grade 1] [--kit bakery] [--interactive 2,8] [--chant 6] [--dry-run]
 *
 * 會做的事：
 *   1. docs/lesson-entry/<code>/script.md、review-log.md（從 .claude/skills/lesson-entry-animation/templates 複製並填入參數）
 *   2. src/components/lessonEntry/lessons/<ID>.ts：N 頁「說話頁」骨架（makeTalkPage，旁白文字先放佔位字，之後填）
 *   3. 登記到 lessons/index.ts 與 config/lessonEntry/musicPlan.ts（用標準編曲曲線 autoPlan）
 * 不會覆寫已存在的檔案。做完後：填腳本 → 通過 Gate A → 再回頭改 lessons/<ID>.ts 的旁白、角色、特殊頁。 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, arr) => (x.startsWith("--") ? [...a, [x.slice(2), arr[i + 1] && !arr[i + 1].startsWith("--") ? arr[i + 1] : true]] : a), []));
const code = String(args.code ?? ""), title = String(args.title ?? ""), cuts = Number(args.cuts ?? 0);
if (!/^[A-Z0-9]+-[A-Z0-9]+$/i.test(code) || !title || !(cuts >= 2)) {
  console.error("用法：node scripts/lesson-entry/new-lesson.mjs --code P1U-W14 --title \"標題\" --cuts 8 [--grade 1] [--kit bakery] [--interactive 2,8] [--chant 6] [--dry-run]");
  process.exit(1);
}
const grade = Number(args.grade ?? 1), kit = String(args.kit ?? "bakery"), dry = !!args["dry-run"];
const interactive = String(args.interactive ?? "").split(",").filter(Boolean).map(Number);
const chant = args.chant ? Number(args.chant) : undefined;
const ID = code.replace(/-/g, ""); // P1UW14
const captionLimit = Number(args["caption-limit"] ?? 10);
const today = new Date().toISOString().slice(0, 10);

const tplDir = path.join(root, ".claude/skills/lesson-entry-animation/templates");
const fill = (s) => s.replaceAll("{{CODE}}", code).replaceAll("{{ID}}", ID).replaceAll("{{TITLE}}", title).replaceAll("{{GRADE}}", String(grade)).replaceAll("{{KIT}}", kit).replaceAll("{{CUTS}}", String(cuts)).replaceAll("{{DATE}}", today).replaceAll("{{CAPTION_LIMIT}}", String(captionLimit));
const written = [];
const write = (rel, content) => {
  const p = path.join(root, rel);
  if (fs.existsSync(p)) { console.log("略過（已存在）：" + rel); return; }
  written.push(rel);
  if (!dry) { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, content); }
};

write(`docs/lesson-entry/${code}/script.md`, fill(fs.readFileSync(path.join(tplDir, "script.md.tpl"), "utf8")));
write(`docs/lesson-entry/${code}/review-log.md`, fill(fs.readFileSync(path.join(tplDir, "review-log.md.tpl"), "utf8")));

// 課程檔：N 頁說話頁骨架
const pages = Array.from({ length: cuts }, (_, i) => {
  const n = i + 1;
  const kind = n === cuts ? "最後一頁：請改成自己的元件，放「開始遊戲」「再看一次」兩個按鈕（見 flow/steps.tsx 的 Step11）" : interactive.includes(n) ? "互動頁：請改成自己的元件，內容結束時自己呼叫 done()（見 flow/steps.tsx 的 Step2）" : n === chant ? "口訣頁：建議改用 Slam 一字一砸（見 flow/steps.tsx 的 Step9）" : "";
  const chars = kind ? "" : ", chars: [{ who: \"rabbit\", x: 24 }]";
  return `  { n: ${n}, title: "CUT ${n}", C: makeTalkPage({ len: 6, cues: [cue("（待填旁白）", 0.5)]${chars} }) },${kind ? " // TODO " + kind : ""}`;
});
write(`src/components/lessonEntry/lessons/${ID}.ts`, `/* ${code}「${title}」：${cuts} 頁骨架（由 new-lesson.mjs 產生）。
 * 旁白文字＝字幕（卡拉 OK 式，念到哪亮到哪）；一個短句 ≤ ${captionLimit} 字（不含標點）。腳本見 docs/lesson-entry/${code}/script.md */
import type { LessonStep } from "../flow/LessonFlow";
import { cue, makeTalkPage } from "../flow/pages";

export const ${ID}_STEPS: LessonStep[] = [
${pages.join("\n")}
];
`);

// 登記
const patch = (rel, marker, insert, importMarker, importLine) => {
  const p = path.join(root, rel);
  let s = fs.readFileSync(p, "utf8");
  if (s.includes(insert.trim())) { console.log("略過（已登記）：" + rel); return; }
  if (!s.includes(marker)) throw new Error(`${rel} 找不到標記 ${marker}`);
  s = s.replace(marker, insert + "  " + marker);
  if (importMarker) s = s.replace(importMarker, importLine + "\n" + importMarker);
  written.push(rel + "（登記）");
  if (!dry) fs.writeFileSync(p, s);
};
patch("src/components/lessonEntry/lessons/index.ts", "// <<lesson-entries>>", `  "${code}": { title: ${JSON.stringify(title)}, steps: ${ID}_STEPS, plan: MUSIC_PLAN["${code}"] },\n`, "// <<lesson-imports>>", `import { ${ID}_STEPS } from "./${ID}";`);
patch("src/config/lessonEntry/musicPlan.ts", "// <<music-plans>>", `  "${code}": autoPlan(${cuts}, { interactive: [${interactive.join(", ")}]${chant ? `, chantAt: ${chant}` : ""} }),\n`);

console.log((dry ? "（試跑，沒有寫入）" : "已建立：") + "\n  " + written.join("\n  "));
console.log(`\n下一步：\n  1. 填 docs/lesson-entry/${code}/script.md → 負責人通過 Gate A\n  2. 主題包「${kit}」有缺的角色／道具先生圖（見 docs/lesson-entry/kits/${kit}/KIT.md）\n  3. 改 src/components/lessonEntry/lessons/${ID}.ts 的旁白、角色、特殊頁\n  4. 開 http://localhost:3210/entry/play/${code} 審（npx next dev -p 3210）\n  5. 跑版面掃描與音樂自檢（見 SKILL.md 的檢查清單）`);
