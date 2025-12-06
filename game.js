// ===================================
// LERN³ - Game Engine
// ===================================

// Game State
const gameState = {
    currentLevel: 0,
    completedLevels: [],
    puzzles: [],
    userAnswer: [],
    availableLetters: [],
    totalLevels: 10,
    hasSeenTutorial: false
};

// Sound Effects
const sounds = {
    correct: null,
    wrong: null,
    tap: null
};

// DOM Elements (cached for performance)
const elements = {
    // Screens
    loadingScreen: document.getElementById('loading-screen'),
    homeScreen: document.getElementById('home-screen'),
    tutorialScreen: document.getElementById('tutorial-screen'),
    gameScreen: document.getElementById('game-screen'),
    explanationScreen: document.getElementById('explanation-screen'),
    completionScreen: document.getElementById('completion-screen'),
    // Home Screen
    startBtn: document.getElementById('start-btn'),
    continueBtn: document.getElementById('continue-btn'),
    currentLevelNum: document.getElementById('current-level-num'),
    homeProgress: document.getElementById('home-progress'),
    homeProgressBar: document.getElementById('home-progress-bar'),
    
    // Tutorial
    tutorialNextBtn: document.getElementById('tutorial-next-btn'),
    
    // Game Screen
    backBtn: document.getElementById('back-btn'),
    levelNumber: document.getElementById('level-number'),
    progressText: document.getElementById('progress-text'),
    imageGrid: document.getElementById('image-grid'),
    answerSlots: document.getElementById('answer-slots'),
    letterTiles: document.getElementById('letter-tiles'),
    clearBtn: document.getElementById('clear-btn'),
    submitBtn: document.getElementById('submit-btn'),
    
    // Explanation Screen
    explanationWord: document.getElementById('explanation-word'),
    explanationText: document.getElementById('explanation-text'),
    nextLevelBtn: document.getElementById('next-level-btn'),
    
    // Completion Screen
    conceptList: document.getElementById('concept-list'),
    playAgainBtn: document.getElementById('play-again-btn'),
    shareBtn: document.getElementById('share-btn'),
    
    // PWA Install
    installPrompt: document.getElementById('install-prompt'),
    installBtn: document.getElementById('install-btn'),
    closeInstallBtn: document.getElementById('close-install')
};

// ===================================
// INITIALIZATION
// ===================================

async function init() {
    try {
        // Load puzzles
        await loadPuzzles();
        
        // Load saved progress
        loadProgress();
        
        // Initialize sounds
        initializeSounds();
        
        // Setup event listeners
        setupEventListeners();
        
        // Setup PWA
        setupPWA();
        
        // Show home screen
        setTimeout(() => {
            showScreen('home');
        }, 1500);
    } catch (error) {
        console.error('Initialization error:', error);
        alert('Failed to load game. Please refresh.');
    }
}

// ===================================
// DATA MANAGEMENT
// ===================================

async function loadPuzzles() {
    try {
        const response = await fetch('puzzles.json');
        if (!response.ok) throw new Error('Failed to load puzzles');
        gameState.puzzles = await response.json();
        gameState.totalLevels = gameState.puzzles.length;
    } catch (error) {
        console.error('Error loading puzzles:', error);
        // Fallback to demo data if fetch fails
        gameState.puzzles = getDemoPuzzles();
        gameState.totalLevels = gameState.puzzles.length;
    }
}

function getDemoPuzzles() {
    // Fallback puzzles in case JSON doesn't load
    return [
        {
            id: 1,
            word: "WALLET",
            images: [
              "https://images.unsplash.com/photo-1627892798770-ea46f678e88e?w=400",
                "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=400",
                "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400",
                "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400"
            ],
            explanation: "A wallet stores your crypto, just like a physical wallet holds cash. But instead of leather, it's digital—and you control it with secret keys, not a zipper."
        }
        // More demo puzzles...
    ];
}

