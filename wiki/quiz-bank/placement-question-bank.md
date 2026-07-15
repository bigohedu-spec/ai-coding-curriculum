# 分班題庫｜Stage 2 Placement Question Bank

> 本題庫專供**新生分班考（Stage 2）**使用，與 quiz bank 不同。
>
> **設計原則**：所有題目不預設學生做過任何課程任務，
> 靠直覺、生活經驗、邏輯推理就能作答。
> 測的是「這個學生天然具備的理解力」，而非課程記憶。
>
> **使用方式**：從 S1 輪次開始，8 題答對 6 題才繼續下一輪。
> 停在哪一輪，新生就從那個學期開始上課。

---

## 輪次一｜S1 程度（AI 基礎認知）

> 測試：對 AI 的基本感知、好奇心、邏輯思考

```json
[
  {
    "placement_id": "P-S1-01",
    "target_semester": "S1",
    "question": "你跟手機說「明天早上七點叫我起床」，手機真的在七點叫你了。這個功能有用到 AI 嗎？",
    "options": [
      "有，因為手機需要「聽懂」你說的話",
      "沒有，因為這只是設鬧鐘",
      "沒有，鬧鐘不需要思考",
      "有，因為任何跟手機有關的都是 AI"
    ],
    "correct_answer": 0,
    "explanation": "語音辨識（讓手機聽懂你說的話）需要 AI 技術。如果你是用手動設定鬧鐘，那就不需要 AI；但語音控制需要。"
  },
  {
    "placement_id": "P-S1-02",
    "target_semester": "S1",
    "question": "你問一個 AI「台灣的首都是哪裡？」，它回答「台北」。你問「日本的首都是哪裡？」，它回答「東京」。這說明 AI 在做什麼？",
    "options": [
      "根據問題從它學過的知識中找出答案",
      "連線到網路查詢最新資料",
      "隨機猜測一個聽起來合理的答案",
      "把你的問題轉給真人回答"
    ],
    "correct_answer": 0,
    "explanation": "AI 是從大量文字資料中學習的，它能回答問題是因為訓練時看過這些知識，而不是即時查詢或隨機猜測。"
  },
  {
    "placement_id": "P-S1-03",
    "target_semester": "S1",
    "question": "你第一次用 AI 問問題，以下哪種問法最可能得到有用的回答？",
    "options": [
      "「你是一位廚師，我想學做蛋炒飯，請告訴我步驟」",
      "「蛋炒飯」",
      "「我很餓」",
      "「廚師食物飯炒蛋步驟做法學習」"
    ],
    "correct_answer": 0,
    "explanation": "說清楚「AI 是什麼角色」和「你要什麼」，AI 才能給出針對性的回答。只給關鍵字或模糊描述，回答通常比較沒有用。"
  },
  {
    "placement_id": "P-S1-04",
    "target_semester": "S1",
    "question": "AI 說「地球是太陽系第三顆行星」，但也說「冥王星是太陽系第九大行星」。冥王星其實已在 2006 年被降級為矮行星。這說明了什麼？",
    "options": [
      "AI 可能學到了過時或錯誤的資訊，不能百分之百相信",
      "AI 故意說錯來測試你",
      "這是因為 AI 不喜歡天文學",
      "AI 一定是對的，可能是科學家搞錯了"
    ],
    "correct_answer": 0,
    "explanation": "AI 的知識來自它訓練時的資料，如果資料是舊的或有誤，AI 也會說錯。遇到重要資訊應該查詢可靠來源確認。"
  },
  {
    "placement_id": "P-S1-05",
    "target_semester": "S1",
    "question": "在 Minecraft 裡，你想在天黑之前保護自己不被怪物攻擊，最快的方法是什麼？",
    "options": [
      "挖一個洞或用方塊蓋一個小房間把自己圍起來",
      "拿著武器站在原地不動",
      "跑得夠快讓怪物追不到",
      "等天亮，怪物會自己消失"
    ],
    "correct_answer": 0,
    "explanation": "在 Minecraft 生存模式，最快的庇護方式是用方塊把自己圍起來，阻止怪物靠近。這是 Vanilla Minecraft 的基本生存策略。"
  },
  {
    "placement_id": "P-S1-06",
    "target_semester": "S1",
    "question": "你讓 AI 幫你寫一首詩，它寫了一首你覺得不夠好的詩。你最應該怎麼做？",
    "options": [
      "修改你給 AI 的說明，例如加上「請寫得更活潑一點」，再試一次",
      "放棄，AI 寫詩就只有這個水準",
      "換一個完全不同的題目",
      "把 AI 寫的詩直接抄下來，不做任何修改"
    ],
    "correct_answer": 0,
    "explanation": "AI 的輸出品質很大程度取決於你的說明。修改說明、加入更多細節，通常能得到更好的結果。"
  },
  {
    "placement_id": "P-S1-07",
    "target_semester": "S1",
    "question": "下面哪個工具是使用了 AI 技術的？",
    "options": [
      "幫你自動翻譯文章的翻譯 App",
      "電燈的開關",
      "機械鐘的時針",
      "一般的計算機（加減乘除）"
    ],
    "correct_answer": 0,
    "explanation": "自動翻譯需要 AI 理解語言的意義和語境，才能產生自然的翻譯。其他選項都是固定機械動作，不需要學習或理解。"
  },
  {
    "placement_id": "P-S1-08",
    "target_semester": "S1",
    "question": "如果你想用 AI 生成一張圖，下面哪個描述會讓圖片最符合你的想像？",
    "options": [
      "「一隻橘色的小貓坐在秋天的楓葉堆裡，陽光斜射，溫暖的氛圍」",
      "「貓」",
      "「可愛的東西」",
      "「圖片要很好看」"
    ],
    "correct_answer": 0,
    "explanation": "越具體的描述，AI 越知道你要什麼。顏色、場景、光線、氛圍——細節越多，生成的圖片越接近你的想像。"
  }
]
```

