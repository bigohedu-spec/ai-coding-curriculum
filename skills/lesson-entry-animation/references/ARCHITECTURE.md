# 程式架構

## 檔案地圖（gpt-clone）

```
docs/lesson-entry/<堂代號>/script.md, review-log.md   腳本與審稿紀錄（本機）
scripts/lesson-entry/                                工具腳本（本機）
  voice-lines/<堂代號>.json                          S 系列台詞（台詞唯一來源）
public/lesson-entry/
  kits/<主題>/                                       主題包素材（WebP＋meta.json：size、anchor＝腳底中心）
  animalese/                                        動物語音節素材
  voice/<堂代號>/<id>.mp3                            S 系列配音
src/components/lessonEntry/
  flow/LessonFlow.tsx      流程：音樂主時鐘、換頁（播完等 2 拍）、再看一次、製作列
  flow/toolkit.tsx         Stage、useClock、useAbsBeat、Spr、Base、groove、prog、snap、popScale、hop、scanOverflow
  flow/pages.tsx           makeTalkPage（說話頁）
  flow/pages2.tsx          makeTitlePage、makeSortPage、makeGoalPage、makeChantPage、makePanelsPage、makeEndPage
  flow/Sub.tsx             卡拉 OK 字幕（自動縮小、念到哪亮到哪）
  flow/Ambient.tsx         環境動畫
  flow/feedback.tsx        useFx＋FxLayer（光圈、跳字）、useTwoHands、useBeatSfx
  flow/sfx.ts              互動音效（tap 等）
  flow/DetKit.tsx          S 系列共用：makeScene、makeChoicePage、planOrder、HINT_AFTER、useSay、Bubble、Tag
  flow/StudioKit.tsx       S5（VS Code 風）共用：makeStudioChoice、useOp、useGuide、useIdleHint、KeyRow
  flow/<主題>.tsx           各主題場景元件（Det、Sea、Glyph、Factory、Studio…）
  lessons/index.ts         課程登記表（堂代號 → 頁清單、配樂、配音）
  lessons/<ID>.ts(x)       一堂課的頁清單
src/config/lessonEntry/
  musicPlan.ts             編曲計畫（autoPlan、MUSIC_STYLE）
  voice/<堂代號>.json       S 系列配音時間表（腳本產生，不手改）
  worksheetEntry.ts        學習單 id → 堂代號
src/lib/lessonEntry/
  music.ts                 合成配樂引擎（MusicStyle：bright、focus、detective、sea、studio）
  voiceLines.ts            makeVoice（S 系列排時間）
  animalese.ts             動物語引擎（tokenize、tokenTimes）
  englishSyllables.ts      英文名字切音節
  keyvoice.ts              鍵盤語（每顆鍵固定音高）
  useAudio.ts              AudioContext、旁白排程
src/pages/entry/play/[session].tsx   審稿頁
```

## 時間模型

- 單位是**拍**：100 BPM，1 拍＝0.6 秒。腳本、動作、旁白、字幕都用拍。
- `Music.beatNow()`＝音樂現在第幾拍（已扣輸出延遲）。`useClock()` 回傳 `b`＝音樂拍數 − 本頁開始拍數；頁內動作、字幕、旁白都讀 `b`。
- 場景晃動讀絕對拍數 `useAbsBeat()`，`groove(beat)` 回傳 hop／land／stretch／side／pulse（一拍 4 格）。
- 換頁：頁元件播完呼叫 `done(endBeat)`（`useStep` 自動處理），`LessonFlow` 等 2 個整拍後切換。互動頁在學生完成時呼叫 `done()`；換頁一律交給流程，頁內不用 `setTimeout`。

## 寫頁面

說話頁（設定即可）：

```tsx
makeTalkPage({
  len: 8,                                    // 內容長度（拍）
  cues: [cue("今天，我們要開麵包坊！", 0.5)],  // cue(文字, 開始拍, 每字拍數=0.25)；旁白＝字幕
  chars: [{ who: "rabbit", x: 22 }, { who: "bear", x: 50, pose: "cheer" }],
  sign: "麵包坊", voice: "rabbit",
})
```

特殊頁：

```tsx
export function MyPage({ A, ctx, done }: StepProps) {
  const CUES = [cue("…", 0.5)];
  const b = useStep(8, A, CUES, "rabbit", done);   // 排旁白、播完回報
  return (
    <Stage>
      <Base>…<Spr s={rabbitS("talk")} H={30} x={22} g={9.5} />…</Base>
      <Sub b={b} cues={CUES} />
    </Stage>
  );
}
```

- 舞台 100 × 56.25 cqw。`Spr` 的 `x`＝腳底水平位置、`g`＝腳底離底邊高度。
- 動作工具：`prog(b, 開始拍, 長度)`、`snap(p, 格數)`（兩格一動）、`popScale(p)`（擠壓彈出）、`hop(b, 週期, 高度)`。
- UI 元素（卡片、對話框、字幕）加 `data-ui`，角色道具加 `data-spr`，自檢才掃得到。

## S 系列頁面

```tsx
import VOICE from "@/config/lessonEntry/voice/S2-W03.json";
const VO = makeVoice(VOICE as unknown as Record<string, VLine>);
export const S2W03_VOICE = { base: "/lesson-entry/voice/S2-W03", ids: VO.ids }; // 登記到 lessons/index.ts 的 voice

const C1 = VO.seq(2.2, ["p1-hi", "p1-case"], 0.6);          // 依音檔長度接續排：第 2.2 拍開始、句間 0.6 拍
const b = useStep(VO.lastEnd(C1) + 1, A, C1, "clip", done);
const sp = VO.speaking(C1, b);                                // 誰在說話
VO.charBeat(C1[1], 9)                                         // 第 2 句第 9 個有聲字的拍數 → 動作對準關鍵字
A.sayClip("p3-ok")                                            // 互動頁立即說一句
```

- 有聲字索引＝台詞去掉 `，。！？、～：；` 與空白後的第幾個字；台詞改了就重算。
- 字幕：`<Sub font={DFONT} size={4} tight left={…} />`（`left`：左側有角色時字幕右移）。
- 一般頁 `makeScene(VO, 堂代號)`；選擇題頁 `makeChoicePage(VO, 堂代號, { intro, qs, opts, ok, no, hint, doneClip })`。範例 `lessons/S2W04.tsx`。

## 配樂

- `musicPlan.ts`：`{ 頁號: [{ beat, layers }] }`，beat 從該頁開頭起算。層：`drums snare shaker bass pad melody counter pluck strum bell clap`。
- 旋律、和弦、混音在 `lib/lessonEntry/music.ts`。Cocos 小遊戲有一份同曲的搬運版，改音樂內容要通知遊戲負責人。

## 環境動畫與場景

- 環境動畫在 `flow/Ambient.tsx`，點位依場景素材像素換算；換主題要改點位（煙囪口、窗、門）。
- 新主題的場景元件放 `flow/<主題>.tsx`，參考現有的 `Det.tsx`、`Sea.tsx`、`Studio.tsx`。
