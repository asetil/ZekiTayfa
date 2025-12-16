import { DOM } from '../core/ui.js';
import { SoundManager } from '../core/soundManager.js';
import { addScore } from '../core/gameState.js';

export function setupCipherGame(level, onComplete) {
    DOM.gameTitle.textContent = "Şifreyi Çöz";
    DOM.gameInstruction.textContent = "Harflerin hangi rakamlara karşılık geldiğini bul!";
    DOM.gameBoard.innerHTML = '';
    DOM.gameBoard.className = '';

    let numLetters, numExamples;
    if (level <= 2) {
        numLetters = 3; 
        numExamples = 3;
    } else if (level <= 6) {
        numLetters = 4;
        numExamples = 3;
    } else if (level <= 10) {
        numLetters = 5;
        numExamples = 3;
    } else {
        numLetters = 6;
        numExamples = 3;
    }

    const letters = ['A', 'B', 'U', 'K', 'C', 'Y', 'D', 'E'].slice(0, numLetters);
    const numbers = [];
    while (numbers.length < numLetters) {
        const num = Math.floor(Math.random() * 9) + 1;
        if (!numbers.includes(num)) {
            numbers.push(num);
        }
    }

    const mapping = {};
    letters.forEach((letter, index) => {
        mapping[letter] = numbers[index];
    });

    const examples = [];
    for (let i = 0; i < numExamples; i++) {
        const combo = [];
        for (let j = 0; j < 3; j++) {
            combo.push(letters[Math.floor(Math.random() * letters.length)]);
        }
        const letterStr = combo.join('');
        const numberStr = combo.map(l => mapping[l]).join('');
        examples.push({ letters: letterStr, numbers: numberStr });
    }

    let questionCombo;
    do {
        questionCombo = [];
        for (let j = 0; j < 3; j++) {
            questionCombo.push(letters[Math.floor(Math.random() * letters.length)]);
        }
    } while (examples.some(ex => ex.letters === questionCombo.join('')));

    const questionLetters = questionCombo.join('');
    const correctAnswer = questionCombo.map(l => mapping[l]).join('');

    const container = document.createElement('div');
    container.className = 'cipher-container';

    const examplesDiv = document.createElement('div');
    examplesDiv.className = 'cipher-examples';

    examples.forEach(ex => {
        const exampleRow = document.createElement('div');
        exampleRow.className = 'cipher-row example-row';
        exampleRow.innerHTML = `
            <div class="cipher-letters">${ex.letters}</div>
            <div class="cipher-equals">→</div>
            <div class="cipher-numbers">${ex.numbers}</div>
        `;
        examplesDiv.appendChild(exampleRow);
    });

    container.appendChild(examplesDiv);

    const questionDiv = document.createElement('div');
    questionDiv.className = 'cipher-question-section';
    const questionRow = document.createElement('div');
    questionRow.className = 'cipher-row question-row';
    questionRow.innerHTML = `
        <div class="cipher-letters">${questionLetters}</div>
        <div class="cipher-equals">→</div>
        <div class="cipher-numbers cipher-answer">?</div>
    `;
    questionDiv.appendChild(questionRow);
    container.appendChild(questionDiv);

    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'cipher-options';

    let options = [correctAnswer];
    while (options.length < 4) {
        let wrong = '';
        for (let i = 0; i < 3; i++) {
            wrong += Math.floor(Math.random() * 9) + 1;
        }
        if (!options.includes(wrong)) {
            options.push(wrong);
        }
    }

    options.sort(() => 0.5 - Math.random());

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'cipher-option-btn';
        btn.textContent = opt;

        btn.addEventListener('click', () => {
            if (opt === correctAnswer) {
                SoundManager.playMatch();
                const answerDiv = container.querySelector('.cipher-answer');
                answerDiv.textContent = correctAnswer;
                answerDiv.style.background = '#d4edda';
                answerDiv.style.color = '#155724';
                btn.style.background = '#d4edda';
                btn.style.transform = 'scale(1.1)';
                addScore(true, btn);
                if (onComplete) setTimeout(onComplete, 1000);
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
