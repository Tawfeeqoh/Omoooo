// ===================================  
// LERN³ - Game Engine v2.0  
// ALL CORRECTIONS APPLIED
// ===================================  

console.log("🚀 LERN³ v2.0 Starting...");

// ================================  
// Game State  
// ================================  
const gameState = {
  currentLevel: 0,
  completedLevels: [],
  puzzles: [],
  userAnswer: [],
  availableLetters: [],
  totalLevels: 10,
  hasSeenTutorial: false,
  
  runStartTime: null,
  attemptsTotal: 0,
  correctTotal: 0,
  bestStreak: 0,
  currentStreak: 0,
  
  hintUsedThisLevel: false,
  hintsUsedTotal: 0
};

const FIXED_TILE_COUNT = 15;

const elements = {};

// ================================  
// Utility Functions  
// ================================  
function $(id) {
  return document.getElementById(id);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ================================  
// Audio  
// ================================  
let audioCtx = null;

function ensureAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playTone(freq, duration = 0.08, gain = 0.08, type = "sine") {
  try {
    ensureAudio();
    const ctx = audioCtx;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.value = gain;

    osc.connect(g);
    g.connect(ctx.destination);

    const now = ctx.currentTime;
    osc.start(now);
    osc.stop(now + duration);
  } catch (e) {
    // ignore
  }
}

function sfxClick() { playTone(520, 0.045, 0.05, "square"); }
function sfxCorrect() { 
  playTone(880, 0.08, 0.065, "triangle");
  setTimeout(() => playTone(1320, 0.08, 0.045, "sine"), 80);
}
function sfxWrong() { playTone(170, 0.08, 0.065, "sawtooth"); }
function sfxHint() { playTone(660, 0.06, 0.05, "sine"); }
function sfxShuffle() { playTone(440, 0.04, 0.04, "sine"); }

// ================================  
// Toast  
// ================================  
function showToast(message, type = 'info', duration = 2500) {
  const container = $("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ================================  
// Confetti  
// ================================  
let confettiAnimation = null;

function startConfetti(durationMs = 1200) {
  const canvas = $("confetti-canvas");
  if (!canvas) return;

  canvas.classList.remove("hidden");
  const ctx = canvas.getContext("2d");
  const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));

  const resize = () => {
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  resize();
  window.addEventListener("resize", resize, { passive: true });

  const colors = ["#2DD4BF", "#0EA5E9", "#A78BFA", "#F472B6", "#FBBF24"];
  const pieces = Array.from({ length: 100 }, () => ({
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * 100,
    r: 2 + Math.random() * 4,
    vx: (Math.random() - 0.5) * 6,
    vy: 2 + Math.random() * 4,
    c: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.3
  }));

  const start = performance.now();

  function draw(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04;
      p.rot += p.vr;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.r * 2, -p.r, p.r * 4, p.r * 2);
      ctx.restore();

      if (p.y > window.innerHeight + 50) {
        p.x = Math.random() * window.innerWidth;
        p.y = -20 - Math.random() * 100;
        p.vy = 2 + Math.random() * 4;
      }
    });

    if (elapsed < durationMs) {
      confettiAnimation = requestAnimationFrame(draw);
    } else {
      canvas.classList.add("hidden");
      window.removeEventListener("resize", resize);
    }
  }

  confettiAnimation = requestAnimationFrame(draw);
}

// ================================  
// Init  
// ================================  
async function init() {
  try {
    console.log("🎮 Initializing LERN³ v2.0...");

    cacheElements();
    loadPuzzles();
    loadProgress();

    updateLoadingText("Preparing game...");
    await sleep(400);

    updateLoadingText("Loading assets...");
    await preloadImages();

    updateLoadingText("Ready!");
    await sleep(300);

    setupEventListeners();

    hideLoadingScreen();
    showScreen(gameState.hasSeenTutorial ? "home" : "tutorial");

  } catch (err) {
    console.error("❌ Initialization error:", err);
    hideLoadingScreen();
    showScreen("home");
    showToast("Something went wrong. Please refresh.", "error");
  }
}

