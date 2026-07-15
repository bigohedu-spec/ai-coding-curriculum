# Task Schema｜任務格式規格

## 為什麼需要固定格式

自動化審核系統需要每個任務的輸出是**可量化、可判斷**的。這份文件定義所有任務必須遵守的資料格式，讓系統能夠：

1. 自動判定任務是否通過
2. 記錄學生的學習進度
3. 根據進度決定 Popup Quiz 中出現哪些題目
4. 在不同任務間建立知識點的連結關係

---

## 核心資料結構

### 任務定義（Task Definition）

```json
{
  "task_id":     "S1-W06-A",
  "name":        "問法大比拼",
  "type":        "LT",
  "module":      "S1-M2",
  "week":        6,
  "points":      30,

  "checkpoints": [
    {
      "id":                   "S1-W06-A-C1",
      "description":          "提交兩組明顯不同的 Prompt 截圖",
      "evidence_type":        "screenshot",
      "evaluation_criteria":  "截圖包含兩段 AI 對話，兩個 Prompt 在結構或長度上明顯不同",
      "points":               30
    }
  ],

  "skill_tags":         ["prompt-basic", "prompt-comparison"],
  "unlocks_quiz_tags":  ["prompt-three-elements", "prompt-vs-question"]
}
```

### 學生進度記錄（Student Progress Record）

```json
{
  "student_id":           "student_42",
  "completed_tasks":      ["S1-W01-A", "S1-W01-B", "S1-W02-A", "S1-W06-A"],
  "completed_checkpoints": ["S1-W01-A-C1", "S1-W01-A-C2", "S1-W06-A-C1"],
  "unlocked_skill_tags":  ["minecraft-basics", "what-is-ai", "prompt-basic"],
  "current_module":       "S1-M2",
  "total_points":         150
}
```

### Quiz 題目（Quiz Question）

```json
{
  "question_id":          "Q-S1-W06-001",
  "question":             "一個好的 Prompt 包含哪三個要素？",
  "options": [
    "角色、背景、問題",
    "長度、格式、語氣",
    "主詞、動詞、受詞",
    "問題、答案、確認"
  ],
  "correct_answer":       0,
  "explanation":          "好的 Prompt 要告訴 AI：你是誰（角色）、我是誰/情境是什麼（背景）、我要什麼（問題）",
  "prerequisite_tasks":   ["S1-W06-A"],
  "skill_tags":           ["prompt-three-elements"],
  "difficulty":           1,
  "semester":             "S1"
}
```

---

## Evidence Type 說明

| 類型 | 適用情境 | 系統判定方式 |
|------|---------|------------|
| `screenshot` | MC 建造、Canva 任務、Lab Terminal 對話截圖 | AI 視覺模型比對截圖內容是否符合 criteria |
| `file` | PDF 作品集、Canva 設計檔 | 格式驗證 + AI 內容評分 |
| `code` | VS Code 程式任務 | 語法檢查 + 功能測試（自動執行） |
| `text` | 反思問題、Lab Terminal 問答紀錄 | 自然語言評分，對照 rubric |
| `in_game` | 未來：伺服器自動偵測建造或動作 | 伺服器 Plugin API 回傳狀態 |

---

## Skill Tags 分類系統（S1 完整版）

### Minecraft 技能
| Tag | 說明 | 首次觸發任務 |
|-----|------|------------|
| `minecraft-basics` | 基本操作：移動、挖掘、放置、背包 | S1-W01-A |
| `minecraft-building` | 建造能力：搭建有意義的結構 | S1-W01-B |
| `minecraft-survival` | 生存基礎：食物、血量、夜晚應對 | S1-W01-A |

### AI 基礎知識
| Tag | 說明 | 首次觸發任務 |
|-----|------|------------|
| `what-is-ai` | 理解 AI 是什麼，與電腦的差別 | S1-W02-A |
| `ai-in-life` | 能舉出生活中 AI 的應用例子 | S1-W03-A |
| `ai-mistakes` | 理解 AI 會犯錯，有批判性思考 | S1-W04-A |

