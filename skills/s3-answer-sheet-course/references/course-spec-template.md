# S3 答題版｜單週課程規格與 schema v3 模板

> `{{...}}` 必須在生成時替換。陣列數量依答案鏈與 ECT 調整；不要為了填模板製造多餘題目。

````markdown
# [S3-W{{NN}}] {{COURSE_TITLE}}｜GAMMA＋答題卡課程規格 G1–G2

> 來源學習單：[[S3-W{{NN}}-學習單]]｜對應教案：[[S3-W{{NN}}-教案]]｜內容版本：`S3W{{NN}}-{{YYYY-MM-DD}}-r1`

## §G 規格治理

- **正典聲明【規定】**：本檔是本週答案、判定、狀態、解鎖、金幣與網站 JSON 的唯一來源；學生題面只讀學習單。
- **綁定內容【規定】**：`wiki/worksheets/S3/S3-W{{NN}}-學習單.md`，revision `S3W{{NN}}-{{YYYY-MM-DD}}-r1`。
- **In Scope【規定】**：{{IN_SCOPE}}。
- **Out of Scope【規定】**：{{OUT_OF_SCOPE_AND_TARGET_WEEK}}。
- **支架 Profile【規定】**：`{{SCAFFOLD_PROFILE}}`；{{WHY_THIS_PROFILE}}。
- **可數單位【規定】**：{{PROLOGUE_COUNT}} 個序章、{{MAIN_TASK_COUNT}} 個主任務、{{PRE_READ_TOTAL}} 題題前檢核、{{READ_CHECK_TOTAL}} 題題後檢核、250 金幣。

## §P 支架與跨週定位

{{WHAT_STUDENTS_RECEIVE_AND_WHAT_THEY_MUST_SUPPLY_THEMSELVES}}

## §GL 遊戲迴圈與判定

```text
{{STORY_LOOP_ALIGNED_WITH_READ_DATA_PROMPT_RESULT_REVIEW_SAVE}}
```

- **AI 定位【規定】**：生成、整理與角色化回饋；本地規則判 pass/fail。
- **答案傳遞【規定】**：{{ANSWER_CHAIN_SUMMARY}}。
- **退件【規定】**：保留草稿與附件，一次只給一個方向，不提供答案。
- **金幣【規定】**：{{COIN_DISTRIBUTION}}＝250；以正式 `taskId` 冪等入帳。

## 1. 後設資料與時長

| 欄位 | 值 |
|---|---|
| 學期／週次 | S3／W{{NN}} |
| 年級 | 小四上，G1–G2 互動取向 |
| Profile | `{{SCAFFOLD_PROFILE}}` |
| 工具 | {{LAB_TOOLS}} |
| 主線時間 | {{ECT_MINUTES}} 分鐘；activity-time-estimator Grade 4：{{ECT_VERDICT}} |
| ECT 動作來源 | {{ECT_JSON_PATH_OR_CONCISE_INVENTORY}} |
| 主線金幣 | 250 |

## 2. 題目、答案鏈與主成果判定

| 題 | 眼前資料 | 本題主要動作 | 主成果 | `passContent` | 下一題依賴 | 本地判定 |
|---|---|---|---|---|---|---|
| A | {{...}} | {{...}} | {{...}} | {{...}} | {{...}} | {{...}} |

### 正確答案隔離規則【規定】

- 本節與 JSON 的答案資料不得渲染到 GAMMA、未通關卡、Prompt 回饋或 placeholder。
- 後題只透過 `autoContextFrom` 取得已通過 `passContent`。
- 題前／題後測驗只考資料、方法與下一步，不考尚未取得的正解。
- GAMMA 圖只畫問題狀態，不畫正解。

## 3. 每題審核標準

| 題 | Prompt 預審 | 主成果通過 | 方向式退件 |
|---|---|---|---|
| A | {{...}} | {{...}} | {{...}} |

## 4. 題前與題後檢核

- `preReadChecks`：{{PROFILE_POLICY}}。
- `readChecks`：{{PHASE_SEQUENCE_AND_COUNTS}}。
- 全部使用本地 `answerIndex`；答錯保留成果，只指向回看方向。
- 所有 ID 唯一，草稿依 ID 保存，不依陣列 index。

