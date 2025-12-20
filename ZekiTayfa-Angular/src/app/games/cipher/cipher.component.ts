import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameStateService } from '../../services/game-state.service';
import { SoundService } from '../../services/sound.service';
import { LevelManagerService } from '../../services/level-manager.service';
import { LevelModalComponent } from '../../shared/components/level-modal/level-modal.component';

@Component({
    selector: 'app-cipher-game',
    standalone: true,
    imports: [CommonModule, LevelModalComponent],
    template: `
    <div class="cipher-container bounce-in">
      <h2>Şifreyi Çöz</h2>
      
      <div class="cipher-row">
        <div class="item">{{ valA() }}</div>
        <div class="op">+</div>
        <div class="item">{{ valB() }}</div>
        <div class="op">=</div>
        <div class="res">{{ sumAB() }}</div>
      </div>
      
      <div class="cipher-row">
        <div class="item">{{ valA() }}</div>
        <div class="op">+</div>
        <div class="item question">?</div>
        <div class="op">=</div>
        <div class="res">{{ sumTarget() }}</div>
      </div>

      <div class="options">
        <button *ngFor="let opt of options()" class="opt-btn" (click)="check(opt)">{{ opt }}</button>
      </div>
      
       <div *ngIf="message()" class="msg">{{ message() }}</div>

       <app-level-modal 
        [visible]="showLevelModal()" 
        [score]="levelScore"
        [title]="'Matematik Dehası!'"
        (onNext)="onNextLevel()"
        (onHome)="onGoHome()">
      </app-level-modal>
    </div>
  `,
    styles: [`
    .cipher-container { padding: 20px; text-align: center; color: white; max-width: 600px; margin: 0 auto; }
    .cipher-row { display: flex; align-items: center; justify-content: center; gap: 15px; margin: 20px 0; font-size: 2rem; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 15px; }
    .item, .res { background: white; color: #333; padding: 10px 20px; border-radius: 10px; font-weight: bold; min-width: 60px; }
    .question { background: #FFD700; }
    .options { display: flex; gap: 20px; justify-content: center; margin-top: 30px; }
    .opt-btn { font-size: 2rem; padding: 15px 30px; border-radius: 15px; border: none; cursor: pointer; background: white; transition: transform 0.2s; }
    .opt-btn:hover { transform: scale(1.1); }
    .msg { font-size: 1.5rem; margin-top: 20px; }
  `]
})
export class CipherGameComponent implements OnInit {
    valA = signal(0);
    valB = signal(0);
    valC = signal(0);

    sumAB = computed(() => this.valA() + this.valB());
    sumTarget = computed(() => this.valA() + this.valC());

    options = signal<number[]>([]);
    message = signal('');

    showLevelModal = signal(false);
    levelScore = 0;
    wins = 0;
    requiredWins = 3;

    constructor(
        private gameState: GameStateService,
        private sound: SoundService,
        private levelManager: LevelManagerService,
        private router: Router
    ) { }

    ngOnInit() {
        this.generate();
    }

    generate() {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        const c = Math.floor(Math.random() * 5) + 1;

        this.valA.set(a);
        this.valB.set(b);
        this.valC.set(c);

        // Options
        const opts = [c, c + 1, c - 1 || 1, c + 2].sort(() => Math.random() - 0.5);
        this.options.set(opts);
        this.message.set('');
    }

    check(ans: number) {
        if (ans === this.valC()) {
            this.sound.playMatch();
            this.message.set('Harika! 🔓');
            this.wins++;

            if (this.wins >= this.requiredWins) {
                this.sound.playWin();
                this.levelScore = 300;
                this.gameState.addScore(this.levelScore);
                this.gameState.unlockNextLevel(8); // ID 8 Cipher
                setTimeout(() => this.showLevelModal.set(true), 1000);
            } else {
                setTimeout(() => this.generate(), 1500);
            }
        } else {
            this.sound.playError();
            this.message.set('Yanlış 🔒');
        }
    }

    onNextLevel() {
        const nextId = this.levelManager.getNextLevelId(8);
        if (nextId) this.router.navigate(['/games', this.levelManager.getLevelById(nextId)?.gameType]);
        else this.router.navigate(['/levels']);
    }

    onGoHome() { this.router.navigate(['/levels']); }
}