### Prompt 技能
| Tag | 說明 | 首次觸發任務 |
|-----|------|------------|
| `prompt-basic` | 能夠對 AI 提出基本問題並得到回答 | S1-W06-A |
| `prompt-comparison` | 能比較不同問法得到不同結果 | S1-W06-A |
| `prompt-three-elements` | 能使用角色＋背景＋問題的格式 | S1-W09-A |
| `prompt-interest` | 能把個人興趣轉化為 AI 的提問材料 | S1-W07-A |
| `prompt-roleplay` | 能讓 AI 扮演特定角色 | S1-W08-A |

### 圖像生成
| Tag | 說明 | 首次觸發任務 |
|-----|------|------------|
| `image-gen-basic` | 能用文字描述生成 AI 圖片 | S1-W11-A |
| `image-gen-comparison` | 能比較不同描述產生的圖片差異 | S1-W12-A |
| `image-gen-iteration` | 能修改描述改善圖片品質 | S1-W14-A |

### 創作與作品
| Tag | 說明 | 首次觸發任務 |
|-----|------|------------|
| `interest-list` | 有明確的個人興趣清單（S6 前持續追蹤） | S1-W17-A |
| `ai-creative-writing` | 能讓 AI 根據興趣生成創作文字 | S1-W20-A |
| `portfolio-basic` | 能整理作品集 | S1-W23-A |

---

## 完整任務範例

### S1-W01-A｜第一次進入

```json
{
  "task_id":    "S1-W01-A",
  "name":       "第一次進入",
  "type":       "MC",
  "module":     "S1-M1",
  "week":       1,
  "points":     60,

  "checkpoints": [
    {
      "id":                  "S1-W01-A-C1",
      "description":         "截圖：成功挖下一個方塊",
      "evidence_type":       "screenshot",
      "evaluation_criteria": "截圖中可看到方塊被挖掉的過程，或背包中有對應材料",
      "points":              12
    },
    {
      "id":                  "S1-W01-A-C2",
      "description":         "截圖：成功放置一個方塊",
      "evidence_type":       "screenshot",
      "evaluation_criteria": "截圖中可看到地面上有一個方塊被放置",
      "points":              12
    },
    {
      "id":                  "S1-W01-A-C3",
      "description":         "截圖：打開背包畫面",
      "evidence_type":       "screenshot",
      "evaluation_criteria": "截圖顯示 Minecraft 背包介面",
      "points":              12
    },
    {
      "id":                  "S1-W01-A-C4",
      "description":         "截圖：角色跳起的瞬間",
      "evidence_type":       "screenshot",
      "evaluation_criteria": "截圖中角色明顯離地（腳不在地面上）",
      "points":              12
    },
    {
      "id":                  "S1-W01-A-C5",
      "description":         "截圖：自選的世界風景",
      "evidence_type":       "screenshot",
      "evaluation_criteria": "截圖顯示 Minecraft 世界的地景，非介面畫面",
      "points":              12
    }
  ],

  "skill_tags":        ["minecraft-basics", "minecraft-survival"],
  "unlocks_quiz_tags": ["minecraft-basic-ops", "minecraft-controls"]
}
```

---

### S1-W01-B｜留下印記

```json
{
  "task_id":    "S1-W01-B",
  "name":       "留下印記",
  "type":       "MC",
  "module":     "S1-M1",
  "week":       1,
  "points":     30,

  "checkpoints": [
    {
      "id":                  "S1-W01-B-C1",
      "description":         "截圖：在世界中建造的作品",
      "evidence_type":       "screenshot",
      "evaluation_criteria": "截圖中有一個明顯由方塊刻意堆疊而成的結構，非天然生成地形",
      "points":              30
    }
  ],

  "skill_tags":        ["minecraft-building"],
  "unlocks_quiz_tags": ["minecraft-building-basic"]
}
```

---

### S1-W06-A｜問法大比拼

```json
{
  "task_id":    "S1-W06-A",
  "name":       "問法大比拼",
  "type":       "LT",
  "module":     "S1-M2",
  "week":       6,
  "points":     30,

  "checkpoints": [
    {
      "id":                  "S1-W06-A-C1",
      "description":         "提交兩組對話截圖：問同一件事，但問法明顯不同",
      "evidence_type":       "screenshot",
      "evaluation_criteria": "兩張截圖各顯示一段 Lab Terminal 對話；兩個 Prompt 在字數或結構上有明顯差異（一個 ≤ 10 字，另一個 ≥ 20 字，或一個有角色設定另一個沒有）",
      "points":              30
    }
  ],

  "skill_tags":        ["prompt-basic", "prompt-comparison"],
  "unlocks_quiz_tags": ["prompt-different-results", "prompt-length-effect"]
}
```

