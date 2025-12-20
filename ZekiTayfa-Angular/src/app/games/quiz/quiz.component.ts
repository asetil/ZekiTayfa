import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameStateService } from '../../services/game-state.service';
import { SoundService } from '../../services/sound.service';
import { LevelManagerService } from '../../services/level-manager.service';
import { LevelModalComponent } from '../../shared/components/level-modal/level-modal.component';

@Component({
  selector: 'app-quiz-game',
  standalone: true,
  imports: [CommonModule, LevelModalComponent],
  template: `
    <div class="quiz-container bounce-in">
      <h2>Eşleşmeyi Tamamla</h2>
      
      <div class="example-row">
        <div class="box">{{ exampleA() }}</div>
        <div class="arrow">➡️</div>
        <div class="box">{{ exampleB() }}</div>
      </div>

      <div class="question-row">
        <div class="box">{{ questionA() }}</div>
        <div class="arrow">➡️</div>
        <div class="box question">?</div>
      </div>

      <div class="options-grid">
        <button *ngFor="let opt of options()" class="opt-btn" (click)="check(opt)">
          {{ opt.content }}
        </button>
      </div>

      <p *ngIf="message()" class="msg">{{ message() }}</p>

      <app-level-modal 
        [visible]="showLevelModal()" 
        [score]="levelScore"
        [bonus]="bonusScore"
        [title]="'Bilge Baykuş Gibisin!'"
        (onNext)="onNextLevel()"
        (onHome)="onGoHome()">
      </app-level-modal>
    </div>
  `,
  styles: [`
    .quiz-container { text-align: center; padding: 20px; color: white; max-width: 600px; margin: 0 auto; }
    .example-row, .question-row { display: flex; align-items: center; justify-content: center; gap: 20px; margin: 20px 0; background: rgba(255,255,255,0.1); padding: 15px; border-radius: 20px; }
    .box { width: 80px; height: 80px; background: white; border-radius: 15px; font-size: 3rem; display: flex; align-items: center; justify-content: center; color: #333; }
    .question { background: #FFD700; color: #333; font-weight: 900; }
    .arrow { font-size: 2rem; }
    .options-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 30px; }
    .opt-btn { font-size: 3rem; padding: 15px; border-radius: 15px; border: none; cursor: pointer; background: white; transition: transform 0.2s; }
    .opt-btn:hover { transform: scale(1.05); }
    .msg { font-size: 1.5rem; margin-top: 20px; font-weight: bold; }
  `]
})
export class QuizGameComponent implements OnInit {
  exampleA = signal('');
  exampleB = signal('');
  questionA = signal('');
  correctB = signal('');

  options = signal<any[]>([]);
  message = signal('');

  showLevelModal = signal(false);
  levelScore = 0;
  bonusScore = 0;
  startTime = 0;
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
    this.startTime = Date.now();
  }

  generate() {
    // ... Generation Logic ... 
    // In real scenario, reset timer per question or keep cumulative? 
    // Let's do cumulative for level

    // ... existing generation code ...
    const pairs = [
      { a: '👨‍⚕️', b: '🩺' },
      { a: '⚽', b: '🏟️' },
      { a: '🐠', b: '🌊' },
      { a: '🐝', b: '🍯' },
      { a: '🐮', b: '🥛' },
      { a: '🌲', b: '🌰' }
    ];

    // Pick example (Random)
    const exIdx = Math.floor(Math.random() * pairs.length);
    const ex = pairs[exIdx];
    this.exampleA.set(ex.a);
    this.exampleB.set(ex.b);

    // Pick question (must differ from example for clarity, but logic allows same)
    let qIdx = Math.floor(Math.random() * pairs.length);
    while (qIdx === exIdx) qIdx = Math.floor(Math.random() * pairs.length);
    const q = pairs[qIdx];

    this.questionA.set(q.a);
    this.correctB.set(q.b);

    // Options
    const distractors = pairs.filter(p => p.b !== q.b).map(p => p.b);
    const shuffledDistractors = distractors.sort(() => 0.5 - Math.random()).slice(0, 3);

    const opts: any[] = [
      { content: q.b, correct: true },
      ...shuffledDistractors.map(d => ({ content: d, correct: false }))
    ].sort(() => Math.random() - 0.5);

    this.options.set(opts);
    this.message.set('');
  }

  check(opt: any) {
    if (opt.correct) {
      this.sound.playMatch();
      this.message.set('Harika! 🎉');
      this.wins++;

      if (this.wins >= this.requiredWins) {
        this.sound.playWin();

        // Score Calculation
        this.levelScore = 150;

        // Time Bonus (Cumulative for 3 questions)
        const durationSeconds = (Date.now() - this.startTime) / 1000;
        let speedBonus = 0;
        // Fast: < 15s for 3 questions
        if (durationSeconds < 15) speedBonus = 50;
        else if (durationSeconds < 30) speedBonus = 25;

        // Lucky Bonus
        const luckyBonus = Math.floor(Math.random() * 51);

        this.bonusScore = speedBonus + luckyBonus;

        this.gameState.addScore(this.levelScore + this.bonusScore);
        this.gameState.unlockNextLevel(7); // ID 7 Quiz
        setTimeout(() => this.showLevelModal.set(true), 1000);
      } else {
        setTimeout(() => this.generate(), 1500);
      }
    } else {
      this.sound.playError();
      this.message.set('Yanlış 😔');
    }
  }

  onNextLevel() {
    const nextId = this.levelManager.getNextLevelId(7);
    if (nextId) this.router.navigate(['/games', this.levelManager.getLevelById(nextId)?.gameType]);
    else this.router.navigate(['/levels']);
  }

  onGoHome() { this.router.navigate(['/levels']); }
}
