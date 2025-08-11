let startTime = 0;
let timerRunning = false;
let bestTime = localStorage.getItem("bestTime");
let cheatFlag = false;

// DOM Elements
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

// ===== ランダム長文生成 =====
function generateRandomTOS(paragraphs = 50) {
  const words = [
    "本契約", "利用者", "サービス", "当社", "免責", "禁止事項", "責任", "損害賠償", "準拠法",
    "規約", "変更", "改定", "合意", "権利", "義務", "個人情報", "適用", "通知", "管轄裁判所",
    "契約期間", "更新", "終了", "第三者", "譲渡", "利用停止", "解除", "秘密保持", "準備",
    "定義", "条件", "遵守", "禁止", "違反", "同意", "判断", "承諾", "発効日", "有効期間",
    "その他", "桜井祐輔", "田中圭", "永野芽衣", "中居正広"
  ];

  let html = "";
  for (let i = 0; i < paragraphs; i++) {
    let sentenceCount = Math.floor(Math.random() * 5) + 3; // 3〜7文
    let paragraph = [];
    for (let j = 0; j < sentenceCount; j++) {
      let wordCount = Math.floor(Math.random() * 12) + 8; // 8〜20語
      let sentence = [];
      for (let k = 0; k < wordCount; k++) {
        let w = words[Math.floor(Math.random() * words.length)];
        sentence.push(w);
      }
      paragraph.push(sentence.join(" ") + "。");
    }
    html += `<p>${paragraph.join(" ")}</p>`;
  }
  return html;
}

// ===== 初期表示（ベストタイム） =====
if (bestTime) {
  bestTimeDisplay.textContent = `${bestTime} 秒`;
}

// ===== スタートボタン =====
startButton.addEventListener("click", () => {
  // 長文生成
  tosContainer.innerHTML = generateRandomTOS(80);

  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  tosContainer.scrollTop = 0;
  timeDisplay.textContent = "0.000 s";
  progressBar.style.width = "0%";
  statusDisplay.textContent = "計測中...";
  timerRunning = true;
  startTime = performance.now();
});

// ===== スクロール監視 =====
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

// ===== 再挑戦 =====
retryButton.addEventListener("click", () => {
  gameScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
});

// ===== ベストリセット =====
resetBestButton.addEventListener("click", () => {
  localStorage.removeItem("bestTime");
  bestTime = null;
  bestTimeDisplay.textContent = "—";
});

// ===== チート検出 =====
window.addEventListener("beforeunload", () => {
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

// ===== モーダル関連 =====
const howBtn = document.getElementById("howBtn");
const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("closeModal");

howBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

closeModalBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// モーダル外クリックで閉じる
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});

