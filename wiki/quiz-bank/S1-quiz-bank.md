# S1 Quiz 題庫｜小三上學期

> 本題庫供 Popup Quiz 系統使用。每道題標注解鎖條件（prerequisite_tasks），
> 系統只在學生完成對應任務後才派發該題目。
> 所有題目以繁體中文撰寫，語氣適合小學三年級學生。

---

## Minecraft 基礎操作｜minecraft-basic-ops
**解鎖條件**：完成 S1-W01-A

```json
[
  {
    "question_id": "Q-S1-001",
    "question": "在 Minecraft 裡，要挖掉一個方塊，應該怎麼做？",
    "options": ["對著方塊按住滑鼠左鍵", "對著方塊按一下右鍵", "按 E 鍵再點方塊", "按空白鍵跳上去"],
    "correct_answer": 0,
    "explanation": "對著方塊按住滑鼠左鍵，等進度條跑完，方塊就會被挖下來。",
    "prerequisite_tasks": ["S1-W01-A"],
    "skill_tags": ["minecraft-basic-ops"],
    "difficulty": 1
  },
  {
    "question_id": "Q-S1-002",
    "question": "在 Minecraft 裡，要把手上的方塊放到地上，應該怎麼做？",
    "options": ["對著要放的地方按右鍵", "對著地面按左鍵", "按 Q 鍵丟出去", "按 E 鍵打開背包再放"],
    "correct_answer": 0,
    "explanation": "選好要放的方塊後，對著想要放置的位置按右鍵，方塊就會被放上去。",
    "prerequisite_tasks": ["S1-W01-A"],
    "skill_tags": ["minecraft-basic-ops"],
    "difficulty": 1
  },
  {
    "question_id": "Q-S1-003",
    "question": "在 Minecraft 裡，要打開背包應該按哪個鍵？",
    "options": ["E", "I", "B", "P"],
    "correct_answer": 0,
    "explanation": "按 E 鍵可以開啟或關閉背包（物品欄）。",
    "prerequisite_tasks": ["S1-W01-A"],
    "skill_tags": ["minecraft-controls"],
    "difficulty": 1
  },
  {
    "question_id": "Q-S1-004",
    "question": "在 Minecraft 裡，要讓角色跳起來應該按哪個鍵？",
    "options": ["空白鍵", "↑ 方向鍵", "W 鍵", "Shift 鍵"],
    "correct_answer": 0,
    "explanation": "按空白鍵可以讓角色跳躍。",
    "prerequisite_tasks": ["S1-W01-A"],
    "skill_tags": ["minecraft-controls"],
    "difficulty": 1
  }
]
```

---

## Minecraft 建造基礎｜minecraft-building-basic
**解鎖條件**：完成 S1-W01-B

```json
[
  {
    "question_id": "Q-S1-005",
    "question": "在 Minecraft 裡，你可以用來蓋房子的材料是？",
    "options": ["任何方塊都可以，例如木頭、石頭、泥土", "只能用木頭", "只能用石頭", "必須用特殊的建築磚塊"],
    "correct_answer": 0,
    "explanation": "在 Minecraft 裡，你可以用任何方塊來建造，包括泥土、木頭、石頭等。",
    "prerequisite_tasks": ["S1-W01-B"],
    "skill_tags": ["minecraft-building-basic"],
    "difficulty": 1
  },
  {
    "question_id": "Q-S1-006",
    "question": "小明想在 Minecraft 裡蓋一座塔，他應該怎麼做？",
    "options": ["先在地上放一個方塊，站上去，再繼續往上放方塊", "用特殊指令生成塔", "塔必須由老師蓋好才能使用", "需要用到合成台"],
    "correct_answer": 0,
    "explanation": "在 Minecraft 裡，往高處蓋東西的方法就是先站在已放好的方塊上，再繼續往上放。",
    "prerequisite_tasks": ["S1-W01-B"],
    "skill_tags": ["minecraft-building-basic"],
    "difficulty": 1
  }
]
```

---

## AI 是什麼｜what-is-ai-basic
**解鎖條件**：完成 S1-W02-A

