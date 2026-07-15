# S1 任務定義｜小三上學期

> 本文件為機器可讀格式，供自動化審核系統使用。
> 所有任務已通過 CLAUDE.md 第十節的 Minecraft Vanilla 驗證。

---

## 模組一：AI 是什麼？（W1–W5）

### S1-W01-A｜第一次進入

```json
{
  "task_id": "S1-W01-A",
  "name": "第一次進入",
  "type": "MC",
  "module": "S1-M1",
  "week": 1,
  "points": 60,
  "checkpoints": [
    {
      "id": "S1-W01-A-C1",
      "description": "截圖：成功挖下一個方塊",
      "evidence_type": "screenshot",
      "evaluation_criteria": "截圖中可見方塊被挖除，或背包中有對應材料",
      "points": 12
    },
    {
      "id": "S1-W01-A-C2",
      "description": "截圖：成功放置一個方塊",
      "evidence_type": "screenshot",
      "evaluation_criteria": "截圖中地面上有一個非天然的方塊被放置",
      "points": 12
    },
    {
      "id": "S1-W01-A-C3",
      "description": "截圖：打開背包畫面",
      "evidence_type": "screenshot",
      "evaluation_criteria": "截圖顯示 Minecraft 背包介面（格子狀物品欄）",
      "points": 12
    },
    {
      "id": "S1-W01-A-C4",
      "description": "截圖：角色跳躍瞬間",
      "evidence_type": "screenshot",
      "evaluation_criteria": "截圖中角色明顯離地",
      "points": 12
    },
    {
      "id": "S1-W01-A-C5",
      "description": "截圖：自選世界風景",
      "evidence_type": "screenshot",
      "evaluation_criteria": "截圖顯示 Minecraft 世界地景，非介面畫面",
      "points": 12
    }
  ],
  "skill_tags": ["minecraft-basics", "minecraft-survival"],
  "unlocks_quiz_tags": ["minecraft-basic-ops", "minecraft-controls"]
}
```

### S1-W01-B｜留下印記

```json
{
  "task_id": "S1-W01-B",
  "name": "留下印記",
  "type": "MC",
  "module": "S1-M1",
  "week": 1,
  "points": 30,
  "checkpoints": [
    {
      "id": "S1-W01-B-C1",
      "description": "截圖：在世界中建造的任何結構",
      "evidence_type": "screenshot",
      "evaluation_criteria": "截圖中有一個由方塊刻意堆疊而成的結構，非天然地形",
      "points": 30
    }
  ],
  "skill_tags": ["minecraft-building"],
  "unlocks_quiz_tags": ["minecraft-building-basic"]
}
```

### S1-W02-A｜AI 大哉問

```json
{
  "task_id": "S1-W02-A",
  "name": "AI 大哉問",
  "type": "LT",
  "module": "S1-M1",
  "week": 2,
  "points": 30,
  "checkpoints": [
    {
      "id": "S1-W02-A-C1",
      "description": "截圖：問 Lab Terminal 一個關於 AI 的問題，並包含 AI 的回答",
      "evidence_type": "screenshot",
      "evaluation_criteria": "截圖包含學生輸入的問題（需與 AI 相關）及 Lab Terminal 的完整回答",
      "points": 30
    }
  ],
  "skill_tags": ["what-is-ai", "ai-vs-computer"],
  "unlocks_quiz_tags": ["what-is-ai-basic", "ai-vs-computer"]
}
```

### S1-W03-A｜AI 偵探

```json
{
  "task_id": "S1-W03-A",
  "name": "AI 偵探",
  "type": "LT",
  "module": "S1-M1",
  "week": 3,
  "points": 30,
  "checkpoints": [
    {
      "id": "S1-W03-A-C1",
      "description": "截圖：Lab Terminal 列出三個生活中使用 AI 的例子",
      "evidence_type": "screenshot",
      "evaluation_criteria": "截圖中可見三個不同的 AI 應用例子，且三者互不重複",
      "points": 30
    }
  ],
  "skill_tags": ["ai-in-life"],
  "unlocks_quiz_tags": ["ai-examples-life"]
}
```

### S1-W04-A｜AI 抓錯任務

