# S5 小宇自然語調（2026-10-20 負責人確認）

適用於沿用 S5W01／W02 風格的旁白。負責人已確認 W01 自然語調版「效果 OK」，並要求 W02 同設定；不覆蓋其他課程已選定的角色聲線，P 系列仍用動物語／鍵盤語。

> **W02 最新定案**：僅用 conversational voice 的 W02 被回報「有點太沮喪」；改為 `[confident, friendly conversational voice]` 三句試聽後，負責人確認「這個版本沒問題」。W02 與後續沿用其風格的旁白採此親切自信指示，明亮、自然重音，不回到強烈興奮表演。W01 已確認的現版維持原設定；樣本確認不等於每段新生成皆已聽審。

## 聲線與語調

- 聲線：Yu 小宇，`fQj4gJSexpu8RDE2Ii5m`。
- 模型：`eleven_v4`，語言 `zh`。
- `voice_settings`：`stability: 0.4`、`similarity_boost: 0.75`。
- W02 及沿用其風格的新旁白：每句送出文字為 `[confident, friendly conversational voice] `＋原台詞。W01 已確認現版使用 `[conversational voice] `。Ctrl 依既有 `say` 表展開成 Control；字幕不包含標籤，顯示原台詞。
- 目標是平穩、有自信、清楚的口語旁白，句內有自然重音、停頓與句尾起伏。**抑揚頓挫不等於強烈情緒**。
- 不預設加入 excited／delighted／energetic 等興奮喜悅標籤；先前即使只套在開場或完成句，負責人仍認為太滿。不靠放大音量、變速或變調營造起伏。
- 原小宇 `stability: 0.5`、無標籤版本被認為太平；不要把這版當成最終的整課設定。遇到個別誤讀可保留既有、同聲線且咬字完整的錄音，逐句記錄例外。

API 輸入範例（實際台詞取自該課 voice-lines JSON）：

```json
{
  "text": "[confident, friendly conversational voice] 上週，你在自己的工作室做出了第一個網頁。",
  "model_id": "eleven_v4",
  "language_code": "zh",
  "voice_settings": { "stability": 0.4, "similarity_boost": 0.75 },
  "seed": 2026102400
}
```

使用 `/v1/text-to-speech/fQj4gJSexpu8RDE2Ii5m?output_format=pcm_24000`。seed 僅供追溯與盡力重現，不保證每次相同。不要沿用其他模型的 style、speed 或 SSML break 參數；v4 本次僅使用上列參數。

## 音訊與字幕

1. 原始 mono PCM 24 kHz 包成 WAV 備存。後製只乘固定增益：`min(0.1/RMS, 0.7/peak)`，再編碼 MP3。保留每個原始樣本與自然停頓，不做 gap 壓縮、trim、time stretch、EQ 或機器人後製。
2. `scripts/lesson-entry/s5w17-liam-preserve.py <post-jobs.json>` 雖為歷史檔名，實際處理為上述固定增益，不是 Liam 專屬。英文句需提供 `englishUnits` 計算的 sizes，避免字幕有聲字數不一致。
3. 更換音檔後，用 `voice-align.mjs <課代號>` 重新取得字詞時間；逐句檢查 token 數、單調時間序、時間界限與音檔時長。不得沿用舊音檔字幕時間。

## 誤讀排查與有限重錄

- 檢查最終 MP3；用 `whisper-1` 與 `gpt-4o-mini-transcribe` 獨立聽寫，不把預期台詞塞進 prompt。保留完整聽寫文字，繁簡體、同音字、Ctrl／Control、index.html 等格式差異需逐項區分。
- 兩模型一致出現不同詞或漏字時，重錄該句，維持原台詞；每句最多加錄兩個候選。優先台詞完整與清晰，不為追求語氣犧牲用詞。
- 沒有合格新候選時，可保留既有同聲線的清楚錄音，記錄該句實際設定。若沒有既有小宇錄音，可額外試一次小宇 `stability: 0.5`、`similarity_boost: 0.75`、無語氣標籤的保底錄音（每句最多兩個原設定重錄＋一個保底候選）；仍失敗則標示待處理，不無限重試或宣稱已過關。
- W01 最終為 44 段自然口語新錄音，`p4-3`／`p8-b` 保留小宇原版 0.5 無標籤錄音：新版本分別把「打程式碼」改成「打代碼」、把「第一」轉寫成 D。這些是 W01 的例外，不是未來課程固定要跳過的句子。
- W02 舊自然語調版曾有 `p10-c` 漏念「第一」的「一」，用小宇 0.5 無標籤保底還原完整；此舊版後來因語氣低落被要求修訂，不作整課語氣參考。親切自信版重新生成時仍逐句驗台詞，不自動沿用舊版例外。句內重複詞亦須檢查，曾出現「所以，所以」與「整整齊齊」連念兩次。
- 不再將常見同音字替換當成普遍的咬字修復方案；此法在本次 Liam 排查中未獲負責人接受。具體多音字例外須有實際聽審證據。
- 自動聽寫、字幕對時及訊號檢查都不等於人耳發音／聲調／語氣驗收。回報已驗項目與待負責人聽審項目；負責人說效果 OK 才能記為其已確認。

## 本機重現與追溯

- W01：`scripts/lesson-entry/s5w01-yu-natural-v4.mjs`，搭配 `s5w01-yu-natural-finalize.mjs` 的兩句保留例外；既有整合版本勿因重跑 install 而覆蓋例外。
- W02 最新：`scripts/lesson-entry/s5w02-yu-friendly-v4.mjs`，三句已確認樣本沿用原始錄音，不重新抽樣；`s5w02-yu-natural-v4.mjs` 為被回報語氣低落的舊版。腳本提供 generate／audit／install，均有 before 備份；有重錄時需更新選錄、raw 路徑與實際 seed，避免 lock 記到落選錄音。
- W02 舊版單句保底處理為 `s5w02-yu-neutral-fallback.mjs`，不可直接套到新版路徑。重跑全課 install 會蓋過保底句，需套回最後選錄並僅對該句重新對時。
- 每課保存 request、原始 WAV／失敗候選、音檔 SHA256、實際參數與 seed、選錄原因、字幕及訊號 QA。製作資料留在本機忽略目錄，不 commit／不 `git add -f`。
- 正式素材仍是 `public/lesson-entry/voice/<課代號>/*.mp3` 與 `src/config/lessonEntry/voice/<課代號>.json`。
- 參考官方 [v4 prompting](https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices#prompting-eleven-v4)；以上數值是本專案實測定案，不代表所有聲線的通用最佳值。