// ================================  
// DOM Cache  
// ================================  
function cacheElements() {
  elements.loadingScreen = $("loading-screen");
  elements.loadingText = $("loading-text");
  elements.loadingProgressBar = $("loading-progress-bar");

  elements.homeScreen = $("home-screen");
  elements.tutorialScreen = $("tutorial-screen");
  elements.gameScreen = $("game-screen");
  elements.explanationScreen = $("explanation-screen");
  elements.completionScreen = $("completion-screen");

  elements.startBtn = $("start-btn");
  elements.continueBtn = $("continue-btn");
  elements.currentLevelNum = $("current-level-num");
  elements.homeProgress = $("home-progress");
  elements.homeProgressBar = $("home-progress-bar");

  elements.tutorialNextBtn = $("tutorial-next-btn");

  elements.backBtn = $("back-btn");
  elements.levelNumber = $("level-number");
  elements.progressText = $("progress-text");
  elements.difficultyBadge = $("difficulty-badge");

  elements.image1 = $("image1");
  elements.image2 = $("image2");
  elements.image3 = $("image3");
  elements.image4 = $("image4");

  elements.answerSlots = $("answer-slots");
  elements.letterTiles = $("letter-tiles");
  elements.clearBtn = $("clear-btn");
  elements.shuffleBtn = $("shuffle-btn");
  elements.hintBtn = $("hint-btn");
  elements.submitBtn = $("submit-btn");

  elements.explanationWord = $("explanation-word");
  elements.explanationText = $("explanation-text");
  elements.nextLevelBtn = $("next-level-btn");

  elements.conceptList = $("concept-list");
  elements.playAgainBtn = $("play-again-btn");
  elements.shareBtn = $("share-btn");
  elements.emailInput = $("email-input");
  elements.emailSubmitBtn = $("email-submit-btn");

  elements.statsTime = $("stat-time");
  elements.statsAttempts = $("stat-attempts");
  elements.statsAccuracy = $("stat-accuracy");
  elements.statsStreak = $("stat-streak");
}

// ================================  
// Loading  
// ================================  
function updateLoadingText(text) {
  if (elements.loadingText) {
    elements.loadingText.textContent = text;
  }
}

function hideLoadingScreen() {
  if (elements.loadingScreen) {
    elements.loadingScreen.classList.remove("active");
  }
}