```json
[
  {
    "question_id": "Q-S1-007",
    "question": "下面哪一個說法，最能描述 AI（人工智慧）是什麼？",
    "options": [
      "一種可以學習和思考的電腦程式",
      "一種非常快速的計算機",
      "一種可以連接網路的機器",
      "一種只能做固定工作的機器人"
    ],
    "correct_answer": 0,
    "explanation": "AI 是一種能夠從資料中學習、並根據情況做出判斷的電腦程式，這和普通程式「只按指令做事」不一樣。",
    "prerequisite_tasks": ["S1-W02-A"],
    "skill_tags": ["what-is-ai-basic"],
    "difficulty": 1
  },
  {
    "question_id": "Q-S1-008",
    "question": "普通電腦程式和 AI 最大的差別是什麼？",
    "options": [
      "普通程式只做被寫好的事；AI 可以從經驗學習，應對沒遇過的情況",
      "普通程式比 AI 快",
      "AI 一定比普通程式聰明",
      "普通程式需要網路，AI 不需要"
    ],
    "correct_answer": 0,
    "explanation": "普通程式就像食譜——只能按照步驟做；AI 比較像廚師——可以根據當下的情況做出判斷，即使食材不一樣。",
    "prerequisite_tasks": ["S1-W02-A"],
    "skill_tags": ["ai-vs-computer"],
    "difficulty": 1
  },
  {
    "question_id": "Q-S1-009",
    "question": "你問 AI「今天天氣怎樣？」，AI 能正確回答的原因是？",
    "options": [
      "AI 被訓練過大量的資料，知道怎麼回答這類問題",
      "AI 能直接感應到外面的天氣",
      "AI 有連接氣象站",
      "AI 猜的"
    ],
    "correct_answer": 0,
    "explanation": "AI 是根據它學習過的大量文字和資料來回答問題的，不是真的「知道」或「感覺到」。",
    "prerequisite_tasks": ["S1-W02-A"],
    "skill_tags": ["what-is-ai-basic"],
    "difficulty": 2
  }
]
```

---

## 生活中的 AI｜ai-examples-life
**解鎖條件**：完成 S1-W03-A

```json
[
  {
    "question_id": "Q-S1-010",
    "question": "下面哪一個是生活中使用 AI 的例子？",
    "options": [
      "手機上的語音助理（如 Siri）聽懂你說的話並回答",
      "電視遙控器調整音量",
      "鬧鐘在設定的時間響",
      "電燈開關控制燈的開關"
    ],
    "correct_answer": 0,
    "explanation": "語音助理需要「聽懂」人說的話並做出回應，這需要 AI 技術。其他選項都是固定的機械動作，不需要學習。",
    "prerequisite_tasks": ["S1-W03-A"],
    "skill_tags": ["ai-examples-life"],
    "difficulty": 1
  },
  {
    "question_id": "Q-S1-011",
    "question": "你在 YouTube 上看完一部影片，系統自動推薦了下一部你可能喜歡的影片。這是 AI 做的事嗎？",
    "options": [
      "是的，AI 分析了你的觀看習慣來推薦影片",
      "不是，那是隨機推薦的",
      "不是，那是有人幫你選的",
      "是的，但只有 YouTube 的員工手動操作"
    ],
    "correct_answer": 0,
    "explanation": "影片推薦系統會分析你看了什麼、看了多久，然後用 AI 推薦你可能喜歡的內容。",
    "prerequisite_tasks": ["S1-W03-A"],
    "skill_tags": ["ai-examples-life"],
    "difficulty": 1
  },
  {
    "question_id": "Q-S1-012",
    "question": "下面哪個情境用到了 AI？",
    "options": [
      "拍照時手機自動幫你的臉對焦",
      "電梯按下樓層後自動移動",
      "電風扇按了開關就轉動",
      "書包的拉鍊拉上就關起來"
    ],
    "correct_answer": 0,
    "explanation": "手機的人臉對焦需要辨識「哪裡是臉」，這用到了 AI 的影像辨識技術。",
    "prerequisite_tasks": ["S1-W03-A"],
    "skill_tags": ["ai-examples-life"],
    "difficulty": 2
  }
]
```

---

## AI 會犯錯｜ai-can-be-wrong
**解鎖條件**：完成 S1-W04-A

