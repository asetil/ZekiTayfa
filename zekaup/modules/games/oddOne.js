import { DOM } from '../core/ui.js';
import { SoundManager } from '../core/soundManager.js';
import { addScore } from '../core/gameState.js';
import { THEMES } from '../data/themes.js';

export function setupOddOneGame(level, onComplete) {
    DOM.gameTitle.textContent = "Farkı Bul";
    DOM.gameInstruction.textContent = "Diğerlerinden farklı olan karta tıkla.";
    DOM.gameBoard.innerHTML = '';
    DOM.gameBoard.className = 'game-board';

    const categories = Object.keys(THEMES);
    const targetCat = categories[Math.floor(Math.random() * categories.length)];
    let distractorCat = categories[Math.floor(Math.random() * categories.length)];
    while (distractorCat === targetCat) {
        distractorCat = categories[Math.floor(Math.random() * categories.length)];
    }

    const targetItems = THEMES[targetCat];
    const distractorItems = THEMES[distractorCat];

    let totalCards = 4;
    if (level >= 2) totalCards = 6;
    if (level >= 3) totalCards = 8;
    if (level >= 5) totalCards = 9;
    if (level >= 8) totalCards = 12;

    const numTargets = totalCards - 1;
    const shuffledTargets = [...targetItems].sort(() => 0.5 - Math.random());
    const selectedTargets = shuffledTargets.slice(0, numTargets);
    const distractor = distractorItems[Math.floor(Math.random() * distractorItems.length)];

    const cardDeck = [...selectedTargets, distractor];
    cardDeck.sort(() => 0.5 - Math.random());

    let columns = 4;
    if (totalCards === 4) columns = 2;
    else if (totalCards === 6) columns = 3;
    DOM.gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    cardDeck.forEach((item) => {
        const isOddOne = item === distractor;
        const card = document.createElement('div');
        card.className = 'card flipped';

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">?</div>
                <div class="card-back">
                    <div class="card-image" style="background-image: url('${item.src}')"></div>
                    <div class="card-label">${item.name}</div>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            if (card.classList.contains('matched')) return;
            if (isOddOne) {
                SoundManager.playMatch();
                card.classList.add('matched');
                addScore(true, card);
                if (onComplete) onComplete();
            } else {
                SoundManager.playError();
                card.style.animation = 'shake 0.4s';
                addScore(false, card);
                setTimeout(() => card.style.animation = '', 400);
            }
        });
        DOM.gameBoard.appendChild(card);
    });
}
