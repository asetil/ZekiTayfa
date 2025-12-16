import { DOM } from '../core/ui.js';
import { addScore } from '../core/gameState.js';
import { SoundManager } from '../core/soundManager.js';

const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;
let isComputerTurn = false;

export function initXoxGame() {
    DOM.xoxModal = document.getElementById('xox-modal');
    DOM.xoxBoard = document.getElementById('xox-board');
    DOM.xoxStatus = document.getElementById('xox-status');
    DOM.xoxCloseBtn = document.getElementById('xox-close-btn');
    DOM.bonusBtn = document.getElementById('header-bonus-btn');

    // Add Listeners
    if (DOM.bonusBtn) {
        DOM.bonusBtn.addEventListener('click', openXoxGame);
    }

    if (DOM.xoxCloseBtn) {
        DOM.xoxCloseBtn.addEventListener('click', closeXoxGame);
    }
}

function openXoxGame() {
    DOM.xoxModal.classList.remove('hidden');
    startGame();
}

function closeXoxGame() {
    DOM.xoxModal.classList.add('hidden');
}

function startGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    isComputerTurn = false;
    DOM.xoxStatus.textContent = "Sıra Sende (X)";
    renderBoard();
}

function renderBoard() {
    DOM.xoxBoard.innerHTML = '';
    board.forEach((cell, index) => {
        const cellEl = document.createElement('div');
        cellEl.className = 'xox-cell';
        if (cell) cellEl.classList.add(cell);
        
        cellEl.textContent = cell;
        cellEl.addEventListener('click', () => handleMove(index));
        DOM.xoxBoard.appendChild(cellEl);
    });
}

function handleMove(index) {
    if (board[index] !== '' || !gameActive || isComputerTurn) return;

    // Player Move (X)
    makeMove(index, 'X');
    
    if (checkWin('X')) {
        endGame('Kazandın! 🎉', true);
        return;
    }
    
    if (checkDraw()) {
        endGame('Berabere!', false);
        return;
    }

    // Computer Turn (O)
    isComputerTurn = true;
    DOM.xoxStatus.textContent = "Bilgisayar Düşünüyor...";
    
    setTimeout(makeComputerMove, 700);
}

function makeMove(index, player) {
    board[index] = player;
    SoundManager.playClick();
    renderBoard();
}

function makeComputerMove() {
    if (!gameActive) return;

    // Simple AI: 
    // 1. Check if can win
    // 2. Check if need to block
    // 3. Random empty spot

    let moveIndex = findBestMove('O'); // Try to win
    if (moveIndex === -1) moveIndex = findBestMove('X'); // Block player
    if (moveIndex === -1) {
        const emptyIndices = board.map((v, i) => v === '' ? i : null).filter(v => v !== null);
        moveIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }

    makeMove(moveIndex, 'O');

    if (checkWin('O')) {
        endGame('Kaybettin 😔', false);
    } else if (checkDraw()) {
        endGame('Berabere!', false);
    } else {
        isComputerTurn = false;
        DOM.xoxStatus.textContent = "Sıra Sende (X)";
    }
}

function findBestMove(player) {
    for (let combo of WINNING_COMBINATIONS) {
        const [a, b, c] = combo;
        const values = [board[a], board[b], board[c]];
        const playerCount = values.filter(v => v === player).length;
        const emptyCount = values.filter(v => v === '').length;

        if (playerCount === 2 && emptyCount === 1) {
            if (board[a] === '') return a;
            if (board[b] === '') return b;
            if (board[c] === '') return c;
        }
    }
    return -1;
}

function checkWin(player) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return board[index] === player;
        });
    });
}

function checkDraw() {
    return board.every(cell => cell !== '');
}

function endGame(message, playerWon) {
    gameActive = false;
    DOM.xoxStatus.textContent = message;
    
    if (playerWon) {
        SoundManager.playWin();
        DOM.xoxBoard.classList.add('win-anim');
        addScore(true, DOM.bonusBtn, 500); // Add 500 bonus points
    } else {
        SoundManager.playError();
    }

    setTimeout(() => {
         DOM.xoxBoard.classList.remove('win-anim');
    }, 2000);
}
