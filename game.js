// ===================================
// LERN³ - Game Engine
// Version: 2.0.0 (Perfect Edition)
// ===================================

console.log('🚀 LERN³ Game Engine Starting...');

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

// DOM Elements (cached for performance)
const elements = {};

// ===================================
// INITIALIZATION
// ===================================

function init() {
    try {
        console.log('🎮 Initializing LERN³...');
        
        // Cache DOM elements
        cacheElements();
        
        // Load puzzles (embedded)
        loadPuzzles();
        
        // Load saved progress
        loadProgress();
        
        // Setup event listeners
        setupEventListeners();
        
        console.log('✅ Game initialized successfully');
        
        // Show home screen after loading animation
        setTimeout(() => {
            showScreen('home');
        }, 1500);
        
    } catch (error) {
        console.error('❌ Initialization error:', error);
        alert('Failed to load game. Please refresh the page.');
    }
}

// ===================================
// DOM CACHING
// ===================================

function cacheElements() {
    elements.loadingScreen = document.getElementById('loading-screen');
    elements.homeScreen = document.getElementById('home-screen');
    elements.tutorialScreen = document.getElementById('tutorial-screen');
    elements.gameScreen = document.getElementById('game-screen');
    elements.explanationScreen = document.getElementById('explanation-screen');
    elements.completionScreen = document.getElementById('completion-screen');
    
    elements.startBtn = document.getElementById('start-btn');
    elements.continueBtn = document.getElementById('continue-btn');
    elements.currentLevelNum = document.getElementById('current-level-num');
    elements.homeProgress = document.getElementById('home-progress');
    elements.homeProgressBar = document.getElementById('home-progress-bar');
    
    elements.tutorialNextBtn = document.getElementById('tutorial-next-btn');
    
    elements.backBtn = document.getElementById('back-btn');
    elements.levelNumber = document.getElementById('level-number');
    elements.progressText = document.getElementById('progress-text');
    elements.imageGrid = document.getElementById('image-grid');
    elements.answerSlots = document.getElementById('answer-slots');
    elements.letterTiles = document.getElementById('letter-tiles');
    elements.clearBtn = document.getElementById('clear-btn');
    elements.submitBtn = document.getElementById('submit-btn');
    
    elements.explanationWord = document.getElementById('explanation-word');
    elements.explanationText = document.getElementById('explanation-text');
    elements.nextLevelBtn = document.getElementById('next-level-btn');
    
    elements.conceptList = document.getElementById('concept-list');
    elements.playAgainBtn = document.getElementById('play-again-btn');
    elements.shareBtn = document.getElementById('share-btn');
    
    console.log('📦 DOM elements cached');
}

// ===================================
// DATA MANAGEMENT
// ===================================

function loadPuzzles() {
    console.log('📚 Loading puzzles...');
    
    gameState.puzzles = [
        {
            id: 1,
            word: "WALLET",
            images: [
                "https://images.unsplash.com/photo-1627892798770-ea46f678e88e?w=400&q=80",
                "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=400&q=80",
                "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&q=80",
                "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&q=80"
            ],
            explanation: "A wallet stores your crypto, just like a physical wallet holds cash. But instead of leather, it's digital—and you control it with secret keys, not a zipper."
        },
        {
            id: 2,
            word: "GAS",
            images: [
                "https://images.unsplash.com/photo-1545262810-77515befe149?w=400&q=80",
                "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80",
                "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=400&q=80",
                "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&q=80"
            ],
            explanation: "Gas is the fee you pay to process transactions on the blockchain. Just like a car needs gas to go, transactions need 'gas' to be completed. On Base, it's super cheap—often less than $0.01."
        },
        {
            id: 3,
            word: "KEYS",
            images: [
                "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&q=80",
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
                "https://images.unsplash.com/photo-1515876305430-f06a0b037deb?w=400&q=80",
                "https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?w=400&q=80"
            ],
            explanation: "Keys prove ownership. Your private key is like a password (never share it), and your public key is like your username (safe to share). Together, they keep your crypto secure."
        },
        {
            id: 4,
            word: "CHAIN",
            images: [
                "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&q=80",
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
                "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400&q=80",
                "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&q=80"
            ],
            explanation: "A blockchain is a chain of blocks—each block contains transactions, and they're all linked together. Once something is added to the chain, it's there forever. That's why it's so secure."
        },
        {
            id: 5,
            word: "BLOCK",
            images: [
                "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80",
                "https://images.unsplash.com/photo-1504253163759-c23fccaebb55?w=400&q=80",
                "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&q=80",
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
            ],
            explanation: "A block is a container of transactions. Every few seconds, new blocks are created filled with recent transactions and added to the chain. Your transaction lives in one of these blocks."
        },
        {
            id: 6,
            word: "MINT",
            images: [
                "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=400&q=80",
                "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&q=80",
                "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80",
                "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&q=80"
            ],
            explanation: "Minting means creating something new. When you 'mint' an NFT, you're creating it for the first time and recording it on the blockchain. Like how a coin is minted at a mint facility!"
        },
        {
            id: 7,
            word: "NODE",
            images: [
                "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80",
                "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&q=80",
                "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&q=80",
                "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&q=80"
            ],
            explanation: "A node is a computer that helps run the blockchain. Thousands of nodes around the world keep copies of all transactions, making the network decentralized and impossible to shut down."
        },
        {
            id: 8,
            word: "HASH",
            images: [
                "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&q=80",
                "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=400&q=80",
                "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&q=80",
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
            ],
            explanation: "A hash is like a fingerprint for data. It's a unique code that represents information. Change even one letter, and the entire hash changes. That's how blockchains detect tampering."
        },
        {
            id: 9,
            word: "SWAP",
            images: [
                "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&q=80",
                "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&q=80",
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
                "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&q=80"
            ],
            explanation: "Swapping means trading one token for another. Want to turn USDC into ETH? You swap. DeFi apps make this instant and automatic—no middleman needed."
        },
        {
            id: 10,
            word: "BRIDGE",
            images: [
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
                "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80",
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
                "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&q=80"
            ],
            explanation: "A bridge connects different blockchains. Want to move your tokens from Ethereum to Base? You use a bridge. It's how different chains talk to each other."
        }
    ];
    
    gameState.totalLevels = gameState.puzzles.length;
    console.log(`✅ Loaded ${gameState.totalLevels} puzzles`);
}

