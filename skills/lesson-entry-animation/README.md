# 進課動畫製作 skill（lesson-entry-animation）

每堂課開始前播放的網頁動畫（直接進主題 → 複習上週 → 故事與今天目標 → 課程重點 → 口訣 → 出發），量產用的製程、規則與工具。給其他人員（或 Claude Code／Codex）照同一套做法生成新的進課動畫。

> 這裡是 **2026-10-20 的快照**，來源是負責人本機 `gpt-clone/.claude/skills/lesson-entry-animation/`（那份是活的版本）。skill 有更新時，請重新複製一份過來並在 [[llm-skills]] 記錄。

## 資料夾內容

| 路徑 | 內容 |
|---|---|
| `SKILL.md` | 主說明：流程與關卡、不可違反的規則、常用指令、回報方式 **（先讀這份）** |
| `references/` | 程式架構、踩過的坑、驗收清單、主題包、S 系列配音（VOICE-TTS、S5 小宇自然語調）、Codex 接手說明 |
| `templates/` | 腳本 `script.md.tpl`、審稿紀錄 `review-log.md.tpl` 範本 |
| `docs/PRODUCTION-SPEC.md` | 完整製作規格（2026-10-13 版；SKILL.md 寫的 `docs/lesson-entry/PRODUCTION-SPEC.md` 就是這份） |
| `scripts/` | 通用工具：建骨架 `new-lesson.mjs`、配音生成／檢查／對時（`voice-*.mjs`、`voice_post*.py`、`tts-*.mjs`、`pronunciation-audit.mjs`）、機器人後製 `robotize.py`、切圖 `slice_sheet.py`／`slice_collage.py`、3D 姿勢預渲染 `boss-render/` |
| `examples/` | 範例：S5-W01 腳本＋審稿紀錄、S2-W06 腳本、S2-W03 台詞檔（`voice-lines` 格式） |

## 怎麼用

1. **安裝 skill**
   - Claude Code：把整個資料夾複製到 `gpt-clone/.claude/skills/lesson-entry-animation/`（或個人的 `~/.claude/skills/`）。
   - Codex：複製到 `~/.codex/skills/lesson-entry-animation/`，再讀 `references/CODEX.md`。
   - Claude 桌面版：到「設定 → Capabilities」加入這個資料夾。
2. **放工具腳本**：把 `scripts/` 的內容複製到 `gpt-clone/scripts/lesson-entry/`（腳本以 gpt-clone 根目錄為基準找檔案，放別的地方跑不起來）。
3. **放製作規格**：把 `docs/PRODUCTION-SPEC.md` 複製到 `gpt-clone/docs/lesson-entry/`。
4. **金鑰**：配音工具只從 `gpt-clone/.env.local` 讀 `OPENAI_API_KEY`（gpt-4o-mini-tts、whisper）與 `ELEVENLABS_API_KEY`（ElevenLabs 配音）。金鑰不放在 skill 裡，向負責人索取。
5. **Python 工具**用 `uv run --with …` 執行（指令見 SKILL.md「常用指令」）；需要 Node 18+。
6. 開工：對 AI 說「幫 S2-W12 做進課動畫」之類的話就會觸發 skill；先跑 `new-lesson.mjs --dry-run` 看骨架。

## 注意

- 進課動畫的**程式**（`src/components/lessonEntry/`、`src/config/lessonEntry/`、`public/lesson-entry/`）在 gpt-clone repo 裡；**製作檔**（skill、`docs/lesson-entry/`、`scripts/lesson-entry/`）在 gpt-clone 是本機忽略檔，**不要 commit 進 gpt-clone**，要分享就更新這裡。
- SKILL.md 寫的活範例 P1U-W13、S2-W03 的腳本原檔已不在，參考 `examples/` 的 S5-W01／S2-W06；動畫本身仍可在 `/entry/play/P1U-W13`、`/entry/play/S2-W03` 看。
- 審稿 dev server：SKILL.md 寫 `npx next dev -p 3210`；與別人共用電腦時換一個沒被占用的 port 即可。
- 每一關都要負責人親眼看、親手玩過才算通過；AI 只能回報「我驗了什麼／沒驗什麼」。
