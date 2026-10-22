// Offline pronunciation review queue. Text recognition is never phonetic approval.
// node scripts/lesson-entry/pronunciation-audit.mjs S2-W11
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
const require=createRequire(import.meta.url),ffmpeg=require('ffmpeg-static');
const code=process.argv[2]||'S2-W11';
if(!/^[A-Z0-9-]+$/.test(code))throw new Error('Invalid lesson code');
const V=JSON.parse(fs.readFileSync(`src/config/lessonEntry/voice/${code}.json`,'utf8'));
const lexicon=[
 {word:'情報',bopomofo:'ㄑㄧㄥˊ ㄅㄠˋ',pinyin:'qing2 bao4',required:true,reason:'負責人回報 p5-check 讀音有問題，需局部聽辨'},
 {word:'鑄',bopomofo:'ㄓㄨˋ',pinyin:'zhu4',required:true,reason:'負責人回報誤讀；不因聽寫文字相同而自動通過',source:'https://dict.mini.moe.edu.tw/SearchIndex/word_detail?breadcrumbs=Search_%E9%91%84_one&dictSearchField=%E9%91%84&wordID=D0002433'},
 {word:'巨典',bopomofo:'ㄐㄩˋ ㄉㄧㄢˇ',pinyin:'ju4 dian3',reason:'故事專有名稱，避免只看 ASR 同音字'},
 {word:'成形室',bopomofo:'ㄔㄥˊ ㄒㄧㄥˊ ㄕˋ',pinyin:'cheng2 xing2 shi4',reason:'關卡名稱'},
 {word:'聖劍',bopomofo:'ㄕㄥˋ ㄐㄧㄢˋ',pinyin:'sheng4 jian4',reason:'關鍵道具名稱'},
 {word:'附魔',bopomofo:'ㄈㄨˋ ㄇㄛˊ',pinyin:'fu4 mo2',reason:'較少見的故事詞彙'}
];
const out=path.resolve(`public/lesson-entry/_audition/${code}-v2`),segments=path.join(out,'segments');
fs.mkdirSync(segments,{recursive:true});
const hash=buf=>crypto.createHash('sha256').update(buf).digest('hex');
const norm=s=>s.replace(/[，。！？、～：；,.!?:;\s]/g,'');
const queue=[];
for(const [id,v] of Object.entries(V)){
 const source=path.resolve(`public/lesson-entry/voice/${code}/${id}.mp3`),digest=hash(fs.readFileSync(source)),plain=norm(v.text);
 for(const rule of lexicon){
  let at=plain.indexOf(rule.word);
  while(at!==-1){
   const start=Math.max(0,(v.at[at]??0)-.5),end=Math.min(v.dur,(v.at[at+rule.word.length]??v.dur)+.5);
   const file=`${id}-${at}.mp3`;
   execFileSync(ffmpeg,['-hide_banner','-loglevel','error','-y','-ss',String(start),'-i',source,'-t',String(Math.max(.4,end-start)),'-codec:a','libmp3lame','-q:a','3',path.join(segments,file)]);
   queue.push({id,word:rule.word,bopomofo:rule.bopomofo,pinyin:rule.pinyin,reason:rule.reason,source:rule.source,required:!!rule.required,sourceSha256:digest,text:v.text,start,end,excerpt:`segments/${file}`,phoneticStatus:'pending-human-or-calibrated-acoustic-assessment'});
   at=plain.indexOf(rule.word,at+rule.word.length);
  }
 }
}
fs.writeFileSync(path.join(out,'pronunciation-queue.json'),JSON.stringify({lesson:code,checkedBy:'offline inventory only; does not infer actual phonemes',queue},null,2));
fs.mkdirSync(`docs/lesson-entry/${code}/audio-v2`,{recursive:true});
fs.writeFileSync(`docs/lesson-entry/${code}/audio-v2/pronunciation-queue.json`,JSON.stringify(queue,null,2));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const audio=src=>`<audio controls preload="none" src="${esc(src)}"></audio>`;
const rows=queue.map(q=>`<article><h3>${esc(q.word)}　${esc(q.bopomofo)} <small>${esc(q.pinyin)}</small></h3><p>${esc(q.text)}</p>${audio(q.excerpt)}<p class="muted">${esc(q.reason)}；前後各保留約半秒，完整句請回動畫聽。</p><button data-key="${esc(q.sourceSha256+':'+q.start)}" data-result="accepted">我已聽過：讀音正確</button> <button data-key="${esc(q.sourceSha256+':'+q.start)}" data-result="rejected">需要重錄</button><output></output></article>`).join('');
const keyClips=['p2-illusion','p3-demand','p3-warn','p3-sword'];
const keyRows=keyClips.filter(id=>V[id]).map(id=>`<article><h3>${id==='p3-sword'?'旁白 George：「鑄」重錄':'巨典 onyx＋W10 同款迴音'}</h3><p>${esc(V[id].text)}</p>${audio(`/lesson-entry/voice/${code}/${id}.mp3?v=${hash(fs.readFileSync(`public/lesson-entry/voice/${code}/${id}.mp3`)).slice(0,12)}`)}</article>`).join('');
fs.writeFileSync(path.join(out,'index.html'),`<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${code} 配音與讀音審聽</title><style>body{font-family:"Noto Sans TC","Microsoft JhengHei",sans-serif;background:#101821;color:#f0e5c8;max-width:960px;margin:auto;padding:28px;line-height:1.7}article{background:#1d2b34;border:1px solid #65746a;padding:18px;margin:14px 0;border-radius:8px}h1,h2,h3{color:#e7c07d}audio{width:min(100%,600px)}button{font:inherit;padding:8px;background:#e7c07d;border:0;border-radius:4px;cursor:pointer}a{color:#a3d3bd}.muted,small{color:#b7c0b7}output{display:block;color:#a3d3bd;margin-top:8px}</style><h1>${code} 配音與讀音審聽</h1><p>巨典比照 W10：onyx、降兩個半音、暗色迴音。旁白保留 George；只重錄含「鑄」的那句，其他 29 句音檔完全相同。</p><h2>W10 角色聲音參考</h2>${audio('w10-boss-reference.mp3')}<h2>這次修改的四句</h2>${keyRows}<h2>舊版「鑄」讀音對照</h2>${audio('before-p3-sword.mp3')}<p><a href="/entry/play/${code}">回完整動畫</a></p><h2>字詞局部試聽（${queue.length} 處）</h2><p>正確轉成文字不代表發音正確。這些項目不會因聽寫分數高而自動通過；請確認聲母、韻母與聲調。審聽結果只存在這個瀏覽器，按音檔雜湊記錄，換音檔即須重新審聽。</p>${rows}<script>for(const b of document.querySelectorAll('button[data-result]')){const article=b.closest('article'),output=article.querySelector('output');const key='pronunciation-review:'+b.dataset.key;const show=()=>{const r=localStorage.getItem(key);output.textContent=r==='accepted'?'本機審聽紀錄：讀音正確':r==='rejected'?'本機審聽紀錄：需要重錄':'尚未確認讀音';};b.onclick=()=>{localStorage.setItem(key,b.dataset.result);show();};show();}</script></html>`);
console.log(JSON.stringify({lesson:code,items:queue.length,required:queue.filter(q=>q.required).map(q=>({id:q.id,word:q.word,start:q.start,end:q.end})),verdict:'not automatically approved',page:`/lesson-entry/_audition/${code}-v2/index.html`},null,2));
