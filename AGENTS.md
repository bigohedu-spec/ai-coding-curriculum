# AI Coding Curriculum Agent Instructions

When creating, revising, or auditing an S3 GAMMA-plus-answer-card course (`gamma-answer-worksheet`, 「S3 答題版學習單」, or equivalent), you must:

1. Read and follow `skills/s3-answer-sheet-course/SKILL.md`.
2. Treat `wiki/labterminal-specs/S3/S3-答題版學習單新架構規格.md` as the shared architecture authority.
3. Maintain the student worksheet, weekly course spec with embedded schema v3 JSON, and teacher lesson plan as one coherent bundle.
4. Run the S3 contract validator and Grade 4 activity-time estimate before declaring the bundle complete.

Do not apply the legacy 7-screen standalone HTML skeleton to S3 answer-card courses. Preserve unrelated user changes in the working tree.

When creating, building, or auditing a **Cocos web game** (Cocos Creator, 「Cocos 小遊戲」, 超休閒遊戲, or any game embedded in gpt-clone under `public/games/cocos/`), you must:

1. Treat `specs/cocos-web-games/standards/cocos-web-game-standard.md` as the engineering authority (versions, folder layout, the `lt-game/1` host protocol, budgets, AI rules, acceptance checks K-1–K-10).
2. Keep the boundary: Cocos owns the round, React owns everything else. The game never loads Firebase, calls `/api/*`, holds answer keys, persists progress, or shows a text-input box.
3. Never hand-edit editor-managed files (`.scene`, `.prefab`, `.anim`, `.meta`). Change scenes only through the Cocos editor MCP or ask the owner; commit before and after MCP scene edits.
4. Do not adjust game-feel numbers (speed, gravity, hitboxes, difficulty) on your own — propose them to the owner.

This standard does not apply to map-exploration Lab Terminal Quest levels, which remain on Phaser until the owner rules otherwise.
