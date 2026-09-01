# S3 學生學習單工程基準

Use this reference whenever creating, revising, or auditing the student worksheet. The shared architecture governs contracts. The target week's Semester entry and course spec govern what is taught and assessed. This file governs how that intent becomes student-visible story, instructions, and scaffolds.

## Reference roles

- W01-W04 remain useful for scaffold progression, tool flow, answer chains, and the gradual transfer of responsibility to students. Reuse effective wording, teaching devices, and content patterns selectively.
- Use the **current** `wiki/worksheets/S3/S3-W05-學習單.md` as the primary student-facing engineering benchmark. Re-read it rather than relying on a remembered revision.
- W05 contributes two different things: a broadly reusable narrative standard and a conditional guided field-placement pattern. Do not confuse them.

## Plan the student action before the story

Record this contract before drafting prose:

```text
Visible input:
Student's one primary transformation:
Submitted output:
What is deliberately not assessed:
Scaffold profile:
```

Choose one primary transformation per task: `match-and-copy`, `retrieve`, `classify`, `compose`, `revise`, or `assemble`.

- If the assessed action is `match-and-copy`, expose canonical source values and matching field names. Do not also require students to remove filler, infer synonyms, summarize, or rewrite.
- If the assessed action is `retrieve`, make the source location visible but do not repeat the saved answer in the new task.
- If the assessed action is `compose` or `revise`, do not supply a finished answer disguised as a copyable example.
- If the task ends by assembling earlier results, use the student's own passed results, not a teacher-completed final answer.

The story may explain why the action matters; it must not secretly change what the student is responsible for doing.

## Universal W05 narrative standard

Apply these qualities across scaffold profiles:

- **Complete arc**: establish a concrete problem, give the student an active role, progress through related consequences, combine earlier results at the climax, and show the opening problem resolved.
- **Causal continuity**: each task states what the previous result fixed, what remains unresolved, why the next learning action is needed, and what its result enables.
- **Functional roles**: each named character has an instructional function such as modeling a misconception, expressing the user's need, providing authorized information, or recognizing growth.
- **Meaning through consequence**: let the result demonstrate the lesson's value. A short closing insight is allowed; an unrelated moral slogan is not.
- **Stable world**: keep character motives, terminology, important objects, locations, and the order of events consistent from Hook to Deliver.

If removing the story leaves the student's action and motivation completely unchanged, strengthen the connection between the fictional problem and the learning action. Do not add more lore merely to make the story longer.

## Conditional W05 guided field-placement pattern

Use this pattern only when the target capability is to place supplied information into named Prompt fields and later assemble passed segments. It normally belongs to `guided-chain`.

For each build-up task, provide these functions in a readable order:

1. **Misconception or incomplete instruction**: a stable character shows exactly one missing dimension.
2. **Observable consequence**: an image or short description makes that single omission visible.
3. **Repair direction**: name the kind of information that must be added without introducing unrelated requirements.
4. **Normal stakeholder explanation**: two or three natural sentences connect the previous result, present need, and specified content.
5. **Canonical field list**: repeat the operable data as `field name: one copyable value`.
6. **Copyable frame**: use placeholders with the exact same field names as the canonical list.
7. **Result boundary**: state what will be produced now and which later concern is intentionally not handled yet.

Canonical field rules:

- Each field has one authoritative value, not synonyms, candidates, optional clauses, or decisions the student has not been taught to make.
- The value is first spoken naturally in the character's explanation, then repeated in a scannable copy zone.
- The source label and placeholder label match exactly. A student should never have to guess which value belongs in which slot.
- Keep explanations, warnings, and flavor text outside the copyable value.
- A copy control may copy a source value or frame, but it must not silently fill the entire completed answer when placement is the assessed action.
- Unreplaced placeholder text does not count as evidence. Feedback points to the unmatched field without pasting the answer for the student.

For the final integration task:

- Show an empty labeled structure in the required order.
- Show the student's own passed segments as separate copyable records.
- Require the student to place each segment under the matching label and preserve the intended formatting.
- Validate placement, completeness, and cross-segment consistency without demanding that the student retype approved content.

Do not describe this pattern as autonomous Prompt writing. The assessed progression is accurate placement, accumulation, and assembly.

## Reading load and operational clarity

Match the density and scanability of W05's student-visible prose, not the length of hidden `GAMMA_ASSET_PROMPT` comments.

- Give each paragraph one main idea and prefer one to three short sentences.
- State the general procedure once. Task blocks should contain only the current variation.
- Repeat content only when the repetition changes its function, such as natural dialogue followed by a copy zone.
- Introduce only names, places, objects, and invented terms students must remember to act.
- Use visible headings to separate story evidence, source data, the student's operation, and the expected result.
- A final assembly task may be longer than a normal task, but it must not reteach every earlier concept.

Count all student-visible prose, tables, source values, Prompt frames, and quizzes in the Grade 4 action inventory. W05 is an editorial comparator, not automatic time approval. The shared 50-65 minute main-line target remains the release target; report and resolve any overrun rather than treating a 90-minute class window or zero reading warnings as equivalent to passing it.

## Meaningful role-play

- Give the student an active role with a verb and responsibility, such as investigating, designing, repairing, advising, or protecting.
- A misconception character may create the problem, but the student must perform the action that resolves it.
- A stakeholder or mentor may provide canonical information when copying is the intended skill. Their dialogue should explain why the data matters before presenting the copy zone.
- Keep mistakes safe and non-shaming. A mistaken character can learn and change.
- Preserve character goals and behavior across tasks; do not force a new mistake only to manufacture another exercise.

## Storyboard and asset continuity

When the worksheet uses GAMMA images, define a small scene chain before writing prompts:

```text
Opening state -> per-task progress states -> climax -> resolved state
```

- Keep one authoritative description for each recurring character and repeat it consistently in asset prompts.
- Advance time, location, carried objects, and visible progress deliberately.
- Each task image should show the current problem or progress state without rendering readable answers.
- The final image may show the accumulated solution because it appears after completion.
- Hidden asset prompts do not count toward student reading load, but their continuity must still be reviewed.

## W05 special-case boundary

The heading `失敗結果：XXX` is not part of the general S3 worksheet skeleton. W05 can use repeated failure-result blocks because the same fixed character performs incomplete operations and each result supplies necessary comparison evidence.

For other weeks:

- Do not add a `失敗結果` heading by default.
- Use it only when observing the consequence of a recurring mistake is necessary evidence for the assessed action.
- If the task only needs a problem state, integrate it into the background, source material, or visual evidence without labeling it as a failure result.
- Do not force every task to begin with an error. A request, discovery, constraint change, or accumulated result may be the causal trigger.

## Editorial pass before validation

Read only the student-visible worksheet and confirm:

- A Grade 4 student can say who they are, what is wrong, what they do, and what they will finish.
- The stated primary transformation matches the actual instructions and assessment.
- No unannounced inference, summarizing, rewriting, or tool choice has been added.
- Every task follows causally from the previous result and handles one new dimension.
- Every named character has a stable function and the student resolves the central problem.
- If using field placement, every source label has one value and an exactly matching destination label.
- The final task uses the student's own passed work and closes the Hook.
- Repeated explanations, ornamental lore, unnecessary terms, and accidental answer leakage have been removed.
- No W05-specific field count, character, plot, or `失敗結果` heading was copied merely because it appears in the benchmark.