// ================================  
// PUZZLES  
// ================================  
function loadPuzzles() {
  console.log("📚 Loading puzzles...");

  gameState.puzzles = [
    {
      id: 1,
      word: "WALLET",
      images: [
        "https://cdn.pixabay.com/photo/2011/03/21/10/40/purse-5647_1280.jpg",
        "https://cdn.pixabay.com/photo/2017/03/07/23/34/wallet-2125548_1280.jpg",
        "https://cdn.pixabay.com/photo/2020/12/16/10/50/wallet-5836312_1280.jpg",
        "https://cdn.pixabay.com/photo/2021/05/04/06/34/kaizen-wallet-6227840_1280.jpg"
      ],
      explanation: "A wallet is where your digital money and crypto keys are stored — like a bank app, but you control everything."
    },
    {
      id: 2,
      word: "GAS",
      images: [
        "https://cdn.pixabay.com/photo/2022/02/07/15/21/fuel-6999637_1280.jpg",
        "https://cdn.pixabay.com/photo/2020/03/28/22/53/petrol-stations-4978823_1280.jpg",
        "https://cdn.pixabay.com/photo/2010/12/13/10/05/appliance-2256_1280.jpg",
        "https://cdn.pixabay.com/photo/2022/04/02/15/07/gas-7107185_1280.jpg"
      ],
      explanation: "Gas is the small fee you pay to process blockchain transactions — like paying for fuel so your car can move."
    },
    {
      id: 3,
      word: "KEYS",
      images: [
        "https://cdn.pixabay.com/photo/2017/10/01/07/29/key-2804482_1280.png",
        "https://cdn.pixabay.com/photo/2018/07/01/13/28/access-3509498_1280.jpg",
        "https://cdn.pixabay.com/photo/2021/11/25/10/38/keys-6823260_1280.jpg",
        "https://cdn.pixabay.com/photo/2014/11/10/18/07/keys-525732_1280.jpg"
      ],
      explanation: "Your private key = your secret password. Your public key = your wallet address. Never share your private key."
    },
    {
      id: 4,
      word: "CHAIN",
      images: [
        "https://cdn.pixabay.com/photo/2020/02/03/13/13/connection-4815645_1280.jpg",
        "https://cdn.pixabay.com/photo/2015/09/19/20/54/chains-947713_1280.jpg",
        "https://cdn.pixabay.com/photo/2018/06/17/20/35/chain-3481377_1280.jpg",
        "https://cdn.pixabay.com/photo/2017/08/06/12/15/chain-2591962_1280.jpg"
      ],
      explanation: "A blockchain is literally a chain of blocks linked together — once added, you can't change the old ones."
    },
    {
      id: 5,
      word: "BLOCK",
      images: [
        "https://cdn.pixabay.com/photo/2021/12/29/19/27/bricks-6902606_1280.jpg",
        "https://cdn.pixabay.com/photo/2016/11/19/14/26/bricks-1839553_1280.jpg",
        "https://cdn.pixabay.com/photo/2014/02/05/12/23/brick-258938_1280.jpg",
        "https://cdn.pixabay.com/photo/2022/01/02/12/34/bricks-6909999_1280.jpg"
      ],
      explanation: "A block is a container of transactions. Blocks stack to form the blockchain — like pages in a permanent record book."
    },
    {
      id: 6,
      word: "MINT",
      images: [
        "https://cdn.pixabay.com/photo/2020/03/05/16/43/mint-4904876_1280.jpg",
        "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=400&q=80",
        "https://cdn.pixabay.com/photo/2020/05/27/22/49/mint-5229226_1280.jpg",
        "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80"
      ],
      explanation: "Minting means creating something new on the blockchain — like generating a new NFT or coin."
    },
    {
      id: 7,
      word: "NODE",
      images: [
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80",
        "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400&q=80",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
        "https://cdn.pixabay.com/photo/2016/04/18/15/38/elastic-1336723_1280.jpg"
      ],
      explanation: "A node is a computer that stores blockchain data and validates transactions. More nodes = more decentralized network."
    },
    {
      id: 8,
      word: "HASH",
      images: [
        "https://cdn.pixabay.com/photo/2018/11/26/07/46/hashtag-3838907_1280.png",
        "https://cdn.pixabay.com/photo/2015/10/04/08/08/blog-970723_1280.jpg",
        "https://cdn.pixabay.com/photo/2017/12/05/08/32/analytics-2998837_1280.jpg",
        "https://cdn.pixabay.com/photo/2016/01/07/00/06/nohate-1125176_1280.jpg"
      ],
      explanation: "A hash is a unique digital fingerprint of data. Even a tiny change produces a completely different hash."
    },
    {
      id: 9,
      word: "SWAP",
      images: [
        "https://cdn.pixabay.com/photo/2018/08/29/17/07/ecommerce-3640321_1280.jpg",
        "https://cdn.pixabay.com/photo/2014/10/18/20/25/railway-493665_1280.jpg",
        "https://cdn.pixabay.com/photo/2016/11/19/20/55/apples-1841132_1280.jpg",
        "https://cdn.pixabay.com/photo/2014/12/04/02/53/give-and-take-556151_1280.jpg"
      ],
      explanation: "Swapping is exchanging one currency for another — like trading money, but on the blockchain with no bank needed."
    },
    {
      id: 10,
      word: "BRIDGE",
      images: [
        "https://cdn.pixabay.com/photo/2024/05/31/12/16/bridge-8800485_1280.jpg",
        "https://cdn.pixabay.com/photo/2020/06/18/11/27/landscape-5313115_1280.jpg",
        "https://cdn.pixabay.com/photo/2015/04/19/21/34/park-730337_1280.jpg",
        "https://cdn.pixabay.com/photo/2019/10/15/18/10/bridge-4552501_1280.jpg"
      ],
      explanation: "A bridge connects two blockchains and lets you move assets between them — like crossing from one city to another."
    }
  ];

  gameState.totalLevels = gameState.puzzles.length;
  console.log(`✅ Loaded ${gameState.totalLevels} puzzles`);
}

