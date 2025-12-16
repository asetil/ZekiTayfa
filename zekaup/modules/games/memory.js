import { DOM } from '../core/ui.js';
import { SoundManager } from '../core/soundManager.js';
import { addScore } from '../core/gameState.js';
import { THEMES } from '../data/themes.js';

let flippedCards = [];
let matchedPairs = 0;
let canFlip = true;
let totalPairs = 0;
let onCompleteCallback = null;

export function setupMemoryGame(level, onComplete) {
    onCompleteCallback = onComplete;
    DOM.gameTitle.textContent = "Eşleri Bul";
    DOM.gameInstruction.textContent = "Kartları çevir ve aynı olanları eşleştir.";

    DOM.gameBoard.innerHTML = '';
    DOM.gameBoard.className = 'game-board';
    flippedCards = [];
    matchedPairs = 0;
    canFlip = true;

    // Difficulty
    let numPairs = 2;
    if (level === 2) numPairs = 3;
    if (level === 3) numPairs = 4;
    if (level === 4) numPairs = 5;
    if (level >= 5) numPairs = 6;
    if (level >= 10) numPairs = 8;

    totalPairs = numPairs;
    const themeItems = [...getRandomTheme()];
    themeItems.sort(() => 0.5 - Math.random());
    const selectedItems = themeItems.slice(0, totalPairs);
    const cardDeck = [...selectedItems, ...selectedItems];
    cardDeck.sort(() => 0.5 - Math.random());

    let columns = 4;
    if (cardDeck.length === 4) columns = 2;

    DOM.gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    cardDeck.forEach((item) => {
        const card = createCard(item.src, item.name, item.name);
        DOM.gameBoard.appendChild(card);
    });
}

function getRandomTheme() {
    const keys = Object.keys(THEMES);
    return THEMES[keys[Math.floor(Math.random() * keys.length)]];
}

function createCard(imgSrc, label, matchId) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front">?</div>
            <div class="card-back">
                <div class="card-image" style="background-image: url('${imgSrc}')"></div>
                <div class="card-label">${label}</div>
            </div>
        </div>
    `;
    card.addEventListener('click', () => flipCard(card, matchId));
    return card;
}

function flipCard(card, matchId) {
    if (!canFlip) return;
    if (flippedCards.length >= 2) return;
    if (card.classList.contains('flipped')) return;
    if (card.classList.contains('matched')) return;

    SoundManager.playClick();
    card.classList.add('flipped');
    flippedCards.push({ card, id: matchId });

    if (flippedCards.length === 2) checkForMatch();
}

function checkForMatch() {
    canFlip = false;
    const [first, second] = flippedCards;

    if (first.id === second.id) {
        setTimeout(() => {
            SoundManager.playMatch();
            first.card.classList.add('matched');
            second.card.classList.add('matched');
            addScore(true, first.card);
            matchedPairs++;
            flippedCards = [];
            canFlip = true;
            if (matchedPairs === totalPairs && onCompleteCallback) onCompleteCallback();
        }, 600);
    } else {
        setTimeout(() => {
            SoundManager.playError();
            first.card.classList.remove('flipped');
            second.card.classList.remove('flipped');

            if (first.card.dataset.visited === 'true' && second.card.dataset.visited === 'true') {
                addScore(false, first.card);
            }
            first.card.dataset.visited = 'true';
            second.card.dataset.visited = 'true';

            flippedCards = [];
            canFlip = true;
        }, 1000);
    }
}