---

## 輪次二｜S2 程度（AI 工具進階運用）

> 測試：能否比較不同 AI 工具的特性、控制輸出格式、理解生圖的細節技巧

```json
[
  {
    "placement_id": "P-S2-01",
    "target_semester": "S2",
    "question": "你讓 AI 解釋「黑洞是什麼」，但你希望它用條列式而不是一大段文字來回答。你應該怎麼做？",
    "options": [
      "在問題裡加上「請用條列式回答」",
      "問完之後再問一次同樣的問題",
      "AI 會自動選擇最好的格式，你無法控制",
      "換一個問題問它"
    ],
    "correct_answer": 0,
    "explanation": "你可以在 Prompt 裡直接指定輸出格式，例如「請用條列式」、「請用表格」、「請用一段話」，AI 通常都會照做。"
  },
  {
    "placement_id": "P-S2-02",
    "target_semester": "S2",
    "question": "你用 ChatGPT 和另一個 AI 問同一個問題，兩個回答不一樣。這代表什麼？",
    "options": [
      "不同 AI 有不同的訓練資料和方式，回答風格和正確率可能不同",
      "一定有一個 AI 是壞的，故意說謊",
      "兩個都錯了，AI 不可信任",
      "應該選字數比較多的那個，因為比較詳細"
    ],
    "correct_answer": 0,
    "explanation": "不同 AI 工具由不同公司開發，訓練方式和資料來源不同，所以回答會有差異。比較不同 AI 的回答是一種驗證資訊的好方法。"
  },
  {
    "placement_id": "P-S2-03",
    "target_semester": "S2",
    "question": "你想讓 AI 教你一個很難的數學概念，讓你真的聽得懂。哪個 Prompt 最好？",
    "options": [
      "「你是一位擅長教小孩的老師，我是國小五年級學生，請用有趣的例子解釋什麼是質數」",
      "「質數是什麼」",
      "「請解釋質數，越詳細越好」",
      "「質數的定義和歷史和應用和例子」"
    ],
    "correct_answer": 0,
    "explanation": "設定角色（擅長教小孩的老師）、說明你的程度（國小五年級）、要求具體方式（有趣的例子），能讓 AI 給出真正適合你的解釋。"
  },
  {
    "placement_id": "P-S2-04",
    "target_semester": "S2",
    "question": "你想用 AI 生圖工具生成「同一個角色在不同場景」的圖片（例如這個角色在家、在學校、在海邊）。最大的挑戰是什麼？",
    "options": [
      "每次生成時，角色的外觀可能不一樣，很難保持一致",
      "AI 只能生成一張圖，無法生成多張",
      "場景不能有室內和室外混合",
      "角色一定要是真實存在的人才能生成"
    ],
    "correct_answer": 0,
    "explanation": "AI 圖片生成工具通常每次都是獨立生成，很難保證不同圖片中的角色外觀完全一致。這是一個需要技巧的進階挑戰。"
  },
  {
    "placement_id": "P-S2-05",
    "target_semester": "S2",
    "question": "你想讓 AI 寫一篇故事，你說「請寫一篇故事」，AI 寫了一篇你不滿意的。最有效的下一步是？",
    "options": [
      "告訴 AI 具體哪裡不滿意，例如「主角太被動了，請讓他更勇敢」",
      "一直說「重新寫」直到你滿意",
      "接受這個版本，AI 已經盡力了",
      "換個 AI 工具"
    ],
    "correct_answer": 0,
    "explanation": "具體說出「哪裡不滿意」和「你想要什麼改變」，比只說「重新寫」有效得多。AI 需要明確的指示才能往你想要的方向調整。"
  },
  {
    "placement_id": "P-S2-06",
    "target_semester": "S2",
    "question": "以下哪個情境最適合讓 AI 用「50 字以內」回答？",
    "options": [
      "「請用一句話說明 Wi-Fi 是什麼」",
      "「請詳細解釋量子力學」",
      "「請幫我寫一篇介紹台灣的文章」",
      "「請分析這部電影的所有優缺點」"
    ],
    "correct_answer": 0,
    "explanation": "「一句話說明」本身就暗示簡短。限制字數最適合需要簡潔摘要的情況，不適合需要詳細說明的複雜主題。"
  },
  {
    "placement_id": "P-S2-07",
    "target_semester": "S2",
    "question": "你想讓 AI 幫你把一篇正式報告改成「像朋友聊天一樣輕鬆的語氣」。以下哪個方式最有效？",
    "options": [
      "把文章貼給 AI，並說「請把這篇文章改成輕鬆活潑、像朋友聊天的語氣」",
      "只說「改成輕鬆版」",
      "請 AI 重新寫一篇完全不同的文章",
      "自己修改，AI 沒辦法控制語氣"
    ],
    "correct_answer": 0,
    "explanation": "把原文和明確的改寫指示都給 AI，它就能根據原本的內容調整語氣，而不是重新創作。"
  },
  {
    "placement_id": "P-S2-08",
    "target_semester": "S2",
    "question": "用 AI 生成的圖片可以直接拿來商業使用嗎？",
    "options": [
      "不一定，需要看使用的工具的使用條款規定",
      "可以，AI 生成的東西沒有版權",
      "不行，所有 AI 生成的圖片都不能商用",
      "可以，只要你付費訂閱了這個工具"
    ],
    "correct_answer": 0,
    "explanation": "每個 AI 工具的使用條款不同，有些允許商業使用，有些有限制。使用前需要查看該工具的規定。這是一個重要的實際應用知識。"
  }
]
```