```json
{
  "task_id": "S1-W04-A",
  "name": "AI 抓錯任務",
  "type": "LT",
  "module": "S1-M1",
  "week": 4,
  "points": 40,
  "checkpoints": [
    {
      "id": "S1-W04-A-C1",
      "description": "截圖：Lab Terminal 的錯誤回答",
      "evidence_type": "screenshot",
      "evaluation_criteria": "截圖包含 AI 的回答內容",
      "points": 20
    },
    {
      "id": "S1-W04-A-C2",
      "description": "文字：一句話說明 AI 哪裡錯了",
      "evidence_type": "text",
      "evaluation_criteria": "學生能用一句話指出 AI 回答中的具體錯誤，非泛泛評論",
      "points": 20
    }
  ],
  "skill_tags": ["ai-mistakes", "critical-thinking-ai"],
  "unlocks_quiz_tags": ["ai-can-be-wrong", "ai-limitations"]
}
```

### S1-W05-A｜探索者初體驗

```json
{
  "task_id": "S1-W05-A",
  "name": "探索者初體驗",
  "type": "MC",
  "module": "S1-M1",
  "week": 5,
  "points": 50,
  "checkpoints": [
    {
      "id": "S1-W05-A-C1",
      "description": "截圖：三個不同的自然地形或場景",
      "evidence_type": "screenshot",
      "evaluation_criteria": "三張截圖呈現明顯不同的地形（如森林、洞穴、水邊、山地等），需為不同地點",
      "points": 50
    }
  ],
  "skill_tags": ["minecraft-exploration"],
  "unlocks_quiz_tags": ["minecraft-world-types"]
}
```

### S1-W05-B｜每週探索（RT）

```json
{
  "task_id": "S1-W05-B",
  "name": "每週探索",
  "type": "RT",
  "module": "S1-M1",
  "week": 5,
  "points": 25,
  "checkpoints": [
    {
      "id": "S1-W05-B-C1",
      "description": "截圖：本週在 Minecraft 中發現的有趣事物",
      "evidence_type": "screenshot",
      "evaluation_criteria": "截圖顯示 Minecraft 世界中的任何內容（非介面畫面）",
      "points": 25
    }
  ],
  "skill_tags": [],
  "unlocks_quiz_tags": []
}
```

---

## 模組二：學會跟 AI 說話（W6–W10）

### S1-W06-A｜問法大比拼

```json
{
  "task_id": "S1-W06-A",
  "name": "問法大比拼",
  "type": "LT",
  "module": "S1-M2",
  "week": 6,
  "points": 30,
  "checkpoints": [
    {
      "id": "S1-W06-A-C1",
      "description": "截圖：兩組對話，問同一主題但問法明顯不同",
      "evidence_type": "screenshot",
      "evaluation_criteria": "兩段對話問的是相同主題；一個 Prompt ≤ 10 字，另一個 ≥ 20 字，或一個有角色設定另一個沒有",
      "points": 30
    }
  ],
  "skill_tags": ["prompt-basic", "prompt-comparison"],
  "unlocks_quiz_tags": ["prompt-different-results", "prompt-length-effect"]
}
```

### S1-W07-A｜我的興趣推銷員

```json
{
  "task_id": "S1-W07-A",
  "name": "我的興趣推銷員",
  "type": "LT",
  "module": "S1-M2",
  "week": 7,
  "points": 30,
  "checkpoints": [
    {
      "id": "S1-W07-A-C1",
      "description": "截圖：Lab Terminal 根據學生的興趣生成的介紹文字",
      "evidence_type": "screenshot",
      "evaluation_criteria": "截圖中學生的 Prompt 提到了具體的興趣內容；AI 的回答與該興趣相關",
      "points": 30
    }
  ],
  "skill_tags": ["prompt-interest", "prompt-with-context"],
  "unlocks_quiz_tags": ["prompt-context-matters"]
}
```

### S1-W08-A｜角色扮演任務

```json
{
  "task_id": "S1-W08-A",
  "name": "角色扮演任務",
  "type": "LT",
  "module": "S1-M2",
  "week": 8,
  "points": 35,
  "checkpoints": [
    {
      "id": "S1-W08-A-C1",
      "description": "截圖：AI 扮演指定角色的對話",
      "evidence_type": "screenshot",
      "evaluation_criteria": "截圖中 Prompt 包含「你現在是___」或類似角色設定；AI 的回答反映了該角色的語氣或知識",
      "points": 35
    }
  ],
  "skill_tags": ["prompt-roleplay"],
  "unlocks_quiz_tags": ["prompt-role-setting"]
}
```

### S1-W09-A｜完美 Prompt 挑戰

