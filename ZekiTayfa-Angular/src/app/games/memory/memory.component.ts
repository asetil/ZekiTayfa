import { Component, signal, WritableSignal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameStateService } from '../../services/game-state.service';
import { SoundService } from '../../services/sound.service';
import { LevelManagerService } from '../../services/level-manager.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { LevelModalComponent } from '../../shared/components/level-modal/level-modal.component';

interface Card {
    id: number;
    content: string; // Emoji or Image URL
    isFlipped: boolean;
    isMatched: boolean;
}

@Component({
    selector: 'app-memory-game',
    standalone: true,
    imports: [CommonModule, LevelModalComponent],
    animations: [
        trigger('cardFlip', [
            state('default', style({ transform: 'none' })),
            state('flipped', style({ transform: 'rotateY(180deg)' })),
            transition('default => flipped', [animate('400ms')]),
            transition('flipped => default', [animate('400ms')])
        ])
    ],
    template: `
    <div class="memory-container">
      <div class="header">
        <h2>Hafıza Oyunu</h2>
        <div class="stats">
          <span>Hamle: {{ moves() }}</span>
          <!-- Level Modal -->
          <app-level-modal 
            [visible]="showLevelModal()" 
            [score]="levelScore"
            [bonus]="bonusScore"
            [title]="'Hafıza Ustası!'"
            (onNext)="onNextLevel()"
            (onHome)="onGoHome()">
          </app-level-modal>
          <span>Eşleşme: {{ matches() }}/{{ totalPairs() }}</span>
        </div>
      </div>

      <div class="grid" [style.grid-template-columns]="'repeat(' + gridSize() + ', 1fr)'">
        <div *ngFor="let card of cards()" 
             class="card-container" 
             (click)="flipCard(card)">
          <div class="card" [@cardFlip]="card.isFlipped || card.isMatched ? 'flipped' : 'default'">
            <div class="card-front">❓</div>
            <div class="card-back">{{ card.content }}</div>
          </div>
        </div>
      </div>

      <div *ngIf="gameWon()" class="win-modal bounce-in">
        <h3>Tebrikler! 🎉</h3>
        <button (click)="restartGame()">Tekrar Oyna</button>
      </div>
    </div>
  `,
    styles: [`
    .memory-container { padding: 20px; max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; color: white;}
    .stats { font-size: 1.2rem; gap: 20px; display: flex; }
    
    .grid { display: grid; gap: 10px; perspective: 1000px; }
    
    .card-container { aspect-ratio: 1; cursor: pointer; }
    .card {
      width: 100%; height: 100%; position: relative;
      transform-style: preserve-3d;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    .card-front, .card-back {
      position: absolute; width: 100%; height: 100%;
      backface-visibility: hidden;
      display: flex; justify-content: center; align-items: center;
      font-size: 2.5rem; border-radius: 10px;
    }
    
    .card-front { background: linear-gradient(135deg, #6e8efb, #a777e3); color: white; }
    .card-back { background: white; transform: rotateY(180deg); border: 2px solid #6e8efb; }

    .win-modal {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: white; padding: 40px; border-radius: 20px;
      text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 100;
    }
    button {
      padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1.2rem;
    }
  `]
})
export class MemoryGameComponent {
    cards = signal<Card[]>([]);
    moves = signal(0);
    matches = signal(0);
    flippedCards = signal<Card[]>([]);

    readonly totalPairs = signal(6); // Configurable based on level
    readonly gridSize = computed(() => Math.ceil(Math.sqrt(this.totalPairs() * 2)));
    readonly gameWon = computed(() => this.matches() === this.totalPairs());

    showLevelModal = signal(false);
    levelScore = 0;
    bonusScore = 0;
    startTime = 0;

    constructor(
        private gameState: GameStateService,
        private sound: SoundService,
        private levelManager: LevelManagerService,
        private router: Router
    ) {
        this.restartGame();

        // Effect to check match
        effect(() => {
            const flipped = this.flippedCards();
            if (flipped.length === 2) {
                setTimeout(() => this.checkMatch(flipped[0], flipped[1]), 800);
            }
        }, { allowSignalWrites: true });
    }

    restartGame() {
        this.moves.set(0);
        this.matches.set(0);
        this.flippedCards.set([]);
        this.cards.set(this.generateCards(this.totalPairs()));
        this.showLevelModal.set(false);
        this.startTime = Date.now(); // Start timer
    }

    flipCard(card: Card) {
        if (card.isFlipped || card.isMatched || this.flippedCards().length >= 2) return;

        this.cards.update(current =>
            current.map(c => c.id === card.id ? { ...c, isFlipped: true } : c)
        );

        this.flippedCards.update(f => [...f, card]);
        this.moves.update(m => m + 1);
    }

    private checkMatch(card1: Card, card2: Card) {
        if (card1.content === card2.content) {
            // Match!
            this.sound.playMatch();
            this.cards.update(current =>
                current.map(c => (c.id === card1.id || c.id === card2.id) ? { ...c, isMatched: true } : c)
            );
            this.matches.update(m => m + 1);

            if (this.gameWon()) {
                this.sound.playWin();

                // Calculate Score
                this.levelScore = 100; // Base score

                // Time Bonus
                const durationSeconds = (Date.now() - this.startTime) / 1000;
                let speedBonus = 0;
                if (durationSeconds < 20) speedBonus = 50;
                else if (durationSeconds < 40) speedBonus = 30;
                else if (durationSeconds < 60) speedBonus = 10;

                // Random Lucky Bonus (Max 50)
                const luckyBonus = Math.floor(Math.random() * 51);

                this.bonusScore = speedBonus + luckyBonus;

                this.gameState.addScore(this.levelScore + this.bonusScore);

                // Unlock next level (Memory is Level 1)
                this.gameState.unlockNextLevel(1);

                setTimeout(() => this.showLevelModal.set(true), 1000);
            }
        } else {
            // No Match - Flip back
            this.sound.playError();
            this.cards.update(current =>
                current.map(c => (c.id === card1.id || c.id === card2.id) ? { ...c, isFlipped: false } : c)
            );
        }
        this.flippedCards.set([]);
    }

    onNextLevel() {
        // Memory is usually the first game, so go to Counting (Level 2)
        // Ideally we get next level ID from LevelManager
        const nextId = this.levelManager.getNextLevelId(1);
        if (nextId) {
            const nextLevel = this.levelManager.getLevelById(nextId);
            if (nextLevel) {
                this.router.navigate(['/games', nextLevel.gameType]);
            }
        } else {
            this.router.navigate(['/levels']);
        }
    }

    onGoHome() {
        this.router.navigate(['/levels']);
    }
    private generateCards(pairs: number): Card[] {
        const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'];
        const selected = emojis.slice(0, pairs);
        const deck = [...selected, ...selected]
            .sort(() => Math.random() - 0.5)
            .map((content, index) => ({
                id: index,
                content,
                isFlipped: false,
                isMatched: false
            }));
        return deck;
    }
}
