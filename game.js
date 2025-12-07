// ===================================
// LERN³ - Game Engine
// Version: 2.2.0 (CRITICAL FIXES)
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

// DOM Elements
const elements = {};

// ===================================
// INITIALIZATION
// ===================================

function init() {
    try {
        console.log('🎮 Initializing LERN³...');
        
        // Cache DOM elements
        cacheElements();
        // Load puzzles
        loadPuzzles();
        
        // Load saved progress
        loadProgress();
        
        // Setup event listeners
        setupEventListeners();
        
        console.log('✅ Game initialized successfully');
        
        // Show home screen after loading animation
        setTimeout(() => {
            hideLoadingScreen();
            showScreen('home');
        }, 2000);
        
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
// LOADING SCREEN MANAGEMENT
// ===================================

function hideLoadingScreen() {
    if (elements.loadingScreen) {
        elements.loadingScreen.classList.remove('active');
        console.log('👋 Loading screen hidden');
    }
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
                "assets/images/level1_1.jpg",
                "assets/images/level1_2.jpg",
                "assets/images/level1_3.jpg",
                "assets/images/level1_4.jpg"
            ],
            explanation: "A wallet stores your crypto, just like a physical wallet holds cash. But instead of leather, it's digital, and you control it with secret keys, not a zipper."
        },
        {
            id: 2,
            word: "GAS",
            images: [
                "assets/images/level2_1.jpg",
                "assets/images/level2_2.jpg",
                "assets/images/level2_3.jpg",
                "assets/images/level2_4.jpg"
            ],
            explanation: "Gas is the fee you pay to process transactions on the blockchain. Just like a car needs gas to go, transactions need 'gas' to be completed. On Base, it's super cheap—often less than $0.01."
        },
        {
            id: 3,
            word: "KEYS",
            images: [
                "assets/images/level3_1.jpg",
                "assets/images/level3_2.jpg",
                "assets/images/level3_3.jpg",
                "assets/images/level3_4.jpg"
            ],
            explanation: "Keys prove ownership. Your private key is like a password (never share it), and your public key is like your username (safe to share). Together, they keep your crypto secure."
        },
        {
            id: 4,
            word: "CHAIN",
            images: [
                "assets/images/level4_1.jpg",
                "assets/images/levep4_2.jpg",
                "assets/images/level4_3.jpg",
                "assets/imageslevel4_4.jpg"
            ],
            explanation: "A blockchain is a chain of blocks—each block contains transactions, and they're all linked together. Once something is added to the chain, it's there forever. That's why it's so secure."
        },
        {
            id: 5,
            word: "BLOCK",
            images: [
                "assets/images/level5_1.jpg",
                "assets/images/level5_2.jpg",
                "assets/images/level5_3.jpg",
                "assets/images/level5_4.jpg"
            ],
            explanation: "A block is a container of transactions. Every few seconds, new blocks are created filled with recent transactions and added to the chain. Your transaction lives in one of these blocks."
        },
        {
            id: 6,
            word: "MINT",
            images: [
                "assets/images/level6_1.jpeg",
                "assets/images/level6_2.jpg",
                "assets/images/level6_3.jpg",
                "assets/images/level6_4.jpg"
            ],
            explanation: "Minting means creating something new. When you 'mint' an NFT, you're creating it for the first time and recording it on the blockchain. Like how a coin is minted at a mint facility!"
        },
        {
            id: 7,
            word: "NODE",
            images: [
                "assets/images/level7_1.jpg",
                "assets/images/level7_2.jpg",
                "assets/images/level7_3.jpg",
                "assets/images/level7_4.jpg"
            ],
            explanation: "A node is a computer that helps run the blockchain. Thousands of nodes around the world keep copies of all transactions, making the network decentralized and impossible to shut down."
        },
        {
            id: 8,
            word: "HASH",
            images: [
                "assets/images/level8_1.jpg",
                "assets/images/level8_2.jpg",
                "assets/images/level8_3.png",
                "assets/images/level8_4.png"
            ],
            explanation: "A hash is like a fingerprint for data. It's a unique code that represents information. Change even one letter, and the entire hash changes. That's how blockchains detect tampering."
        },
        {
            id: 9,
            word: "SWAP",
            images: [
                "assets/images/level9_1.png",
                "assets/images/level9_2.png",
                "assets/images/level9_3.png",
                "assets/images/level9_4.png"
            ],
            explanation: "Swapping means trading one token for another. Want to turn USDC into ETH? You swap. DeFi apps make this instant and automatic—no middleman needed."
        },
        {
            id: 10,
            word: "BRIDGE",
            images: [
                "assets/images/level10_1.png",
                "assets/images/level10_2.png",
                "assets/images/level10_3.png",
                "assets/images/level10_4.png"
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
            console.log('📊 No saved progress - starting fresh');
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
        
        // FIXED: Only load level data when actually showing game screen
        if (screenName === 'home') {
            updateHomeProgress();
        } else if (screenName === 'game') {
            loadLevel(gameState.currentLevel);
        } else if (screenName === 'completion') {
            showCompletionSummary();
        }
    } else {
        console.error(`❌ Screen not found: ${screenName}`);
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
// EVENT LISTENERS (FIXED)
// ===================================

function setupEventListeners() {
    console.log('🎧 Setting up event listeners');
    
    // FIXED: Direct click listeners with prevent default
    if (elements.startBtn) {
        elements.startBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('▶️ Start button clicked!');
            gameState.currentLevel = 0;
            if (!gameState.hasSeenTutorial) {
                showScreen('tutorial');
            } else {
                showScreen('game');
            }
        };
        console.log('✅ Start button listener added');
    }
    
    if (elements.continueBtn) {
        elements.continueBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('▶️ Continue clicked!');
            showScreen('game');
        };
        console.log('✅ Continue button listener added');
    }
    
    if (elements.tutorialNextBtn) {
        elements.tutorialNextBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('✅ Tutorial completed!');
            gameState.hasSeenTutorial = true;
            saveProgress();
            showScreen('game');
        };
        console.log('✅ Tutorial next button listener added');
    }
    if (elements.backBtn) {
        elements.backBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (confirm('Leave current level?')) {
                console.log('🔙 Back to home');
                showScreen('home');
            }
        };
        console.log('✅ Back button listener added');
    }
    
    // Letter tiles - use delegation
    if (elements.letterTiles) {
        elements.letterTiles.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (e.target.classList.contains('letter-tile') && !e.target.classList.contains('used')) {
                const letter = e.target.dataset.letter;
                const index = parseInt(e.target.dataset.index);
                handleLetterTap(letter, index);
            }
        };
        console.log('✅ Letter tiles listener added');
    }
    
    // FIXED: Clear button should NOT fire automatically
    if (elements.clearBtn) {
        elements.clearBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🧹 Clear button clicked!');
            clearAnswer();
        };
        console.log('✅ Clear button listener added');
    }
    
    if (elements.submitBtn) {
        elements.submitBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('✔️ Submit button clicked!');
            submitAnswer();
        };
        console.log('✅ Submit button listener added');
    }
    
    if (elements.nextLevelBtn) {
        elements.nextLevelBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('⏭️ Next level clicked!');
            if (gameState.currentLevel >= gameState.totalLevels) {
                showScreen('completion');
            } else {
                showScreen('game');
            }
        };
        console.log('✅ Next level button listener added');
    }
    
    if (elements.playAgainBtn) {
        elements.playAgainBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔄 Play again clicked!');
            resetProgress();
        };
        console.log('✅ Play again button listener added');
    }
    
    if (elements.shareBtn) {
        elements.shareBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('📤 Share clicked!');
            shareProgress();
        };
        console.log('✅ Share button listener added');
    }
    
    console.log('✅ All event listeners ready');
}

// ===================================
// START GAME
// ===================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}