```json
{
  "task_id": "S1-W09-A",
  "name": "完美 Prompt 挑戰",
  "type": "LT",
  "module": "S1-M2",
  "week": 9,
  "points": 40,
  "checkpoints": [
    {
      "id": "S1-W09-A-C1",
      "description": "截圖：包含角色＋背景＋問題三要素的 Prompt 及 AI 回應",
      "evidence_type": "screenshot",
      "evaluation_criteria": "Prompt 中可識別角色設定（如「你是___」）、背景資訊（如「我是___」）、以及具體問題；三個要素都存在",
      "points": 40
    }
  ],
  "skill_tags": ["prompt-three-elements"],
  "unlocks_quiz_tags": ["prompt-format-mastery", "prompt-role-background-question"]
}
```

### S1-W10-A｜探索者認證

```json
{
  "task_id": "S1-W10-A",
  "name": "探索者認證",
  "type": "MC",
  "module": "S1-M2",
  "week": 10,
  "points": 60,
  "checkpoints": [
    {
      "id": "S1-W10-A-C1",
      "description": "截圖：背包中有 5 種不同類型的材料",
      "evidence_type": "screenshot",
      "evaluation_criteria": "截圖顯示背包介面，其中包含至少 5 種不同材料（如木材、石頭、沙子、煤、鐵礦等）",
      "points": 30
    },
    {
      "id": "S1-W10-A-C2",
      "description": "截圖：合成一個工具（任何工具均可）",
      "evidence_type": "screenshot",
      "evaluation_criteria": "截圖顯示工作台介面或背包中出現一個合成出的工具",
      "points": 30
    }
  ],
  "skill_tags": ["minecraft-crafting", "minecraft-resource-gathering"],
  "unlocks_quiz_tags": ["minecraft-materials", "minecraft-crafting-basic"]
}
```

---

## 模組三：AI 生圖初體驗（W11–W16）

### S1-W11-A｜第一張 AI 圖

```json
{
  "task_id": "S1-W11-A",
  "name": "第一張 AI 圖",
  "type": "EX",
  "module": "S1-M3",
  "week": 11,
  "points": 30,
  "checkpoints": [
    {
      "id": "S1-W11-A-C1",
      "description": "截圖：一張 AI 生成的圖片及使用的描述文字",
      "evidence_type": "screenshot",
      "evaluation_criteria": "截圖中可見一張圖片及對應的描述文字；圖片明顯為 AI 生成",
      "points": 30
    }
  ],
  "skill_tags": ["image-gen-basic"],
  "unlocks_quiz_tags": ["image-gen-what-is", "image-gen-text-to-image"]
}
```

### S1-W12-A｜圖片描述挑戰

```json
{
  "task_id": "S1-W12-A",
  "name": "圖片描述挑戰",
  "type": "EX",
  "module": "S1-M3",
  "week": 12,
  "points": 40,
  "checkpoints": [
    {
      "id": "S1-W12-A-C1",
      "description": "截圖：三張圖片配上各自的描述文字",
      "evidence_type": "screenshot",
      "evaluation_criteria": "三張圖片的描述文字明顯不同（詳細程度、風格描述或主題細節有差異）；三張圖片在畫面呈現上有可見差異",
      "points": 40
    }
  ],
  "skill_tags": ["image-gen-comparison"],
  "unlocks_quiz_tags": ["image-gen-description-matters", "image-gen-detail-effect"]
}
```

### S1-W13-A｜興趣圖片大師

```json
{
  "task_id": "S1-W13-A",
  "name": "興趣圖片大師",
  "type": "EX",
  "module": "S1-M3",
  "week": 13,
  "points": 35,
  "checkpoints": [
    {
      "id": "S1-W13-A-C1",
      "description": "截圖：三張與個人興趣相關的 AI 圖片",
      "evidence_type": "screenshot",
      "evaluation_criteria": "三張圖片的主題與學生提交的興趣清單一致；圖片內容互有差異",
      "points": 35
    }
  ],
  "skill_tags": ["image-gen-interest"],
  "unlocks_quiz_tags": ["image-gen-topic-selection"]
}
```

### S1-W14-A｜Prompt 修改師

