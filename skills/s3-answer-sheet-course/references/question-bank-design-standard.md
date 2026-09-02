# S3 題庫認知設計標準

Use this reference whenever creating, revising, or auditing `preReadChecks`, `readChecks`, a prologue quiz, or any student-facing question bank. The question bank is the main focus-control layer; the worksheet is the concise story-and-data surface.

## Begin with a learning contract, not a target count

Before writing options, state:

```text
Weekly observable capability:
Concepts the student must distinguish:
Evidence needed to solve the task:
Previous result already established:
Current unresolved problem:
Current action and output:
What must be preserved:
Next action or completion state:
```

Every check must serve one named cognitive function. Useful functions are:

- `orientation`: identify the visible source or expected result.
- `concept-boundary`: distinguish concepts by the question each statement answers, not by a keyword.
- `state-recap`: recall what the previous task already fixed.
- `current-problem`: identify what remains wrong now.
- `current-action`: select the action or output required now.
- `preserve-and-change`: separate valid prior work from the one field that changes.
- `next-action`: identify the next source, action, or completion ritual.
- `transfer`: apply the same concept to a new but structurally similar example.

Do not add a question only to increase the count. Do not delete a unique concept boundary or state transition merely to reduce the count.

## Divide responsibility between worksheet and question bank

The worksheet is written for Grade 4 students. Keep only the story state, operable source data, task goal, necessary constraint, and concise expected result. Do not turn it into a procedure manual.

Move focus-management into short checks:

- what happened in the previous task;
- what remains wrong;
- what the student must do now;
- what correct work must be preserved;
- what comes next.

The question bank must not become another long reading passage. One check makes one judgment. Put the context needed to answer in the stem, use short parallel options, and avoid reprinting the whole worksheet.

## Build a previous-current-next state bridge

For every task in a causal chain, define these semantics in the course spec before writing checks:

```json
"stateBridge": {
  "previousResult": "What is already valid or completed",
  "currentProblem": "What is still wrong or missing",
  "currentAction": "The one action and output required now",
  "preserve": ["Prior evidence that must remain"],
  "doNotDo": ["Likely destructive or premature actions"],
  "nextState": "What this task enables"
}
```

`stateBridge` is a recommended schema v3 extension for chained or concept-dense weeks. If the renderer does not consume the field, preserve the same semantics in the human-readable answer-chain table and checks. It is teacher/system metadata and must not be copied verbatim into the student worksheet.

Coverage is required across the task, but not every item needs its own separate question. Combine nearby judgments when the result stays unambiguous and reading load falls.

## Teach concept boundaries, not labels

For each easily confused concept, define:

```json
"conceptBoundary": {
  "label": "The local concept name",
  "diagnosticQuestion": "The question this kind of statement answers",
  "includes": ["Positive evidence"],
  "excludes": ["Nearest competing concept"]
}
```

A domain-specific alias such as `requirementConcept` is allowed when already deployed, but the semantics must remain explicit. Concept checks should include near-boundary examples and transfer examples. A correct answer should depend on the statement's function, not on spotting one repeated noun.

When a week teaches four categories, make their distinction explicit in the teacher/system contract and test at least the confusing boundaries. Do not assume that seeing all four labels once creates understanding.

## Calibrate quantity by coverage and profile

There is no universal number of checks per task.

- `onboarding`: use only checks needed to keep the first tool flow understandable; `preReadChecks` may be absent.
- `guided-chain`: use checks to recall the prior result, identify the present gap, and select the next addition or placement. Add concept-transfer checks only when classification is part of the capability.
- `semi-open-chain`: check source selection, desired result, preservation, and revision method without revealing a tool answer.
- `autonomous-chain`: exactly three `preReadChecks` per main task as required by the shared architecture, plus answer-safe post-task checks needed by the weekly policy.

The release count is the smallest set that covers all required cognitive functions and still fits the Grade 4 ECT budget. Report totals by phase and by task in the course spec. If a task has multiple checks with the same function and no transfer value, merge or remove the weaker duplicate.

## Write diagnostic options and feedback

- Use at least three unique, plausible options. Use a fourth only when it represents a meaningful nearby misconception.
- Make each distractor traceable to a real error: wrong source, wrong concept boundary, wrong result type, destructive replacement, premature next step, or keeping a superseded value.
- Keep option length, grammar, and tone comparable. Disperse `answerIndex`; do not create a visible position pattern.
- `successFeedback` briefly names why the choice works.
- `retryFeedback` points to evidence, a diagnostic question, or a section to recheck. It must not paste the correct answer.
- A wrong check preserves the student's main result and draft.

## JSON contract

- Every check has a stable unique `id`, `type`, `question`, `options`, `answerIndex`, `successFeedback`, and `retryFeedback`.
- Every `readCheck` declares a meaningful `phase`; use stable generic phases where possible: `state-recap`, `concept-boundary`, `current-problem`, `current-action`, `preserve-and-change`, `next-action`, `success-review`, or `completion`. Existing domain-specific phases may remain when their function is documented.
- `displayOrder`, when present, is unique and follows the rendered order.
- `reviewCriteria.requiredPreReadChecks` and `requiredReadChecks` equal the actual array lengths.
- `nextContentRef` points to a real unique worksheet H2.
- Put optional weekly `learningContract`, `stateBridge`, and `conceptBoundary` metadata in the sole schema v3 JSON only when they help the teacher, validator, or renderer. Do not require these extension names for simple weeks.
- When check IDs, counts, answer semantics, or dependencies change, increase `contentRevision`; increase `storageVersion` and define reset/migration behavior when saved progress is incompatible.

## Reading load and classroom calibration

Count every mandatory stem, option, required feedback view, click, and transition in the Grade 4 activity inventory. When the course is too long:

1. remove paraphrase-only checks;
2. merge state recap with the current problem when one short stem can test both;
3. shorten stems and options;
4. move non-core reflection to optional follow-up;
5. preserve unique concept boundaries and the causal state bridge.

After classroom use, review P50/P80 completion time, wrong-answer distribution, repeated retries, and teacher intervention. Revise a question when its distractor attracts students for wording reasons rather than the intended misconception. A bank is not improved merely because its item count rises.

## Release audit

- [ ] Each check maps to the weekly capability and one cognitive function.
- [ ] Each chained task makes the previous result, current problem, current action, preservation boundary, and next state recoverable without adding a paragraph to the worksheet.
- [ ] Confusable concepts are separated by diagnostic questions and near-boundary examples.
- [ ] No check asks for an answer the student has not yet obtained or leaks hidden `passContent`.
- [ ] Distractors represent real misconceptions; correct positions and option lengths do not signal the answer.
- [ ] Check totals, phases, required counts, IDs, and content references agree between prose and JSON.
- [ ] The worksheet remains concise and student-readable; the bank remains short and single-judgment.
- [ ] Grade 4 ECT remains 50–65 minutes and classroom evidence is recorded for the next revision.
