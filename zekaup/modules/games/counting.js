import { DOM } from '../core/ui.js';
import { SoundManager } from '../core/soundManager.js';
import { addScore } from '../core/gameState.js';
import { THEMES } from '../data/themes.js';

export function setupCountingGame(level, onComplete) {
    DOM.gameTitle.textContent = "Tane Hesabı";
    DOM.gameInstruction.textContent = "Yukarıdaki sayı kadar nesne olan kutuyu seç!";
    DOM.gameBoard.innerHTML = '';
    DOM.gameBoard.className = '';

    let maxNum = 5;
    if (level >= 5) maxNum = 7;
    if (level >= 6) maxNum = 10;

    const targetNumber = Math.floor(Math.random() * maxNum) + 1;

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.width = '100%';

    const targetDisplay = document.createElement('div');
    targetDisplay.className = 'counting-target';
    targetDisplay.textContent = targetNumber;
    container.appendChild(targetDisplay);

    const optionsGrid = document.createElement('div');
    optionsGrid.className = 'counting-grid';

    let answers = [targetNumber];
    while (answers.length < 4) {
        let wrong = Math.floor(Math.random() * maxNum) + 1;
        if (!answers.includes(wrong)) answers.push(wrong);
    }
    answers.sort(() => 0.5 - Math.random());

    const allImages = [];
    Object.values(THEMES).forEach(cat => allImages.push(...cat));
    allImages.sort(() => 0.5 - Math.random());

    answers.forEach((num, index) => {
        const btn = document.createElement('button');
        btn.className = `counting-option layout-${num}`;

        const itemObj = allImages[index % allImages.length];
        const iconSrc = itemObj.src;

        for (let i = 0; i < num; i++) {
            const img = document.createElement('img');
            img.src = iconSrc;
            img.className = 'count-item';
            btn.appendChild(img);
        }

        btn.addEventListener('click', () => {
            if (num === targetNumber) {
                SoundManager.playMatch();
                btn.style.background = '#d4edda';
                addScore(true, btn);
                if (onComplete) setTimeout(onComplete, 500);
            } else {
                SoundManager.playError();
                btn.style.animation = 'shake 0.4s';
                btn.style.background = '#f8d7da';
                addScore(false, btn);
                setTimeout(() => {
                    btn.style.animation = '';
                    btn.style.background = 'white';
                }, 400);
            }
        });

        optionsGrid.appendChild(btn);
    });

    container.appendChild(optionsGrid);
    DOM.gameBoard.appendChild(container);
}
