// script.js

let startTime = 0;
let timerRunning = false;
let bestTime = localStorage.getItem("bestTime");
let cheatFlag = false;

// DOM Elements
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const tryAgainButton = document.getElementById("try-again-btn");
const tosContainer = document.getElementById("tos-container");
const progressBar = document.getElementById("progress-bar");
const timeDisplay = document.getElementById("time");
const bestTimeDisplay = document.getElementById("best-time");
const resultTimeDisplay = document.getElementById("result-time");
const resultBestDisplay = document.getElementById("result-best");

// Show best time if available
if (bestTime) {
  bestTimeDisplay.textContent = `ベスト: ${bestTime} 秒`;
}

// Start game
startButton.addEventListener("click", () => {
  startScreen.style.display = "none";
  gameScreen.style.display = "block";
  tosContainer.scrollTop = 0;
  timerRunning = true;
  startTime = performance.now();
});

// Scroll tracking
tosContainer.addEventListener("scroll", () => {
  if (!timerRunning) return;
  const scrollTop = tosContainer.scrollTop;
  const scrollHeight = tosContainer.scrollHeight - tosContainer.clientHeight;
  const progress = (scrollTop / scrollHeight) * 100;
  progressBar.style.width = `${progress}%`;

  if (scrollTop >= scrollHeight - 5) {
    // reached bottom
    timerRunning = false;
    const endTime = performance.now();
    const elapsed = ((endTime - startTime) / 1000).toFixed(2);
    resultTimeDisplay.textContent = `${elapsed} 秒`;

    if (!bestTime || parseFloat(elapsed) < parseFloat(bestTime)) {
      bestTime = elapsed;
      localStorage.setItem("bestTime", bestTime);
    }
    resultBestDisplay.textContent = `ベスト: ${bestTime} 秒`;

    gameScreen.style.display = "none";
    resultScreen.style.display = "block";
  }
});

// Try again
tryAgainButton.addEventListener("click", () => {
  resultScreen.style.display = "none";
  startScreen.style.display = "block";
  bestTimeDisplay.textContent = bestTime
    ? `ベスト: ${bestTime} 秒`
    : "";
});

// Cheat detection
window.addEventListener("beforeunload", (e) => {
  if (timerRunning) {
    localStorage.setItem("cheated", "true");
  }
});

window.addEventListener("load", () => {
  if (localStorage.getItem("cheated") === "true") {
    alert("途中離脱が検出されました（チート扱い）");
    localStorage.removeItem("cheated");
  }
});