```json
{
  "task_id": "S1-W14-A",
  "name": "Prompt 修改師",
  "type": "EX",
  "module": "S1-M3",
  "week": 14,
  "points": 45,
  "checkpoints": [
    {
      "id": "S1-W14-A-C1",
      "description": "截圖：初稿圖片及初稿描述文字",
      "evidence_type": "screenshot",
      "evaluation_criteria": "截圖包含一張 AI 圖及使用的描述",
      "points": 15
    },
    {
      "id": "S1-W14-A-C2",
      "description": "截圖：修改後的圖片及修改後的描述文字",
      "evidence_type": "screenshot",
      "evaluation_criteria": "截圖包含修改後的描述（與初稿有明顯差異）及對應新生成的圖片",
      "points": 15
    },
    {
      "id": "S1-W14-A-C3",
      "description": "文字：說明修改了什麼，以及結果是否有改善",
      "evidence_type": "text",
      "evaluation_criteria": "學生能說明至少一處具體的修改內容",
      "points": 15
    }
  ],
  "skill_tags": ["image-gen-iteration", "prompt-refinement"],
  "unlocks_quiz_tags": ["image-gen-refinement", "prompt-iteration-effect"]
}
```

### S1-W15-A｜Canva 設計作品

```json
{
  "task_id": "S1-W15-A",
  "name": "Canva 設計作品",
  "type": "EX",
  "module": "S1-M3",
  "week": 15,
  "points": 50,
  "checkpoints": [
    {
      "id": "S1-W15-A-C1",
      "description": "截圖：完成的 Canva 設計作品",
      "evidence_type": "screenshot",
      "evaluation_criteria": "作品包含至少一張 AI 生成圖片及至少一段文字；整體排版不是純空白",
      "points": 50
    }
  ],
  "skill_tags": ["image-gen-design", "canva-basic"],
  "unlocks_quiz_tags": ["design-image-text-combo", "canva-layout-basic"]
}
```

### S1-W16-A｜第一棟房子

```json
{
  "task_id": "S1-W16-A",
  "name": "第一棟房子",
  "type": "MC",
  "module": "S1-M3",
  "week": 16,
  "points": 60,
  "checkpoints": [
    {
      "id": "S1-W16-A-C1",
      "description": "截圖：建造完成的房子（外觀）",
      "evidence_type": "screenshot",
      "evaluation_criteria": "截圖中可見一個封閉的建築結構，有牆壁、屋頂、至少一個開口（門或洞）",
      "points": 30
    },
    {
      "id": "S1-W16-A-C2",
      "description": "截圖：房子內部（可站立的空間）",
      "evidence_type": "screenshot",
      "evaluation_criteria": "截圖視角在建築內部，天花板可見，地板面積估計不小於 5×5 格",
      "points": 30
    }
  ],
  "skill_tags": ["minecraft-building-structure"],
  "unlocks_quiz_tags": ["minecraft-building-requirements", "minecraft-shelter-design"]
}
```

---

## 模組四：興趣探索與第一個作品（W17–W22）

### S1-W17-A｜興趣清單任務

```json
{
  "task_id": "S1-W17-A",
  "name": "興趣清單任務",
  "type": "LT",
  "module": "S1-M4",
  "week": 17,
  "points": 30,
  "checkpoints": [
    {
      "id": "S1-W17-A-C1",
      "description": "文字或截圖：五件喜歡的事，每件附上說明",
      "evidence_type": "text",
      "evaluation_criteria": "列出五件不同的事物；每件有至少一句說明「喜歡哪個部分」",
      "points": 30
    }
  ],
  "skill_tags": ["interest-exploration", "interest-list"],
  "unlocks_quiz_tags": ["interest-self-awareness"]
}
```

### S1-W18-A｜興趣 AI 作品

```json
{
  "task_id": "S1-W18-A",
  "name": "興趣 AI 作品",
  "type": "LT",
  "module": "S1-M4",
  "week": 18,
  "points": 50,
  "checkpoints": [
    {
      "id": "S1-W18-A-C1",
      "description": "截圖：Lab Terminal 根據興趣生成的介紹文字",
      "evidence_type": "screenshot",
      "evaluation_criteria": "截圖中可見 AI 生成的文字，內容與學生興趣清單中的某項目相關",
      "points": 25
    },
    {
      "id": "S1-W18-A-C2",
      "description": "截圖：Lab Image 生成的相關圖片",
      "evidence_type": "screenshot",
      "evaluation_criteria": "截圖包含一張 AI 生成圖片，主題與興趣相關",
      "points": 25
    }
  ],
  "skill_tags": ["interest-ai-creation", "prompt-interest"],
  "unlocks_quiz_tags": ["ai-creation-from-interest"]
}
```

### S1-W19-A｜分享挑戰

