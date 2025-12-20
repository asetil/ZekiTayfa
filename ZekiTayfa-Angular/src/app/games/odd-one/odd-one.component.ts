import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameStateService } from '../../services/game-state.service';
import { SoundService } from '../../services/sound.service';
import { LevelManagerService } from '../../services/level-manager.service';
import { LevelModalComponent } from '../../shared/components/level-modal/level-modal.component';

@Component({
  selector: 'app-odd-one-game',
  standalone: true,
  imports: [CommonModule, LevelModalComponent],
  template: `
    <div class="odd-one-container bounce-in">
      <h2>Farkı Bul</h2>
      <p>Hangi şekil diğerlerinden farklı?</p>
      
      <div class="grid" [style.grid-template-columns]="'repeat(' + gridSize() + ', 1fr)'">
        <button *ngFor="let item of items(); let i = index"
                class="item-btn"
                [class.correct]="showFeedback() && i === diffIndex()"
                [class.wrong]="showFeedback() && i === selectedIndex() && i !== diffIndex()"
                (click)="selectItem(i)">
          {{ item }}
        </button>
      </div>
      
      <app-level-modal 
        [visible]="showLevelModal()" 
        [score]="levelScore"
        [title]="'Çok Dikkatlisin!'"
        (onNext)="onNextLevel()"
        (onHome)="onGoHome()">
      </app-level-modal>
    </div>
  `,
  styles: [`
    .odd-one-container { text-align: center; padding: 20px; max-width: 600px; margin: 0 auto; color: #333; }
    .grid { display: grid; gap: 15px; margin-top: 20px; }
    .item-btn {
      font-size: 3rem; background: white; border: none; border-radius: 15px; padding: 20px;
      cursor: pointer; transition: transform 0.2s; aspect-ratio: 1; box-shadow: 0 5px 10px rgba(0,0,0,0.1);
    }
    .item-btn:hover { transform: scale(1.05); }
    .item-btn.correct { background: #d4edda; border: 4px solid #28a745; }
    .item-btn.wrong { background: #f8d7da; border: 4px solid #dc3545; animation: shake 0.4s; }
    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
  `]
})
export class OddOneGameComponent implements OnInit {
  items = signal<string[]>([]);
  diffIndex = signal(-1);
  gridSize = signal(3);
  showFeedback = signal(false);
  selectedIndex = signal(-1);

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
    this.generateLevel();
  }

  generateLevel() {
    const common = '🐱';
    const different = '🐶';
    const total = 9;

    const diffPos = Math.floor(Math.random() * total);
    this.diffIndex.set(diffPos);

    const arr = Array(total).fill(common);
    arr[diffPos] = different;

    this.items.set(arr);
    this.showFeedback.set(false);
    this.selectedIndex.set(-1);
  }

  selectItem(index: number) {
    if (this.showFeedback()) return;

    this.selectedIndex.set(index);
    const correct = index === this.diffIndex();
    this.showFeedback.set(true);

    if (correct) {
      this.sound.playMatch();
      this.wins++;

      if (this.wins >= this.requiredWins) {
        this.sound.playWin();
        this.levelScore = 250;
        this.gameState.addScore(this.levelScore);
        this.gameState.unlockNextLevel(3); // ID 3 is OddOne
        setTimeout(() => this.showLevelModal.set(true), 1000);
      } else {
        setTimeout(() => this.generateLevel(), 1500);
      }
    } else {
      this.sound.playError();
      setTimeout(() => {
        this.showFeedback.set(false);
        this.selectedIndex.set(-1);
      }, 1000);
    }
  }

  onNextLevel() {
    const nextId = this.levelManager.getNextLevelId(3);
    if (nextId) this.router.navigate(['/games', this.levelManager.getLevelById(nextId)?.gameType]);
    else this.router.navigate(['/levels']);
  }

  onGoHome() { this.router.navigate(['/levels']); }
}
