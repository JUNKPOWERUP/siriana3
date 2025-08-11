let startTime = 0;
let timerRunning = false;
let bestTime = localStorage.getItem("bestTime");
let cheatFlag = false;

// DOM Elements (HTMLに合わせたID)
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const startButton = document.getElementById("startBtn");
const retryButton = document.getElementById("retryBtn");
const resetBestButton = document.getElementById("resetBest");

const tosContainer = document.getElementById("doc");
const progressBar = document.getElementById("progress").querySelector("span");
const timeDisplay = document.getElementById("timer");
const bestTimeDisplay = document.getElementById("best");
const statusDisplay = document.getElementById("status");

// 初期表示（ベストタイム）
if (bestTime) {
  bestTimeDisplay.textContent = `${bestTime} 秒`;
}

// スタートボタン
startButton.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  tosContainer.scrollTop = 0;
  timeDisplay.textContent = "0.000 s";
  progressBar.style.width = "0%";
  statusDisplay.textContent = "計測中...";
  timerRunning = true;
  startTime = performance.now();
});

// スクロール監視
tosContainer.addEventListener("scroll", () => {
  if (!timerRunning) return;

  const scrollTop = tosContainer.scrollTop;
  const scrollHeight = tosContainer.scrollHeight - tosContainer.clientHeight;
  const progress = (scrollTop / scrollHeight) * 100;
  progressBar.style.width = `${progress}%`;

  // タイム更新
  const now = performance.now();
  const elapsed = ((now - startTime) / 1000).toFixed(3);
  timeDisplay.textContent = `${elapsed} s`;

  // 一番下に到達
  if (scrollTop >= scrollHeight - 5) {
    timerRunning = false;
    statusDisplay.textContent = "ゴール！";

    // ベストタイム更新
    if (!bestTime || parseFloat(elapsed) < parseFloat(bestTime)) {
      bestTime = elapsed;
      localStorage.setItem("bestTime", bestTime);
    }
    bestTimeDisplay.textContent = `${bestTime} 秒`;
  }
});

// 再挑戦
retryButton.addEventListener("click", () => {
  gameScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
});

// ベストリセット
resetBestButton.addEventListener("click", () => {
  localStorage.removeItem("bestTime");
  bestTime = null;
  bestTimeDisplay.textContent = "—";
});

// チート検出（ページ離脱中に計測していたらフラグ）
window.addEventListener("beforeunload", () => {
  if (timerRunning) {
    localStorage.setItem("cheated", "true");
  }
});

// ページロード時にチート履歴があれば警告
window.addEventListener("load", () => {
  if (localStorage.getItem("cheated") === "true") {
    alert("途中離脱が検出されました（チート扱い）");
    localStorage.removeItem("cheated");
  }
});
