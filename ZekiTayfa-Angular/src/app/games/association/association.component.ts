import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameStateService } from '../../services/game-state.service';
import { SoundService } from '../../services/sound.service';
import { LevelManagerService } from '../../services/level-manager.service';
import { LevelModalComponent } from '../../shared/components/level-modal/level-modal.component';

interface PairCard {
    id: number;
    pairId: string;
    content: string;
    type: 'A' | 'B';
    isFlipped: boolean;
    isMatched: boolean;
}

@Component({
    selector: 'app-association-game',
    standalone: true,
    imports: [CommonModule, LevelModalComponent],
    template: `
    <div class="assoc-container bounce-in">
      <h2>İlişkili Olanı Bul</h2>
      
      <div class="grid">
        <div *ngFor="let card of cards()" 
             class="card"
             [class.flipped]="card.isFlipped || card.isMatched"
             (click)="flipCard(card)">
             
          <div class="front">❓</div>
          <div class="back">{{ card.content }}</div>
        </div>
      </div>
      
      <app-level-modal 
        [visible]="showLevelModal()" 
        [score]="levelScore"
        [title]="'Bağlantılar Kuruldu!'"
        (onNext)="onNextLevel()"
        (onHome)="onGoHome()">
      </app-level-modal>
    </div>
  `,
    styles: [`
    .assoc-container { text-align: center; padding: 20px; color: #333; max-width: 800px; margin: 0 auto; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-top: 20px; }
    .card { aspect-ratio: 1; position: relative; cursor: pointer; transform-style: preserve-3d; transition: transform 0.6s; }
    .card.flipped { transform: rotateY(180deg); }
    .front, .back { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; background: white; border-radius: 15px; border: 4px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
    .front { background: linear-gradient(135deg, #FF9966, #FF5E62); color: white; }
    .back { transform: rotateY(180deg); color: #333; }
  `]
})
export class AssociationGameComponent implements OnInit {
    cards = signal<PairCard[]>([]);
    flippedCards = signal<PairCard[]>([]);

    showLevelModal = signal(false);
    levelScore = 0;
    matchesFound = 0;
    totalMatches = 4;

    constructor(
        private gameState: GameStateService,
        private sound: SoundService,
        private levelManager: LevelManagerService,
        private router: Router
    ) { }

    ngOnInit() {
        this.startLevel();
    }

    startLevel() {
        const pairs = [
            { id: '1', a: '🌧️', b: '☂️' },
            { id: '2', a: '🕸️', b: '🕷️' },
            { id: '3', a: '☀️', b: '😎' },
            { id: '4', a: '🐮', b: '🥛' }
        ];

        let deck: PairCard[] = [];
        pairs.forEach((p, i) => {
            deck.push({ id: i * 2, pairId: p.id, content: p.a, type: 'A', isFlipped: false, isMatched: false });
            deck.push({ id: i * 2 + 1, pairId: p.id, content: p.b, type: 'B', isFlipped: false, isMatched: false });
        });

        this.cards.set(deck.sort(() => Math.random() - 0.5));
        this.matchesFound = 0;
    }

    flipCard(card: PairCard) {
        if (card.isFlipped || card.isMatched || this.flippedCards().length >= 2) return;

        this.cards.update(c => c.map(x => x.id === card.id ? { ...x, isFlipped: true } : x));
        this.flippedCards.update(f => [...f, card]);

        if (this.flippedCards().length === 2) {
            setTimeout(() => this.checkMatch(), 1000);
        }
    }

    checkMatch() {
        const [c1, c2] = this.flippedCards();
        if (c1.pairId === c2.pairId) {
            this.sound.playMatch();
            this.cards.update(c => c.map(x => (x.id === c1.id || x.id === c2.id) ? { ...x, isMatched: true } : x));
            this.matchesFound++;

            if (this.matchesFound === this.totalMatches) {
                this.sound.playWin();
                this.levelScore = 300;
                this.gameState.addScore(this.levelScore);
                this.gameState.unlockNextLevel(4); // ID 4 is Association
                setTimeout(() => this.showLevelModal.set(true), 800);
            }
        } else {
            this.sound.playError();
            this.cards.update(c => c.map(x => (x.id === c1.id || x.id === c2.id) ? { ...x, isFlipped: false } : x));
        }
        this.flippedCards.set([]);
    }

    onNextLevel() {
        const nextId = this.levelManager.getNextLevelId(4);
        if (nextId) this.router.navigate(['/games', this.levelManager.getLevelById(nextId)?.gameType]);
        else this.router.navigate(['/levels']);
    }

    onGoHome() { this.router.navigate(['/levels']); }
}