---

## 輪次三｜S3 程度（多工具整合與邏輯思維）

> 測試：能否組合多個 AI 工具、具備基礎邏輯概念、對 VS Code 有初步認識

```json
[
  {
    "placement_id": "P-S3-01",
    "target_semester": "S3",
    "question": "你想做一個「有配樂的動畫故事」，需要哪些步驟？",
    "options": [
      "用文字 AI 寫故事 → 用圖像 AI 生成插圖 → 用影片 AI 讓圖動起來 → 用音樂 AI 生成配樂",
      "只用一個 AI 工具就能完成所有步驟",
      "先做配樂，再想故事，再生成圖片",
      "這種作品只有專業人士才能做到"
    ],
    "correct_answer": 0,
    "explanation": "不同類型的 AI 工具各有專長，把它們串起來可以完成複雜的多媒體作品。這就是「工具串聯」的概念。"
  },
  {
    "placement_id": "P-S3-02",
    "target_semester": "S3",
    "question": "程式裡的「如果…就…」（條件判斷）是什麼意思？",
    "options": [
      "電腦根據某個條件是否成立，決定要做哪件事",
      "這是一種讓程式執行更快的方法",
      "讓程式重複做同一件事",
      "讓程式記住資料"
    ],
    "correct_answer": 0,
    "explanation": "「如果天氣好，就去公園；否則，就在家看書」——這就是條件判斷的邏輯，電腦也是用同樣的方式做決定的。"
  },
  {
    "placement_id": "P-S3-03",
    "target_semester": "S3",
    "question": "你想讓 Minecraft 裡的一扇門，在玩家走近時自動開門。最接近這個邏輯的描述是？",
    "options": [
      "「如果玩家在門前 2 格內，就打開門；否則，保持關閉」",
      "「門在遊戲開始時就打開，不再關閉」",
      "「玩家必須按右鍵才能開門」",
      "「門每隔 10 秒自動開關一次」"
    ],
    "correct_answer": 0,
    "explanation": "這個邏輯就是「如果（條件）→ 就做（動作）」，Minecraft 的紅石電路和指令方塊都可以實現這種條件判斷。"
  },
  {
    "placement_id": "P-S3-04",
    "target_semester": "S3",
    "question": "VS Code 是什麼？",
    "options": [
      "一個讓你寫程式的軟體（程式碼編輯器）",
      "一個可以生成 AI 圖片的工具",
      "一個線上遊戲平台",
      "一個製作簡報的軟體"
    ],
    "correct_answer": 0,
    "explanation": "VS Code（Visual Studio Code）是目前最多人使用的程式碼編輯器，讓你撰寫、查看、執行各種程式語言的程式碼。"
  },
  {
    "placement_id": "P-S3-05",
    "target_semester": "S3",
    "question": "你想做一段 30 秒的背景音樂，配合你的「夏天海邊冒險」故事。你應該告訴音樂 AI 什麼？",
    "options": [
      "「請生成一段 30 秒的音樂，節奏輕快、有海浪聲、充滿冒險感」",
      "「音樂」",
      "「海邊」",
      "「請生成好聽的音樂」"
    ],
    "correct_answer": 0,
    "explanation": "給音樂 AI 的描述和給圖像 AI 一樣：長度、節奏、氛圍、特定元素——越具體越能生成符合需求的作品。"
  },
  {
    "placement_id": "P-S3-06",
    "target_semester": "S3",
    "question": "「序列」（sequence）在程式設計中是什麼意思？",
    "options": [
      "程式按照你寫的順序，一步一步執行",
      "程式隨機選擇要執行哪一步",
      "程式同時做所有的事",
      "程式只執行最後一個步驟"
    ],
    "correct_answer": 0,
    "explanation": "序列是程式最基本的概念：先做步驟一，完成後再做步驟二，然後步驟三……，按順序執行，少一步或順序錯了結果就不對。"
  },
  {
    "placement_id": "P-S3-07",
    "target_semester": "S3",
    "question": "你用文字 AI 寫了一個故事，再用圖像 AI 為故事生成插圖。你發現插圖和故事的描述對不上。最可能的原因是？",
    "options": [
      "你給圖像 AI 的描述沒有包含足夠的故事細節",
      "圖像 AI 和文字 AI 是同一個系統，應該自動同步",
      "這是因為圖像 AI 不夠好",
      "插圖和故事不需要對應，AI 創作就是這樣"
    ],
    "correct_answer": 0,
    "explanation": "圖像 AI 只看你給它的描述，不知道文字 AI 寫了什麼。你需要把故事的關鍵場景細節也告訴圖像 AI，它才能生成匹配的插圖。"
  },
  {
    "placement_id": "P-S3-08",
    "target_semester": "S3",
    "question": "你在 VS Code 裡打開一個檔案，裡面寫著：print(\"Hello, World!\")。你執行這個程式，螢幕上會顯示什麼？",
    "options": [
      "Hello, World!",
      "print",
      "\"Hello, World!\"",
      "什麼都不會顯示"
    ],
    "correct_answer": 0,
    "explanation": "print() 是 Python 語言中「把東西顯示在螢幕上」的指令。括號裡的內容（不含引號）就是會顯示出來的文字。"
  }
]
```

