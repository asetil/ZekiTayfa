import { DOM } from '../core/ui.js';
import { SoundManager } from '../core/soundManager.js';

const SEQ_COLORS = ['red', 'blue', 'green', 'yellow'];
let gameSequence = [];
let userSequence = [];
let isShowingSequence = false;
let onCompleteCallback = null;

export function setupSequenceGame(level, onComplete) {
    onCompleteCallback = onComplete;
    DOM.gameTitle.textContent = "Sırayı Hatırla";
    DOM.gameInstruction.textContent = "Yanan ışıkları sırasıyla tekrar et!";
    DOM.gameBoard.innerHTML = '';
    DOM.gameBoard.className = '';

    const container = document.createElement('div');
    container.className = 'sequence-container';

    const grid = document.createElement('div');
    grid.className = 'sequence-grid';

    SEQ_COLORS.forEach(color => {
        const btn = document.createElement('div');
        btn.className = `sequence-btn ${color}`;
        btn.dataset.color = color;
        btn.addEventListener('click', () => handleSequenceInput(color));
        grid.appendChild(btn);
    });

    container.appendChild(grid);
    DOM.gameBoard.appendChild(container);

    gameSequence = [];
    userSequence = [];
    isShowingSequence = false;

    let targetLength = 2;
    if (level >= 6) targetLength = 3;
    if (level >= 7) targetLength = 4;
    if (level >= 8) targetLength = 5;
    if (level >= 15) targetLength = 6;

    generateSequence(targetLength);
    setTimeout(() => playSequence(), 1000);
}

function generateSequence(length) {
    gameSequence = [];
    const colors = ['red', 'blue', 'green', 'yellow'];

    for (let i = 0; i < length; i++) {
        let randomColor = colors[Math.floor(Math.random() * colors.length)];
        if (i > 0) {
            while (randomColor === gameSequence[i - 1]) {
                randomColor = colors[Math.floor(Math.random() * colors.length)];
            }
        }
        gameSequence.push(randomColor);
    }
}

function playSequence(callback) {
    isShowingSequence = true;
    let i = 0;

    const interval = setInterval(() => {
        if (i >= gameSequence.length) {
            clearInterval(interval);
            isShowingSequence = false;
            if (callback) callback();
            return;
        }
        activateSequenceBtn(gameSequence[i]);
        i++;
    }, 1000);
}

function activateSequenceBtn(color) {
    const btn = document.querySelector(`.sequence-btn.${color}`);
    if (!btn) return;

    btn.classList.add('active');
    SoundManager.playSound('click');

    setTimeout(() => {
        btn.classList.remove('active');
    }, 500);
}

function handleSequenceInput(color) {
    if (isShowingSequence) return;

    activateSequenceBtn(color);
    userSequence.push(color);

    const currentIndex = userSequence.length - 1;

    if (userSequence[currentIndex] !== gameSequence[currentIndex]) {
        SoundManager.playError();
        const grid = document.querySelector('.sequence-grid');
        grid.style.animation = 'shake 0.4s';
        setTimeout(() => {
            grid.style.animation = '';
            userSequence = [];
            setTimeout(() => playSequence(), 1000);
        }, 600);
        return;
    }

    if (userSequence.length === gameSequence.length) {
        if (onCompleteCallback) setTimeout(onCompleteCallback, 500);
    }
}