// ================================  
// Progress  
// ================================  
function loadProgress() {
  try {
    const saved = localStorage.getItem("lern3_progress");
    if (!saved) return;

    const progress = JSON.parse(saved);
    gameState.completedLevels = progress.completedLevels || [];
    gameState.currentLevel = typeof progress.currentLevel === "number" ? progress.currentLevel : 0;
    gameState.hasSeenTutorial = Boolean(progress.hasSeenTutorial);
    gameState.bestStreak = progress.bestStreak || 0;

    console.log("✅ Progress loaded");
  } catch (e) {
    console.warn("⚠️ Could not load progress:", e);
  }
}

function saveProgress() {
  try {
    const progress = {
      completedLevels: gameState.completedLevels,
      currentLevel: gameState.currentLevel,
      hasSeenTutorial: gameState.hasSeenTutorial,
      bestStreak: gameState.bestStreak
    };
    localStorage.setItem("lern3_progress", JSON.stringify(progress));
  } catch (e) {
    console.warn("⚠️ Could not save progress:", e);
  }
}

// ================================  
// Image Preloading  
// ================================  
async function preloadImages() {
  const promises = [];
  let loaded = 0;
  const total = gameState.puzzles.reduce((acc, p) => acc + p.images.length, 0);

  gameState.puzzles.forEach(level => {
    level.images.forEach(src => {
      promises.push(
        new Promise(resolve => {
          const img = new Image();
          img.onload = () => {
            loaded++;
            const progress = (loaded / total) * 100;
            if (elements.loadingProgressBar) {
              elements.loadingProgressBar.style.width = `${progress}%`;
            }
            resolve(true);
          };
          img.onerror = () => {
            loaded++;
            const progress = (loaded / total) * 100;
            if (elements.loadingProgressBar) {
              elements.loadingProgressBar.style.width = `${progress}%`;
            }
            resolve(true);
          };
          img.src = src;
        })
      );
    });
  });

  await Promise.all(promises);
  console.log("✅ All images preloaded");
}

// ================================  
// Screen Management  
// ================================  
function showScreen(screenName) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const screen = $(`${screenName}-screen`);
  if (!screen) return;
  
  screen.classList.add("active");

  if (screenName === "home") {
    updateHomeProgress();
  } else if (screenName === "game") {
    loadLevel(gameState.currentLevel);
  } else if (screenName === "completion") {
    renderCompletionStats();
    showCompletionSummary();
  }
}

// ================================  
// Home Screen  
// ================================  
function updateHomeProgress() {
  const completed = gameState.completedLevels.length;
  const total = gameState.totalLevels;
  const percentage = total ? (completed / total) * 100 : 0;

  elements.homeProgress.textContent = `${completed}/${total}`;
  elements.homeProgressBar.style.width = `${percentage}%`;

  if (completed > 0 && completed < total) {
    elements.startBtn.style.display = "none";
    elements.continueBtn.style.display = "flex";
    elements.currentLevelNum.textContent = (gameState.currentLevel + 1).toString();
  } else {
    elements.startBtn.style.display = "flex";
    elements.continueBtn.style.display = "none";
  }
}

// ================================  
// Difficulty  
// ================================  
function getDifficultyForLevel(levelIndex) {
  const n = levelIndex + 1;
  if (n >= 8) return { key: "hard", label: "HARD" };
  if (n >= 5) return { key: "medium", label: "MEDIUM" };
  return { key: "easy", label: "EASY" };
}