---

## 輪次四｜S4 程度（HTML/CSS 與數位創作）

> 測試：對網頁基礎結構、CSS 樣式、數位產品概念的理解

```json
[
  {
    "placement_id": "P-S4-01",
    "target_semester": "S4",
    "question": "HTML 和 CSS 在網頁製作中各自負責什麼？",
    "options": [
      "HTML 負責網頁的內容結構，CSS 負責網頁的視覺樣式（顏色、字體、排版）",
      "HTML 負責動畫，CSS 負責文字",
      "HTML 和 CSS 做的是同一件事，只是語法不同",
      "CSS 負責內容，HTML 負責樣式"
    ],
    "correct_answer": 0,
    "explanation": "HTML 就像網頁的骨架（有哪些標題、段落、圖片），CSS 就像網頁的外觀（什麼顏色、字多大、怎麼排列）。兩者分工合作。"
  },
  {
    "placement_id": "P-S4-02",
    "target_semester": "S4",
    "question": "下面哪個是 HTML 的標籤（tag）？",
    "options": [
      "<h1>標題</h1>",
      "color: red;",
      "print(\"標題\")",
      "# 標題"
    ],
    "correct_answer": 0,
    "explanation": "HTML 使用角括號（< >）來標記內容的類型，例如 <h1> 表示最大的標題，</h1> 表示這個標題結束了。"
  },
  {
    "placement_id": "P-S4-03",
    "target_semester": "S4",
    "question": "你想讓網頁上所有的標題文字都變成藍色。這是 HTML 的工作還是 CSS 的工作？",
    "options": [
      "CSS 的工作，因為 CSS 負責視覺樣式",
      "HTML 的工作，因為標題是 HTML 的內容",
      "需要同時用 HTML 和 CSS 才能做到",
      "需要用 JavaScript 才能改變顏色"
    ],
    "correct_answer": 0,
    "explanation": "改變顏色屬於「視覺樣式」，這是 CSS 的職責。你可以在 CSS 裡寫 h1 { color: blue; } 來讓所有 h1 標題變藍色。"
  },
  {
    "placement_id": "P-S4-04",
    "target_semester": "S4",
    "question": "什麼是「數位產品」？",
    "options": [
      "可以在電腦、手機或網路上使用的應用程式、網站、工具或內容",
      "只有實體的電子產品，例如手機和電腦",
      "只有付費才能使用的軟體",
      "由機器人製造的產品"
    ],
    "correct_answer": 0,
    "explanation": "數位產品是以數位形式存在、可以透過網路或裝置使用的東西，例如 App、網站、線上課程、電子書、遊戲等，不需要實體交付。"
  },
  {
    "placement_id": "P-S4-05",
    "target_semester": "S4",
    "question": "你想在網頁上放一張圖片，應該用哪個 HTML 標籤？",
    "options": [
      "<img>",
      "<picture>",
      "<photo>",
      "<image>"
    ],
    "correct_answer": 0,
    "explanation": "在 HTML 中，<img> 是插入圖片的標籤，例如 <img src=\"圖片網址\"> 就能在網頁上顯示一張圖片。"
  },
  {
    "placement_id": "P-S4-06",
    "target_semester": "S4",
    "question": "你的網頁背景色是白色，你想改成淺灰色。你應該修改哪個部分？",
    "options": [
      "CSS 樣式，修改 background-color 的值",
      "HTML 結構，修改 <body> 標籤的內容",
      "JavaScript，用程式動態修改顏色",
      "圖片，換一張灰色的背景圖"
    ],
    "correct_answer": 0,
    "explanation": "背景顏色是樣式設定，屬於 CSS 的範疇。通常在 CSS 中寫 body { background-color: lightgrey; } 即可。"
  },
  {
    "placement_id": "P-S4-07",
    "target_semester": "S4",
    "question": "一個故事繪本要有哪些基本元素才算「完整」？",
    "options": [
      "角色、故事情節（開頭中間結尾）、插圖",
      "只需要有圖片",
      "只需要有文字",
      "需要有至少 100 頁"
    ],
    "correct_answer": 0,
    "explanation": "一個完整的故事繪本需要：讓讀者認識的角色、有起承轉合的故事情節、以及幫助讀者理解故事的插圖。長度不是關鍵。"
  },
  {
    "placement_id": "P-S4-08",
    "target_semester": "S4",
    "question": "你做了一個網頁，想在裡面放一個會讓訪客看到「你好！歡迎光臨」的文字框。這需要用到什麼技術？",
    "options": [
      "HTML（建立文字框的結構）＋ CSS（讓文字框好看）",
      "只需要 Photoshop",
      "只需要 CSS",
      "需要先會 Python"
    ],
    "correct_answer": 0,
    "explanation": "建立一個文字框需要 HTML 定義它的存在（例如 <div> 或 <p>），再用 CSS 設計它的外觀（邊框、背景、文字大小等）。"
  }
]
```

