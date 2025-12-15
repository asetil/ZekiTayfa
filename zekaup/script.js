document.addEventListener('DOMContentLoaded', () => {
    // Screens
    const welcomeScreen = document.getElementById('welcome-screen');
    const levelScreen = document.getElementById('level-screen');
    const gameScreen = document.getElementById('game-screen');
    const appHeader = document.getElementById('app-header');

    // Header Elements
    const headerName = document.getElementById('header-name');
    const headerAge = document.getElementById('header-age');
    const headerLevel = document.getElementById('header-level');
    // We will dynamically add score element since it might not exist in HTML

    // Create Header Score Element if missing
    let headerScore = document.getElementById('header-score');
    if (!headerScore) {
        headerScore = document.createElement('div');
        headerScore.id = 'header-score';
        headerScore.className = 'score-display';
        headerScore.textContent = '🪙 0';
        document.querySelector('.app-header').appendChild(headerScore);
    }
    const navLevelBtn = document.getElementById('nav-levels-btn');
    const navSwitchBtn = document.getElementById('nav-switch-btn');

    // Game Elements
    const nameInput = document.getElementById('name-input');
    const levelsGrid = document.getElementById('levels-grid');
    const ageButtons = document.querySelectorAll('.age-btn');
    const gameBoard = document.getElementById('game-board');
    const gameTitle = document.getElementById('game-title');
    const gameInstruction = document.getElementById('game-instruction');

    // Modal Elements
    const successModal = document.getElementById('success-modal');
    const nextLevelBtn = document.getElementById('next-level-btn');
    const menuBtn = document.getElementById('menu-btn');

    // State
    const AppVersion = '1.4';
    let currentUser = {
        name: '',
        age: 0,
        unlockedLevel: 1,
        score: 0
    };
    let currentLevel = 1;

    // Game State
    let flippedCards = [];
    let matchedPairs = 0;
    let canFlip = true;
    let totalPairs = 0;



    // Sequence Game State
    let gameSequence = [];
    let userSequence = [];
    let isShowingSequence = false;

    // Cumulative Logic
    let minigameQueue = [];
    let queueIndex = 0;

    // Config
    const levelsConfig = {
        maxLevelsYoung: 10,
        maxLevelsOld: 20
    };

    // --- Assets ---
    // Memory Game Themes
    const THEMES = {
        animals: [
            { name: "KEDİ", src: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=200&fit=crop" },
            { name: "KÖPEK", src: "https://png.pngtree.com/png-vector/20250111/ourmid/pngtree-golden-retriever-dog-pictures-png-image_15147078.png" },
            { name: "ASLAN", src: "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=200&fit=crop" },
            { name: "FİL", src: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=200&fit=crop" },
            { name: "TAVŞAN", src: "https://cdn.pixabay.com/photo/2025/02/22/10/28/bunny-9423909_640.jpg" },
            { name: "ZÜRAFA", src: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=200&fit=crop" },
            { name: "MAYMUN", src: "https://media.istockphoto.com/id/93214254/tr/foto%C4%9Fraf/vervet-monkey-chlorocebus-pygerythrus.jpg?s=612x612&w=0&k=20&c=TqjlGs9XYkFEgJCrHfXbzow_11Sa5HpXg2m-GSoKHsM=" },
            { name: "PANDA", src: "https://png.pngtree.com/png-vector/20231126/ourmid/pngtree-clipart-panda-white-background-png-image_10727356.png" }
        ],
        fruits: [
            { name: "ELMA", src: "https://png.pngtree.com/png-vector/20241210/ourmid/pngtree-glossy-red-apple-artwork-perfect-for-food-themed-projects-png-image_14657026.png" },
            { name: "MUZ", src: "https://images.pexels.com/photos/6848574/pexels-photo-6848574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
            { name: "ÇİLEK", src: "https://png.pngtree.com/png-vector/20250616/ourmid/pngtree-fresh-red-strawberry-on-white-background-png-image_16540744.png" },
            { name: "KARPUZ", src: "https://png.pngtree.com/png-clipart/20250221/original/pngtree-watermelon-png-image_20491271.png" },
            { name: "ÜZÜM", src: "https://media.istockphoto.com/id/91094708/photo/three-various-grades-of-grapes.jpg?b=1&s=612x612&w=0&k=20&c=A5_EYIyh1bEpqUeRnlTZ_RwRsqLJCbEH1gpZwkj7iYY=" },
            { name: "LİMON", src: "https://png.pngtree.com/png-vector/20250508/ourmid/pngtree-lemon-png-image_16221455.png" },
            { name: "PORTAKAL", src: "https://png.pngtree.com/png-vector/20240208/ourlarge/pngtree-fresh-whole-three-ripe-oranges-png-image_11717743.png" },
            { name: "KİRAZ", src: "https://png.pngtree.com/png-vector/20250620/ourmid/pngtree-four-red-cherries-with-green-leaf-closeup-png-image_16559108.png" }
        ],
        veggies: [
            { name: "HAVUÇ", src: "https://png.pngtree.com/png-vector/20240206/ourmid/pngtree-fresh-vegetable-carrot-png-image_11666117.png" },
            { name: "DOMATES", src: "https://png.pngtree.com/png-vector/20230903/ourlarge/pngtree-fruit-fresh-tomato-png-image_9959799.png" },
            { name: "MISIR", src: "https://png.pngtree.com/png-vector/20250604/ourmid/pngtree-corn-cobs-with-husks-on-white-background-png-image_16457623.png" },
            { name: "BROKOLİ", src: "https://cdn.pixabay.com/photo/2016/06/11/15/33/broccoli-1450274_640.png" },
            { name: "PATATES", src: "https://png.pngtree.com/png-vector/20250630/ourmid/pngtree-single-yellow-potato-isolated-on-transparent-background-png-image_16589173.webp" },
            { name: "SOĞAN", src: "https://static7.depositphotos.com/1020804/753/i/450/depositphotos_7535602-stock-photo-onion-on-a-white-background.jpg" },
            { name: "BİBER", src: "https://vedigida.com/wp-content/uploads/2022/07/yesil-biber-500-gr-sebze-985-30-B.jpg" },
            { name: "BALKABAĞI", src: "https://png.pngtree.com/png-vector/20250221/ourmid/pngtree-happy-thanksgiving-day-pumpkin-icon-3d-rendering-png-image_15548670.png" }
        ]
    };

    // Association Game Pairs (20 Pairs)
    // Using Icons8 Flat Color Icons for beautiful, consistent visuals
    const ASSOCIATION_PAIRS = [
        { id: '1', a: { name: 'TAVUK', src: 'https://img.icons8.com/fluency/200/chicken.png' }, b: { name: 'CİVCİV', src: 'https://img.icons8.com/color/200/chick.png' } },
        { id: '2', a: { name: 'İNEK', src: 'https://img.icons8.com/fluency/200/cow.png' }, b: { name: 'SÜT', src: 'https://img.icons8.com/fluency/200/milk-bottle.png' } },
        { id: '3', a: { name: 'ARI', src: 'https://img.icons8.com/fluency/200/bee.png' }, b: { name: 'BAL', src: 'https://img.icons8.com/fluency/200/honey.png' } },
        { id: '4', a: { name: 'KÖPEK', src: 'https://img.icons8.com/fluency/200/dog.png' }, b: { name: 'KEMİK', src: 'https://img.icons8.com/emoji/200/bone-emoji.png' } },
        { id: '5', a: { name: 'MAYMUN', src: 'https://img.icons8.com/color/200/gorilla.png' }, b: { name: 'MUZ', src: 'https://img.icons8.com/fluency/200/banana.png' } },
        { id: '6', a: { name: 'TAVŞAN', src: 'https://img.icons8.com/fluency/200/rabbit.png' }, b: { name: 'HAVUÇ', src: 'https://img.icons8.com/fluency/200/carrot.png' } },
        { id: '7', a: { name: 'FARE', src: 'https://img.icons8.com/fluency/200/mouse.png' }, b: { name: 'PEYNİR', src: 'https://img.icons8.com/fluency/200/cheese.png' } },
        { id: '8', a: { name: 'ÖRÜMCEK', src: 'https://img.icons8.com/fluency/200/spider.png' }, b: { name: 'AĞ', src: 'https://img.icons8.com/fluency/200/spiderweb.png' } },
        { id: '9', a: { name: 'YAĞMUR', src: 'https://img.icons8.com/fluency/200/rain.png' }, b: { name: 'ŞEMSİYE', src: 'https://img.icons8.com/fluency/200/umbrella.png' } },
        { id: '10', a: { name: 'GÜNEŞ', src: 'https://img.icons8.com/fluency/200/sun.png' }, b: { name: 'GÖZLÜK', src: 'https://img.icons8.com/color/200/sunglasses.png' } },
        { id: '11', a: { name: 'BALIK', src: 'https://img.icons8.com/fluency/200/fish.png' }, b: { name: 'AKVARYUM', src: 'https://img.icons8.com/fluency/200/aquarium.png' } },
        { id: '12', a: { name: 'KUŞ', src: 'https://img.icons8.com/fluency/200/bird.png' }, b: { name: 'YUVA', src: 'https://img.icons8.com/fluency/200/nest.png' } },
        { id: '13', a: { name: 'DOKTOR', src: 'https://img.icons8.com/fluency/200/doctor-male.png' }, b: { name: 'STETOSKOP', src: 'https://img.icons8.com/fluency/200/stethoscope.png' } },
        { id: '14', a: { name: 'RESSAM', src: 'https://img.icons8.com/color/200/paint-palette.png' }, b: { name: 'FIRÇA', src: 'https://img.icons8.com/fluency/200/paint-brush.png' } },
        { id: '15', a: { name: 'FUTBOLCU', src: 'https://img.icons8.com/fluency/200/football-player.png' }, b: { name: 'TOP', src: 'https://img.icons8.com/color/200/football.png' } },
        { id: '16', a: { name: 'BEBEK', src: 'https://img.icons8.com/fluency/200/baby.png' }, b: { name: 'BİBERON', src: 'https://img.icons8.com/fluency/200/baby-bottle.png' } },
        { id: '17', a: { name: 'DİŞ', src: 'https://img.icons8.com/fluency/200/tooth.png' }, b: { name: 'FIRÇA', src: 'https://img.icons8.com/fluency/200/toothbrush.png' } },
        { id: '18', a: { name: 'ARABA', src: 'https://img.icons8.com/fluency/200/car.png' }, b: { name: 'YOL', src: 'https://img.icons8.com/fluency/200/road.png' } },
        { id: '19', a: { name: 'KİLİT', src: 'https://img.icons8.com/fluency/200/lock.png' }, b: { name: 'ANAHTAR', src: 'https://img.icons8.com/fluency/200/key.png' } },
        { id: '20', a: { name: 'ÇEKİÇ', src: 'https://img.icons8.com/fluency/200/hammer.png' }, b: { name: 'ÇİVİ', src: 'https://img.icons8.com/fluency/200/nail.png' } }
    ];

    // Pattern Game Data
    const PATTERN_ELEMENTS = {
        colors: [
            { id: 'red', emoji: '🔴', name: 'KIRMIZI' },
            { id: 'blue', emoji: '🔵', name: 'MAVİ' },
            { id: 'green', emoji: '🟢', name: 'YEŞİL' },
            { id: 'yellow', emoji: '🟡', name: 'SARI' },
            { id: 'purple', emoji: '🟣', name: 'MOR' },
            { id: 'orange', emoji: '🟠', name: 'TURUNCU' }
        ],
        shapes: [
            { id: 'circle', emoji: '🟣', name: 'MOR DAİRE' },
            { id: 'square', emoji: '�', name: 'SARI KARE' },
            { id: 'triangle', emoji: '🔺', name: 'KIRMIZI ÜÇGEN' },
            { id: 'diamond', emoji: '🔶', name: 'TURUNCU ELMAS' },
            { id: 'star', emoji: '⭐', name: 'YILDIZ' },
            { id: 'heart', emoji: '💚', name: 'YEŞİL KALP' },
            { id: 'hexagon', emoji: '⬡', name: 'ALTIGEN' }
        ],
        animals: [
            { id: 'cat', emoji: '🐱', name: 'KEDİ' },
            { id: 'dog', emoji: '🐶', name: 'KÖPEK' },
            { id: 'rabbit', emoji: '🐰', name: 'TAVŞAN' },
            { id: 'bear', emoji: '🐻', name: 'AYI' },
            { id: 'frog', emoji: '🐸', name: 'KURBAĞA' }
        ],
        fruits: [
            { id: 'apple', emoji: '🍎', name: 'ELMA' },
            { id: 'banana', emoji: '🍌', name: 'MUZ' },
            { id: 'orange', emoji: '🍊', name: 'PORTAKAL' },
            { id: 'grape', emoji: '🍇', name: 'ÜZÜM' },
            { id: 'watermelon', emoji: '🍉', name: 'KARPUZ' }
        ],
        numbers: [
            { id: '1', emoji: '1️⃣', name: 'BİR' },
            { id: '2', emoji: '2️⃣', name: 'İKİ' },
            { id: '3', emoji: '3️⃣', name: 'ÜÇ' },
            { id: '4', emoji: '4️⃣', name: 'DÖRT' },
            { id: '5', emoji: '5️⃣', name: 'BEŞ' },
            { id: '6', emoji: '6️⃣', name: 'ALTI' }
        ],
        letters: [
            { id: 'A', emoji: '🅰️', name: 'A' },
            { id: 'B', emoji: '🅱️', name: 'B' },
            { id: 'C', emoji: '🅲', name: 'C' },
            { id: 'D', emoji: '🅳', name: 'D' },
            { id: 'E', emoji: '🅴', name: 'E' },
            { id: 'F', emoji: '🅵', name: 'F' }
        ],
        sizes: [
            { id: 'small', emoji: '🔹', name: 'KÜÇÜK', size: '30px' },
            { id: 'medium', emoji: '🔷', name: 'ORTA', size: '50px' },
            { id: 'large', emoji: '🔶', name: 'BÜYÜK', size: '70px' }
        ]
    };

    // --- Audio System (File Based) ---
    const SoundManager = {
        sounds: {
            click: new Audio('audio/click.mp3'),
            match: new Audio('audio/match.mp3'),
            error: new Audio('audio/error.mp3'),
            win: new Audio('audio/win.mp3')
        },

        init() {
            // Preload
            Object.values(this.sounds).forEach(s => s.load());
        },

        playSound(name) {
            const sound = this.sounds[name];
            if (sound) {
                // Clone to allow overlapping sounds (rapid clicks)
                const clone = sound.cloneNode();
                clone.play().catch(e => console.log('Audio play failed:', e));
            }
        },

        playClick() {
            this.playSound('click');
        },

        playMatch() {
            this.playSound('match');
        },

        playError() {
            this.playSound('error');
        },

        playWin() {
            this.playSound('win');
        }
    };

    // --- Init ---
    init();

    // --- Event Listeners ---

    ageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const name = nameInput.value.trim();
            if (!name) {
                nameInput.classList.add('error');
                setTimeout(() => nameInput.classList.remove('error'), 500);
                nameInput.focus();
                return;
            }

            const age = parseInt(btn.dataset.age);
            saveUser(name, age);
            selectAge(age);
        });
    });

    navSwitchBtn.addEventListener('click', () => {
        localStorage.removeItem('zekaup_user');
        appHeader.classList.add('hidden');
        nameInput.value = '';
        showScreen(welcomeScreen);
    });

    navLevelBtn.addEventListener('click', () => {
        showScreen(levelScreen);
    });

    menuBtn.addEventListener('click', () => {
        hideModal();
        showScreen(levelScreen);
    });

    nextLevelBtn.addEventListener('click', () => {
        hideModal();
        startLevel(currentLevel + 1);
    });

    // --- Core Functions ---

    function init() {
        // Initialize Audio Context on first interaction to allow auto-play
        document.body.addEventListener('click', () => {
            SoundManager.init();
        }, { once: true });

        const storedUser = localStorage.getItem('zekaup_user');
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
            updateHeaderUI();
            selectAge(currentUser.age);
        } else {
            appHeader.classList.add('hidden');
            showScreen(welcomeScreen);
        }
    }

    function saveUser(name, age) {
        currentUser.name = name;
        currentUser.age = age;
        if (!currentUser.unlockedLevel) currentUser.unlockedLevel = 1;
        if (!currentUser.score) currentUser.score = 0;

        localStorage.setItem('zekaup_user', JSON.stringify(currentUser));
        updateHeaderUI();
    }

    function updateHeaderUI() {
        appHeader.classList.remove('hidden');
        headerName.textContent = currentUser.name;
        headerAge.textContent = `${currentUser.age} Yaş`;
        headerLevel.textContent = `Seviye ${currentUser.unlockedLevel}`;
        headerScore.textContent = `🪙 ${currentUser.score || 0}`;
    }

    // --- Score System ---
    function addScore(isCorrect, element) {
        // Base: Correct +20, Wrong -10
        // Level Scaling: +10/-10 per level

        let reward = 10 + (currentLevel * 10); // L1: 20, L2: 30...
        let penalty = currentLevel * 10;       // L1: 10, L2: 20...

        const points = isCorrect ? reward : -penalty;

        currentUser.score = (currentUser.score || 0) + points;
        if (currentUser.score < 0) currentUser.score = 0; // No negative total score

        saveUser(currentUser.name, currentUser.age); // Save immediately

        // Visual Feedback
        if (element) {
            const popup = document.createElement('div');
            popup.className = `score-popup ${isCorrect ? 'score-plus' : 'score-minus'}`;
            popup.textContent = isCorrect ? `+${reward}` : `-${penalty}`;

            const rect = element.getBoundingClientRect();
            popup.style.left = `${rect.left + rect.width / 2}px`;
            popup.style.top = `${rect.top}px`;

            document.body.appendChild(popup);
            setTimeout(() => popup.remove(), 2000);
        }
    }

    function selectAge(age) {
        currentUser.age = age;
        generateLevelButtons(age);
        showScreen(levelScreen);
    }

    function generateLevelButtons(age) {
        levelsGrid.innerHTML = '';
        const limit = age < 6 ? levelsConfig.maxLevelsYoung : levelsConfig.maxLevelsOld;

        for (let i = 1; i <= limit; i++) {
            const btn = document.createElement('button');
            btn.className = 'level-btn';
            btn.textContent = i;

            if (i > currentUser.unlockedLevel) {
                btn.classList.add('locked');
            }

            const rotate = (Math.random() * 6 - 3).toFixed(1);
            btn.style.transform = `rotate(${rotate}deg)`;

            btn.addEventListener('click', () => {
                if (i <= currentUser.unlockedLevel) {
                    startLevel(i);
                } else {
                    btn.style.animation = 'shake 0.4s';
                    setTimeout(() => btn.style.animation = '', 400);
                }
            });

            if (i <= currentUser.unlockedLevel) {
                btn.addEventListener('mouseenter', () => { btn.style.transform = `rotate(0deg) scale(1.1)`; });
                btn.addEventListener('mouseleave', () => { btn.style.transform = `rotate(${rotate}deg)`; });
            }

            levelsGrid.appendChild(btn);
        }
    }

    // --- Level Rotation ---
    // Cycle: 
    // L1: Memory
    // L2: Odd One
    // L3: Association
    // L4: Quiz (Complete Pair)
    // ...
    const ALL_MINIGAMES = [
        'memory',
        'odd',
        'assoc',
        'counting',
        'sequence',
        'pattern',
        'quiz',
        'cipher'
    ];

    let minigameBag = [];
    function refillBag() {
        minigameBag = [...ALL_MINIGAMES]
            .sort(() => Math.random() - 0.5);
    }

    function drawGames(count) {
        if (minigameBag.length < count) {
            refillBag();
        }

        return minigameBag.splice(0, count);
    }

    function startLevel(level) {
        currentLevel = level;
        minigameQueue = [];

        if (minigameBag.length === 0) {
            refillBag();
        }

        const gameCount = level <= 8 ? 1 : 2;

        minigameQueue = drawGames(gameCount);

        queueIndex = 0;
        loadMinigame();
    }



    function loadMinigame() {
        const gameType = minigameQueue[queueIndex];

        // Show progress if queue > 1
        if (minigameQueue.length > 1) {
            // Optional: Toast/Overlay saying "Bölüm 2/3" etc.
            // For now, just load the screen.
        }

        if (gameType === 'memory') setupMemoryGame(currentLevel);
        else if (gameType === 'odd') setupOddOneGame(currentLevel);
        else if (gameType === 'assoc') setupAssociationGame(currentLevel); // The pair matching
        else if (gameType === 'counting') setupCountingGame(currentLevel);
        else if (gameType === 'sequence') setupSequenceGame(currentLevel);
        else if (gameType === 'pattern') setupPatternGame(currentLevel);
        else if (gameType === 'quiz') setupAssociationQuiz(currentLevel); // Association quiz
        else if (gameType === 'cipher') setupCipherGame(currentLevel); // Letter-number cipher

        showScreen(gameScreen);
    }

    function advanceQueue() {
        queueIndex++;
        if (queueIndex < minigameQueue.length) {
            // Small delay or effect before next game?
            setTimeout(() => {
                gameBoard.innerHTML = ''; // Clear
                loadMinigame();
            }, 500);
        } else {
            // Level Complete
            completeLevel();
        }
    }

    // --- Game Logic: Sequence Memory ---
    const SEQ_COLORS = ['red', 'blue', 'green', 'yellow'];

    function setupSequenceGame(level) {
        gameTitle.textContent = "Sırayı Hatırla";
        gameInstruction.textContent = "Yanan ışıkları sırasıyla tekrar et!";
        gameBoard.innerHTML = '';
        gameBoard.className = ''; // No grid for this custom layout

        const container = document.createElement('div');
        container.className = 'sequence-container';

        // 2x2 Grid for buttons
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
        gameBoard.appendChild(container);

        // Reset State
        gameSequence = [];
        userSequence = [];
        isShowingSequence = false;

        // Generate full sequence based on target length
        // Level 5 (Intro): 2 Steps
        // Level 6: 3 Steps
        // Level 7: 4 Steps
        // Level 8+: 5 Steps

        let targetLength = 2;

        if (level >= 6) targetLength = 3;
        if (level >= 7) targetLength = 4;
        if (level >= 8) targetLength = 5;
        if (level >= 15) targetLength = 6;

        generateSequence(targetLength);

        // Start!
        setTimeout(() => playSequence(), 1000);
    }

    function generateSequence(length) {
        gameSequence = [];
        const colors = ['red', 'blue', 'green', 'yellow'];

        for (let i = 0; i < length; i++) {
            let randomColor = colors[Math.floor(Math.random() * colors.length)];

            // Prevent same color twice in a row
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

            const color = gameSequence[i];
            activateSequenceBtn(color);
            i++;
        }, 1000);
    }

    function activateSequenceBtn(color) {
        const btn = document.querySelector(`.sequence-btn.${color}`);
        if (!btn) return;

        btn.classList.add('active');

        // Play uniform click sound for all colors
        SoundManager.playSound('click');

        /* 
        // Old Logic:
        if (color === 'red') SoundManager.playSound('click'); 
        if (color === 'blue') SoundManager.playSound('match');
        if (color === 'green') SoundManager.playSound('win');
        if (color === 'yellow') SoundManager.playSound('error'); 
        */

        setTimeout(() => {
            btn.classList.remove('active');
        }, 500);
    }

    function handleSequenceInput(color) {
        if (isShowingSequence) return;

        activateSequenceBtn(color);
        userSequence.push(color);

        // check latest input
        const currentIndex = userSequence.length - 1;

        if (userSequence[currentIndex] !== gameSequence[currentIndex]) {
            // Wrong!
            SoundManager.playError();
            const grid = document.querySelector('.sequence-grid');
            grid.style.animation = 'shake 0.4s';
            setTimeout(() => {
                grid.style.animation = '';
                // Creating a gentle loop for kids: Replay the SAME sequence so they can try again.
                // Reset user input
                userSequence = [];
                setTimeout(() => playSequence(), 1000);
            }, 600);
            return;
        }

        // Correct so far
        if (userSequence.length === gameSequence.length) {
            // Completed the full sequence!
            setTimeout(advanceQueue, 500);
        }
    }

    // --- Game Logic: Counting ---
    function setupCountingGame(level) {
        gameTitle.textContent = "Tane Hesabı";
        gameInstruction.textContent = "Yukarıdaki sayı kadar nesne olan kutuyu seç!";
        gameBoard.innerHTML = '';
        gameBoard.className = '';

        // 1. Difficulty
        // L4: 1-5
        // L5: 1-7
        // L6+: 1-10
        let maxNum = 5;
        if (level >= 5) maxNum = 7;
        if (level >= 6) maxNum = 10;

        const targetNumber = Math.floor(Math.random() * maxNum) + 1;

        // 2. Container
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.width = '100%';

        // 3. Target Display
        const targetDisplay = document.createElement('div');
        targetDisplay.className = 'counting-target';
        targetDisplay.textContent = targetNumber;
        container.appendChild(targetDisplay);

        // 4. Options
        const optionsGrid = document.createElement('div');
        optionsGrid.className = 'counting-grid';

        // Generate answers
        let answers = [targetNumber];
        while (answers.length < 4) {
            let wrong = Math.floor(Math.random() * maxNum) + 1;
            if (!answers.includes(wrong)) answers.push(wrong);
        }
        answers.sort(() => 0.5 - Math.random());

        // Prepare Image Pool (Flatten all themes)
        const allImages = [];
        Object.values(THEMES).forEach(cat => allImages.push(...cat));

        // Shuffle pool to get random unique images for each option
        allImages.sort(() => 0.5 - Math.random());

        answers.forEach((num, index) => {
            const btn = document.createElement('button');
            btn.className = `counting-option layout-${num}`; // Add dynamic class

            // Pick a unique image for this option
            const itemObj = allImages[index % allImages.length];
            const iconSrc = itemObj.src;

            // Create X items
            for (let i = 0; i < num; i++) {
                const img = document.createElement('img');
                img.src = iconSrc;
                img.className = 'count-item';
                btn.appendChild(img);
            }

            btn.addEventListener('click', () => {
                if (num === targetNumber) {
                    SoundManager.playMatch();
                    btn.style.background = '#d4edda'; // Greenish
                    addScore(true, btn);
                    setTimeout(advanceQueue, 500);
                } else {
                    SoundManager.playError();
                    btn.style.animation = 'shake 0.4s';
                    btn.style.background = '#f8d7da'; // Reddish
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
        gameBoard.appendChild(container);
    }

    // --- Game Logic: Memory ---

    function setupMemoryGame(level) {
        gameTitle.textContent = "Eşleri Bul";
        gameInstruction.textContent = "Kartları çevir ve aynı olanları eşleştir.";

        gameBoard.innerHTML = '';
        gameBoard.className = 'game-board'; // Reset class
        flippedCards = [];
        matchedPairs = 0;
        canFlip = true;

        // Difficulty Tiering
        // L1: 2 Pairs (4 Cards)
        // L2: 3 Pairs (6 Cards)
        // L3: 4 Pairs (8 Cards)
        // L4: 5 Pairs (10 Cards)
        // L5+: 6 Pairs (12 Cards) - Cap at 6 or 8 for screen space

        let numPairs = 2;
        if (level === 2) numPairs = 3;
        if (level === 3) numPairs = 4;
        if (level === 4) numPairs = 5;
        if (level >= 5) numPairs = 6;
        if (level >= 10) numPairs = 8;

        totalPairs = numPairs;
        const themeItems = [...getRandomTheme()];
        themeItems.sort(() => 0.5 - Math.random()); // Shuffle items to pick random ones
        const selectedItems = themeItems.slice(0, totalPairs);
        const cardDeck = [...selectedItems, ...selectedItems];
        cardDeck.sort(() => 0.5 - Math.random());

        // Grid
        let columns = 4;
        if (cardDeck.length === 4) columns = 2;

        gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

        cardDeck.forEach((item) => {
            const card = createCard(item.src, item.name, item.name); // matchId = name
            gameBoard.appendChild(card);
        });
    }

    // --- Game Logic: Odd One Out ---

    function setupOddOneGame(level) {
        gameTitle.textContent = "Farkı Bul";
        gameInstruction.textContent = "Diğerlerinden farklı olan karta tıkla.";
        gameBoard.innerHTML = '';
        gameBoard.className = 'game-board';

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
        if (level >= 5) totalCards = 9; // 3x3 grid maybe?
        if (level >= 8) totalCards = 12;

        const numTargets = totalCards - 1;
        const shuffledTargets = [...targetItems].sort(() => 0.5 - Math.random());
        const selectedTargets = shuffledTargets.slice(0, numTargets);
        const distractor = distractorItems[Math.floor(Math.random() * distractorItems.length)];

        const cardDeck = [...selectedTargets, distractor];
        cardDeck.sort(() => 0.5 - Math.random());

        // Grid
        let columns = 4;
        if (totalCards === 4) columns = 2;
        else if (totalCards === 6) columns = 3;

        gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

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
                    SoundManager.playMatch(); // Immediate feedback
                    card.classList.add('matched');
                    addScore(true, card);
                    advanceQueue();
                } else {
                    SoundManager.playError();
                    card.style.animation = 'shake 0.4s';
                    addScore(false, card);
                    setTimeout(() => card.style.animation = '', 400);
                }
            });
            gameBoard.appendChild(card);
        });
    }

    // --- Game Logic: Association (Memory) ---

    function setupAssociationGame(level) {
        gameTitle.textContent = "İlişkili Olanı Bul";
        gameInstruction.textContent = "Birbiriyle ilişkili kartları eşleştir. (Örn: Tavuk - Civciv)";

        gameBoard.innerHTML = '';
        gameBoard.className = 'game-board';
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

        gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

        cardItems.forEach(item => {
            const card = createCard(item.src, item.name, item.id);
            gameBoard.appendChild(card);
        });
    }

    // --- Game Logic: Association Quiz ---

    function setupAssociationQuiz(level) {
        gameTitle.textContent = "Eşleşmeyi Tamamla";
        gameInstruction.textContent = "Yukarıdaki örneğe bakarak aşağıdaki eşleşmeyi tamamla!";

        gameBoard.innerHTML = '';
        gameBoard.className = ''; // Remove grid layout

        // Pick 2 different pairs
        const shuffledPairs = [...ASSOCIATION_PAIRS].sort(() => 0.5 - Math.random());
        const examplePair = shuffledPairs[0]; // Example pair to show
        const questionPair = shuffledPairs[1]; // Pair to complete

        const container = document.createElement('div');
        container.className = 'quiz-container';

        // Create 4-box layout
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

        gameBoard.appendChild(container);

        const correctAnswer = questionPair.b;

        // Get distractors (B-sides of other pairs, excluding both pairs we're using)
        const otherPairs = ASSOCIATION_PAIRS.filter(p => p.id !== examplePair.id && p.id !== questionPair.id);
        const shuffledOthers = otherPairs.sort(() => 0.5 - Math.random());
        const distractors = shuffledOthers.slice(0, 3).map(p => p.b);

        const options = [correctAnswer, ...distractors];
        options.sort(() => 0.5 - Math.random());

        const optionsContainer = document.getElementById('quiz-options');

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.innerHTML = `
                <img src="${opt.src}" alt="${opt.name}">
                <span class="quiz-option-label">${opt.name}</span>
            `;

            btn.addEventListener('click', () => {
                if (opt === correctAnswer) {
                    SoundManager.playMatch();
                    const qCard = container.querySelector('.quiz-question');
                    qCard.innerHTML = `
                        <img src="${opt.src}" style="width:80%; height:80%; object-fit:contain;">
                        <span class="card-label">${opt.name}</span>
                    `;
                    qCard.style.background = '#d4edda';
                    qCard.style.border = '4px solid #28a745';

                    addScore(true, btn);
                    setTimeout(advanceQueue, 800);
                } else {
                    SoundManager.playError();
                    btn.style.animation = 'shake 0.4s';
                    btn.style.background = '#FFEBEE';
                    addScore(false, btn);
                    setTimeout(() => {
                        btn.style.animation = '';
                        btn.style.background = 'white';
                    }, 400);
                }
            });

            optionsContainer.appendChild(btn);
        });
    }

    // --- Game Logic: Letter-Number Cipher ---

    function setupCipherGame(level) {
        gameTitle.textContent = "Şifreyi Çöz";
        gameInstruction.textContent = "Harflerin hangi rakamlara karşılık geldiğini bul!";

        gameBoard.innerHTML = '';
        gameBoard.className = '';

        // Difficulty based on level
        let numLetters, numExamples;
        if (level <= 2) {
            numLetters = 3; // A, B, C
            numExamples = 3;
        } else if (level <= 6) {
            numLetters = 4; // A, B, C, D
            numExamples = 3;
        } else if (level <= 10) {
            numLetters = 5;
            numExamples = 3;
        } else {
            numLetters = 6;
            numExamples = 3;
        }

        // Generate random letter-to-number mapping
        const letters = ['A', 'B', 'U', 'K', 'C', 'Y', 'D', 'E'].slice(0, numLetters);
        const numbers = [];
        while (numbers.length < numLetters) {
            const num = Math.floor(Math.random() * 9) + 1; // 1-9
            if (!numbers.includes(num)) {
                numbers.push(num);
            }
        }

        const mapping = {};
        letters.forEach((letter, index) => {
            mapping[letter] = numbers[index];
        });

        // Generate examples
        const examples = [];
        for (let i = 0; i < numExamples; i++) {
            // Create random letter combination
            const combo = [];
            for (let j = 0; j < 3; j++) {
                combo.push(letters[Math.floor(Math.random() * letters.length)]);
            }
            const letterStr = combo.join('');
            const numberStr = combo.map(l => mapping[l]).join('');
            examples.push({ letters: letterStr, numbers: numberStr });
        }

        // Generate question (different from examples)
        let questionCombo;
        do {
            questionCombo = [];
            for (let j = 0; j < 3; j++) {
                questionCombo.push(letters[Math.floor(Math.random() * letters.length)]);
            }
        } while (examples.some(ex => ex.letters === questionCombo.join('')));

        const questionLetters = questionCombo.join('');
        const correctAnswer = questionCombo.map(l => mapping[l]).join('');

        // Create UI
        const container = document.createElement('div');
        container.className = 'cipher-container';

        // Examples section
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

        // Question section
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

        // Options
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'cipher-options';

        // Generate wrong answers
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
                    setTimeout(advanceQueue, 1000);
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
        gameBoard.appendChild(container);
    }

    // --- Game Logic: Pattern Recognition ---

    function setupPatternGame(level) {
        gameTitle.textContent = "Örüntüyü Tamamla";
        gameInstruction.textContent = "Soru işareti yerine ne gelmeli?";

        gameBoard.innerHTML = '';
        gameBoard.className = ''; // Remove grid layout

        // Determine difficulty based on level
        let patternType, patternLength;

        if (level <= 7) {
            // Simple patterns - colors, shapes, numbers, letters
            const types = ['colors', 'shapes', 'numbers', 'letters'];
            patternType = types[Math.floor(Math.random() * types.length)];
            patternLength = 5 + Math.floor(Math.random() * 3); // 5, 6, or 7
        } else if (level <= 10) {
            // Medium patterns - all types except sizes
            const types = ['colors', 'shapes', 'animals', 'fruits', 'numbers', 'letters'];
            patternType = types[Math.floor(Math.random() * types.length)];
            patternLength = 5 + Math.floor(Math.random() * 3); // 5, 6, or 7
        } else {
            // Complex patterns - all types
            const types = ['colors', 'shapes', 'animals', 'fruits', 'numbers', 'letters'];
            patternType = types[Math.floor(Math.random() * types.length)];
            patternLength = 6 + Math.floor(Math.random() * 2); // 6 or 7
        }

        // Generate pattern
        const elements = PATTERN_ELEMENTS[patternType];
        let pattern, correctAnswer;

        // Define available pattern templates based on level
        let availablePatterns;

        if (level <= 7) {
            // Simple patterns for younger kids
            availablePatterns = ['AB', 'BA', 'AAB', 'ABB', 'ABA'];
            patternLength = 5;
        } else if (level <= 10) {
            // Medium complexity patterns
            availablePatterns = ['ABC', 'AAB', 'ABB', 'ABA', 'BAA', 'AABB', 'ABBA'];
            patternLength = 6;
        } else {
            // Complex patterns
            availablePatterns = ['ABCD', 'AABC', 'ABCC', 'ABAC', 'ABBC', 'AABBC'];
            patternLength = 7;
        }

        // Choose random pattern template
        const chosenTemplate = availablePatterns[Math.floor(Math.random() * availablePatterns.length)];

        // Generate unique elements for the pattern
        const uniqueElements = [];
        const maxUniqueNeeded = Math.max(...chosenTemplate.split('').map(char => char.charCodeAt(0) - 64));

        for (let i = 0; i < maxUniqueNeeded; i++) {
            let elem = elements[Math.floor(Math.random() * elements.length)];
            while (uniqueElements.some(e => e.id === elem.id)) {
                elem = elements[Math.floor(Math.random() * elements.length)];
            }
            uniqueElements.push(elem);
        }

        // Map template letters to actual elements
        const templateMap = {};
        for (let i = 0; i < uniqueElements.length; i++) {
            templateMap[String.fromCharCode(65 + i)] = uniqueElements[i]; // A=65, B=66, etc.
        }

        // Build the repeating sequence from template
        const baseSequence = chosenTemplate.split('').map(letter => templateMap[letter]);

        // Create pattern by repeating the base sequence
        pattern = [];
        const totalItems = patternLength; // Total including question mark

        // Randomly decide where to put the question mark (not always at the end)
        let questionPosition;
        if (level <= 7) {
            // For younger kids, question mark at the end or second to last
            questionPosition = totalItems - 1 - Math.floor(Math.random() * 2);
        } else {
            // For older kids, question mark can be anywhere in the last half
            questionPosition = Math.floor(totalItems / 2) + Math.floor(Math.random() * (totalItems - Math.floor(totalItems / 2)));
        }

        // Build the full pattern
        for (let i = 0; i < totalItems; i++) {
            if (i !== questionPosition) {
                pattern.push(baseSequence[i % baseSequence.length]);
            }
        }

        // The correct answer is the element that should be at questionPosition
        correctAnswer = baseSequence[questionPosition % baseSequence.length];

        // Create UI
        const container = document.createElement('div');
        container.className = 'pattern-container';

        // Pattern sequence display
        const sequenceDiv = document.createElement('div');
        sequenceDiv.className = 'pattern-sequence';

        // Build the visual sequence with question mark at the right position
        let visualIndex = 0;
        for (let i = 0; i < totalItems; i++) {
            if (i === questionPosition) {
                // Question mark
                const questionMark = document.createElement('div');
                questionMark.className = 'pattern-item pattern-question';
                questionMark.textContent = '?';
                questionMark.dataset.position = questionPosition;
                sequenceDiv.appendChild(questionMark);
            } else {
                // Regular pattern item
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

        // Options
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'pattern-options';

        // Generate wrong answers
        let options = [correctAnswer];
        while (options.length < 4) {
            const wrong = elements[Math.floor(Math.random() * elements.length)];
            if (!options.find(opt => opt.id === wrong.id)) {
                options.push(wrong);
            }
        }

        // Shuffle options
        options.sort(() => 0.5 - Math.random());

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'pattern-option-btn';
            btn.textContent = opt.emoji;
            if (opt.size) {
                btn.style.fontSize = opt.size;
            }

            btn.addEventListener('click', () => {
                if (opt.id === correctAnswer.id) {
                    SoundManager.playMatch();
                    const questionMark = container.querySelector('.pattern-question');
                    questionMark.textContent = correctAnswer.emoji;
                    if (correctAnswer.size) {
                        questionMark.style.fontSize = correctAnswer.size;
                    }
                    questionMark.classList.add('correct');
                    btn.style.background = '#d4edda';
                    btn.style.transform = 'scale(1.1)';
                    addScore(true, btn);
                    setTimeout(advanceQueue, 800);
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
        gameBoard.appendChild(container);
    }

    // --- Common Card Logic (Flip & Match) ---

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

        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }

    function checkForMatch() {
        canFlip = false;
        const [first, second] = flippedCards;

        if (first.id === second.id) {
            setTimeout(() => {
                SoundManager.playMatch();
                first.card.classList.add('matched');
                second.card.classList.add('matched');
                // Score for each pair? Or just once? Let's give score for match.
                // Using first card for popup position
                addScore(true, first.card);

                matchedPairs++;
                flippedCards = [];
                canFlip = true;
                if (matchedPairs === totalPairs) advanceQueue();
            }, 600);
        } else {
            setTimeout(() => {
                SoundManager.playError();
                first.card.classList.remove('flipped');
                second.card.classList.remove('flipped');

                // Only penalize if BOTH cards were previously visited (Memory Error)
                // If either card was new, it's exploration -> No Penalty
                if (first.card.dataset.visited === 'true' && second.card.dataset.visited === 'true') {
                    addScore(false, first.card); // Penalty
                }

                // Mark as visited for next time
                first.card.dataset.visited = 'true';
                second.card.dataset.visited = 'true';

                flippedCards = [];
                canFlip = true;
            }, 1000);
        }
    }

    // --- Helpers ---

    function getRandomTheme() {
        const keys = Object.keys(THEMES);
        return THEMES[keys[Math.floor(Math.random() * keys.length)]];
    }

    function completeLevel() {
        // Level Bonus: Level * 100
        const bonus = currentLevel * 100;
        currentUser.score = (currentUser.score || 0) + bonus;

        // Bonus Popup center screen
        const popup = document.createElement('div');
        popup.className = 'score-popup score-plus';
        popup.style.left = '50%';
        popup.style.top = '50%';
        popup.style.fontSize = '3rem';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.textContent = `Seviye Bonusu: +${bonus}`;
        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 1500);

        SoundManager.playWin();
        if (currentUser.unlockedLevel < currentLevel + 1) {
            currentUser.unlockedLevel = currentLevel + 1;
            saveUser(currentUser.name, currentUser.age); // Score saved here too
        } else {
            saveUser(currentUser.name, currentUser.age); // Save score even if level replayed
        }

        setTimeout(showWinModal, 500);
    }

    function showWinModal() {
        // Congratulation messages
        const congratsMessages = [
            'Harikasın! 🎉',
            'Mükemmelsin! 🌟',
            'Süpersin! 🚀',
            'Aferin Sana! 👏',
            'Çok İyisin! ⭐',
            'Bravo! 🎊',
            'Muhteşemsin! 💫',
            'Şahanesin! 🏆',
            'Efsanesin! 🔥',
            'Harikaydı! ✨',
            'Çok Başarılısın! 🎯',
            'Süper Oldu! 🌈',
            'Tebrikler! 🎈',
            'Çok Güzel! 💝',
            'Harika İş! 🌺'
        ];

        // Pick random message
        const randomMessage = congratsMessages[Math.floor(Math.random() * congratsMessages.length)];

        // Update modal message
        const modalTitle = successModal.querySelector('h2');
        if (modalTitle) {
            modalTitle.textContent = randomMessage;
        }

        successModal.classList.remove('hidden');
    }

    function hideModal() {
        successModal.classList.add('hidden');
    }

    function showScreen(screenToShow) {
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.add('hidden');
            s.classList.remove('active');
        });
        screenToShow.classList.remove('hidden');
        screenToShow.classList.add('active');
    }
});