function loadProgress() {
    try {
        const saved = localStorage.getItem('lern3_progress');
        if (saved) {
            const progress = JSON.parse(saved);
            gameState.completedLevels = progress.completedLevels || [];
            gameState.currentLevel = progress.currentLevel || 0;
            gameState.hasSeenTutorial = progress.hasSeenTutorial || false;
        }
        updateHomeProgress();
    } catch (error) {
        console.error('Error loading progress:', error);
    }
}

function saveProgress() {
    try {
        const progress = {
            completedLevels: gameState.completedLevels,
            currentLevel: gameState.currentLevel,
            hasSeenTutorial: gameState.hasSeenTutorial,
            lastPlayed: Date.now()
        };
        localStorage.setItem('lern3_progress', JSON.stringify(progress));
    } catch (error) {
        console.error('Error saving progress:', error);
    }
}

// ===================================
// SCREEN MANAGEMENT
// ===================================

function showScreen(screenName) {
    // Hide all screens
    Object.values(elements).forEach(el => {
        if (el && el.classList && el.classList.contains('screen')) {
            el.classList.remove('active');
        }
    });
    
    // Show requested screen
    const screen = document.getElementById(`${screenName}-screen`);
    if (screen) {
        screen.classList.add('active');
        
        // Screen-specific setup
        switch(screenName) {
            case 'home':
                updateHomeProgress();
                break;
            case 'game':
              loadLevel(gameState.currentLevel);
                break;
            case 'completion':
                showCompletionSummary();
                break;
        }
    }
}

// ===================================
// HOME SCREEN
// ===================================

function updateHomeProgress() {
    const completed = gameState.completedLevels.length;
    const total = gameState.totalLevels;
    const percentage = (completed / total) * 100;
    
    elements.homeProgress.textContent = `${completed}/${total}`;
    elements.homeProgressBar.style.width = `${percentage}%`;
    
    if (completed > 0 && completed < total) {
        elements.startBtn.style.display = 'none';
        elements.continueBtn.style.display = 'block';
        elements.currentLevelNum.textContent = gameState.currentLevel + 1;
    } else {
        elements.startBtn.style.display = 'block';
        elements.continueBtn.style.display = 'none';
    }
}

// ===================================
// GAME LOGIC
// ===================================

function loadLevel(levelIndex) {
    if (levelIndex >= gameState.puzzles.length) {
        showScreen('completion');
        return;
    }
    
    const puzzle = gameState.puzzles[levelIndex];
    
    // Update UI
    elements.levelNumber.textContent = levelIndex + 1;
    elements.progressText.textContent = `${levelIndex + 1}/${gameState.totalLevels}`;
    
    // Load images
    const imageCards = elements.imageGrid.querySelectorAll('.puzzle-image');
    imageCards.forEach((img, index) => {
        img.src = puzzle.images[index];
        img.alt = `Hint ${index + 1}`;
    });
    
    // Setup answer slots
    setupAnswerSlots(puzzle.word.length);
    // Setup letter tiles
    setupLetterTiles(puzzle.word);
    
    // Reset state
    gameState.userAnswer = [];
    elements.submitBtn.disabled = true;
}

function setupAnswerSlots(length) {
    elements.answerSlots.innerHTML = '';
    for (let i = 0; i < length; i++) {
        const slot = document.createElement('div');
        slot.className = 'answer-slot';
        slot.dataset.index = i;
        elements.answerSlots.appendChild(slot);
    }
}

