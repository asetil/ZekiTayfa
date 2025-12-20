import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameStateService } from '../../services/game-state.service';
import { SoundService } from '../../services/sound.service';
import { LevelManagerService } from '../../services/level-manager.service';
import { LevelModalComponent } from '../../shared/components/level-modal/level-modal.component';

@Component({
  selector: 'app-pattern-game',
  standalone: true,
  imports: [CommonModule, LevelModalComponent],
  template: `
    <div class="pattern-container bounce-in">
      <h2>Örüntüyü Tamamla</h2>
      
      <div class="pattern-display">
        <div *ngFor="let item of pattern()" class="pattern-item">
          {{ item }}
        </div>
        <div class="pattern-item question">?</div>
      </div>

      <div class="options-grid">
        <button *ngFor="let opt of options()" class="option-btn" (click)="checkAnswer(opt)">
           {{ opt }}
        </button>
      </div>

      <p *ngIf="message()" class="status-msg">{{ message() }}</p>

      <app-level-modal 
        [visible]="showLevelModal()" 
        [score]="levelScore"
        [title]="'Harika Gidiyorsun!'"
        (onNext)="onNextLevel()"
        (onHome)="onGoHome()">
      </app-level-modal>
    </div>
  `,
  styles: [`
    .pattern-container { text-align: center; padding: 20px; color: white; max-width: 800px; margin: 0 auto; }
    .pattern-display { display: flex; gap: 10px; justify-content: center; margin: 40px 0; background: rgba(255,255,255,0.2); padding: 20px; border-radius: 20px; }
    .pattern-item { font-size: 3rem; background: white; width: 80px; height: 80px; border-radius: 15px; display: flex; justify-content: center; align-items: center; box-shadow: 0 5px 0 rgba(0,0,0,0.1); color: #333; }
    .question { background: #FFD700; color: #333; font-weight: bold; }
    
    .options-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 500px; margin: 0 auto; }
    .option-btn { font-size: 2.5rem; padding: 20px; border-radius: 15px; border: none; cursor: pointer; transition: transform 0.2s; background: white; }
    .option-btn:hover { transform: scale(1.1); }
    .status-msg { margin-top: 20px; font-size: 1.5rem; font-weight: bold; }
  `]
})
export class PatternGameComponent implements OnInit {
  pattern = signal<string[]>([]);
  options = signal<string[]>([]);
  correctAnswer = signal('');
  message = signal('');

  showLevelModal = signal(false);
  levelScore = 0;
  correctCount = 0;
  requiredCorrects = 3;

  constructor(
    private gameState: GameStateService,
    private sound: SoundService,
    private levelManager: LevelManagerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.generateLevel();
  }

  generateLevel() {
    // Simple Pattern: A B A B ?
    const shapes = ['🔴', '🔵', '🟢', '🟡'];
    const a = shapes[Math.floor(Math.random() * shapes.length)];
    const b = shapes[Math.floor(Math.random() * shapes.length)];

    this.pattern.set([a, b, a, b]);
    this.correctAnswer.set(a);

    // Distractors
    const opts = [a, b, '🔺', '⭐'].sort(() => Math.random() - 0.5);
    this.options.set(opts);
    this.message.set('');
  }

  checkAnswer(ans: string) {
    if (ans === this.correctAnswer()) {
      this.sound.playMatch();
      this.message.set('Doğru! 🎉');
      this.correctCount++;

      if (this.correctCount >= this.requiredCorrects) {
        this.sound.playWin();
        this.levelScore = 200;
        this.gameState.addScore(this.levelScore);
        this.gameState.unlockNextLevel(5); // ID 5 is Pattern
        setTimeout(() => this.showLevelModal.set(true), 1000);
      } else {
        setTimeout(() => this.generateLevel(), 1500);
      }
    } else {
      this.sound.playError();
      this.message.set('Yanlış, tekrar dene.');
    }
  }

  onNextLevel() {
    const nextId = this.levelManager.getNextLevelId(5);
    if (nextId) this.router.navigate(['/games', this.levelManager.getLevelById(nextId)?.gameType]);
    else this.router.navigate(['/levels']);
  }

  onGoHome() { this.router.navigate(['/levels']); }
}
