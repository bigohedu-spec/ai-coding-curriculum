# AI Coding Curriculum Agent Instructions

When creating, revising, or auditing an S3 GAMMA-plus-answer-card course (`gamma-answer-worksheet`, 「S3 答題版學習單」, or equivalent), you must:

1. Read and follow `skills/s3-answer-sheet-course/SKILL.md`.
2. Treat `wiki/labterminal-specs/S3/S3-答題版學習單新架構規格.md` as the shared architecture authority.
3. Maintain the student worksheet, weekly course spec with embedded schema v3 JSON, and teacher lesson plan as one coherent bundle.
4. Run the S3 contract validator and Grade 4 activity-time estimate before declaring the bundle complete.

Do not apply the legacy 7-screen standalone HTML skeleton to S3 answer-card courses. Preserve unrelated user changes in the working tree.

When creating, rebuilding, or auditing a **map-exploration Lab Terminal Quest** level (`Lab Terminal Quest`, 「失落規格的溪谷」, S3W05, or any level with a walkable map plus a right-hand answer card), you must:

1. Pick the right skill for the stage: `skills/labterminal-quest-narrative/SKILL.md` when the input is a knowledge point and the output is a spec (story, characters, dialogue, questions, mini-games); `skills/labterminal-quest-phaser/SKILL.md` when the input is a spec and the output is code. Never do both in one pass.
2. Treat `specs/lab-terminal-quest/standards/lab-terminal-quest-narrative-standard.md` as the content authority, `specs/lab-terminal-quest/standards/lab-terminal-quest-phaser-runtime-standard.md` as the engineering authority, and `specs/lab-terminal-quest/standards/lab-terminal-quest-level-design-standard.md` as the design authority that both must satisfy.
3. Validate the level data (V-1–V-14) **before** writing any scene code, and the runtime (P-1–P-14) before declaring the level complete.
4. Never let Phaser scene code hold answer data (`answerIndex`, `answerEvidence`, `optionMisconceptions`, `requirement`) or branch on content ids — Phaser owns the world, React owns the transaction.
5. Keep world-level content (setting, villain, character sheets) in the arc-scoped `specs/lab-terminal-quest/S{N}/S{N}-世界觀規格-{劇本代號}.md` and week-level content in `specs/lab-terminal-quest/S{N}/W{NN}/`. A story arc spans roughly four weeks; switching arcs means a new file, never editing the old one in place. The owner decides arc boundaries — do not decide them yourself.

Phaser is the default runtime for these levels as of 2026-09-09. Do not build new levels on the Gamma iframe route; the clauses it supersedes are listed in `specs/lab-terminal-quest/standards/lab-terminal-quest-phaser-runtime-standard.md` §0-1.

When creating, building, or auditing a **Cocos web game** (Cocos Creator, 「Cocos 小遊戲」, 超休閒遊戲, or any game embedded in gpt-clone under `public/games/cocos/`), you must:

1. Treat `specs/cocos-web-games/standards/cocos-web-game-standard.md` as the engineering authority (versions, folder layout, the `lt-game/1` host protocol, budgets, AI rules, acceptance checks K-1–K-10).
2. Keep the boundary: Cocos owns the round, React owns everything else. The game never loads Firebase, calls `/api/*`, holds answer keys, persists progress, or shows a text-input box.
3. Never hand-edit editor-managed files (`.scene`, `.prefab`, `.anim`, `.meta`). Change scenes only through the Cocos editor MCP or ask the owner; commit before and after MCP scene edits.
4. Do not adjust game-feel numbers (speed, gravity, hitboxes, difficulty) on your own — propose them to the owner.

This standard does not apply to map-exploration Lab Terminal Quest levels, which remain on Phaser until the owner rules otherwise.
