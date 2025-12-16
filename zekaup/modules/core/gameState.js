// Removed circular dependency: import { updateHeaderUI } from './ui.js';

let uiUpdater = null;

export function setUiUpdater(fn) {
    uiUpdater = fn;
}

export let currentUser = {
    name: '',
    age: 0,
    unlockedLevel: 1,
    score: 0
};

export let currentLevel = 1;

export function setCurrentLevel(level) {
    currentLevel = level;
}

export function initUser() {
    const storedUser = localStorage.getItem('zekaup_user');
    if (storedUser) {
        const parsed = JSON.parse(storedUser);
        currentUser.name = parsed.name || '';
        currentUser.age = parsed.age || 0;
        currentUser.unlockedLevel = parsed.unlockedLevel || 1;
        currentUser.score = parsed.score || 0;
        return true; // User exists
    } else {
        return false; // No user
    }
}

export function saveUser(name, age) {
    if (name !== undefined) currentUser.name = name;
    if (age !== undefined) currentUser.age = age;
    
    // Ensure defaults
    if (!currentUser.unlockedLevel) currentUser.unlockedLevel = 1;
    if (!currentUser.score) currentUser.score = 0;

    localStorage.setItem('zekaup_user', JSON.stringify(currentUser));
    if (uiUpdater) uiUpdater();
}

export function addScore(isCorrect, element, customPoints = null) {
    // Base: Correct +20, Wrong -10
    // Level Scaling: +10/-10 per level

    let reward = customPoints !== null ? customPoints : 10 + (currentLevel * 10); 
    let penalty = customPoints !== null ? 0 : currentLevel * 10;       

    const points = isCorrect ? reward : -penalty;

    currentUser.score = (currentUser.score || 0) + points;
    if (currentUser.score < 0) currentUser.score = 0; // No negative total score

    saveUser(); // Save immediately with current state

    // Visual Feedback
    if (element) {
        showScorePopup(element, isCorrect, reward, penalty);
    }
}

function showScorePopup(element, isCorrect, reward, penalty) {
    const popup = document.createElement('div');
    popup.className = `score-popup ${isCorrect ? 'score-plus' : 'score-minus'}`;
    popup.textContent = isCorrect ? `+${reward}` : `-${penalty}`;

    const rect = element.getBoundingClientRect();
    popup.style.left = `${rect.left + rect.width / 2}px`;
    popup.style.top = `${rect.top}px`;

    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 2000);
}