```json
[
  {
    "question_id": "Q-S1-013",
    "question": "你問 AI 一道數學題，它給了錯誤的答案。最可能的原因是？",
    "options": [
      "AI 是從資料中學習的，有時候學到了錯誤的模式",
      "AI 故意給錯誤的答案",
      "AI 沒有網路連線",
      "AI 不喜歡數學"
    ],
    "correct_answer": 0,
    "explanation": "AI 是從大量資料中學習的，如果訓練資料中有錯誤，或遇到它沒學過的情況，就可能給出錯誤答案。",
    "prerequisite_tasks": ["S1-W04-A"],
    "skill_tags": ["ai-can-be-wrong"],
    "difficulty": 1
  },
  {
    "question_id": "Q-S1-014",
    "question": "使用 AI 給的答案時，最好的態度是？",
    "options": [
      "把 AI 的答案當作參考，自己再想一想是否合理",
      "AI 說什麼就是什麼，完全相信",
      "AI 一定是錯的，不要相信它",
      "只有老師說的才對"
    ],
    "correct_answer": 0,
    "explanation": "AI 很有用，但也會犯錯。把它的答案當作參考，用自己的判斷來確認，才是最聰明的用法。",
    "prerequisite_tasks": ["S1-W04-A"],
    "skill_tags": ["ai-limitations"],
    "difficulty": 1
  },
  {
    "question_id": "Q-S1-015",
    "question": "你讓 AI 幫你查「台灣最高的山是什麼」，AI 回答「富士山」。這說明了什麼？",
    "options": [
      "AI 有時候會混淆不同地方的資訊，不一定正確",
      "富士山確實是台灣最高的山",
      "AI 比你聰明，你記錯了",
      "這個問題太難了，AI 放棄了"
    ],
    "correct_answer": 0,
    "explanation": "AI 可能會混淆不同地方的知識。台灣最高的山是玉山，不是富士山（那是日本的）。遇到這種情況，要查其他資料確認。",
    "prerequisite_tasks": ["S1-W04-A"],
    "skill_tags": ["ai-can-be-wrong", "ai-limitations"],
    "difficulty": 2
  }
]
```

---

## Minecraft 世界探索｜minecraft-world-types
**解鎖條件**：完成 S1-W05-A

```json
[
  {
    "question_id": "Q-S1-016",
    "question": "在 Minecraft 裡，你在森林裡會找到什麼？",
    "options": ["樹木和動物", "沙子和仙人掌", "冰和雪", "熔岩和火"],
    "correct_answer": 0,
    "explanation": "森林生態系統（Biome）裡主要有樹木和各種動物，例如豬、雞、牛。",
    "prerequisite_tasks": ["S1-W05-A"],
    "skill_tags": ["minecraft-world-types"],
    "difficulty": 1
  },
  {
    "question_id": "Q-S1-017",
    "question": "在 Minecraft 裡，你想找到鐵礦，應該去哪裡找？",
    "options": ["在地下挖掘", "在海底", "在山頂", "在村莊裡"],
    "correct_answer": 0,
    "explanation": "大多數礦石，包括鐵礦，都藏在地表以下的石頭層裡，需要往下挖才能找到。",
    "prerequisite_tasks": ["S1-W05-A"],
    "skill_tags": ["minecraft-world-types"],
    "difficulty": 1
  }
]
```

---

## Prompt 比較效果｜prompt-different-results
**解鎖條件**：完成 S1-W06-A