function loadProgress() {
  try {
        const saved = localStorage.getItem('lern3_progress');
        if (saved) {
            const progress = JSON.parse(saved);
            gameState.completedLevels = progress.completedLevels || [];
            gameState.currentLevel = progress.currentLevel || 0;
            gameState.hasSeenTutorial = progress.hasSeenTutorial || false;
            console.log('📊 Progress loaded:', progress);
        } else {
            console.log('📊 No saved progress found - starting fresh');
        }
    } catch (error) {
        console.error('❌ Error loading progress:', error);
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
        console.log('💾 Progress saved');
    } catch (error) {
        console.error('❌ Error saving progress:', error);
    }
}

// ===================================
// SCREEN MANAGEMENT
// ===================================

function showScreen(screenName) {
    console.log(`🖥️ Showing screen: ${screenName}`);
    
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show requested screen
    const screen = document.getElementById(`${screenName}-screen`);
    if (screen) {
        screen.classList.add('active');
        
        // Screen-specific setup
        if (screenName === 'home') {
            updateHomeProgress();
        } else if (screenName === 'game') {
            loadLevel(gameState.currentLevel);
        } else if (screenName === 'completion') {
            showCompletionSummary();
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
    
    console.log(`📈 Progress: ${completed}/${total} (${percentage.toFixed(0)}%)`);
}

// ===================================
// GAME LOGIC
// ===================================

function loadLevel(levelIndex) {
    if (levelIndex >= gameState.puzzles.length) {
        console.log('🎉 All levels completed!');
        showScreen('completion');
        return;
    }
    const puzzle = gameState.puzzles[levelIndex];
    console.log(`🎮 Loading Level ${levelIndex + 1}: ${puzzle.word}`);
    
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
    const wordLetters = word.split('');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const distractors = [];
    const numDistractors = Math.floor(Math.random() * 3) + 5;
    
    while (distractors.length < numDistractors) {
        const letter = alphabet[Math.floor(Math.random() * alphabet.length)];
        if (!wordLetters.includes(letter) && !distractors.includes(letter)) {
            distractors.push(letter);
        }
    }
    
    const allLetters = [...wordLetters, ...distractors];
    gameState.availableLetters = shuffleArray(allLetters);
    
    console.log(`🔤 Letters: ${gameState.availableLetters.join('')}`);
    
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
    const puzzle = gameState.puzzles[gameState.currentLevel];
    
    if (gameState.userAnswer.length >= puzzle.word.length) {
        return;
    }
    
    console.log(`🔤 Letter tapped: ${letter}`);
    
    gameState.userAnswer.push({ letter, tileIndex });
    updateAnswerSlots();
    
    const tile = elements.letterTiles.querySelector(`[data-index="${tileIndex}"]`);
    if (tile) tile.classList.add('used');
    
    elements.submitBtn.disabled = gameState.userAnswer.length !== puzzle.word.length;
}

function updateAnswerSlots() {
    const slots = elements.answerSlots.querySelectorAll('.answer-slot');
    slots.forEach((slot, index) => {
        if (gameState.userAnswer[index]) {
            slot.textContent = gameState.userAnswer[index].letter;
            slot.classList.add('filled');
        } else {
            slot.textContent = '';
            slot.classList.remove('filled', 'correct', 'wrong');
        }
    });
}

function clearAnswer() {
    console.log('🧹 Clearing answer');
    
    gameState.userAnswer.forEach(item => {
        const tile = elements.letterTiles.querySelector(`[data-index="${item.tileIndex}"]`);
        if (tile) tile.classList.remove('used');
    });
    
    gameState.userAnswer = [];
    updateAnswerSlots();
    elements.submitBtn.disabled = true;
}

function submitAnswer() {
    const puzzle = gameState.puzzles[gameState.currentLevel];
    const userWord = gameState.userAnswer.map(item => item.letter).join('');
    
    console.log(`📝 Submitted: ${userWord} (Correct: ${puzzle.word})`);
    
    if (userWord === puzzle.word) {
      handleCorrectAnswer();
    } else {
        handleWrongAnswer();
    }
}

function handleCorrectAnswer() {
    const puzzle = gameState.puzzles[gameState.currentLevel];
    console.log('✅ Correct answer!');
    
    const slots = elements.answerSlots.querySelectorAll('.answer-slot');
    slots.forEach(slot => slot.classList.add('correct'));
    
    if (!gameState.completedLevels.includes(gameState.currentLevel)) {
        gameState.completedLevels.push(gameState.currentLevel);
    }
    gameState.currentLevel++;
    saveProgress();
    
    setTimeout(() => {
        elements.explanationWord.textContent = puzzle.word;
        elements.explanationText.textContent = puzzle.explanation;
        showScreen('explanation');
    }, 1000);
}

function handleWrongAnswer() {
    console.log('❌ Wrong answer');
    
    const slots = elements.answerSlots.querySelectorAll('.answer-slot');
    slots.forEach(slot => slot.classList.add('wrong'));
    
    if ('vibrate' in navigator) {
        navigator.vibrate(200);
    }
    
    setTimeout(() => {
        slots.forEach(slot => slot.classList.remove('wrong'));
        clearAnswer();
    }, 600);
}

// ===================================
// COMPLETION SCREEN
// ===================================

function showCompletionSummary() {
    console.log('🎊 Showing completion summary');
    
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
    
    console.log('📤 Sharing progress');
    
    if (navigator.share) {
        navigator.share({
            title: 'LERN³ Progress',
            text: text
        }).catch(() => {});
    } else {
        navigator.clipboard.writeText(text).then(() => {
            alert('Progress copied to clipboard!');
        }).catch(() => {
            alert(text);
        });
    }
}

function resetProgress() {
    if (confirm('Reset all progress? This cannot be undone.')) {
        console.log('🔄 Resetting progress');
        gameState.completedLevels = [];
        gameState.currentLevel = 0;
        gameState.hasSeenTutorial = false;
        saveProgress();
        showScreen('home');
    }
}
// ===================================
// EVENT LISTENERS
// ===================================

function setupEventListeners() {
    console.log('🎧 Setting up event listeners');
    
    elements.startBtn.addEventListener('click', () => {
        console.log('▶️ Start clicked');
        gameState.currentLevel = 0;
        if (!gameState.hasSeenTutorial) {
            showScreen('tutorial');
        } else {
            showScreen('game');
        }
    });
    
    elements.continueBtn.addEventListener('click', () => {
        console.log('▶️ Continue clicked');
        showScreen('game');
    });
    
    elements.tutorialNextBtn.addEventListener('click', () => {
        console.log('✅ Tutorial completed');
        gameState.hasSeenTutorial = true;
        saveProgress();
        showScreen('game');
    });
    
    elements.backBtn.addEventListener('click', () => {
        if (confirm('Leave current level?')) {
            console.log('🔙 Back to home');
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
    
    elements.nextLevelBtn.addEventListener('click', () => {
        console.log('⏭️ Next level');
        if (gameState.currentLevel >= gameState.totalLevels) {
            showScreen('completion');
        } else {
            showScreen('game');
        }
    });
    
    elements.playAgainBtn.addEventListener('click', resetProgress);
    elements.shareBtn.addEventListener('click', shareProgress);
    
    console.log('✅ Event listeners ready');
}

// ===================================
// START GAME
// ===================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}