import { levelsConfig, ALL_MINIGAMES } from './modules/data/levelsConfig.js';
import { SoundManager } from './modules/core/soundManager.js';
import { initUser, saveUser, currentUser, currentLevel, setCurrentLevel, addScore, setUiUpdater } from './modules/core/gameState.js';
import { DOM, showScreen, updateHeaderUI, hideModal, showWinModal, initUI } from './modules/core/ui.js';

import { setupMemoryGame } from './modules/games/memory.js';
import { setupOddOneGame } from './modules/games/oddOne.js';
import { setupAssociationGame } from './modules/games/association.js';
import { setupCountingGame } from './modules/games/counting.js';
import { setupSequenceGame } from './modules/games/sequence.js';
import { setupPatternGame } from './modules/games/pattern.js';
import { setupAssociationQuiz } from './modules/games/quiz.js';
import { setupCipherGame } from './modules/games/cipher.js';
import { initXoxGame } from './modules/games/xox.js';

let minigameQueue = [];
let queueIndex = 0;
let minigameBag = [];

document.addEventListener('DOMContentLoaded', () => {
    initUI(); // Initialize DOM references first
    setUiUpdater(updateHeaderUI); // Hook up UI updates
    initXoxGame(); // Initialize Bonus Game
    init();

    // Event Listeners
    if (DOM.ageButtons) {
        DOM.ageButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const name = DOM.nameInput.value.trim();
                if (!name) {
                    DOM.nameInput.classList.add('error');
                    setTimeout(() => DOM.nameInput.classList.remove('error'), 500);
                    DOM.nameInput.focus();
                    return;
                }

                const age = parseInt(btn.dataset.age);
                saveUser(name, age);
                selectAge(age);
            });
        });
    }

    if (DOM.navSwitchBtn) {
        DOM.navSwitchBtn.addEventListener('click', () => {
            localStorage.removeItem('zekaup_user');
            DOM.appHeader.classList.add('hidden');
            DOM.nameInput.value = '';
            showScreen(DOM.welcomeScreen);
        });
    }

    if (DOM.navLevelsBtn) {
        DOM.navLevelsBtn.addEventListener('click', () => {
            showScreen(DOM.levelScreen);
        });
    }

    if (DOM.backToAgeBtn) {
         DOM.backToAgeBtn.addEventListener('click', () => {
            localStorage.removeItem('zekaup_user');
            DOM.appHeader.classList.add('hidden');
            DOM.nameInput.value = '';
            showScreen(DOM.welcomeScreen);
         });
    }

    if (DOM.backToLevelsBtn) {
        DOM.backToLevelsBtn.addEventListener('click', () => {
            showScreen(DOM.levelScreen);
        });
    }

    if (DOM.menuBtn) {
        DOM.menuBtn.addEventListener('click', () => {
            hideModal();
            showScreen(DOM.levelScreen);
        });
    }

    if (DOM.nextLevelBtn) {
        DOM.nextLevelBtn.addEventListener('click', () => {
            hideModal();
            startLevel(currentLevel + 1);
        });
    }
});

function init() {
    console.log("Game Initializing...");
    document.body.addEventListener('click', () => {
        SoundManager.init();
    }, { once: true });
    
    if (initUser()) {
        updateHeaderUI();
        selectAge(currentUser.age);
    } else {
        DOM.appHeader.classList.add('hidden');
        showScreen(DOM.welcomeScreen);
    }
}

function selectAge(age) {
    currentUser.age = age;
    generateLevelButtons(age);
    showScreen(DOM.levelScreen);
}

function generateLevelButtons(age) {
    DOM.levelsGrid.innerHTML = '';
    const limit = age < 6 ? levelsConfig.maxLevelsYoung : levelsConfig.maxLevelsOld;

    for (let i = 1; i <= limit; i++) {
        const btn = document.createElement('button');
        btn.className = 'level-btn';
        btn.textContent = i;

        if (i > currentUser.unlockedLevel) {
            btn.classList.add('locked');
        }

        const rotate = (Math.random() * 6 - 3).toFixed(1);
        btn.style.transform = `rotate(${rotate}deg)`;

        btn.addEventListener('click', () => {
            if (i <= currentUser.unlockedLevel) {
                startLevel(i);
            } else {
                btn.style.animation = 'shake 0.4s';
                setTimeout(() => btn.style.animation = '', 400);
            }
        });

        if (i <= currentUser.unlockedLevel) {
            btn.addEventListener('mouseenter', () => { btn.style.transform = `rotate(0deg) scale(1.1)`; });
            btn.addEventListener('mouseleave', () => { btn.style.transform = `rotate(${rotate}deg)`; });
        }

        DOM.levelsGrid.appendChild(btn);
    }
}

function refillBag() {
    minigameBag = [...ALL_MINIGAMES].sort(() => Math.random() - 0.5);
}

function drawGames(count) {
    if (minigameBag.length < count) {
        refillBag();
    }
    return minigameBag.splice(0, count);
}

function startLevel(level) {
    setCurrentLevel(level);
    minigameQueue = [];

    if (minigameBag.length === 0) {
        refillBag();
    }

    const gameCount = level <= 8 ? 1 : 2;
    minigameQueue = drawGames(gameCount);

    queueIndex = 0;
    loadMinigame();
}

function loadMinigame() {
    const gameType = minigameQueue[queueIndex];

    if (gameType === 'memory') setupMemoryGame(currentLevel, advanceQueue);
    else if (gameType === 'odd') setupOddOneGame(currentLevel, advanceQueue);
    else if (gameType === 'assoc') setupAssociationGame(currentLevel, advanceQueue);
    else if (gameType === 'counting') setupCountingGame(currentLevel, advanceQueue);
    else if (gameType === 'sequence') setupSequenceGame(currentLevel, advanceQueue);
    else if (gameType === 'pattern') setupPatternGame(currentLevel, advanceQueue);
    else if (gameType === 'quiz') setupAssociationQuiz(currentLevel, advanceQueue);
    else if (gameType === 'cipher') setupCipherGame(currentLevel, advanceQueue);

    showScreen(DOM.gameScreen);
}

function advanceQueue() {
    queueIndex++;
    if (queueIndex < minigameQueue.length) {
        setTimeout(() => {
            DOM.gameBoard.innerHTML = '';
            loadMinigame();
        }, 500);
    } else {
        completeLevel();
    }
}

function completeLevel() {
    const bonus = currentLevel * 100;
    addScore(true); // Just to verify connection, but logic suggests:
    // Actually addScore in gameState handles logic. We need to manually add bonus.
    // The original script did manual bonus addition.
    
    // We already have addScore imported.
    // Let's modify gameState.js to support custom points? 
    // Or just do it manually here since we have direct access to saveUser (which saves currentUser state).
    
    currentUser.score = (currentUser.score || 0) + bonus;
    
    const popup = document.createElement('div');
    popup.className = 'score-popup score-plus';
    popup.style.left = '50%';
    popup.style.top = '50%';
    popup.style.fontSize = '3rem';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.textContent = `Seviye Bonusu: +${bonus}`;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 1500);

    SoundManager.playWin();

    if (currentUser.unlockedLevel < currentLevel + 1) {
        currentUser.unlockedLevel = currentLevel + 1;
        saveUser(); 
    } else {
        saveUser();
    }

    setTimeout(() => {
        const congratsMessages = [ 'Harikasın! 🎉', 'Mükemmelsin! 🌟', 'Süpersin! 🚀', 'Bravo! 🎊' ];
        const randomMessage = congratsMessages[Math.floor(Math.random() * congratsMessages.length)];
        showWinModal(randomMessage);
    }, 500);
}
