// DOM取得
const screens = {
  menu: document.getElementById('menuScreen'),
  howto: document.getElementById('howToScreen'),
  game: document.getElementById('gameScreen')
};
const startBtnMenu = document.getElementById('startBtnMenu');
const howToBtn = document.getElementById('howToBtn');
const backMenuBtns = document.querySelectorAll('.backMenuBtn');
const restartBtn = document.getElementById('restartBtn');
const frame = document.getElementById('frame');
const content = document.getElementById('content');
const timeEl = document.getElementById('time');
const resultEl = document.getElementById('result');

// モーダル
const resultModal = document.getElementById('resultModal');
const modalResultText = document.getElementById('modalResultText');
const modalBackBtn = document.getElementById('modalBackBtn');

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

// --- 画面遷移 ---
function showScreen(name){
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}
startBtnMenu.addEventListener('click', () => {
  showScreen('game');
  startGame();
});
howToBtn.addEventListener('click', () => showScreen('howto'));
backMenuBtns.forEach(btn => btn.addEventListener('click', () => showScreen('menu')));
modalBackBtn.addEventListener('click', () => {
  resultModal.classList.remove('show');
  showScreen('menu');
});

// --- 利用規約生成 ---
function generateTOSChunk(chars = 2500){
  let text = "";
  while (text.length < chars) {
    text += sectionHeaders[Math.floor(Math.random()*sectionHeaders.length)] + "\n";
    const sentences = 3 + Math.floor(Math.random() * 5);
    for (let i = 0; i < sentences; i++) {
      const c = clauses[Math.floor(Math.random()*clauses.length)];
      text += "　" + c + "\n";
    }
    text += "\n";
  }
  return text;
}

// 初期ロード
function loadInitialTOS(){
  content.textContent = generateTOSChunk(4000);
}
loadInitialTOS();

// 無限スクロール
frame.addEventListener('scroll', () => {
  if (frame.scrollTop + frame.clientHeight >= frame.scrollHeight - 300) {
    content.textContent += generateTOSChunk();
  }
});

// --- ゲーム制御 ---
function enableScroll(enable){
  frame.style.pointerEvents = enable ? 'auto' : 'none';
}

function startGame(){
  gameRunning = true;
  remaining = DURATION;
  timeEl.textContent = remaining;
  resultEl.textContent = "結果: -";
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
  gameRunning = false;
  clearInterval(timerId);
  enableScroll(false);
  restartBtn.disabled = false;

  const totalChars = content.textContent.length;
  const visibleBottom = frame.scrollTop + frame.clientHeight;
  const ratio = Math.min(1, visibleBottom / frame.scrollHeight);
  const scrolledChars = Math.round(ratio * totalChars);

  // モーダルで結果表示
  modalResultText.textContent = `${scrolledChars.toLocaleString()} 文字スクロール！`;
  resultModal.classList.add('show');
}

restartBtn.addEventListener('click', () => {
  loadInitialTOS();
  frame.scrollTop = 0;
  resultEl.textContent = "結果: -";
  timeEl.textContent = DURATION;
});
