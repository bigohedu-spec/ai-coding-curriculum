# 進課動畫：程式架構與怎麼擴充

## 檔案地圖

```
.claude/skills/lesson-entry-animation/   ← 這個 skill（含腳本／審稿紀錄範本）
docs/lesson-entry/
  PRODUCTION-SPEC.md                      ← 完整製程與規格（唯一的規格來源）
  <堂代號>/script.md, review-log.md       ← 每堂課的腳本與審稿紀錄
  kits/<主題>/KIT.md, STYLE.md            ← 主題包的提示詞、風格定義、生成紀錄
public/lesson-entry/
  kits/<主題>/                            ← 主題包素材（WebP＋meta.json：size、anchor＝腳底中心）
  animalese/{rabbit,bear}.wav/.json       ← 動物語音節素材（OpenAI TTS 逐音節預錄、已切短）
  voice/<堂代號>/<id>.mp3                  ← S 系列語音生成配音（voice-build.mjs 產生）
  kits/detective/                         ← 阿問偵探社主題包（S2 遊戲美術縮成 WebP；偵探 detective-ph＝暫代）
scripts/lesson-entry/
  new-lesson.mjs                          ← 新增一堂課的骨架
  slice_sheet.py                          ← 姿勢表去背切片
  voice-lines/<堂代號>.json               ← S 系列台詞清單（台詞的唯一來源）
  voice-build.mjs／voice_post.py          ← 生成配音＋後製（響度、機器人）＋每字時間
  voice-check.mjs                         ← whisper 聽寫檢查
  tts-audition.mjs／robotize.py／tts-check.mjs ← 選聲線、機器人強度的試聽
src/
  components/lessonEntry/
    flow/LessonFlow.tsx                   ← 通用流程：音樂主時鐘、頁切換（內容播完等 2 拍）、再看一次、製作列
    flow/toolkit.tsx                      ← 工具：Stage、useClock、Spr、Base（分層場景）、Cap、groove、scanOverflow
    flow/pages.tsx                        ← 頁面範本 makeTalkPage（說話頁；extra 可放道具／機器人／特效）
    flow/pages2.tsx                       ← 頁面範本：makeTitlePage、makeSortPage（拖曳排順序複習）、makeGoalPage、makeChantPage、makePanelsPage、makeEndPage
    flow/Sub.tsx                          ← 卡拉 OK 字幕（自動縮小、念到哪亮到哪）
    flow/Ambient.tsx                      ← 環境動畫（太陽、小鳥、煙、香氣、閃光、鈴鐺、花粉、落葉、蝴蝶）
    flow/Det.tsx                          ← 阿問偵探社主題：DScene（展示廳／辦公室＋串燈、雨、浮塵）、Awen、Detective、Person 剪影、SlamText、FormatIcon、KeyShape、HintGlow
    flow/steps.tsx                        ← P1U-W13 的特殊頁（互動、特效）；也是寫新特殊頁的範例
    lessons/index.ts                      ← 課程登記表（堂代號 → 頁清單、配樂計畫）
    lessons/<ID>.ts                       ← 一堂課的頁清單
    cuts/                                 ← 舊的 CUT 預覽（CUT 1 動態版仍在用；BakeryScene 是場景版面資料）
  config/lessonEntry/musicPlan.ts         ← 配樂編曲計畫（autoPlan＋手調）
  config/lessonEntry/voice/<堂代號>.json  ← S 系列配音時間表（dur、每字 at；voice_post.py 產生，不要手改）
  lib/lessonEntry/
    voiceLines.ts                         ← S 系列：makeVoice（seq 依音檔長度排、charBeat 對關鍵字、speaking 誰在說話）
    music.ts                              ← 合成配樂引擎（11 層、主時鐘、restart）
    blips.ts                              ← 木琴音（playNote）
    animalese.ts                          ← 動物語引擎（tokenize、tokenTimes、displayUnits、speakSamples）
    englishSyllables.ts                   ← 英文名字切音節
    useAudio.ts                           ← AudioContext、旁白排程、音樂
  data/zhuyinDict.json                    ← 動物語的注音字典（缺字用固定咕噥代替）
  pages/entry/play/[session].tsx          ← 審稿頁 /entry/play/<堂代號>
```

## 時間模型（最重要）

- **單位是「拍」**：100 BPM，1 拍＝0.6 秒。腳本、動作、旁白、字幕全用拍。
- **音樂是主時鐘**：`Music.beatNow()` 回傳音樂現在第幾拍（已扣輸出延遲）。`useClock()` 回傳 `b = 音樂拍數 − 這一頁開始的拍數`（還沒開始時是 0）；整個畫面（動作、字幕亮起、旁白排程）都讀它，所以一定同步。
- 一頁開始的拍數是 `stepStart`。旁白用 `A.play(cues, voice)`：頁內第 n 拍 ＝ 音樂第 `stepStart + n` 拍（`useStep` 已經幫你呼叫）。
- **換頁**：頁元件在內容播完時呼叫 `done(endBeat)`（`useStep` 會自動做），`LessonFlow` 等 2 個整拍後切換；最後一頁自己呼叫 `done()`（按「開始遊戲」）。互動頁（等學生操作）在操作完成時自己呼叫 `done()`。
- 場景物件晃動讀**絕對拍數** `useAbsBeat()`，`groove(beat)` 回傳 hop／land／stretch／side／pulse（一拍分 4 格＝兩格一動）。

