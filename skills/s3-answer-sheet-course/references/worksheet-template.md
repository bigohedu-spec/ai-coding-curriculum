# S3 答題版｜學生學習單模板

> 使用前先讀總規格 §P 與 [worksheet-writing-standard.md](worksheet-writing-standard.md)，先寫清楚學生的主要轉換動作，再依 `scaffoldProfile` 選擇下方任務殼層。`{{...}}` 是生成時必須替換的欄位。W05 是學生端工程基準；它的同名欄位搬運只適用於對應能力，`失敗結果：XXX` 也不是固定段落。

```markdown
# S3 W{{NN}}｜{{COURSE_TITLE}} 學習單

<!-- CONTENT_REVISION: S3W{{NN}}-{{YYYY-MM-DD}}-r1 -->

> **求助順序**：GAMMA 故事 → 前題答題卡／Lab Terminal → 完成的同學 → 老師

## 今天的冒險

{{CONCISE_HOOK_WITH_PROBLEM_STUDENT_ROLE_SUPPORTING_ROLES_AND_PROMISED_RESULT}}

今天的口訣：

> **{{MANTRA}}**

<!-- GAMMA_ASSET_PROMPT
用途：開場主視覺
提示詞：{{SCENE_WITHOUT_ANSWER}}, 兒童友善、不恐怖、電影感寬幅構圖、保留標題留白，不要文字、數字、Emoji、答案、標誌或浮水印
比例：16:9
-->

## 開始前：答題卡會保存你的紀錄

{{PROFILE_APPROPRIATE_SAVE_AND_PROMPT_GUIDANCE}}

## 序章詢問｜{{PROLOGUE_TITLE}}

**任務 ID**：S3-W{{NN}}-PROLOGUE

{{RIGHT_SIDE_ONLY_READING_OR_TEXT_PROMPT}}

---

## 任務 A｜{{TASK_A_TITLE}}

**任務 ID**：S3-W{{NN}}-A

{{TASK_BODY_FROM_ONE_PROFILE_APPROPRIATE_SHELL_BELOW}}

<!-- GAMMA_ASSET_PROMPT
用途：任務 A 場景圖
提示詞：{{PROBLEM_STATE_NOT_SOLUTION}}, 不要可閱讀文字、數字、Emoji、答案或浮水印
比例：16:9
-->

---

## 任務 B｜{{TASK_B_TITLE}}

**任務 ID**：S3-W{{NN}}-B

### 背景故事
{{...}}

### 謎題內容
{{MUST_REQUIRE_A_PASSED_DATA_WITHOUT_REPEATING_ANSWER}}

### 通關條件
{{...}}

### 提示
{{...}}

---

{{REPEAT_TASK_BLOCKS_AS_REQUIRED_BY_THE_ANSWER_CHAIN}}

## {{DELIVER_ENDING_TITLE}}

{{ENDING_THAT_USES_THE_STUDENT_RESULTS_CLOSES_THE_HOOK_AND_SHOWS_CHARACTER_OR_COMMUNITY_CHANGE}}

## 卡住了嗎？

- 找不到舊資料 → 回到已完成答題卡查看通關紀錄。
- 不知道怎麼問 → 先說清楚「我看到什麼」和「希望 AI 做什麼」。
- 系統退件 → 只修正它指出的那一類缺漏。
- 技術失敗 → 保留畫面與 Prompt，告訴老師，不要重打全部內容。

## 今天學到什麼？

{{ONE_TO_THREE_SHORT_REFLECTION_PROMPTS_OR_OMIT_IF_TIME_BUDGET_IS_FULL}}

## 連結

- 對應課程規格：[[S3-W{{NN}}-課程規格-G1-G2]]
- 對應教案：[[S3-W{{NN}}-教案]]
- 所屬學期：[[S3-小四上-AI建構]]
- 前一週：[[S3-W{{PREV_NN}}-學習單]]

> 最後修改：{{YYYY-MM-DD}}，原因：{{CHANGE_REASON}}
```

Profile adjustments:

- `onboarding`: remove the prologue and four-section puzzle shape when unnecessary; explicit tool names and copy-ready prompts are allowed.
- `guided-chain`: choose the shell that matches the assessed action. For label-matched placement, use the guided field-placement shell below. For prior-card retrieval, keep a complete frame with clearly marked prior-card slots without repeating the prior answer.
- `semi-open-chain`: a visible “你可以這麼問” may appear, but the actual session input must remain empty.
- `autonomous-chain`: keep the four sections per task; do not include complete prompts, step-by-step completion instructions, quiz questions, or tool answers.

Guided field-placement task shell (conditional; labels must match exactly):

````markdown
### {{MISCONCEPTION_CHARACTER}}的話

{{ONE_INCOMPLETE_OR_MISTAKEN_INSTRUCTION}}

### {{OBSERVABLE_PROBLEM_HEADING}}

{{ONE_VISIBLE_CONSEQUENCE_AND_THE_MISSING_INFORMATION_TYPE}}

### {{STAKEHOLDER_CHARACTER}}的話｜{{CURRENT_DIMENSION}}

{{TWO_OR_THREE_NATURAL_SENTENCES_CONNECTING_PREVIOUS_PROGRESS_TO_THE_CURRENT_NEED}}

- {{FIELD_LABEL_1}}：`{{ONE_CANONICAL_COPYABLE_VALUE}}`
- {{FIELD_LABEL_2}}：`{{ONE_CANONICAL_COPYABLE_VALUE}}`

### 可複製填空 Prompt｜{{SLOT_COUNT}} 個空格

```text
{{FRAME_WITH_PLACEHOLDERS_USING_THE_EXACT_FIELD_LABELS_ABOVE}}
```

### 完成成果

{{CURRENT_OUTPUT_AND_WHAT_LATER_DIMENSION_IS_NOT_HANDLED_YET}}
````

Open or autonomous task shell:

```markdown
### 背景故事

{{WHAT_CHANGED_PREVIOUSLY_AND_WHY_THIS_TASK_IS_THE_CAUSAL_NEXT_STEP}}

### 謎題內容

{{VISIBLE_SOURCE_DATA_AND_STUDENT_GOAL}}

### 通關條件

{{STUDENT_VISIBLE_OUTPUT_CONTRACT_WITHOUT_HIDDEN_ANSWER}}

### 提示

{{DIRECTION_ONLY_HINT}}
```
