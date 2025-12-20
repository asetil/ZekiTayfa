import { Injectable, signal, computed, effect } from '@angular/core';

export interface User {
    name: string;
    age: number;
    unlockedLevel: number;
    score: number;
}

@Injectable({
    providedIn: 'root'
})
export class GameStateService {
    private readonly initialUser: User = { name: '', age: 0, unlockedLevel: 1, score: 0 };

    private user = signal<User>(this.loadUser());

    readonly score = computed(() => this.user().score);
    readonly level = computed(() => this.user().unlockedLevel);
    readonly name = computed(() => this.user().name);
    readonly age = computed(() => this.user().age);

    constructor() {
        // Auto-save effect: Whenever user signal changes, save to localStorage
        effect(() => {
            localStorage.setItem('zekaup_user', JSON.stringify(this.user()));
        });
    }

    updateUser(partialUser: Partial<User>) {
        this.user.update(u => ({ ...u, ...partialUser }));
    }

    addScore(points: number) {
        this.user.update(u => ({ ...u, score: u.score + points }));
    }

    unlockNextLevel(currentLevelId: number) {
        const nextLevel = currentLevelId + 1;
        // unlock mechanism
        if (nextLevel > this.user().unlockedLevel) {
            this.user.update(u => ({ ...u, unlockedLevel: nextLevel }));
        }
    }

    resetGame() {
        localStorage.removeItem('zekaup_user');
        this.user.set(this.initialUser);
    }

    private loadUser(): User {
        const saved = localStorage.getItem('zekaup_user');
        return saved ? JSON.parse(saved) : this.initialUser;
    }
}
