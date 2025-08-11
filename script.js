const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const timeEl = document.getElementById('time');
const resultEl = document.getElementById('result');
const frame = document.getElementById('frame');
const content = document.getElementById('content');

let gameRunning = false;
let timerId = null;
let remaining = 10;
const DURATION = 10;

const clauses = [
  "本サービスは、提供する機能及び付随するサービスを利用者に提供します。",
  "利用者は本規約に従い、当社の定める方法で利用するものとします。",
  "当社は予告なく本サービスの全部または一部を変更・停止できます。",
  "利用者は自己責任で利用し、損害について自身で対処するものとします。",
  "当社は利用者間のトラブルに介入しませんが、法令に基づく要請があれば協力します。",
  "本サービス内の権利は、当社または権利者に帰属します。",
  "利用者は事前承諾なく商業利用してはなりません。",
  "登録情報は適切に管理しますが、安全性を保証するものではありません。",
  "本規約にない事項は当社の定めによります。",
  "紛争は東京地方裁判所を第一審専属管轄とします。"
];
const sectionHeaders = [
  "第1条（適用）","第2条（定義）","第3条（サービス提供）","第4条（利用者の責務）",
  "第5条（禁止事項）","第6条（知的財産権）","第7条（免責）","第8条（個人情報）",
  "第9条（規約変更）","第10条（準拠法）"
];

function generateLongTOS(targetChars = 15000) {
  let text = "";
  while (text.length < targetChars) {
    text += sectionHeaders[Math.floor(Math.random()*sectionHeaders.length)] + "\n";
    const sentences = 4 + Math.floor(Math.random() * 6);
    for (let i = 0; i < sentences; i++) {
      const c = clauses[Math.floor(Math.random()*clauses.length)];
      text += "　" + c + "\n";
    }
    text += "\n";
  }
  return text;
}

content.textContent = generateLongTOS();

function enableScroll(enable){
  frame.style.pointerEvents = enable ? 'auto' : 'none';
}

function startGame(){
  if (gameRunning) return;
  gameRunning = true;
  remaining = DURATION;
  timeEl.textContent = remaining;
  resultEl.textContent = "結果: -";
  startBtn.disabled = true;
  restartBtn.disabled = true;
  frame.scrollTop = 0;
  enableScroll(true);

  timerId = setInterval(() => {
    remaining--;
    timeEl.textContent = remaining;
    if (remaining <= 0) endGame();
  }, 1000);
}

function endGame(){
  if (!gameRunning) return;
  gameRunning = false;
  clearInterval(timerId);
  enableScroll(false);
  startBtn.disabled = false;
  restartBtn.disabled = false;

  const totalChars = content.textContent.length;
  const visibleBottom = frame.scrollTop + frame.clientHeight;
  const ratio = Math.min(1, visibleBottom / frame.scrollHeight);
  const scrolledChars = Math.round(ratio * totalChars);

  resultEl.textContent = `結果: ${scrolledChars.toLocaleString()} 文字`;
}

function restartGame(){
  content.textContent = generateLongTOS();
  frame.scrollTop = 0;
  resultEl.textContent = "結果: -";
  timeEl.textContent = DURATION;
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
enableScroll(false);
