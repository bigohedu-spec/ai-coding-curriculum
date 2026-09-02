---
name: s3-answer-sheet-course
description: Create, revise, or audit S3 GAMMA-plus-answer-card worksheet bundles using W01-W04 as scaffold and contract references and the current W05 as the student-facing engineering benchmark. Use when generating an S3 答題版學習單, its Lab Terminal course spec/schema v3 config, its lesson plan, or when checking narrative, operational scaffolds, readability, contentRevision, contentRef, answer-chain, quiz, state, media, and coin contracts. Do not use for legacy 7-screen standalone HTML courses.
---

# S3 Answer-Sheet Course

Produce a coherent three-file course bundle, not an isolated worksheet.

## Read first

1. Read `wiki/labterminal-specs/S3/S3-答題版學習單新架構規格.md` completely. It is the architecture authority.
2. Read the target week in `wiki/semesters/S3-小四上-AI建構.md` and the previous week's worksheet, course spec, and lesson plan.
3. Select exactly one scaffold profile: `onboarding`, `guided-chain`, `semi-open-chain`, or `autonomous-chain`.
4. Read only the templates needed for the requested deliverables:
   - Student worksheet: read [references/worksheet-writing-standard.md](references/worksheet-writing-standard.md), then [references/worksheet-template.md](references/worksheet-template.md).
   - Question bank, `preReadChecks`, or `readChecks`: read [references/question-bank-design-standard.md](references/question-bank-design-standard.md).
   - Weekly course spec and schema v3 JSON: [references/course-spec-template.md](references/course-spec-template.md)
   - Teacher lesson plan: [references/lesson-plan-template.md](references/lesson-plan-template.md)

If the request is an audit only, do not edit files. Run the validator and report evidence.

## Required workflow

1. Define the observable weekly capability, In/Out of Scope, Hook/Deliver, and scaffold profile. Name the student's exact transformation: copy by matching labels, retrieve prior data, classify, compose, revise, or assemble. Do not silently add summarizing, inference, or rewriting when it is not being taught.
2. Design the teacher-only answer chain before writing the story. Each main task has one primary cognitive action, one primary result, a minimal `passContent`, and a local reproducible pass rule. For a chained week, define the previous result, current problem, current action, preservation boundary, and next state.
3. Design the question bank from a learning contract and cognitive-function matrix. Use short checks to focus the child on previous-current-next state and concept boundaries; do not compensate for a weak bank by adding procedural paragraphs to the worksheet.
4. Create or update all three files unless the user explicitly narrows the deliverable:
   - `wiki/worksheets/S3/S3-WNN-學習單.md`
   - `wiki/labterminal-specs/S3/S3-WNN-課程規格-G1-G2.md`
   - `wiki/lesson-plans/S3/S3-WNN-教案.md`
5. Lock worksheet H2 headings and `CONTENT_REVISION` before writing the config. Copy headings verbatim into `contentRef` and `nextContentRef`.
6. Put the sole `LAB_TERMINAL_WORKSHEET_CONFIG` JSON block in the weekly course spec. New work uses schema v3 and declares `scaffoldProfile`.
7. Keep hidden answer keys, `passContent`, validation terms, coins, and quiz answers out of the student worksheet. In a `guided-chain` match-and-copy task, canonical values explicitly authorized as student-visible source data by the weekly spec may appear; they are task input, not a leaked hidden key. Keep JSON out of the lesson plan.
8. Estimate the Grade 4 main-line duration with `activity-time-estimator`; use one action inventory for both the spec and lesson plan. Count all mandatory stems, options, required feedback views, and clicks. Target 50–65 minutes.
9. Run:

```powershell
python skills/s3-answer-sheet-course/scripts/validate_s3_answer_course.py `
  wiki/worksheets/S3/S3-WNN-學習單.md `
  wiki/labterminal-specs/S3/S3-WNN-課程規格-G1-G2.md `
  --lesson-plan wiki/lesson-plans/S3/S3-WNN-教案.md
```

Resolve every error. Review every warning and record why any warning remains.

## Non-negotiable contracts

- The weekly course spec is the sole machine source; do not create a handwritten sidecar JSON.
- `contentRevision`, `contentSource.path`, all content references, explicit IDs, dependencies, and the 250-coin sum must agree.
- AI can generate or explain, but local reproducible rules decide completion. Technical generation failure cannot count as student failure.
- Later tasks may consume completed earlier `passContent`; they must not reveal earlier answers before completion.
- The worksheet is a concise story-and-data surface for children, not a procedure manual. Put focus-control in short single-judgment checks without turning the bank into another reading passage.
- Question quantity follows cognitive coverage and ECT, not a fixed quota. Every chained task must make previous result, current problem, current action, preservation boundary, and next state recoverable across its checks and task contract.
- Media is either signed live Lab output or an explicitly declared teacher-library asset. Preserve the student's prompt in both cases.
- Preserve drafts, attachments, quiz answers, and modification history across rejection, reload, task switching, and recoverable failure.
- Student-facing content uses Lab names and no third-party AI brands.
- Do not apply the legacy 7-screen standalone HTML skeleton to this architecture.

## Reference hierarchy and pattern selection

- The shared architecture governs bundle contracts; the target week's Semester entry and course spec govern the capability, assessment, and scaffold profile.
- Keep W01-W04 as valid references for scaffold progression, answer chains, tool flow, explicit IDs, state, local validation, and answer isolation. Also reuse their effective task wording, teaching devices, or content patterns selectively; do not treat the four worksheets as wholly positive or wholly negative templates.
- Use the current `wiki/worksheets/S3/S3-W05-學習單.md` as the primary student-facing engineering benchmark. Its complete story, causal continuity, functional roles, concise visible prose, and explicit separation of story explanation from student operation apply broadly.
- W05's exact-label copy/paste pattern is conditional, not universal. Use it for `guided-chain` work whose assessed action is placing supplied content into named fields and assembling saved results. Do not use it when students are meant to infer, summarize, rewrite, or compose independently.
- Reuse W05's engineering principles, not its plot, characters, field count, task labels, or exact section sequence. Never claim autonomous prompting when the worksheet supplies canonical values and copyable sentence frames.
- `失敗結果：XXX` is a W05-specific device supported by its recurring character performing incomplete operations. It is not a required heading or default worksheet pattern. Use an explicit failure-result block only when the week's learning action genuinely depends on comparing a stable character's mistake with its consequence.

## Scaffold profile guardrails

- `onboarding`: copy-ready prompts and explicit tools are allowed; do not claim to assess autonomous prompting.
- `guided-chain`: the prompt frame can be complete, but the student must retrieve the right prior data.
- `semi-open-chain`: the session input starts empty; any teacher `toolPrompt` stays hidden; four tool buttons may remain visible without highlighting.
- `autonomous-chain`: no complete prompt template or `toolPrompt`; use direction-only `studentGuidance`, three pre-read checks per task, and answer-safe post-task checks.

## Completion report

State which files were created or changed, selected scaffold profile, task/coin totals, question totals by phase, ECT result, validator error/warning counts, and any explicit assumption still awaiting classroom calibration.
