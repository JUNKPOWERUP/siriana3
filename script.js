// 画面管理
const screens = {
  opening: document.getElementById("openingScreen"),
  menu: document.getElementById("menuScreen"),
  howTo: document.getElementById("howToScreen"),
  game: document.getElementById("gameScreen")
};
const tosContent = document.getElementById("tosContent");
const timerEl = document.getElementById("timer");
const resultModal = document.getElementById("resultModal");
const resultText = document.getElementById("resultText");

let scrollCount = 0;
let gameTimer = null;
let timeLeft = 10;

// 利用規約のサンプル文生成
function generateTOSChunk() {
  let text = "";
  for (let i = 0; i < 50; i++) {
    text += "本利用規約は、当社が提供するサービスの利用条件を定めるものです。" +
            "利用者は、本規約に同意のうえサービスを利用するものとします。\n";
  }
  return text;
}

// 無限スクロール
function setupInfiniteScroll() {
  tosContent.innerText = generateTOSChunk();
  tosContent.addEventListener("scroll", () => {
    const bottom = tosContent.scrollHeight - tosContent.scrollTop <= tosContent.clientHeight + 50;
    if (bottom) {
      tosContent.innerText += generateTOSChunk();
    }
  });
}

// ゲーム開始
function startGame() {
  scrollCount = 0;
  timeLeft = 10;
  tosContent.scrollTop = 0;
  tosContent.innerText = "";
  setupInfiniteScroll();

  // スクロール計測
  tosContent.addEventListener("scroll", countScroll);

  // タイマー開始
  timerEl.innerText = timeLeft;
  gameTimer = setInterval(() => {
    timeLeft--;
    timerEl.innerText = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// スクロール距離計測（大まかに）
function countScroll() {
  scrollCount += 5; // 仮に1回のスクロールで5文字分として加算
}

// ゲーム終了
function endGame() {
  clearInterval(gameTimer);
  tosContent.removeEventListener("scroll", countScroll);
  resultText.innerText = `スクロールした文字数: 約${scrollCount}文字`;
  resultModal.classList.add("show");
}

// 画面切り替え
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
}

// イベント
document.getElementById("openingScreen").addEventListener("click", () => {
  showScreen("menu");
});
document.getElementById("startBtn").addEventListener("click", () => {
  showScreen("game");
  startGame();
});
document.getElementById("howToBtn").addEventListener("click", () => {
  showScreen("howTo");
});
document.getElementById("backToMenuBtn").addEventListener("click", () => {
  showScreen("menu");
});
document.getElementById("backToMenuFromResult").addEventListener("click", () => {
  resultModal.classList.remove("show");
  showScreen("menu");
});