function applyDifficultyBadge(levelIndex) {
  const diff = getDifficultyForLevel(levelIndex);
  elements.difficultyBadge.className = "difficulty " + diff.key;
  elements.difficultyBadge.textContent = diff.label;
}

// ================================  
// Level Loading  
// ================================  
async function loadLevel(levelIndex) {
  if (levelIndex >= gameState.puzzles.length) {
    showScreen("completion");
    return;
  }

  const puzzle = gameState.puzzles[levelIndex];

  if (!gameState.runStartTime) {
    gameState.runStartTime = Date.now();
  }

  gameState.hintUsedThisLevel = false;

  elements.levelNumber.textContent = (levelIndex + 1).toString();
  elements.progressText.textContent = `${levelIndex + 1}/${gameState.totalLevels}`;

  applyDifficultyBadge(levelIndex);

  elements.hintBtn.disabled = false;
  elements.hintBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 9V15M10 5H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
    <span>Hint</span>
  `;

  elements.image1.src = puzzle.images[0];
  elements.image2.src = puzzle.images[1];
  elements.image3.src = puzzle.images[2];
  elements.image4.src = puzzle.images[3];

  gameState.userAnswer = [];
  elements.submitBtn.disabled = true;
  elements.answerSlots.innerHTML = "";
  elements.letterTiles.innerHTML = "";

  setupAnswerSlots(puzzle.word.length);
  setupLetterTiles(puzzle.word);
}

// ================================  
// Answer Slots  
// ================================  
function setupAnswerSlots(length) {
  for (let i = 0; i < length; i++) {
    const slot = document.createElement("div");
    slot.className = "answer-slot";
    slot.dataset.index = String(i);
    elements.answerSlots.appendChild(slot);
  }
}

// ================================  
// Letter Tiles  
// ================================  
function setupLetterTiles(word) {
  const wordLetters = word.split("");
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const distractors = [];
  const numDistractors = FIXED_TILE_COUNT - wordLetters.length;

  while (distractors.length < numDistractors) {
    const letter = alphabet[Math.floor(Math.random() * alphabet.length)];
    if (!wordLetters.includes(letter) && !distractors.includes(letter)) {
      distractors.push(letter);
    }
  }

  const allLetters = [...wordLetters, ...distractors];
  gameState.availableLetters = shuffleArray(allLetters);

  renderLetterTiles();
}

function renderLetterTiles() {
  elements.letterTiles.innerHTML = "";
  
  const wordLength = gameState.puzzles[gameState.currentLevel].word.length;
  const tileSize = wordLength > 6 ? 'small' : 'normal';
  
  gameState.availableLetters.forEach((letter, index) => {
    const tile = document.createElement("button");
    tile.className = "letter-tile";
    if (tileSize === 'small') {
      tile.style.width = "48px";
      tile.style.height = "56px";
      tile.style.fontSize = "1.5rem";
    }
    tile.textContent = letter;
    tile.dataset.index = String(index);
    tile.dataset.letter = letter;
    
    const usedIndex = gameState.userAnswer.findIndex(a => a.tileIndex === index);
    if (usedIndex !== -1) {
      tile.classList.add("used");
    }
    
    elements.letterTiles.appendChild(tile);
  });
}

// ================================  
// Shuffle  
// ================================  
function shuffleArray(a) {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function shuffleLetters() {
  sfxShuffle();
  
  const tiles = elements.letterTiles.querySelectorAll(".letter-tile");
  tiles.forEach(tile => tile.classList.add("shuffle-animate"));
  
  setTimeout(() => {
    gameState.availableLetters = shuffleArray(gameState.availableLetters);
    renderLetterTiles();
  }, 200);
}

// ================================  
// Letter Tap  
// ================================  
function handleLetterTap(letter, tileIndex) {
  const puzzle = gameState.puzzles[gameState.currentLevel];
  if (gameState.userAnswer.length >= puzzle.word.length) return;

  sfxClick();

  gameState.userAnswer.push({ letter, tileIndex });
  updateAnswerSlots();

  const tile = elements.letterTiles.querySelector(`[data-index="${tileIndex}"]`);
  if (tile) tile.classList.add("used");

  elements.submitBtn.disabled = (gameState.userAnswer.length !== puzzle.word.length);
}

function updateAnswerSlots() {
  const slots = elements.answerSlots.querySelectorAll(".answer-slot");
  slots.forEach((slot, idx) => {
    const entry = gameState.userAnswer[idx];
    if (entry) {
      slot.textContent = entry.letter;
      slot.classList.add("filled");
    } else {
      slot.textContent = "";
      slot.classList.remove("filled", "correct", "wrong");
    }
  });
}

function clearAnswer() {
  sfxClick();

  gameState.userAnswer.forEach(item => {
    const tile = elements.letterTiles.querySelector(`[data-index="${item.tileIndex}"]`);
    if (tile) tile.classList.remove("used");
  });

  gameState.userAnswer = [];
  updateAnswerSlots();
  elements.submitBtn.disabled = true;
}

// ================================  
// Hint  
// ================================  
function useHint() {
  if (gameState.hintUsedThisLevel) {
    showToast("Hint already used for this level!", "info");
    return;
  }

  sfxHint();

  const puzzle = gameState.puzzles[gameState.currentLevel];
  const firstLetter = puzzle.word[0];

  if (gameState.userAnswer.length > 0) {
    clearAnswer();
  }

  const tiles = elements.letterTiles.querySelectorAll(".letter-tile");
  let firstLetterTile = null;

  tiles.forEach(tile => {
    if (tile.dataset.letter === firstLetter && !tile.classList.contains("used")) {
      if (!firstLetterTile) {
        firstLetterTile = tile;
      }
    }
  });

  if (firstLetterTile) {
    const tileIndex = parseInt(firstLetterTile.dataset.index, 10);
    handleLetterTap(firstLetter, tileIndex);
  }

  showToast(`Hint: First letter is "${firstLetter}"`, "info", 3000);

  gameState.hintUsedThisLevel = true;
  gameState.hintsUsedTotal++;

  elements.hintBtn.disabled = true;
  elements.hintBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 9V15M10 5H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
    <span>Used</span>
  `;
}

