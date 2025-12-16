import { DOM } from '../core/ui.js';
import { SoundManager } from '../core/soundManager.js';
import { addScore } from '../core/gameState.js';
import { ASSOCIATION_PAIRS } from '../data/themes.js';

let flippedCards = [];
let matchedPairs = 0;
let canFlip = true;
let totalPairs = 0;
let onCompleteCallback = null;

export function setupAssociationGame(level, onComplete) {
    onCompleteCallback = onComplete;
    DOM.gameTitle.textContent = "İlişkili Olanı Bul";
    DOM.gameInstruction.textContent = "Birbiriyle ilişkili kartları eşleştir. (Örn: Tavuk - Civciv)";

    DOM.gameBoard.innerHTML = '';
    DOM.gameBoard.className = 'game-board';
    flippedCards = [];
    matchedPairs = 0;
    canFlip = true;

    let numPairs = 2;
    if (level >= 3) numPairs = 3;
    if (level >= 5) numPairs = 4;
    if (level >= 8) numPairs = 6;

    totalPairs = numPairs;

    const shuffledPairs = [...ASSOCIATION_PAIRS].sort(() => 0.5 - Math.random());
    const selectedPairs = shuffledPairs.slice(0, numPairs);

    let cardItems = [];
    selectedPairs.forEach(pair => {
        cardItems.push({ ...pair.a, id: pair.id });
        cardItems.push({ ...pair.b, id: pair.id });
    });

    cardItems.sort(() => 0.5 - Math.random());

    let columns = 4;
    if (cardItems.length === 4) columns = 2;
    else if (cardItems.length === 6) columns = 3;

    DOM.gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    cardItems.forEach(item => {
        const card = createCard(item.src, item.name, item.id);
        DOM.gameBoard.appendChild(card);
    });
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