---

## 對應的 Quiz 題庫範例

### 解鎖條件：完成 S1-W01-A

```json
[
  {
    "question_id":        "Q-S1-W01-001",
    "question":           "在 Minecraft 裡，要挖掉一個方塊，應該按哪個鍵？",
    "options":            ["滑鼠左鍵（按住）", "滑鼠右鍵", "E 鍵", "空白鍵"],
    "correct_answer":     0,
    "explanation":        "在 Minecraft 裡，對著方塊按住滑鼠左鍵就能挖掘。",
    "prerequisite_tasks": ["S1-W01-A"],
    "skill_tags":         ["minecraft-basic-ops"],
    "difficulty":         1
  },
  {
    "question_id":        "Q-S1-W01-002",
    "question":           "在 Minecraft 裡，要放置一個方塊，應該按哪個鍵？",
    "options":            ["滑鼠右鍵", "滑鼠左鍵", "F 鍵", "Q 鍵"],
    "correct_answer":     0,
    "explanation":        "選好手上的方塊後，對著要放置的位置按滑鼠右鍵即可放置。",
    "prerequisite_tasks": ["S1-W01-A"],
    "skill_tags":         ["minecraft-basic-ops"],
    "difficulty":         1
  },
  {
    "question_id":        "Q-S1-W01-003",
    "question":           "在 Minecraft 裡，要打開背包應該按哪個鍵？",
    "options":            ["E", "I", "B", "Tab"],
    "correct_answer":     0,
    "explanation":        "按 E 鍵可以開啟背包（物品欄）。",
    "prerequisite_tasks": ["S1-W01-A"],
    "skill_tags":         ["minecraft-controls"],
    "difficulty":         1
  }
]
```

### 解鎖條件：完成 S1-W06-A

```json
[
  {
    "question_id":        "Q-S1-W06-001",
    "question":           "下面哪一種問法，比較容易讓 AI 給出有用的回答？",
    "options":            [
      "「什麼是光合作用？」",
      "「你是一位國小老師，我是三年級學生，請用三句話解釋光合作用。」",
      "「光合作用光合作用光合作用」",
      "「我不懂光合作用」"
    ],
    "correct_answer":     1,
    "explanation":        "告訴 AI 角色和背景，它就知道要怎麼調整回答的方式和難度。",
    "prerequisite_tasks": ["S1-W06-A"],
    "skill_tags":         ["prompt-different-results"],
    "difficulty":         1
  },
  {
    "question_id":        "Q-S1-W06-002",
    "question":           "用兩種不同的方式問 AI 同一個問題，結果會怎樣？",
    "options":            [
      "結果完全一樣，因為問題一樣",
      "結果可能不同，問法越詳細通常答案越有用",
      "問越短越好，AI 比較不會搞混",
      "AI 不在乎問法，只看關鍵字"
    ],
    "correct_answer":     1,
    "explanation":        "問法不同，AI 得到的資訊量不同，給出的答案品質也會不同。",
    "prerequisite_tasks": ["S1-W06-A"],
    "skill_tags":         ["prompt-length-effect"],
    "difficulty":         1
  }
]
```

---

## 設計新任務時的必填欄位

每次新增一個任務到 wiki，**必須填寫**以下欄位才算完整：

| 欄位 | 說明 | 缺少此欄位的影響 |
|------|------|----------------|
| `checkpoints` | 每個驗收點的判定標準 | 無法自動審核 |
| `evidence_type` | 提交物格式 | 系統不知道要接收什麼 |
| `evaluation_criteria` | AI 用來判斷的標準 | 無法自動評分 |
| `skill_tags` | 此任務訓練了哪些知識點 | 無法追蹤學習進度 |
| `unlocks_quiz_tags` | 完成後解鎖哪些 Quiz 題目 | Quiz 系統無法個人化 |

---

## 相關概念

- [[task-types]]（任務類型：MC / EX / LT / MS / RT / TA）
- [[gamification-system]]（點數系統與統一經濟體）
- [[lab-terminal]]（LT 任務的平台與 Quiz 系統）

---

> 最後修改：2026-04-23，原因：初始建立，定義自動化審核系統所需的任務格式規格，填入 S1-W01-A、S1-W01-B、S1-W06-A 為範例
