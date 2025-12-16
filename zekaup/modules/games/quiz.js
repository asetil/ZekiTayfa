import { DOM } from '../core/ui.js';
import { SoundManager } from '../core/soundManager.js';
import { addScore } from '../core/gameState.js';
import { ASSOCIATION_PAIRS } from '../data/themes.js';

export function setupAssociationQuiz(level, onComplete) {
    DOM.gameTitle.textContent = "Eşleşmeyi Tamamla";
    DOM.gameInstruction.textContent = "Yukarıdaki örneğe bakarak aşağıdaki eşleşmeyi tamamla!";
    DOM.gameBoard.innerHTML = '';
    DOM.gameBoard.className = '';

    const shuffledPairs = [...ASSOCIATION_PAIRS].sort(() => 0.5 - Math.random());
    const examplePair = shuffledPairs[0];
    const questionPair = shuffledPairs[1];

    const container = document.createElement('div');
    container.className = 'quiz-container';

    container.innerHTML = `
        <div class="quiz-pairs-grid">
            <div class="quiz-pair example-pair">
                <div class="quiz-card">
                    <img src="${examplePair.a.src}" alt="${examplePair.a.name}">
                    <span class="card-label">${examplePair.a.name}</span>
                </div>
                <div class="quiz-arrow">➜</div>
                <div class="quiz-card">
                    <img src="${examplePair.b.src}" alt="${examplePair.b.name}">
                    <span class="card-label">${examplePair.b.name}</span>
                </div>
            </div>
            
            <div class="quiz-pair question-pair">
                <div class="quiz-card">
                    <img src="${questionPair.a.src}" alt="${questionPair.a.name}">
                    <span class="card-label">${questionPair.a.name}</span>
                </div>
                <div class="quiz-arrow">➜</div>
                <div class="quiz-card quiz-question">
                    <div class="question-mark">?</div>
                </div>
            </div>
        </div>
        <div class="quiz-options" id="quiz-options"></div>
    `;

    DOM.gameBoard.appendChild(container);

    const correctAnswer = questionPair.b;

    const otherPairs = ASSOCIATION_PAIRS.filter(p => p.id !== examplePair.id && p.id !== questionPair.id);
    const shuffledOthers = otherPairs.sort(() => 0.5 - Math.random());
    const distractors = shuffledOthers.slice(0, 3).map(p => p.b);

    const options = [correctAnswer, ...distractors];
    options.sort(() => 0.5 - Math.random());

    const optionsContainer = document.getElementById('quiz-options');
    const questionCard = container.querySelector('.quiz-question');

    // Drag & Drop Handlers
    questionCard.addEventListener('dragover', (e) => {
        e.preventDefault();
        questionCard.style.transform = 'scale(1.05)';
        questionCard.style.borderColor = '#4CAF50';
    });

    questionCard.addEventListener('dragleave', (e) => {
        questionCard.style.transform = '';
        questionCard.style.borderColor = '';
    });

    questionCard.addEventListener('drop', (e) => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        handleAnswer(data.opt, data.btnIndex);
        questionCard.style.transform = '';
        questionCard.style.borderColor = '';
    });

    // Touch events for mobile drag and drop simulation (optional but good)
    // For now simple DnD.

    options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.draggable = true;
        btn.id = `quiz-opt-${index}`;
        
        btn.innerHTML = `
            <img src="${opt.src}" alt="${opt.name}" draggable="false">
            <span class="quiz-option-label">${opt.name}</span>
        `;

        // Click Handler
        btn.addEventListener('click', () => handleAnswer(opt, index));

        // Drag Start
        btn.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', JSON.stringify({ opt: opt, btnIndex: index }));
            btn.style.opacity = '0.5';
        });

        btn.addEventListener('dragend', () => {
            btn.style.opacity = '1';
        });

        optionsContainer.appendChild(btn);
    });

    function handleAnswer(selectedOpt, btnIndex) {
        // Find button by index if needed for animation
        const btn = document.getElementById(`quiz-opt-${btnIndex}`);

        if (selectedOpt.name === correctAnswer.name) { // Compare names or IDs if cleaner
            SoundManager.playMatch();
            questionCard.innerHTML = `
                <img src="${selectedOpt.src}" style="width:80%; height:80%; object-fit:contain;">
                <span class="card-label">${selectedOpt.name}</span>
            `;
            questionCard.style.background = '#d4edda';
            questionCard.style.border = '4px solid #28a745';
            
            if(btn) {
                btn.style.background = '#d4edda';
                addScore(true, btn);
            } else {
                 addScore(true, questionCard);
            }

            if (onComplete) setTimeout(onComplete, 800);
        } else {
            SoundManager.playError();
            if (btn) {
                btn.style.animation = 'shake 0.4s';
                btn.style.background = '#FFEBEE';
                addScore(false, btn);
                setTimeout(() => {
                    btn.style.animation = '';
                    btn.style.background = 'white';
                }, 400);
            }
        }
    }
}
