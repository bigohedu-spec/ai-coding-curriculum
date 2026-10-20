# lesson-entry-animation 安裝

製作進課動畫的 skill。內容從 `SKILL.md` 開始讀。

| 資料夾 | 放到 gpt-clone 的位置 |
|---|---|
| 整個 skill（`SKILL.md`、`references/`、`templates/`） | `.claude/skills/lesson-entry-animation/`（Codex：`~/.codex/skills/lesson-entry-animation/`） |
| `scripts/` 的內容 | `scripts/lesson-entry/` |

- 所有指令在 gpt-clone 根目錄執行（`new-lesson.mjs` 從 `.claude/skills/lesson-entry-animation/templates/` 讀範本）。
- 配音工具從 gpt-clone 的 `.env.local` 讀 `OPENAI_API_KEY`、`ELEVENLABS_API_KEY`，向負責人索取。
- 需要 Node 18+ 與 `uv`（Python 工具用 `uv run --with …` 執行）。
- 以上位置的檔案都是本機製作檔，不提交到 gpt-clone；skill 更新後同步回這裡。
