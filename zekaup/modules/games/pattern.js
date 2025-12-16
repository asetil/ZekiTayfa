import { DOM } from '../core/ui.js';
import { SoundManager } from '../core/soundManager.js';
import { addScore } from '../core/gameState.js';
import { PATTERN_ELEMENTS } from '../data/themes.js';

export function setupPatternGame(level, onComplete) {
    DOM.gameTitle.textContent = "Örüntüyü Tamamla";
    DOM.gameInstruction.textContent = "Soru işareti yerine ne gelmeli?";
    DOM.gameBoard.innerHTML = '';
    DOM.gameBoard.className = '';

    let patternType, patternLength;

    if (level <= 7) {
        const types = ['colors', 'shapes', 'numbers', 'letters'];
        patternType = types[Math.floor(Math.random() * types.length)];
        patternLength = 5 + Math.floor(Math.random() * 3);
    } else if (level <= 10) {
        const types = ['colors', 'shapes', 'animals', 'fruits', 'numbers', 'letters'];
        patternType = types[Math.floor(Math.random() * types.length)];
        patternLength = 5 + Math.floor(Math.random() * 3);
    } else {
        const types = ['colors', 'shapes', 'animals', 'fruits', 'numbers', 'letters'];
        patternType = types[Math.floor(Math.random() * types.length)];
        patternLength = 6 + Math.floor(Math.random() * 2);
    }

    const elements = PATTERN_ELEMENTS[patternType];
    let availablePatterns;

    if (level <= 7) {
        availablePatterns = ['AB', 'BA', 'AAB', 'ABB', 'ABA'];
        patternLength = 5;
    } else if (level <= 10) {
        availablePatterns = ['ABC', 'AAB', 'ABB', 'ABA', 'BAA', 'AABB', 'ABBA'];
        patternLength = 6;
    } else {
        availablePatterns = ['ABCD', 'AABC', 'ABCC', 'ABAC', 'ABBC', 'AABBC'];
        patternLength = 7;
    }

    const chosenTemplate = availablePatterns[Math.floor(Math.random() * availablePatterns.length)];
    const uniqueElements = [];
    const maxUniqueNeeded = Math.max(...chosenTemplate.split('').map(char => char.charCodeAt(0) - 64));

    for (let i = 0; i < maxUniqueNeeded; i++) {
        let elem = elements[Math.floor(Math.random() * elements.length)];
        while (uniqueElements.some(e => e.id === elem.id)) {
            elem = elements[Math.floor(Math.random() * elements.length)];
        }
        uniqueElements.push(elem);
    }

    const templateMap = {};
    for (let i = 0; i < uniqueElements.length; i++) {
        templateMap[String.fromCharCode(65 + i)] = uniqueElements[i];
    }

    const baseSequence = chosenTemplate.split('').map(letter => templateMap[letter]);
    let pattern = [];
    const totalItems = patternLength;

    let questionPosition;
    if (level <= 7) {
        questionPosition = totalItems - 1 - Math.floor(Math.random() * 2);
    } else {
        questionPosition = Math.floor(totalItems / 2) + Math.floor(Math.random() * (totalItems - Math.floor(totalItems / 2)));
    }

    for (let i = 0; i < totalItems; i++) {
        if (i !== questionPosition) {
            pattern.push(baseSequence[i % baseSequence.length]);
        }
    }

    const correctAnswer = baseSequence[questionPosition % baseSequence.length]; // Correct logic

    const container = document.createElement('div');
    container.className = 'pattern-container';

    const sequenceDiv = document.createElement('div');
    sequenceDiv.className = 'pattern-sequence';

    let visualIndex = 0;
    for (let i = 0; i < totalItems; i++) {
        if (i === questionPosition) {
            const questionMark = document.createElement('div');
            questionMark.className = 'pattern-item pattern-question';
            questionMark.textContent = '?';
            questionMark.dataset.position = questionPosition;
            sequenceDiv.appendChild(questionMark);
        } else {
            const item = document.createElement('div');
            item.className = 'pattern-item';
            item.textContent = pattern[visualIndex].emoji;
            if (pattern[visualIndex].size) {
                item.style.fontSize = pattern[visualIndex].size;
            }
            sequenceDiv.appendChild(item);
            visualIndex++;
        }
    }

    container.appendChild(sequenceDiv);

    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'pattern-options';

    let options = [correctAnswer];
    while (options.length < 4) {
        const wrong = elements[Math.floor(Math.random() * elements.length)];
        if (!options.find(opt => opt.id === wrong.id)) {
            options.push(wrong);
        }
    }
    options.sort(() => 0.5 - Math.random());

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'pattern-option-btn';
        btn.textContent = opt.emoji;
        if (opt.size) btn.style.fontSize = opt.size;

        btn.addEventListener('click', () => {
            if (opt.id === correctAnswer.id) {
                SoundManager.playMatch();
                const questionMark = container.querySelector('.pattern-question');
                questionMark.textContent = correctAnswer.emoji;
                if (correctAnswer.size) questionMark.style.fontSize = correctAnswer.size;
                questionMark.classList.add('correct');
                btn.style.background = '#d4edda';
                btn.style.transform = 'scale(1.1)';
                addScore(true, btn);
                if (onComplete) setTimeout(onComplete, 800);
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

        optionsDiv.appendChild(btn);
    });

    container.appendChild(optionsDiv);
    DOM.gameBoard.appendChild(container);
}