function setupLetterTiles(word) {
    // Get unique letters from word
    const wordLetters = word.split('');
    
    // Add 5-7 random distractor letters
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const distractors = [];
    const numDistractors = Math.floor(Math.random() * 3) + 5; // 5-7 random
    
    while (distractors.length < numDistractors) {
        const letter = alphabet[Math.floor(Math.random() * alphabet.length)];
        if (!wordLetters.includes(letter) && !distractors.includes(letter)) {
            distractors.push(letter);
        }
    }
    // Combine and shuffle
    const allLetters = [...wordLetters, ...distractors];
    gameState.availableLetters = shuffleArray(allLetters);
    
    // Render tiles
    elements.letterTiles.innerHTML = '';
    gameState.availableLetters.forEach((letter, index) => {
        const tile = document.createElement('button');
        tile.className = 'letter-tile';
        tile.textContent = letter;
        tile.dataset.index = index;
        tile.dataset.letter = letter;
        elements.letterTiles.appendChild(tile);
    });
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function handleLetterTap(letter, tileIndex) {
    if (gameState.userAnswer.length >= gameState.puzzles[gameState.currentLevel].word.length) {
        return;
    }
    
    // Add to answer
    gameState.userAnswer.push({ letter, tileIndex });
    
    // Update UI
    updateAnswerSlots();
    
    // Mark tile as used
    const tile = elements.letterTiles.querySelector(`[data-index="${tileIndex}"]`);
    if (tile) tile.classList.add('used');
    
    // Enable submit if answer complete
    const puzzle = gameState.puzzles[gameState.currentLevel];
    elements.submitBtn.disabled = gameState.userAnswer.length !== puzzle.word.length;
    
    // Play sound
    playSound('tap');
}

function updateAnswerSlots() {
    const slots = elements.answerSlots.querySelectorAll('.answer-slot');
    slots.forEach((slot, index) => {
        if (gameState.userAnswer[index]) {
            slot.textContent = gameState.userAnswer[index].letter;
            slot.classList.add('filled');
        } else {
            slot.textContent = '';
            slot.classList.remove('filled');
        }
    });
}

function clearAnswer() {
    // Reset tiles
    gameState.userAnswer.forEach(item => {
        const tile = elements.letterTiles.querySelector(`[data-index="${item.tileIndex}"]`);
        if (tile) tile.classList.remove('used');
    });
    
    // Clear answer
    gameState.userAnswer = [];
    updateAnswerSlots();
    elements.submitBtn.disabled = true;
}

function submitAnswer() {
    const puzzle = gameState.puzzles[gameState.currentLevel];
    const userWord = gameState.userAnswer.map(item => item.letter).join('');
    
    if (userWord === puzzle.word) {
        handleCorrectAnswer();
    } else {
        handleWrongAnswer();
    }
}
function handleCorrectAnswer() {
    const puzzle = gameState.puzzles[gameState.currentLevel];
    
    // Visual feedback
    const slots = elements.answerSlots.querySelectorAll('.answer-slot');
    slots.forEach(slot => slot.classList.add('correct'));
    
    // Play sound
    playSound('correct');
    
    // Save progress
    if (!gameState.completedLevels.includes(gameState.currentLevel)) {
        gameState.completedLevels.push(gameState.currentLevel);
    }
    gameState.currentLevel++;
    saveProgress();
    
    // Show explanation after delay
    setTimeout(() => {
        elements.explanationWord.textContent = puzzle.word;
        elements.explanationText.textContent = puzzle.explanation;
        showScreen('explanation');
    }, 1000);
}

function handleWrongAnswer() {
    // Visual feedback
    const slots = elements.answerSlots.querySelectorAll('.answer-slot');
    slots.forEach(slot => slot.classList.add('wrong'));
    
    // Play sound
    playSound('wrong');
    
    // Vibrate (if supported)
    if ('vibrate' in navigator) {
        navigator.vibrate(200);
    }
    
    // Reset after animation
    setTimeout(() => {
        slots.forEach(slot => slot.classList.remove('wrong'));
        clearAnswer();
    }, 600);
}

// ===================================
// COMPLETION SCREEN
// ===================================

function showCompletionSummary() {
    elements.conceptList.innerHTML = '';
    
    gameState.puzzles.forEach((puzzle, index) => {
        if (gameState.completedLevels.includes(index)) {
            const tag = document.createElement('div');
            tag.className = 'concept-tag';
            tag.textContent = puzzle.word;
            elements.conceptList.appendChild(tag);
        }
    });
}

function shareProgress() {
  const completed = gameState.completedLevels.length;
    const total = gameState.totalLevels;
    const text = `I just completed ${completed}/${total} levels in LERN³! 🎮\n\nLearning Web3 through play.\n\nJoin me: https://lern3.xyz`;
    
    if (navigator.share) {
        navigator.share({
            title: 'LERN³ Progress',
            text: text
        }).catch(() => {});
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(text).then(() => {
            alert('Progress copied to clipboard!');
        });
    }
}

function resetProgress() {
    if (confirm('Are you sure you want to reset all progress?')) {
        gameState.completedLevels = [];
        gameState.currentLevel = 0;
        saveProgress();
        showScreen('home');
    }
}

// ===================================
// SOUND MANAGEMENT
// ===================================

function initializeSounds() {
    // Create audio elements
    sounds.correct = new Audio('assets/sounds/correct.mp3');
    sounds.wrong = new Audio('assets/sounds/wrong.mp3');
    sounds.tap = new Audio('assets/sounds/correct.mp3'); // Reuse for tap
    
    // Set volumes
    sounds.correct.volume = 0.5;
    sounds.wrong.volume = 0.5;
    sounds.tap.volume = 0.2;
    
    // Preload
    Object.values(sounds).forEach(sound => {
        if (sound) sound.load();
    });
}

function playSound(type) {
    try {
        const sound = sounds[type];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(() => {}); // Ignore errors
        }
    } catch (error) {
        // Silently fail
    }
}

