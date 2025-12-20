import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameStateService } from '../../services/game-state.service';
import { SoundService } from '../../services/sound.service';
import { LevelManagerService } from '../../services/level-manager.service';
import { LevelModalComponent } from '../../shared/components/level-modal/level-modal.component';

@Component({
    selector: 'app-sequence-game',
    standalone: true,
    imports: [CommonModule, LevelModalComponent],
    template: `
    <div class="sequence-container bounce-in">
      <h2>Sırayı Hatırla</h2>
      <p>{{ statusMessage() }}</p>

      <div class="simon-grid">
        <div *ngFor="let color of colors" 
             class="simon-btn"
             [class]="color"
             [class.active]="activeBtn() === color"
             (click)="playerClick(color)">
        </div>
      </div>
      
      <button *ngIf="!gameActive()" (click)="startGame()" class="start-btn">Başla</button>

      <app-level-modal 
        [visible]="showLevelModal()" 
        [score]="levelScore"
        [title]="'Hafızan Çok Güçlü!'"
        (onNext)="onNextLevel()"
        (onHome)="onGoHome()">
      </app-level-modal>
    </div>
  `,
    styles: [`
    .sequence-container { text-align: center; padding: 20px; color: white; }
    .simon-grid {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;
      max-width: 400px; margin: 30px auto; background: #333; padding: 20px; border-radius: 50%;
    }
    .simon-btn {
      height: 150px; border-radius: 20px; opacity: 0.6; cursor: pointer; transition: all 0.2s; border: 4px solid rgba(0,0,0,0.1);
    }
    .simon-btn.active { opacity: 1; transform: scale(0.95); box-shadow: 0 0 20px white; border-color: white; }
    
    .red { background: #FF4136; }
    .blue { background: #0074D9; }
    .green { background: #2ECC40; }
    .yellow { background: #FFDC00; }
    
    .start-btn { padding: 15px 40px; font-size: 1.5rem; border-radius: 30px; border: none; background: #FFD700; cursor: pointer; color: #333; font-weight: bold; }
  `]
})
export class SequenceGameComponent implements OnInit {
    colors = ['red', 'blue', 'green', 'yellow'];
    sequence: string[] = [];
    playerSequence: string[] = [];
    gameActive = signal(false);
    activeBtn = signal<string | null>(null);
    statusMessage = signal('Hazır mısın?');

    showLevelModal = signal(false);
    levelScore = 0;
    targetSequenceLength = 5; // Win condition

    constructor(
        private gameState: GameStateService,
        private sound: SoundService,
        private levelManager: LevelManagerService,
        private router: Router
    ) { }

    ngOnInit() { }

    startGame() {
        this.sequence = [];
        this.playerSequence = [];
        this.gameActive.set(true);
        this.nextLevel();
    }

    nextLevel() {
        this.playerSequence = [];
        const color = this.colors[Math.floor(Math.random() * 4)];
        this.sequence.push(color);
        this.statusMessage.set(`Seviye ${this.sequence.length}`);
        setTimeout(() => this.playSequence(), 1000);
    }

    async playSequence() {
        this.statusMessage.set('İzle...');
        for (let color of this.sequence) {
            await this.activateBtn(color);
        }
        this.statusMessage.set('Sıra Sende!');
    }

    activateBtn(color: string): Promise<void> {
        return new Promise(resolve => {
            this.sound.playClick(); // Beep on flash
            this.activeBtn.set(color);
            setTimeout(() => {
                this.activeBtn.set(null);
                setTimeout(resolve, 300); // Gap between flashes
            }, 600);
        });
    }

    playerClick(color: string) {
        if (!this.gameActive()) return;

        this.sound.playClick();
        this.activeBtn.set(color);
        setTimeout(() => this.activeBtn.set(null), 200);

        this.playerSequence.push(color);

        const checkIdx = this.playerSequence.length - 1;
        if (this.playerSequence[checkIdx] !== this.sequence[checkIdx]) {
            this.sound.playError();
            this.statusMessage.set('Yanlış! Oyun Bitti.');
            this.gameActive.set(false);
            return;
        }

        if (this.playerSequence.length === this.sequence.length) {
            this.sound.playMatch();
            this.statusMessage.set('Harika!');

            if (this.sequence.length >= this.targetSequenceLength) {
                this.sound.playWin();
                this.levelScore = this.sequence.length * 50;
                this.gameState.addScore(this.levelScore);
                this.gameState.unlockNextLevel(6); // ID 6 is Sequence
                setTimeout(() => this.showLevelModal.set(true), 1000);
            } else {
                setTimeout(() => this.nextLevel(), 1000);
            }
        }
    }

    onNextLevel() {
        const nextId = this.levelManager.getNextLevelId(6);
        if (nextId) this.router.navigate(['/games', this.levelManager.getLevelById(nextId)?.gameType]);
        else this.router.navigate(['/levels']);
    }

    onGoHome() { this.router.navigate(['/levels']); }
}
