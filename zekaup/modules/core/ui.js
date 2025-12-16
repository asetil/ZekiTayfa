import { currentUser } from './gameState.js';

export const DOM = {};

export function initUI() {
    DOM.welcomeScreen = document.getElementById('welcome-screen');
    DOM.levelScreen = document.getElementById('level-screen');
    DOM.gameScreen = document.getElementById('game-screen');
    DOM.appHeader = document.getElementById('app-header');
    DOM.headerName = document.getElementById('header-name');
    DOM.headerAge = document.getElementById('header-age');
    DOM.headerLevel = document.getElementById('header-level');
    DOM.headerScore = document.getElementById('header-score'); 
    DOM.gameBoard = document.getElementById('game-board');
    DOM.gameTitle = document.getElementById('game-title');
    DOM.gameInstruction = document.getElementById('game-instruction');
    DOM.successModal = document.getElementById('success-modal');
    DOM.levelsGrid = document.getElementById('levels-grid');
    DOM.nameInput = document.getElementById('name-input');
    DOM.ageButtons = document.querySelectorAll('.age-btn');
    DOM.backToAgeBtn = document.getElementById('back-to-age-btn');
    DOM.backToLevelsBtn = document.getElementById('back-to-levels-btn');
    DOM.navLevelsBtn = document.getElementById('nav-levels-btn');
    DOM.navSwitchBtn = document.getElementById('nav-switch-btn');
    DOM.menuBtn = document.getElementById('menu-btn');
    DOM.nextLevelBtn = document.getElementById('next-level-btn');

    // Ensure header score exists if not found in HTML
    if (!DOM.headerScore) {
        const scoreEl = document.createElement('div');
        scoreEl.id = 'header-score';
        scoreEl.className = 'score-display';
        scoreEl.textContent = '🪙 0';
        document.querySelector('.app-header')?.appendChild(scoreEl);
        DOM.headerScore = scoreEl;
    }
}

export function showScreen(screenToShow) {
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.add('hidden');
        s.classList.remove('active');
    });
    screenToShow.classList.remove('hidden');
    screenToShow.classList.add('active');
}

export function updateHeaderUI() {
    DOM.appHeader.classList.remove('hidden');
    DOM.headerName.textContent = currentUser.name;
    DOM.headerAge.textContent = `${currentUser.age} Yaş`;
    DOM.headerLevel.textContent = `Seviye ${currentUser.unlockedLevel}`;
    DOM.headerScore.textContent = `🪙 ${currentUser.score || 0}`;
}

export function hideModal() {
    DOM.successModal.classList.add('hidden');
}

export function showWinModal(message) {
    const modalTitle = DOM.successModal.querySelector('h2');
    if (modalTitle) {
        modalTitle.textContent = message;
    }
    DOM.successModal.classList.remove('hidden');
}