```json
[
  {
    "question_id": "Q-S1-018",
    "question": "下面哪一種問法，比較容易讓 AI 給出有用的回答？",
    "options": [
      "「你是一位國小老師，我是三年級學生，請用三句話解釋光合作用。」",
      "「什麼是光合作用？」",
      "「光合作用光合作用光合作用」",
      "「我不懂"
    ],
    "correct_answer": 0,
    "explanation": "告訴 AI 你是誰、它是誰，以及你需要什麼格式，AI 就能給出更符合你需求的回答。",
    "prerequisite_tasks": ["S1-W06-A"],
    "skill_tags": ["prompt-different-results"],
    "difficulty": 1
  },
  {
    "question_id": "Q-S1-019",
    "question": "用兩種不同的方式問 AI 同一個問題，結果會怎樣？",
    "options": [
      "結果可能不同，問法越詳細通常答案越有用",
      "結果完全一樣，因為問題一樣",
      "問越短越好，AI 比較不會搞混",
      "AI 不在乎問法，只看關鍵字"
    ],
    "correct_answer": 0,
    "explanation": "問法不同，AI 得到的資訊量不同，給出的答案品質也會不同。詳細的問法通常能得到更準確的答案。",
    "prerequisite_tasks": ["S1-W06-A"],
    "skill_tags": ["prompt-length-effect"],
    "difficulty": 1
  },
  {
    "question_id": "Q-S1-020",
    "question": "「請幫我寫一首詩」和「請幫我寫一首關於春天的四行詩，語氣輕鬆活潑」，哪個問法更好？",
    "options": [
      "第二個，因為給了更多具體的要求",
      "第一個，因為比較短，AI 比較好理解",
      "兩個一樣好",
      "都不好，AI 不會寫詩"
    ],
    "correct_answer": 0,
    "explanation": "越具體的要求，AI 越能給出符合你期望的結果。「主題、長度、語氣」都說清楚，會比只說「寫一首詩」好得多。",
    "prerequisite_tasks": ["S1-W06-A"],
    "skill_tags": ["prompt-length-effect", "prompt-different-results"],
    "difficulty": 2
  }
]
```

---

## Prompt 三要素｜prompt-role-background-question
**解鎖條件**：完成 S1-W09-A

```json
[
  {
    "question_id": "Q-S1-021",
    "question": "一個好的 Prompt 包含哪三個要素？",
    "options": [
      "角色、背景、問題",
      "長度、格式、語氣",
      "主詞、動詞、受詞",
      "開頭、中間、結尾"
    ],
    "correct_answer": 0,
    "explanation": "好的 Prompt 格式：「你是___（角色）」+「我是___或情境是___（背景）」+「請幫我___（問題）」。",
    "prerequisite_tasks": ["S1-W09-A"],
    "skill_tags": ["prompt-role-background-question"],
    "difficulty": 1
  },
  {
    "question_id": "Q-S1-022",
    "question": "「你是一位廚師，我想在家做晚餐，請推薦三道簡單的菜」，這個 Prompt 裡的「背景」是什麼？",
    "options": [
      "「我想在家做晚餐」",
      "「你是一位廚師」",
      "「請推薦三道簡單的菜」",
      "「廚師」"
    ],
    "correct_answer": 0,
    "explanation": "「角色」是「廚師」，「背景」是「我想在家做晚餐」（情境說明），「問題」是「推薦三道簡單的菜」。",
    "prerequisite_tasks": ["S1-W09-A"],
    "skill_tags": ["prompt-role-background-question"],
    "difficulty": 2
  },
  {
    "question_id": "Q-S1-023",
    "question": "為什麼在 Prompt 裡說「你是一位___」很重要？",
    "options": [
      "讓 AI 用那個角色的專業和語氣來回答",
      "這樣 AI 才會理解你在說話",
      "AI 需要知道你叫什麼名字",
      "這只是一種禮貌，沒有實際效果"
    ],
    "correct_answer": 0,
    "explanation": "設定角色會影響 AI 的回答風格和專業度。「你是醫生」和「你是幼稚園老師」說明同一件事，會給出完全不同的回答。",
    "prerequisite_tasks": ["S1-W09-A"],
    "skill_tags": ["prompt-format-mastery"],
    "difficulty": 2
  }
]
```

---

## AI 圖片生成基礎｜image-gen-what-is
**解鎖條件**：完成 S1-W11-A

```json
[
  {
    "question_id": "Q-S1-024",
    "question": "AI 圖片生成工具（如 Lab Image）是怎麼產生圖片的？",
    "options": [
      "你輸入文字描述，AI 根據描述生成對應的圖片",
      "AI 從網路上找一張最相似的圖片給你",
      "有設計師在後台幫你畫",
      "你必須先上傳一張圖，AI 才能生成"
    ],
    "correct_answer": 0,
    "explanation": "AI 圖片生成是「文字轉圖片」——你用文字描述想要的畫面，AI 就根據這段描述生成一張全新的圖片。",
    "prerequisite_tasks": ["S1-W11-A"],
    "skill_tags": ["image-gen-what-is", "image-gen-text-to-image"],
    "difficulty": 1
  },
  {
    "question_id": "Q-S1-025",
    "question": "你想用 AI 生成「一隻藍色的貓咪坐在窗邊」的圖片，你應該輸入什麼？",
    "options": [
      "「一隻藍色的貓咪坐在窗邊」",
      "上傳一張普通貓咪的照片",
      "「貓」",
      "先選一個顏色，再選動物"
    ],
    "correct_answer": 0,
    "explanation": "AI 圖片生成工具需要你用文字說明想要的畫面。描述得越詳細，生成的圖片越接近你的想像。",
    "prerequisite_tasks": ["S1-W11-A"],
    "skill_tags": ["image-gen-text-to-image"],
    "difficulty": 1
  }
]
```

