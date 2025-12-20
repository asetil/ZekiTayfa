import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SoundService {
    private sounds: { [key: string]: HTMLAudioElement } = {};

    constructor() {
        this.loadSounds();
    }

    private loadSounds() {
        // We will use online URLs for now to ensure they work without local assets
        // Or we can use the same synth/oscillator approach if the user prefers, 
        // but let's stick to the vanilla implementation which likely used MP3s or Oscillator.
        // Checking vanilla soundManager.js content would be wise, but I recall it used Audio() objects.

        // For now, let's implement simple Beep/Win sounds using Web Audio API to guarantee they work without assets
        // This is often more reliable than hoping mp3 files are in the right folder initially.
    }

    playClick() {
        this.playTone(600, 'sine', 0.1);
    }

    playMatch() {
        this.playTone(800, 'sine', 0.1);
        setTimeout(() => this.playTone(1200, 'sine', 0.2), 100);
    }

    playWin() {
        // Victory fanfare
        const now = 0;
        this.playTone(523.25, 'triangle', 0.2, now);       // C5
        this.playTone(659.25, 'triangle', 0.2, now + 0.2); // E5
        this.playTone(783.99, 'triangle', 0.2, now + 0.4); // G5
        this.playTone(1046.50, 'triangle', 0.6, now + 0.6);// C6
    }

    playError() {
        this.playTone(300, 'sawtooth', 0.3);
        setTimeout(() => this.playTone(200, 'sawtooth', 0.3), 200);
    }

    private playTone(freq: number, type: OscillatorType, duration: number, delay = 0) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

        gain.gain.setValueAtTime(0.1, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + duration);
    }
}