// ================================  
// Submit  
// ================================  
function submitAnswer() {
  const puzzle = gameState.puzzles[gameState.currentLevel];
  const userWord = gameState.userAnswer.map(x => x.letter).join("");

  gameState.attemptsTotal += 1;

  if (userWord === puzzle.word) {
    handleCorrectAnswer();
  } else {
    handleWrongAnswer();
  }
}

async function handleCorrectAnswer() {
  const puzzle = gameState.puzzles[gameState.currentLevel];
  sfxCorrect();

  gameState.correctTotal += 1;
  gameState.currentStreak += 1;
  if (gameState.currentStreak > gameState.bestStreak) {
    gameState.bestStreak = gameState.currentStreak;
  }

  const slots = elements.answerSlots.querySelectorAll(".answer-slot");
  slots.forEach(slot => slot.classList.add("correct"));

  if (!gameState.completedLevels.includes(gameState.currentLevel)) {
    gameState.completedLevels.push(gameState.currentLevel);
  }

  startConfetti(1200);

  gameState.currentLevel += 1;
  saveProgress();

  await sleep(600);

  elements.explanationWord.textContent = puzzle.word;
  elements.explanationText.textContent = puzzle.explanation;
  showScreen("explanation");
}

async function handleWrongAnswer() {
  sfxWrong();

  const slots = elements.answerSlots.querySelectorAll(".answer-slot");
  slots.forEach(slot => slot.classList.add("wrong"));

  gameState.currentStreak = 0;

  if ("vibrate" in navigator) {
    navigator.vibrate?.(200);
  }

  await sleep(600);

  slots.forEach(slot => slot.classList.remove("wrong"));
  clearAnswer();
}

