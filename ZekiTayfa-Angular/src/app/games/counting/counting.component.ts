import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameStateService } from '../../services/game-state.service';
import { SoundService } from '../../services/sound.service';
import { LevelManagerService } from '../../services/level-manager.service';
import { LevelModalComponent } from '../../shared/components/level-modal/level-modal.component';

@Component({
  selector: 'app-counting-game',
  standalone: true,
  imports: [CommonModule, LevelModalComponent],
  template: `
    <div class="counting-container bounce-in">
      <h2>Tane Hesabı</h2>
      <p class="instruction">Kaç tane görüyorsun?</p>
      
      <div class="target-number">{{ targetNumber() }}</div>
      
      <div class="options-grid">
        <button *ngFor="let option of options()"
                class="option-btn"
                [class.correct]="selectedOption() === option && isCorrect()"
                [class.wrong]="selectedOption() === option && !isCorrect()"
                (click)="selectOption(option)">
          
          <div class="items-container">
            <img *ngFor="let i of generateArray(option.count)" 
                 [src]="option.image" 
                 class="count-item" 
                 alt="item">
          </div>
          
        </button>
      </div>

      <!-- Level Modal -->
      <app-level-modal 
        [visible]="showLevelModal()" 
        [score]="levelScore"
        [title]="'Harika Saydın!'"
        (onNext)="onNextLevel()"
        (onHome)="onGoHome()">
      </app-level-modal>
    </div>
  `,
  styles: [`
    .counting-container { text-align: center; padding: 20px; max-width: 800px; margin: 0 auto; color: #333; }
    .target-number { font-size: 5rem; font-weight: 800; margin: 20px 0; color: #FFD700; text-shadow: 2px 2px 0 #333; }
    
    .options-grid {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;
    }
    
    .option-btn {
      background: white; border: none; border-radius: 20px; padding: 15px;
      cursor: pointer; transition: transform 0.2s; min-height: 150px;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    .option-btn:hover { transform: scale(1.05); }
    
    .items-container {
      display: flex; flex-wrap: wrap; justify-content: center; gap: 5px;
    }
    .count-item { width: 40px; height: 40px; object-fit: contain; }

    .option-btn.correct { background: #d4edda; border: 4px solid #28a745; }
    .option-btn.wrong { background: #f8d7da; border: 4px solid #dc3545; animation: shake 0.5s; }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
  `]
})
export class CountingGameComponent implements OnInit {
  targetNumber = signal(0);
  options = signal<any[]>([]);
  selectedOption = signal<any>(null);
  isCorrect = signal(false);

  // Progression
  showLevelModal = signal(false);
  levelScore = 0;
  correctCount = 0;
  requiredCorrects = 3; // Need 3 correct answers to pass level

  constructor(
    private gameState: GameStateService,
    private sound: SoundService,
    private levelManager: LevelManagerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.generateNewRound();
  }

  generateNewRound() {
    const target = Math.floor(Math.random() * 9) + 1; // 1-9
    this.targetNumber.set(target);

    // Generate distractions
    const nums = new Set([target]);
    while (nums.size < 4) {
      nums.add(Math.floor(Math.random() * 9) + 1);
    }

    const shuffledNums = Array.from(nums).sort(() => Math.random() - 0.5);
    const image = 'https://img.icons8.com/fluency/96/star.png'; // Consistent image

    this.options.set(shuffledNums.map(n => ({
      count: n,
      image: image
    })));

    this.selectedOption.set(null);
  }

  selectOption(option: any) {
    if (this.selectedOption()) return; // Lock

    this.selectedOption.set(option);
    const correct = option.count === this.targetNumber();
    this.isCorrect.set(correct);

    if (correct) {
      this.sound.playMatch(); // Ding sound
      this.correctCount++;

      if (this.correctCount >= this.requiredCorrects) {
        this.sound.playWin();
        this.levelScore = 200;
        this.gameState.addScore(this.levelScore);
        this.gameState.unlockNextLevel(2); // ID 2 is Counting
        setTimeout(() => this.showLevelModal.set(true), 1000);
      } else {
        setTimeout(() => this.generateNewRound(), 1000);
      }
    } else {
      this.sound.playError();
      setTimeout(() => {
        this.selectedOption.set(null);
      }, 1000);
    }
  }

  onNextLevel() {
    const nextId = this.levelManager.getNextLevelId(2);
    if (nextId) {
      this.router.navigate(['/games', this.levelManager.getLevelById(nextId)?.gameType]);
    } else {
      this.router.navigate(['/levels']);
    }
  }

  onGoHome() {
    this.router.navigate(['/levels']);
  }

  generateArray(n: number): number[] {
    return Array(n).fill(0);
  }
}
