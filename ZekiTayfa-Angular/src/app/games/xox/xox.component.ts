import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../services/game-state.service';
import { SoundService } from '../../services/sound.service';

@Component({
  selector: 'app-xox',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="xox-container bounce-in">
      <h2>XOX</h2>
      <div class="status">{{ statusMessage() }}</div>
      
      <div class="board" [class.disabled]="!isGameActive()">
        <div *ngFor="let cell of board(); let i = index" 
             class="cell" 
             [class.x]="cell === 'X'" 
             [class.o]="cell === 'O'"
             (click)="makeMove(i)">
          {{ cell }}
        </div>
      </div>
      
      <button class="reset-btn" (click)="resetGame()">Yeniden Başla</button>
    </div>
  `,
  styles: [`
    .xox-container {
      text-align: center;
      padding: 20px;
      font-family: 'Fredoka', sans-serif;
    }
    .board {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      width: 100%;
      max-width: 300px;
      aspect-ratio: 1;
      margin: 20px auto;
      background: #2C3E50;
      padding: 10px;
      border-radius: 15px;
    }
    .cell {
      background: white;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 3rem;
      font-weight: 800;
      cursor: pointer;
      color: #333;
    }
    .cell.x { color: #FF6B6B; }
    .cell.o { color: #4ECDC4; }
    .reset-btn {
      padding: 10px 20px;
      border-radius: 20px;
      border: none;
      background: #FF6B6B;
      color: white;
      font-weight: bold;
      cursor: pointer;
    }
  `]
})
export class XoxComponent {
  board: WritableSignal<string[]> = signal(Array(9).fill(''));
  isGameActive = signal(true);
  statusMessage = signal('Sıra Sende (X)');

  constructor(private gameState: GameStateService, private sound: SoundService) { }

  makeMove(index: number) {
    if (!this.isGameActive() || this.board()[index] !== '') return;

    this.sound.playClick();
    this.updateBoard(index, 'X');

    if (this.checkWin('X')) {
      this.sound.playWin();
      this.endGame('Kazandın! 🎉', true);
      return;
    }

    if (this.board().every(c => c !== '')) {
      this.sound.playError(); // Draw sound
      this.endGame('Berabere!', false);
      return;
    }

    // Computer Move
    this.statusMessage.set('Bilgisayar düşünüyor...');
    setTimeout(() => this.computerMove(), 500);
  }

  computerMove() {
    if (!this.isGameActive()) return;

    const emptyIndices = this.board().map((v, i) => v === '' ? i : -1).filter(i => i !== -1);
    const move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

    this.sound.playClick();
    this.updateBoard(move, 'O');

    if (this.checkWin('O')) {
      this.sound.playError();
      this.endGame('Kaybettin 😔', false);
    } else {
      this.statusMessage.set('Sıra Sende (X)');
    }
  }

  updateBoard(index: number, val: string) {
    this.board.update(b => {
      const newB = [...b];
      newB[index] = val;
      return newB;
    });
  }

  checkWin(player: string): boolean {
    const wins = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    return wins.some(combo => combo.every(i => this.board()[i] === player));
  }

  endGame(msg: string, win: boolean) {
    this.isGameActive.set(false);
    this.statusMessage.set(msg);
    if (win) {
      this.gameState.addScore(500);
    }
  }

  resetGame() {
    this.board.set(Array(9).fill(''));
    this.isGameActive.set(true);
    this.statusMessage.set('Sıra Sende (X)');
  }
}