---

## 輪次五｜S5 程度（JavaScript 與開發工具）

> 測試：對 JavaScript 基礎概念、GitHub Copilot、開發工作流程的理解

```json
[
  {
    "placement_id": "P-S5-01",
    "target_semester": "S5",
    "question": "JavaScript 在網頁中主要負責什麼？",
    "options": [
      "讓網頁有互動功能，例如按按鈕會發生事情",
      "決定網頁的版面和顏色",
      "讓網頁的圖片更清晰",
      "負責把網頁傳到網路上"
    ],
    "correct_answer": 0,
    "explanation": "如果說 HTML 是骨架、CSS 是外觀，JavaScript 就是讓網頁「動起來」的力量。按鈕點了會反應、表單驗證、動畫效果，都是 JavaScript 的工作。"
  },
  {
    "placement_id": "P-S5-02",
    "target_semester": "S5",
    "question": "GitHub 是什麼？",
    "options": [
      "一個儲存和管理程式碼的平台，可以追蹤每次的修改記錄",
      "一種程式語言",
      "一個 AI 圖片生成工具",
      "微軟出的文書處理軟體"
    ],
    "correct_answer": 0,
    "explanation": "GitHub 是全球最多人使用的程式碼託管平台，讓你可以儲存程式碼、追蹤修改歷史、和其他人合作開發，也可以公開分享你的作品。"
  },
  {
    "placement_id": "P-S5-03",
    "target_semester": "S5",
    "question": "在 JavaScript 中，「變數」是什麼？",
    "options": [
      "用來暫時儲存資料的容器，例如儲存使用者的名字或分數",
      "一種讓程式重複執行的機制",
      "網頁上的按鈕",
      "一種讓網頁有顏色的方法"
    ],
    "correct_answer": 0,
    "explanation": "變數就像一個有名字的盒子，你可以把資料放進去，之後用名字取出來使用。例如 let score = 100; 就是把 100 存在叫做 score 的變數裡。"
  },
  {
    "placement_id": "P-S5-04",
    "target_semester": "S5",
    "question": "GitHub Copilot 是什麼？",
    "options": [
      "一個在 VS Code 裡幫你寫程式的 AI 助理",
      "一個替你駕駛飛機的 AI",
      "GitHub 的管理員帳號",
      "一種程式設計語言"
    ],
    "correct_answer": 0,
    "explanation": "GitHub Copilot 是一個 AI 程式輔助工具，整合在 VS Code 裡，可以根據你的程式碼和說明，自動建議下一行或整個函式的程式碼。"
  },
  {
    "placement_id": "P-S5-05",
    "target_semester": "S5",
    "question": "你寫了一段 JavaScript，想讓按下按鈕時網頁上的文字改變。你需要用到哪個 JavaScript 技術？",
    "options": [
      "DOM 操作——讓 JavaScript 找到網頁上的元素並修改它",
      "CSS 動畫",
      "HTML 的 onclick 屬性（不需要 JavaScript）",
      "Python 腳本"
    ],
    "correct_answer": 0,
    "explanation": "DOM（Document Object Model）讓 JavaScript 可以找到網頁上的任何元素（例如那段文字），並動態修改它的內容、樣式或行為。"
  },
  {
    "placement_id": "P-S5-06",
    "target_semester": "S5",
    "question": "在程式裡，「函式」（function）是什麼？",
    "options": [
      "一段有名字的程式碼，可以在需要的時候呼叫來執行",
      "一種存放資料的容器",
      "程式裡的一個錯誤",
      "讓程式自動執行的定時器"
    ],
    "correct_answer": 0,
    "explanation": "函式就像食譜——你把步驟寫好，給它一個名字，之後只要呼叫這個名字，程式就會按照步驟執行，不需要每次都重寫同樣的程式碼。"
  },
  {
    "placement_id": "P-S5-07",
    "target_semester": "S5",
    "question": "你用 AI 輔助寫了一段程式，但程式執行後出現錯誤。你應該怎麼做？",
    "options": [
      "看懂錯誤訊息，理解是哪裡出錯，再問 AI 怎麼修正",
      "把所有程式碼刪掉重新開始",
      "不管錯誤訊息，繼續寫下一段程式",
      "放棄這個專案"
    ],
    "correct_answer": 0,
    "explanation": "錯誤訊息是程式告訴你「哪裡有問題」的提示。讀懂錯誤訊息，找出問題所在，再向 AI 詢問修正方法，是開發者最重要的能力之一。"
  },
  {
    "placement_id": "P-S5-08",
    "target_semester": "S5",
    "question": "什麼是「版本控制」（version control）？",
    "options": [
      "記錄每一次程式碼修改的歷史，讓你可以回到之前的版本",
      "決定程式要執行第幾個版本",
      "讓你的程式在不同的電腦上都能執行",
      "控制程式的執行速度"
    ],
    "correct_answer": 0,
    "explanation": "版本控制就像程式碼的「時光機」，每次做了重大修改，就存一個新版本。如果新版本出問題，可以回到之前正常的版本。Git 是最常用的版本控制工具。"
  }
]
```