---

## 圖片描述的重要性｜image-gen-description-matters
**解鎖條件**：完成 S1-W12-A

```json
[
  {
    "question_id": "Q-S1-026",
    "question": "用「一隻貓」和「一隻橘色胖貓坐在陽光下的窗邊，水彩畫風格」生成的圖片會有什麼不同？",
    "options": [
      "第二個描述更詳細，生成的圖片會更接近你想要的樣子",
      "兩個描述會生成一模一樣的圖片",
      "越短的描述生成的圖片越好",
      "AI 不在乎描述，每次都生成隨機圖片"
    ],
    "correct_answer": 0,
    "explanation": "描述越詳細，AI 越知道你想要什麼。顏色、動作、場景、畫風都可以加進描述，讓圖片更符合你的期望。",
    "prerequisite_tasks": ["S1-W12-A"],
    "skill_tags": ["image-gen-description-matters"],
    "difficulty": 1
  },
  {
    "question_id": "Q-S1-027",
    "question": "你想要一張「像電影海報一樣的太空探險圖片」，以下哪個描述最好？",
    "options": [
      "「一位太空人站在月球表面，背景是地球和星空，電影海報風格，戲劇性光影」",
      "「太空」",
      "「太空人」",
      "「太空探險圖片」"
    ],
    "correct_answer": 0,
    "explanation": "加入場景細節（月球表面、地球）、風格說明（電影海報）、光影描述，能讓 AI 更精準地生成你想要的圖片。",
    "prerequisite_tasks": ["S1-W12-A"],
    "skill_tags": ["image-gen-detail-effect"],
    "difficulty": 2
  }
]
```

---

## 圖片修改與迭代｜image-gen-refinement
**解鎖條件**：完成 S1-W14-A

```json
[
  {
    "question_id": "Q-S1-028",
    "question": "你用 AI 生成了一張圖，覺得顏色太暗。你應該怎麼做？",
    "options": [
      "修改描述文字，加上「明亮的色彩」或「高對比度」等說明，重新生成",
      "接受這張圖，AI 做的就是最好的",
      "換一個 AI 工具",
      "用修圖軟體自己調整"
    ],
    "correct_answer": 0,
    "explanation": "修改描述文字是讓 AI 圖片更符合你期望的最直接方法。加上你想要的特徵的描述，重新生成即可。",
    "prerequisite_tasks": ["S1-W14-A"],
    "skill_tags": ["image-gen-refinement"],
    "difficulty": 1
  },
  {
    "question_id": "Q-S1-029",
    "question": "「修改 Prompt 再重新生成圖片」這個做法叫什麼？",
    "options": [
      "迭代（反覆修改改進）",
      "複製貼上",
      "格式轉換",
      "存檔"
    ],
    "correct_answer": 0,
    "explanation": "迭代是「反覆修改、改進」的意思。先做出第一版，找出不滿意的地方，修改後再做，這樣反覆進行，作品會越來越好。",
    "prerequisite_tasks": ["S1-W14-A"],
    "skill_tags": ["prompt-iteration-effect"],
    "difficulty": 2
  }
]
```

---

## Minecraft 建造結構｜minecraft-building-requirements
**解鎖條件**：完成 S1-W16-A