// ===================================
// PWA FUNCTIONALITY
// ===================================

let deferredPrompt;
function setupPWA() {
    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('Service Worker registered'))
            .catch(err => console.error('SW registration failed:', err));
    }
    
    // Install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show custom install prompt after delay
        setTimeout(() => {
            elements.installPrompt.style.display = 'block';
        }, 30000); // Show after 30 seconds
    });
    
    // Handle install
    elements.installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            elements.installPrompt.style.display = 'none';
        }
        
        deferredPrompt = null;
    });
    
    elements.closeInstallBtn.addEventListener('click', () => {
        elements.installPrompt.style.display = 'none';
    });
}

// ===================================
// EVENT LISTENERS
// ===================================

function setupEventListeners() {
    // Home Screen
    elements.startBtn.addEventListener('click', () => {
        gameState.currentLevel = 0;
        if (!gameState.hasSeenTutorial) {
            showScreen('tutorial');
        } else {
            showScreen('game');
        }
    });
    
    elements.continueBtn.addEventListener('click', () => {
        showScreen('game');
    });
    
    // Tutorial
    elements.tutorialNextBtn.addEventListener('click', () => {
        gameState.hasSeenTutorial = true;
        saveProgress();
        showScreen('game');
    });
    // Game Screen
    elements.backBtn.addEventListener('click', () => {
        if (confirm('Leave current level?')) {
            showScreen('home');
        }
    });
    
    elements.letterTiles.addEventListener('click', (e) => {
        if (e.target.classList.contains('letter-tile') && !e.target.classList.contains('used')) {
            const letter = e.target.dataset.letter;
            const index = parseInt(e.target.dataset.index);
            handleLetterTap(letter, index);
        }
    });
    
    elements.clearBtn.addEventListener('click', clearAnswer);
    elements.submitBtn.addEventListener('click', submitAnswer);
    
    // Explanation Screen
    elements.nextLevelBtn.addEventListener('click', () => {
        if (gameState.currentLevel >= gameState.totalLevels) {
            showScreen('completion');
        } else {
            showScreen('game');
        }
    });
    
    // Completion Screen
    elements.playAgainBtn.addEventListener('click', resetProgress);
    elements.shareBtn.addEventListener('click', shareProgress);
}