## 5. 內嵌網站設定 JSON（唯一機器來源）

<!-- LAB_TERMINAL_WORKSHEET_CONFIG_START -->
```json
{
  "schemaVersion": 3,
  "id": "S3W{{NN}}",
  "courseId": "S3-W{{NN}}",
  "title": "S3 W{{NN}}｜{{COURSE_TITLE}}",
  "shortTitle": "S3 W{{NN}}｜{{SHORT_TITLE}}",
  "semester": "S3",
  "week": {{WEEK_NUMBER}},
  "source": "gamma-answer-worksheet",
  "contentRevision": "S3W{{NN}}-{{YYYY-MM-DD}}-r1",
  "contentSource": {
    "type": "markdown",
    "path": "wiki/worksheets/S3/S3-W{{NN}}-學習單.md"
  },
  "storageVersion": "v1-s3w{{NN}}-{{SLUG}}-{{YYYYMMDD}}",
  "scaffoldProfile": "{{SCAFFOLD_PROFILE}}",
  "studentToolHints": {{TRUE_OR_FALSE}},
  "reviewFeedbackMode": "direction-only",
  "initialQuestionId": "{{INITIAL_QUESTION_ID}}",
  "mantra": ["{{MANTRA_STEP_1}}", "{{MANTRA_STEP_2}}", "{{MANTRA_STEP_3}}", "{{MANTRA_STEP_4}}"],
  "questions": [
    {
      "id": "prologue",
      "taskId": "S3-W{{NN}}-PROLOGUE",
      "contentRef": "序章詢問｜{{PROLOGUE_TITLE}}",
      "presentationSurface": "answer-card-only",
      "code": "序章・{{PROLOGUE_CODE}}",
      "label": "{{PROLOGUE_LABEL}}",
      "title": "{{PROLOGUE_TITLE}}",
      "prompt": "{{PROLOGUE_STUDENT_PROMPT}}",
      "interactionMode": "reading-check-only",
      "studentPromptEditable": false,
      "expectedKind": "none",
      "coins": 0,
      "preReadChecks": [
        {
          "id": "prologue-data",
          "type": "choice",
          "question": "{{VISIBLE_DATA_QUESTION}}",
          "options": ["{{CORRECT}}", "{{PLAUSIBLE_DISTRACTOR}}", "{{PLAUSIBLE_DISTRACTOR}}"],
          "answerIndex": {{INDEX}},
          "successFeedback": "{{ANSWER_SAFE_SUCCESS}}",
          "retryFeedback": "{{DIRECTION_ONLY_RETRY}}"
        }
      ],
      "reviewCriteria": {
        "requiredPreReadChecks": {{COUNT}},
        "aiReviewMode": "local-only"
      }
    },
    {
      "id": "q1",
      "taskId": "S3-W{{NN}}-A",
      "contentRef": "任務 A｜{{TASK_A_TITLE}}",
      "code": "任務 A・{{TASK_A_TITLE}}",
      "label": "{{SHORT_ACTION_LABEL}}",
      "title": "{{ANSWER_CARD_TITLE}}",
      "prompt": "{{RIGHT_SIDE_TASK_SUMMARY_WITHOUT_HIDDEN_ANSWER}}",
      "studentGuidance": "{{DIRECTION_ONLY_GUIDANCE_IF_PROFILE_ALLOWS}}",
      "interactionMode": "one-question-one-result",
      "studentPromptEditable": true,
      "autoContextFrom": ["contentRef:任務 A｜{{TASK_A_TITLE}}"],
      "responseCards": ["通關答案"],
      "toolId": "{{terminal|image|music|video}}",
      "expectedKind": "{{text|image|audio|video}}",
      "coins": {{COINS}},
      "accept": "{{MIME_LIST}}",
      "reviewHint": "{{DIRECTION_ONLY_REVIEW_HINT}}",
      "passContent": "保存站 A・{{STRUCTURED_MINIMAL_SUMMARY}}",
      "preReadChecks": [
        {
          "id": "q1-preread-data",
          "type": "choice",
          "question": "{{WHAT_DATA_IS_VISIBLE}}",
          "options": ["{{...}}", "{{...}}", "{{...}}"],
          "answerIndex": {{INDEX}},
          "successFeedback": "{{...}}",
          "retryFeedback": "{{...}}"
        }
      ],
      "readChecks": [
        {
          "id": "q1-review",
          "displayOrder": 1,
          "phase": "review",
          "type": "choice",
          "question": "{{REVIEW_METHOD_OR_ALREADY_REVEALED_RESULT}}",
          "options": ["{{...}}", "{{...}}", "{{...}}"],
          "answerIndex": {{INDEX}},
          "successFeedback": "{{...}}",
          "retryFeedback": "{{...}}"
        },
        {
          "id": "q1-next",
          "displayOrder": 2,
          "phase": "next-reading",
          "nextContentRef": "任務 B｜{{TASK_B_TITLE}}",
          "type": "choice",
          "question": "{{CURRENT_LOCATION_THEN_NEXT_ACTION}}",
          "options": ["{{...}}", "{{...}}", "{{...}}"],
          "answerIndex": {{INDEX}},
          "successFeedback": "{{...}}",
          "retryFeedback": "{{...}}"
        }
      ],
      "promptReviewCriteria": {
        "explicitEvidenceGroups": [
          { "anyOf": ["{{TERM}}", "{{SYNONYM}}"] }
        ],
        "minimumExplicitEvidenceMatches": {{COUNT}}
      },
      "reviewCriteria": {
        "minAttachments": {{0_OR_1}},
        "maxAttachments": {{0_OR_1}},
        "allowedMimeTypes": ["{{MIME}}"],
        "requiredPreReadChecks": {{COUNT}},
        "requiredReadChecks": {{COUNT}},
        "aiReviewMode": "local-only"
      }
    }
  ]
}
```
<!-- LAB_TERMINAL_WORKSHEET_CONFIG_END -->