---

## 輪次六｜S6–S7 程度（完整作品開發）

> 測試：能否理解完整專案開發流程、部署概念、迭代思維

```json
[
  {
    "placement_id": "P-S6-01",
    "target_semester": "S6",
    "question": "你開發了一個網頁 App，你的朋友在他的電腦上無法開啟。最可能的原因是？",
    "options": [
      "這個 App 只在你的電腦上運行，還沒有「部署」到網路上讓其他人存取",
      "你的朋友電腦太舊了",
      "網頁 App 只能在手機上使用",
      "App 需要安裝才能使用"
    ],
    "correct_answer": 0,
    "explanation": "在你電腦上運行的程式，別人無法直接存取。「部署」（deployment）就是把你的作品放到伺服器或雲端平台，讓任何人都能透過網路使用。"
  },
  {
    "placement_id": "P-S6-02",
    "target_semester": "S6",
    "question": "什麼是「MVP」（最小可行產品）？",
    "options": [
      "只有核心功能的最簡單版本，讓你快速測試想法是否可行",
      "最完整、最完美的產品版本",
      "最多人使用的產品",
      "最貴的產品版本"
    ],
    "correct_answer": 0,
    "explanation": "MVP 就是「先做一個夠用的版本」，確認別人真的需要這個東西，再慢慢加功能。比起花很多時間做完美版本後才發現沒人用，MVP 的風險更低。"
  },
  {
    "placement_id": "P-S6-03",
    "target_semester": "S6",
    "question": "你開發了一個 App，讓朋友試用後說「這個按鈕太小了，我按不到」。你應該怎麼看待這個回饋？",
    "options": [
      "這是有用的回饋，可以根據這個改善 App 的設計",
      "朋友的手太大了，不是你的問題",
      "App 已經夠好了，不需要修改",
      "等有更多人反映才需要處理"
    ],
    "correct_answer": 0,
    "explanation": "使用者回饋是改善產品最直接的資訊。「用戶覺得哪裡不好用」遠比自己猜測更有價值。好的開發者會主動收集和回應回饋。"
  },
  {
    "placement_id": "P-S6-04",
    "target_semester": "S6",
    "question": "「迭代開發」是什麼意思？",
    "options": [
      "先做出一個基本版本，根據回饋不斷修改改進，反覆進行",
      "一次就做出完美的最終版本",
      "每隔固定時間重新開始做一個新版本",
      "讓不同的人輪流開發同一個專案"
    ],
    "correct_answer": 0,
    "explanation": "迭代是現代軟體開發的核心方法。先做出可用的版本，收集回饋，改進，再發布，再收集回饋……這樣的循環讓產品越來越好。"
  },
  {
    "placement_id": "P-S6-05",
    "target_semester": "S6",
    "question": "GitHub Pages 可以做什麼？",
    "options": [
      "免費把你的靜態網站（HTML/CSS/JS）部署到網路上，讓任何人都能訪問",
      "讓你在 GitHub 上建立一個個人部落格",
      "把你的程式碼翻譯成其他語言",
      "自動修復你程式碼裡的錯誤"
    ],
    "correct_answer": 0,
    "explanation": "GitHub Pages 是 GitHub 提供的免費靜態網站託管服務，只要把你的 HTML/CSS/JS 推送到指定的 GitHub 儲存庫，就能得到一個公開的網址讓別人訪問你的網站。"
  },
  {
    "placement_id": "P-S6-06",
    "target_semester": "S6",
    "question": "你想讓更多人使用你做的 App，你應該先做什麼？",
    "options": [
      "確認 App 能解決某群人的真實需求，找到你的目標使用者",
      "先把 App 的功能做到最多最完整",
      "先設計很漂亮的圖示和介面",
      "先寫很長的說明文件"
    ],
    "correct_answer": 0,
    "explanation": "最重要的問題是「誰需要這個？為什麼需要？」。先確認有真實需求，再根據需求開發功能，比做了一堆功能才發現沒人用有效率得多。"
  },
  {
    "placement_id": "P-S6-07",
    "target_semester": "S6",
    "question": "你的網頁 App 在手機上看起來版面很亂，但在電腦上正常。這個問題叫什麼？",
    "options": [
      "響應式設計（RWD）問題，網頁沒有針對不同螢幕大小做適配",
      "手機瀏覽器有 Bug",
      "App 的程式碼有語法錯誤",
      "網路連線太慢"
    ],
    "correct_answer": 0,
    "explanation": "響應式設計（Responsive Web Design）是讓網頁在不同螢幕尺寸（手機、平板、電腦）上都能正常顯示的技術。如果沒有做 RWD，在手機上看起來可能很亂。"
  },
  {
    "placement_id": "P-S6-08",
    "target_semester": "S6",
    "question": "你做了一個計算機 App，想讓它也能在手機上使用。最快的方法是？",
    "options": [
      "用 CSS 的 media query 讓版面根據螢幕大小自動調整",
      "重新做一個專門給手機用的 App",
      "讓使用者自己縮放頁面",
      "告訴使用者只能在電腦上使用"
    ],
    "correct_answer": 0,
    "explanation": "CSS 的 @media query 讓你可以針對不同螢幕寬度設定不同的樣式，是實現響應式設計最直接的方法，不需要做兩個版本。"
  }
]
```

