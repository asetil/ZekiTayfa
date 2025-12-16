export const SoundManager = {
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