## 6. 資料、狀態、失敗與發布

- 草稿鍵：`storageVersion + worksheetId + userId`。
- `passContent` 只在題目通過後寫入；後題只讀明列來源。
- 金幣交易 ID：`S3W{{NN}}:<uid>:<taskId>:pass`。
- 本地／雲端衝突取進度較遠者；不同 uid 互不污染。
- AI、媒體、附件、離線與缺資產的學生畫面及備援：{{FAILURE_MATRIX_SUMMARY}}。
- revision 或 schema 不相容時：{{MIGRATION_OR_PROGRESS_RESET_POLICY}}。

## 7. 老師端與翻轉教育

{{TEACHER_DASHBOARD_FIELDS_AND_PEER_HELP_BOUNDARIES}}

## 8. 驗收清單（DoD）

- [ ] 三文件、revision、H2 content refs、ID 與金幣通過 validator。
- [ ] Profile 支架符合本週能力，沒有答案洩漏。
- [ ] 每題一個主要動作、一個成果、一個最小保存包。
- [ ] 主成果本地判定；技術失敗不算學生失敗。
- [ ] ECT 50～65 分鐘，與教案使用同一動作清單。
- [ ] 老師端、備援、翻轉教育、完成儀式已定義。

## 9. 連結

- 學習單：[[S3-W{{NN}}-學習單]]
- 教案：[[S3-W{{NN}}-教案]]
- 總架構：[[S3-答題版學習單新架構規格]]

> 最後修改：{{YYYY-MM-DD}}，原因：{{CHANGE_REASON}}
````

## Profile-specific cleanup before validation

- If there is no prologue, remove the entire prologue object and point `initialQuestionId` to the first main task.
- For `onboarding`, `preReadChecks` can be absent and explicit tool guidance is allowed.
- For `semi-open-chain`, a hidden `toolPrompt` can exist for server review, but it must never prefill the student input.
- For `autonomous-chain`, remove every `toolPrompt`; keep `studentGuidance`, exactly three `preReadChecks` per main task, and the weekly declared `readChecks` policy.
- Remove `promptReviewCriteria` from pure text tasks; replace attachment rules with local text concepts and length bounds.
- Never leave a `{{...}}` token in a deliverable.

