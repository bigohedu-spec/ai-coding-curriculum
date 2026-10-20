# 旁白與配音

| 系列 | 旁白方式 |
|---|---|
| P 系列（小一、小二） | 動物語（真人音節素材串接）＋卡拉 OK 字幕；字母要塞用鍵盤語 |
| S 系列（小三以上） | 語音生成配音；機器人角色＝語音＋後製 |
| S5 起 | ElevenLabs 小宇，見文末「S5 設定」 |

## P 系列：動物語

- 引擎 `lib/lessonEntry/animalese.ts`，素材 `public/lesson-entry/animalese/`（每角色一個 sprite wav＋索引 json）。
- 字幕與發聲共用 `tokenTimes`：動物一發聲，對應的字就亮起。一次一個短句（≤ 10 字）。
- 旁白速度 `SPEECH_PER_BEAT`（每字 0.32 拍，在 `steps.tsx`）；改速度後每頁重跑 `__cueCheck`。
- 英文名字依音節發聲（`englishSyllables.ts`）。
- 字典（`data/zhuyinDict.json`）沒收的字會用固定咕噥並在字幕標示；新課先掃缺字。
- 字母要塞的鍵盤語：`lib/lessonEntry/keyvoice.ts`（voice `"kaka"`），每顆鍵固定音高。

## S 系列：語音生成流程

```
台詞 JSON → 試聽選聲線 → voice-build.mjs 生成＋後製 → voice-check.mjs 聽寫 → 頁面用 makeVoice 排時間 → 瀏覽器檢查字幕
```

1. **試聽**：`tts-audition.mjs` 每個角色生 3 句 × 約 5 個聲線；機器人用 `robotize.py` 出 R1～R3 三種強度。放成靜態試聽頁 `public/lesson-entry/_audition/<堂代號>/`（不進 repo），請負責人點選；選擇結果存在頁面變數，用 JS 讀出。
2. **台詞 JSON** `scripts/lesson-entry/voice-lines/<堂代號>.json`（台詞唯一來源，腳本只放摘要）：
   ```json
   {
     "lesson": "S2-W03",
     "voices": {
       "det": { "voice": "ash", "robot": null, "style": "請用台灣國語的口音說話（不要大陸腔）。堅定、沉穩、溫暖的少年偵探……" },
       "bot": { "voice": "alloy", "robot": "R1", "style": "請用台灣國語的口音說話。開朗熱心的小機器人……" }
     },
     "say": { "長度": "嘗度" },
     "lines": [{ "id": "p1-hi", "who": "det", "text": "……" }]
   }
   ```
   - `id` 用 `p<頁>-<用途>`；互動頁的提示句、對錯回饋也列進來。
   - ElevenLabs 聲線寫 `"provider": "eleven", "voice": <voice_id>, "model": …, "stability": …, "speed": …`。
3. **生成**：`node scripts/lesson-entry/voice-build.mjs <堂代號>`（`--force` 全部重生）。
   - 依「文字＋聲線＋語氣」快取在 `scripts/lesson-entry/.voice-cache/`，只重生改過的句子；單句重生用 `voice-redo.mjs <堂代號> <id> …`。
   - 後製 `voice_post.py`：統一響度、修頭尾靜音、機器人後製、算每字時間。輸出 `public/lesson-entry/voice/<堂代號>/<id>.mp3` 與 `src/config/lessonEntry/voice/<堂代號>.json`。
4. **對時**：`node scripts/lesson-entry/voice-align.mjs <堂代號>` 用 whisper 字詞時間重算每字時間（比估算準，ElevenLabs 必跑）。`--check` 只報告。
5. **聽寫檢查**：`node scripts/lesson-entry/voice-check.mjs <堂代號>`，每句相似度 ≥ 0.9。周／週、麽／麼、哦／喔、嗶嗶→BB 屬字形差異。含糊的句子用 `voice-polish.mjs <堂代號>` 多生幾版、自動留最清楚的。
6. **讀音**：聽寫通過不代表讀音正確，破音字與聲調要人耳聽。`pronunciation-audit.mjs <堂代號>` 產生待聽清單與切片。
   - 會念錯的破音字（長、重、行、樂、還、教、少、數…）在 `say` 表換成只有一個讀音的同音字（長度→嘗度），字數必須相同；字幕仍顯示原文。本來就讀另一音的詞（校長）不放進表。
   - 回報時「讀音已確認」只寫負責人聽過的句子。

## 台詞寫法（S 系列）

- 完整句子，一句約 15～25 字；字幕依逗號切段，每段 ≤ 14 字。
- 只用中文字、`，。！？：；` 與半形空白；列舉用半形空白（`清單 表格 步驟`）。英文工具名改中文或確認念法；不放數字與 `@` 等符號。
- 口訣照學習單原文。

## 機器人聲（`robotize.py`）

- 做法：稍微升調（不變速）＋淡淡高八度和聲＋10 ms 短機殼回音＋喇叭等化（150 Hz～7 kHz）＋淡入淡出。
- 強度 R1 輕／R2 中／R3 明顯，預設 R1（R3 會影響聽懂）。
- 不用環形調變與降取樣（電流聲、破音）。所有角色統一響度。

## S5 設定（小宇）

- 聲線 Yu 小宇 `fQj4gJSexpu8RDE2Ii5m`，模型 `eleven_v4`，`language_code: "zh"`，`stability: 0.4`、`similarity_boost: 0.75`，輸出 `pcm_24000`。
- 每句文字前加語氣標籤 `[confident, friendly conversational voice] `（標籤不進字幕）。目標是平穩、親切、有自信的口語，有自然重音與句尾起伏；不加 excited 等強烈情緒標籤，不靠音量、變速、變調製造起伏。
  ```json
  { "text": "[confident, friendly conversational voice] 上週，你在自己的工作室做出了第一個網頁。",
    "model_id": "eleven_v4", "language_code": "zh",
    "voice_settings": { "stability": 0.4, "similarity_boost": 0.75 }, "seed": 2026102400 }
  ```
- 後製只乘固定增益 `min(0.1/RMS, 0.7/peak)` 後轉 MP3；保留原始停頓，不裁切、不變速、不等化。（`voice-build.mjs` 的後製會修靜音與變速，S5 需另寫只做固定增益的步驟。）
- 換音檔後一定跑 `voice-align.mjs` 重新對時；逐句檢查字數、時間單調遞增、不超過音檔長度。
- 誤讀：用 `whisper-1` 與 `gpt-4o-mini-transcribe` 各聽寫一次（prompt 不放預期台詞）。兩者都聽到漏字或錯詞就重錄該句，每句最多 2 個候選；仍失敗可試一次 `stability: 0.5`、無標籤的保底版；再失敗就標示待處理。
- 每課保存：請求內容、原始 WAV、音檔 SHA256、實際參數與 seed、選錄原因（存在本機製作資料夾）。

## 頁面接法

見 ARCHITECTURE.md「S 系列頁面」。動作要對準台詞關鍵字（念到「皇冠」燈才閃），用 `charBeat`；台詞改了索引要重算。