---

## 輪次七｜S7–S8 程度（產品發布與市場驗證）

> 測試：對產品上架、市場分析、個人品牌建立的理解

```json
[
  {
    "placement_id": "P-S7-01",
    "target_semester": "S7",
    "question": "你把你的 App 放到網路上了，但很少人使用。你應該怎麼分析這個問題？",
    "options": [
      "收集使用者數據，看看是沒有人找到（流量問題）還是找到了但不想用（體驗問題）",
      "立刻加很多新功能",
      "降低 App 的價格",
      "放棄這個 App，重新做一個"
    ],
    "correct_answer": 0,
    "explanation": "「很少人使用」可能有兩種完全不同的原因，需要先找出是哪種問題再對症下藥。不分析就亂加功能，可能解決不了真正的問題。"
  },
  {
    "placement_id": "P-S7-02",
    "target_semester": "S7",
    "question": "在 GitHub 上，「README.md」是什麼？",
    "options": [
      "介紹這個專案是什麼、怎麼使用的說明文件",
      "程式的主要程式碼檔案",
      "GitHub 自動生成的錯誤報告",
      "只有開發者才能看到的私密筆記"
    ],
    "correct_answer": 0,
    "explanation": "README.md 是放在 GitHub 專案首頁的說明文件，用來告訴別人「這個專案是什麼」、「怎麼安裝和使用」、「誰做的」等基本資訊，是開源專案的門面。"
  },
  {
    "placement_id": "P-S7-03",
    "target_semester": "S7",
    "question": "你做了一個「番茄鐘計時 App」，想了解使用者喜不喜歡。最直接的方法是？",
    "options": [
      "讓幾個人試用，問他們用完的感受和遇到的問題",
      "看 App 的下載次數",
      "問自己覺得好不好用",
      "等一個月看看有沒有人自動來用"
    ],
    "correct_answer": 0,
    "explanation": "直接讓目標使用者試用並訪談，是獲得最真實、最有用的產品回饋的方法。數據能告訴你發生了什麼，訪談能告訴你為什麼。"
  },
  {
    "placement_id": "P-S7-04",
    "target_semester": "S7",
    "question": "你想要其他開發者幫你改善你的 GitHub 專案。你應該做什麼？",
    "options": [
      "把專案設為公開，寫清楚 README，並建立「Issues」讓別人回報問題",
      "把程式碼用電子郵件寄給大家",
      "把專案設為私密，只邀請特定的人",
      "在社群媒體上發文介紹"
    ],
    "correct_answer": 0,
    "explanation": "GitHub 的開源協作流程：公開專案 + 清楚說明（README）+ Issue 追蹤系統，讓社群貢獻者可以找到你的專案、理解怎麼貢獻、並回報或修復問題。"
  },
  {
    "placement_id": "P-S7-05",
    "target_semester": "S7",
    "question": "什麼是「作品集」（Portfolio）？",
    "options": [
      "展示你做過的作品的集合，讓別人了解你的能力和風格",
      "你所有程式碼的備份",
      "一種程式語言",
      "向老師繳交的作業"
    ],
    "correct_answer": 0,
    "explanation": "作品集是你向世界展示「我能做什麼」的最直接方式。好的作品集包含你的代表作、每個作品的說明，以及你的個人介紹。"
  },
  {
    "placement_id": "P-S7-06",
    "target_semester": "S7",
    "question": "你想把你的興趣（例如喜歡畫畫）轉化成可以獲利的方式，最可能的路徑是？",
    "options": [
      "先做出一個真實有用的東西（如畫畫教學 App 或數位商品），找到願意付費的目標客群",
      "先做很多廣告，等人們注意到後再想要賣什麼",
      "等有人主動來找你合作",
      "需要先有很多追蹤者才能開始"
    ],
    "correct_answer": 0,
    "explanation": "從興趣獲利的關鍵是「找到真實需求並解決它」。先做出有價值的東西，再找願意為這個價值付費的人。流量和追蹤者是結果，不是前提。"
  },
  {
    "placement_id": "P-S7-07",
    "target_semester": "S7",
    "question": "你的 App 上線後，用戶反映「載入速度太慢」。這是什麼類型的問題？",
    "options": [
      "效能（Performance）問題，需要優化程式碼或減少資源大小",
      "介面設計問題",
      "內容問題",
      "行銷問題"
    ],
    "correct_answer": 0,
    "explanation": "載入速度慢通常是效能問題，可能是圖片太大、程式碼沒有優化、或是伺服器回應太慢。效能優化是產品上線後的重要工作之一。"
  },
  {
    "placement_id": "P-S7-08",
    "target_semester": "S7",
    "question": "什麼樣的個人作品集網站最有說服力？",
    "options": [
      "有真實的作品案例，每個作品說明你解決了什麼問題、用了什麼技術、學到了什麼",
      "設計最漂亮、動畫最多的網站",
      "列出所有你學過的技術名稱",
      "越長越好，內容越多越顯得專業"
    ],
    "correct_answer": 0,
    "explanation": "真實的作品案例遠比技術列表或華麗設計更有說服力。說明「你做了什麼」、「為什麼這樣做」、「學到了什麼」，讓看的人理解你的思維過程。"
  }
]
```

---

## 統計

| 輪次 | 目標學期 | 題數 | 主要測試能力 |
|------|---------|------|------------|
| 輪次一 | S1 | 8 | AI 基礎認知、Minecraft 直覺、邏輯思維 |
| 輪次二 | S2 | 8 | AI 工具進階、輸出控制、生圖技巧 |
| 輪次三 | S3 | 8 | 多工具整合、基礎邏輯、VS Code 認識 |
| 輪次四 | S4 | 8 | HTML/CSS 基礎、數位產品概念 |
| 輪次五 | S5 | 8 | JavaScript 基礎、GitHub、開發工具 |
| 輪次六 | S6–S7 | 8 | 完整開發流程、部署、迭代思維 |
| 輪次七 | S7–S8 | 8 | 上架、市場分析、作品集、獲利思維 |
| **合計** | | **56 題** | |

> 注意：輪次六對應 S6，輪次七對應 S7；通過輪次七者直接放入 S8。

---

> 最後修改：2026-04-23，原因：初始建立 Stage 2 分班題庫，56 題覆蓋 S1–S8 全程度，無前置知識版