## 加一個新頁（頁面元件）

```tsx
// 最常見：說話頁（設定即可）
makeTalkPage({
  len: 8,                                   // 內容長度（拍）
  cues: [cue("今天，我們要開麵包坊！", 0.5)], // 旁白＝字幕；cue(文字, 第幾拍開始, 每字幾拍=0.25)
  chars: [{ who: "rabbit", x: 22 }, { who: "bear", x: 50, pose: "cheer" }],
  sign: "麵包坊", voice: "rabbit",
})
```

特殊頁（互動／特效）自己寫元件，骨架：

```tsx
export function MyPage({ A, ctx, done }: StepProps) {
  const CUES = [cue("…", 0.5)];
  const b = useStep(8, A, CUES, "rabbit", done);   // 排旁白、內容結束時回報
  return (
    <Stage>
      <Base>…角色 <Spr s={rabbitS("talk")} H={30} x={22} g={9.5} />…</Base>
      <Sub b={b} cues={CUES} />                      // 字幕一定要放，旁白的字就是字幕
    </Stage>
  );
}
```

- 座標單位 **cqw**（舞台寬度的 1%），舞台 100 × 56.25。`Spr` 的 `x` 是腳底水平位置、`g` 是腳底離底邊。
- 動作一律用 `prog(b, 開始拍, 長度)`、`snap(p, 格數)`（階梯＝兩格一動）、`popScale(p)`（擠壓彈出）、`hop(b, 週期, 高度)`。
- **每個元素都要自己設 `fontFamily`**（見 PITFALLS）。
- 互動頁：不要自己 `setTimeout` 換頁；操作完成後呼叫 `done()`，換頁時機由流程決定。

## S 系列：語音生成配音怎麼接

- `useAudio` 的 voice `"clip"`：cue 帶 `clip`（音檔 id）、`dur`、`at`（每字秒數）。`A.play(cues, "clip")` 依音樂拍點排程、說話時音樂自動壓低；`A.sayClip(id)` 立刻說一句（互動頁）。
- 音檔在「點一下開始」時預先載入：課程登記表 `lessons/index.ts` 的 `voice: { base, ids }`，`LessonFlow` 在 unlock 後呼叫 `A.loadClips`。
- `Sub`：cue 有 `at` 就用它當每字亮起時間（從音檔量出來的），否則照動物語速度算。S 系列傳 `font`（不帶注音）、`tight`（字距收緊）、`left`（左側有角色時讓字幕往右）。
- 台詞規則與流程見 VOICE-TTS.md。
- **W04 起用共用工具 `flow/DetKit.tsx`**：`makeScene(VO, 堂代號)` 一般頁、`makeChoicePage(VO, 堂代號, {intro, qs, opts, ok, no, hint, doneClip})` 互動選擇題頁（選錯抖＋提示、選對發光＋下一題、9 拍沒動作就指引）、`useSay`、F 小調音效 `note`／`achieve`、`ToneFace`（語氣圓臉）、`EmoFace`（表情臉）、`Bubble`、`Tag`。範例 `lessons/S2W04.tsx`；W03（`S2W03.tsx`）是抽出前的版本，先不動。

## 加配樂層／改編曲

- 編曲計畫在 `config/lessonEntry/musicPlan.ts`：`{ 頁號: [{ beat, layers }] }`，beat 是該頁開頭起算。層：`drums snare shaker bass pad melody counter pluck strum bell clap`。
- 規則：逐頁加一層（`autoPlan` 做這件事）；互動頁不寫項目；口訣頁只留 `bass clap pad`。
- 改音樂**內容**（旋律、和弦、混音比例）在 `lib/lessonEntry/music.ts`；改完要**通知 Cocos session**（它搬了一份，以 commit hash 為準）。

## 加環境動畫／新主題包

- 環境動畫在 `flow/Ambient.tsx`；位置用店面素材像素點換算（`BakeryScene.shopPt`）。**換主題包時要改點位**（煙囪口、櫥窗、門）。
- 新主題包見 THEME-KIT.md；場景版面（店面、前景擺放）在 `cuts/BakeryScene.tsx` 的 `LAYOUT`、`SHOP`；新主題建議複製成 `cuts/<主題>Scene.tsx`，並讓 `Base` 接受版面參數（目前 Base 綁定小熊麵包坊）。

## 已知限制（要擴充時留意）

- `Base`／`Ambient` 目前綁定小熊麵包坊的版面；換主題要抽成參數（量產前的第一個重構）。
- 已抽成範本：標題頁、排順序複習、目標完成、口訣、面板說明、結尾（`pages2.tsx`）；P1U-W14 全部用範本做成。**打名字**互動頁仍是 W13 專用（`steps.tsx` 的 Step2），要再用時請抽成範本。
- 動物語的注音字典沒收的字會用固定咕噥，字幕會標示；新課的用字要先掃一次缺字。
