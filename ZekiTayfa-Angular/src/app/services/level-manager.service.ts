import { Injectable, signal, computed } from '@angular/core';

export interface Level {
    id: number;
    gameType: 'memory' | 'counting' | 'pattern' | 'sequence' | 'odd-one' | 'cipher' | 'association' | 'quiz';
    title: string;
    difficulty: number;
}

@Injectable({
    providedIn: 'root'
})
export class LevelManagerService {
    private levels: Level[] = [
        { id: 1, gameType: 'memory', title: 'Hafıza Başlangıç', difficulty: 1 },
        { id: 2, gameType: 'counting', title: 'Sayıları Öğren', difficulty: 1 },
        { id: 3, gameType: 'odd-one', title: 'Farklıyı Bul', difficulty: 1 },
        { id: 4, gameType: 'association', title: 'Eşleştirme', difficulty: 1 },
        { id: 5, gameType: 'pattern', title: 'Örüntü', difficulty: 2 },
        { id: 6, gameType: 'sequence', title: 'Sıralama', difficulty: 2 },
        { id: 7, gameType: 'quiz', title: 'Bilgi Yarışması', difficulty: 2 },
        { id: 8, gameType: 'cipher', title: 'Şifre Çözücü', difficulty: 3 },
        // More levels can be generated structurally
    ];

    getLevelsForAge(age: number): Level[] {
        // Simple logic: higher age gets more levels or harder difficulty
        // For now returning all, but we can filter
        return this.levels;
    }

    getLevelById(id: number) {
        return this.levels.find(l => l.id === id);
    }

    getNextLevelId(currentId: number): number | null {
        const idx = this.levels.findIndex(l => l.id === currentId);
        if (idx !== -1 && idx < this.levels.length - 1) {
            return this.levels[idx + 1].id;
        }
        return null;
    }
}