// ================================  
// Completion  
// ================================  
function renderCompletionStats() {
  const totalMs = (Date.now() - (gameState.runStartTime || Date.now())) || 0;
  const mm = Math.floor(totalMs / 60000);
  const ss = Math.floor((totalMs % 60000) / 1000);
  const timeStr = `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;

  const attempts = gameState.attemptsTotal || 1;
  const accuracy = gameState.correctTotal ? Math.round((gameState.correctTotal / attempts) * 100) : 0;

  elements.statsTime.textContent = timeStr;
  elements.statsAttempts.textContent = String(attempts);
  elements.statsAccuracy.textContent = `${accuracy}%`;
  elements.statsStreak.textContent = String(gameState.bestStreak || 0);
}

function showCompletionSummary() {
  elements.conceptList.innerHTML = "";

  gameState.puzzles.forEach((p, idx) => {
    if (gameState.completedLevels.includes(idx)) {
      const tag = document.createElement("div");
      tag.className = "concept-tag";
      tag.textContent = p.word;
      elements.conceptList.appendChild(tag);
    }
  });
}

// ================================  
// Email Submission
// ================================  
function submitEmail() {
  const email = elements.emailInput.value.trim();
  
  if (!email) {
    showToast("Please enter your email", "error");
    return;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showToast("Please enter a valid email", "error");
    return;
  }
  
  sfxCorrect();
  showToast("Thanks! We'll notify you when new packs launch 🚀", "info", 3500);
  
  elements.emailInput.value = "";
  elements.emailSubmitBtn.disabled = true;
  elements.emailSubmitBtn.innerHTML = "<span>Subscribed! ✓</span>";
  
  console.log("📧 Email submitted:", email);
}

// ================================  
// Share  
// ================================  
function shareProgress() {
  const completed = gameState.completedLevels.length;
  const total = gameState.totalLevels;
  const accuracy = gameState.correctTotal ? Math.round((gameState.correctTotal / gameState.attemptsTotal) * 100) : 0;

  const text = `I just completed ${completed}/${total} levels in LERN³! 🎮\n\nAccuracy: ${accuracy}%\nBest Streak: ${gameState.bestStreak}\n\nLearn Web3 through play:\nlern3demo.vercel.app`;

  if (navigator.share) {
    navigator.share({
      title: "LERN³ Progress",
      text: text
    }).catch(() => {
      copyToClipboard(text);
    });
  } else {
    copyToClipboard(text);
  }
}

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("Progress copied to clipboard!", "info");
    }).catch(() => {
      showToast(text, "info", 5000);
    });
  } else {
    showToast(text, "info", 5000);
  }
}

// ================================  
// Listeners  
// ================================  
function setupEventListeners() {
  elements.startBtn.onclick = (e) => {
    e.preventDefault();
    sfxClick();
    gameState.currentLevel = 0;
    gameState.runStartTime = null;
    gameState.attemptsTotal = 0;
    gameState.correctTotal = 0;
    gameState.currentStreak = 0;
    showScreen(gameState.hasSeenTutorial ? "game" : "tutorial");
  };

  elements.continueBtn.onclick = (e) => {
    e.preventDefault();
    sfxClick();
    showScreen("game");
  };

  elements.tutorialNextBtn.onclick = (e) => {
    e.preventDefault();
    sfxClick();
    gameState.hasSeenTutorial = true;
    saveProgress();
    showScreen("game");
  };

  elements.backBtn.onclick = (e) => {
    e.preventDefault();
    sfxClick();
    if (confirm("Leave current level? Progress will be saved.")) {
      showScreen("home");
    }
  };

  elements.letterTiles.onclick = (e) => {
    const tile = e.target;
    if (!tile.classList.contains("letter-tile")) return;
    if (tile.classList.contains("used")) return;

    const letter = tile.dataset.letter;
    const idx = parseInt(tile.dataset.index, 10);
    handleLetterTap(letter, idx);
  };

  elements.clearBtn.onclick = (e) => {
    e.preventDefault();
    clearAnswer();
  };

  elements.shuffleBtn.onclick = (e) => {
    e.preventDefault();
    shuffleLetters();
  };

  elements.hintBtn.onclick = (e) => {
    e.preventDefault();
    useHint();
  };

  elements.submitBtn.onclick = (e) => {
    e.preventDefault();
    submitAnswer();
  };

  elements.nextLevelBtn.onclick = (e) => {
    e.preventDefault();
    sfxClick();

    if (gameState.currentLevel >= gameState.totalLevels) {
      showScreen("completion");
    } else {
      showScreen("game");
    }
  };

  elements.playAgainBtn.onclick = (e) => {
    e.preventDefault();
    sfxClick();

    if (confirm("Restart all progress? This will reset your stats.")) {
      gameState.completedLevels = [];
      gameState.currentLevel = 0;
      gameState.hasSeenTutorial = true;
      gameState.runStartTime = null;
      gameState.attemptsTotal = 0;
      gameState.correctTotal = 0;
      gameState.currentStreak = 0;
      gameState.bestStreak = 0;
      gameState.hintsUsedTotal = 0;

      saveProgress();
      showScreen("home");
    }
  };

  elements.shareBtn.onclick = (e) => {
    e.preventDefault();
    sfxClick();
    shareProgress();
  };

  elements.emailSubmitBtn.onclick = (e) => {
    e.preventDefault();
    submitEmail();
  };

  elements.emailInput.onkeypress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitEmail();
    }
  };

  document.addEventListener("keydown", (e) => {
    if (!elements.gameScreen.classList.contains("active")) return;

    if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
      const letter = e.key.toUpperCase();
      const tiles = elements.letterTiles.querySelectorAll(".letter-tile");

      for (let tile of tiles) {
        if (tile.dataset.letter === letter && !tile.classList.contains("used")) {
          tile.click();
          break;
        }
      }
    }

    if (e.key === "Backspace" || e.key === "Delete") {
      if (gameState.userAnswer.length > 0) {
        clearAnswer();
      }
    }

    if (e.key === "Enter") {
      if (!elements.submitBtn.disabled) {
        elements.submitBtn.click();
      }
    }
  });
}

// ================================  
// Init  
// ================================  
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// ================================  
// PWA  
// ================================  
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then(
      (registration) => {
        console.log("✅ Service Worker registered:", registration.scope);
      },
      (err) => {
        console.log("⚠️ Service Worker registration failed:", err);
      }
    );
  });
}

// ================================  
// Performance  
// ================================  
window.addEventListener("load", () => {
  const loadTime = performance.now();
  console.log(`⚡ App loaded in ${Math.round(loadTime)}ms`);
});

// ================================  
// Errors  
// ================================  
window.addEventListener("error", (e) => {
  console.error("❌ Runtime error:", e.error);
  showToast("Something went wrong. Please refresh.", "error", 5000);
});

window.addEventListener("unhandledrejection", (e) => {
  console.error("❌ Unhandled promise rejection:", e.reason);
});

// ================================  
// Debug  
// ================================  
if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
  window.DEBUG = {
    skipToLevel: (n) => {
      gameState.currentLevel = n;
      gameState.completedLevels = Array.from({ length: n }, (_, i) => i);
      showScreen("game");
    },
    completeAll: () => {
      gameState.completedLevels = Array.from({ length: gameState.totalLevels }, (_, i) => i);
      gameState.currentLevel = gameState.totalLevels;
      showScreen("completion");
    },
    resetProgress: () => {
      localStorage.removeItem("lern3_progress");
      location.reload();
    },
    showStats: () => {
      console.table({
        currentLevel: gameState.currentLevel,
        completed: gameState.completedLevels.length,
        attempts: gameState.attemptsTotal,
        correct: gameState.correctTotal,
        streak: gameState.currentStreak,
        bestStreak: gameState.bestStreak,
        hints: gameState.hintsUsedTotal
      });
    }
  };

  console.log("🔧 Debug mode enabled.");
}