```json
[
  {
    "question_id": "Q-S1-030",
    "question": "在 Minecraft 裡蓋一個可以住的房子，最基本需要哪些東西？",
    "options": [
      "牆壁、屋頂、門（或入口）",
      "只需要牆壁",
      "必須有窗戶才算房子",
      "需要床和燈才算完整的房子"
    ],
    "correct_answer": 0,
    "explanation": "一個基本的房子需要牆壁圍住空間、屋頂防止怪物從上方進入、以及一個可以進出的開口。",
    "prerequisite_tasks": ["S1-W16-A"],
    "skill_tags": ["minecraft-building-requirements"],
    "difficulty": 1
  },
  {
    "question_id": "Q-S1-031",
    "question": "為什麼在 Minecraft 生存模式裡，第一天需要蓋一個房子或找一個躲避的地方？",
    "options": [
      "晚上會有殭屍、骷髏等怪物出現，房子可以保護你",
      "規則規定每個玩家必須有一個家",
      "沒有房子就無法存檔",
      "太陽下山後你的角色會自動死亡"
    ],
    "correct_answer": 0,
    "explanation": "在 Minecraft 生存模式裡，晚上敵對怪物會出現。有牆和屋頂的建築可以阻擋怪物，保護你的安全。",
    "prerequisite_tasks": ["S1-W16-A"],
    "skill_tags": ["minecraft-shelter-design"],
    "difficulty": 1
  }
]
```

---

## 個人興趣探索｜interest-self-awareness
**解鎖條件**：完成 S1-W17-A

```json
[
  {
    "question_id": "Q-S1-032",
    "question": "為什麼在這堂課裡，老師要你列出自己的興趣清單？",
    "options": [
      "你的興趣會成為之後所有作品的主題，從小三一直用到小六",
      "只是為了讓老師了解你",
      "興趣清單可以換取更多點數",
      "這只是第一週的活動，之後就沒用了"
    ],
    "correct_answer": 0,
    "explanation": "你的興趣清單是這四年課程的主軸。你會用 AI 工具把你的興趣變成作品，最終嘗試從中獲利。",
    "prerequisite_tasks": ["S1-W17-A"],
    "skill_tags": ["interest-self-awareness"],
    "difficulty": 1
  },
  {
    "question_id": "Q-S1-033",
    "question": "當你告訴 AI 你的興趣，並請它幫你寫一段介紹，最重要的是什麼？",
    "options": [
      "給 AI 越多關於你興趣的資訊，它的介紹就越好",
      "興趣的名字夠有趣",
      "用英文說",
      "問法越短越好"
    ],
    "correct_answer": 0,
    "explanation": "AI 只知道你告訴它的事。說明你興趣的哪個部分最讓你著迷、你有什麼特別的故事，AI 才能寫出有個人特色的介紹。",
    "prerequisite_tasks": ["S1-W17-A"],
    "skill_tags": ["interest-self-awareness", "prompt-context-matters"],
    "difficulty": 2
  }
]
```

---

## AI 輔助創作｜ai-story-structure
**解鎖條件**：完成 S1-W20-A

```json
[
  {
    "question_id": "Q-S1-034",
    "question": "一個完整的故事通常有哪三個部分？",
    "options": [
      "開頭（介紹角色/場景）、中間（發生什麼事）、結尾（怎麼結束）",
      "問題、答案、總結",
      "角色、地點、時間",
      "起因、高潮、主角"
    ],
    "correct_answer": 0,
    "explanation": "一個完整的故事有開頭（讓讀者認識角色和場景）、中間（主要的事件和衝突）、結尾（問題被解決或故事收場）。",
    "prerequisite_tasks": ["S1-W20-A"],
    "skill_tags": ["story-elements"],
    "difficulty": 1
  },
  {
    "question_id": "Q-S1-035",
    "question": "你讓 AI 幫你寫一個關於恐龍的故事，但 AI 寫的開頭你不喜歡。你可以怎麼做？",
    "options": [
      "修改你的 Prompt，告訴 AI 你想要什麼樣的開頭，再重新生成",
      "整個故事都要重寫",
      "換一個題目",
      "只能接受 AI 的版本"
    ],
    "correct_answer": 0,
    "explanation": "你可以在 Prompt 裡說明「開頭要從一個驚險的場景開始」或「用第一人稱敘述」等要求，引導 AI 生成你想要的版本。",
    "prerequisite_tasks": ["S1-W20-A"],
    "skill_tags": ["ai-story-structure"],
    "difficulty": 2
  }
]
```

---

## 作品回顧｜learning-reflection
**解鎖條件**：完成 S1-W23-A