```json
{
  "task_id": "S1-W19-A",
  "name": "分享挑戰",
  "type": "LT",
  "module": "S1-M4",
  "week": 19,
  "points": 40,
  "checkpoints": [
    {
      "id": "S1-W19-A-C1",
      "description": "截圖：在 Lab Terminal 說明自己的作品",
      "evidence_type": "screenshot",
      "evaluation_criteria": "截圖中學生向 AI 描述自己的作品內容",
      "points": 20
    },
    {
      "id": "S1-W19-A-C2",
      "description": "文字：同學給的一條回饋",
      "evidence_type": "text",
      "evaluation_criteria": "提交至少一句同學的具體回饋（非「很好」等空泛評語）",
      "points": 20
    }
  ],
  "skill_tags": ["sharing-work", "receiving-feedback"],
  "unlocks_quiz_tags": ["feedback-giving", "work-presentation"]
}
```

### S1-W20-A｜AI 幫我寫故事

```json
{
  "task_id": "S1-W20-A",
  "name": "AI 幫我寫故事",
  "type": "LT",
  "module": "S1-M4",
  "week": 20,
  "points": 35,
  "checkpoints": [
    {
      "id": "S1-W20-A-C1",
      "description": "截圖：AI 生成的完整故事",
      "evidence_type": "screenshot",
      "evaluation_criteria": "截圖中可見 AI 生成的故事；故事長度至少 100 字；有開頭、中間、結尾的結構",
      "points": 35
    }
  ],
  "skill_tags": ["ai-creative-writing", "story-structure-basic"],
  "unlocks_quiz_tags": ["ai-story-structure", "story-elements"]
}
```

### S1-W21-A｜故事插圖師

```json
{
  "task_id": "S1-W21-A",
  "name": "故事插圖師",
  "type": "EX",
  "module": "S1-M4",
  "week": 21,
  "points": 40,
  "checkpoints": [
    {
      "id": "S1-W21-A-C1",
      "description": "截圖：三張對應故事不同場景的插圖",
      "evidence_type": "screenshot",
      "evaluation_criteria": "三張 AI 生成圖片，主題互不相同，且能對應故事中的不同場景",
      "points": 40
    }
  ],
  "skill_tags": ["image-gen-story", "image-gen-scene-selection"],
  "unlocks_quiz_tags": ["image-story-connection"]
}
```

### S1-W22-A｜定時任務挑戰週（RT）

```json
{
  "task_id": "S1-W22-A",
  "name": "定時任務挑戰週",
  "type": "RT",
  "module": "S1-M4",
  "week": 22,
  "points": 35,
  "checkpoints": [
    {
      "id": "S1-W22-A-C1",
      "description": "截圖：完成本週 Minecraft 挑戰的任何形式證明",
      "evidence_type": "screenshot",
      "evaluation_criteria": "截圖顯示學生在本週完成了 Minecraft 中的某項挑戰",
      "points": 35
    }
  ],
  "skill_tags": [],
  "unlocks_quiz_tags": []
}
```

---

## 模組五：學期回顧（W23–W24）

### S1-W23-A｜學期作品集

```json
{
  "task_id": "S1-W23-A",
  "name": "學期作品集",
  "type": "EX",
  "module": "S1-M5",
  "week": 23,
  "points": 60,
  "checkpoints": [
    {
      "id": "S1-W23-A-C1",
      "description": "提交：包含至少三個作品的 PDF 作品集",
      "evidence_type": "file",
      "evaluation_criteria": "PDF 中包含至少三個不同的作品；每個作品附有一句說明文字；整體有封面或標題頁",
      "points": 60
    }
  ],
  "skill_tags": ["portfolio-basic", "work-reflection"],
  "unlocks_quiz_tags": ["portfolio-organization", "learning-reflection"]
}
```

### S1-W24-MS｜小三上里程碑｜AI 探索者

```json
{
  "task_id": "S1-W24-MS",
  "name": "小三上里程碑｜AI 探索者",
  "type": "MS",
  "module": "S1-M5",
  "week": 24,
  "points": 200,
  "checkpoints": [
    {
      "id": "S1-W24-MS-C1",
      "description": "系統確認：本學期所有 EX + MC 主線任務均已完成",
      "evidence_type": "system",
      "evaluation_criteria": "student.completed_tasks 包含所有 S1 非 RT 任務的 task_id",
      "points": 200
    }
  ],
  "skill_tags": [],
  "unlocks_quiz_tags": ["s1-mastery-review"]
}
```

---

> 最後修改：2026-04-23，原因：初始建立，填入 S1 全部 24 週任務定義