```json
[
  {
    "question_id": "Q-S1-036",
    "question": "把這學期的作品整理成作品集有什麼好處？",
    "options": [
      "可以看見自己這學期的成長，也方便以後分享給別人看",
      "只是老師要求的，沒有其他用處",
      "作品集可以換取更多點數",
      "作品集是寫給 AI 看的"
    ],
    "correct_answer": 0,
    "explanation": "作品集讓你可以回顧這學期做了什麼，看見自己的進步。以後你可以拿它來展示你的能力，或者繼續在這些作品上發展。",
    "prerequisite_tasks": ["S1-W23-A"],
    "skill_tags": ["learning-reflection"],
    "difficulty": 1
  },
  {
    "question_id": "Q-S1-037",
    "question": "在作品集裡，除了放作品本身，還應該加上什麼？",
    "options": [
      "對每個作品的說明：這是什麼、你學到了什麼",
      "只放最漂亮的作品，不需要說明",
      "每個作品都要寫至少一頁的報告",
      "只需要放截圖，不需要文字"
    ],
    "correct_answer": 0,
    "explanation": "說明文字讓看的人（包括未來的自己）知道這個作品的背景和你學到的事。簡短但有意義的說明比空洞的展示更有價值。",
    "prerequisite_tasks": ["S1-W23-A"],
    "skill_tags": ["portfolio-organization"],
    "difficulty": 1
  }
]
```

---

## 學期總複習｜s1-mastery-review
**解鎖條件**：完成 S1-W24-MS（里程碑）

```json
[
  {
    "question_id": "Q-S1-038",
    "question": "這學期你學了哪些跟 AI 有關的技能？（選出最完整的答案）",
    "options": [
      "認識 AI 是什麼、學會問 AI（Prompt）、用 AI 生圖、用 AI 輔助創作",
      "只學了怎麼問 AI",
      "只學了 Minecraft",
      "只學了畫圖"
    ],
    "correct_answer": 0,
    "explanation": "這學期你學了 AI 的基本概念、如何寫好的 Prompt、用 AI 生成圖片，以及用 AI 幫助創作故事和作品。",
    "prerequisite_tasks": ["S1-W24-MS"],
    "skill_tags": ["s1-mastery-review"],
    "difficulty": 1
  },
  {
    "question_id": "Q-S1-039",
    "question": "「角色＋背景＋問題」是一個好的 Prompt 的格式。下面哪個 Prompt 用到了這三個要素？",
    "options": [
      "「你是一位歷史老師，我是五年級學生，請用故事方式介紹鄭成功」",
      "「介紹鄭成功」",
      "「你是老師」",
      "「我是五年級學生，鄭成功是誰？」"
    ],
    "correct_answer": 0,
    "explanation": "角色（歷史老師）+ 背景（我是五年級學生）+ 問題（請用故事方式介紹鄭成功）——三個要素都有。",
    "prerequisite_tasks": ["S1-W24-MS"],
    "skill_tags": ["prompt-role-background-question", "s1-mastery-review"],
    "difficulty": 2
  },
  {
    "question_id": "Q-S1-040",
    "question": "你生成了一張 AI 圖片，覺得不夠好，你應該？",
    "options": [
      "修改描述文字，加入更多細節，再重新生成",
      "放棄，AI 就只能做到這樣",
      "換一個完全不同的主題",
      "直接用修圖軟體改"
    ],
    "correct_answer": 0,
    "explanation": "修改 Prompt（描述文字）是改善 AI 圖片最有效的方法。這就是「迭代」——反覆修改改進，是這學期學到的重要習慣。",
    "prerequisite_tasks": ["S1-W24-MS"],
    "skill_tags": ["image-gen-refinement", "s1-mastery-review"],
    "difficulty": 2
  }
]
```

---

## 統計

| 項目 | 數量 |
|------|------|
| Skill Tags 覆蓋數 | 20 個 |
| 題目總數 | 40 題 |
| 難度 1（基礎） | 28 題 |
| 難度 2（進階） | 12 題 |
| 覆蓋模組 | M1–M5（全學期） |

---

> 最後修改：2026-04-23，原因：初始建立 S1 完整 Quiz 題庫，40 題涵蓋全學期 20 個 Skill Tags
