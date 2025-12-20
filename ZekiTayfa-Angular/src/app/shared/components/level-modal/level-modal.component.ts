import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-level-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay bounce-in" *ngIf="visible">
      <div class="modal-content">
        <h2 class="title">{{ title }}</h2>
        <div class="stars">
          <span class="star">⭐</span>
          <span class="star">⭐</span>
          <span class="star">⭐</span>
        </div>
        
        <div class="score-details">
            <p class="score base">+{{ score }} Puan</p>
            <p class="score bonus" *ngIf="bonus > 0">⚡ +{{ bonus }} Bonus!</p>
            <p class="total">Toplam: {{ score + bonus }}</p>
        </div>
        
        <div class="actions">
          <button class="btn btn-primary" (click)="onNext.emit()">Sonraki Seviye ▶</button>
          <button class="btn btn-secondary" (click)="onHome.emit()">Menüye Dön 🏠</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.7); backdrop-filter: blur(5px);
      display: flex; justify-content: center; align-items: center; z-index: 1000;
    }
    .modal-content {
      background: white; padding: 40px; border-radius: 30px; text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.4); min-width: 320px;
    }
    .title { color: #4ECDC4; font-size: 2.5rem; margin-bottom: 10px; }
    .stars { font-size: 3rem; margin: 20px 0; }
    .star { display: inline-block; animation: pop 0.5s ease backwards; }
    .star:nth-child(2) { animation-delay: 0.2s; }
    .star:nth-child(3) { animation-delay: 0.4s; }
    
    .score-details { margin-bottom: 30px; }
    .score { font-size: 1.5rem; color: #555; font-weight: bold; margin: 5px 0; }
    .bonus { color: #FFD700; font-size: 1.2rem; animation: pulse 1s infinite; }
    .total { font-size: 1.8rem; color: #4ECDC4; font-weight: 800; border-top: 1px dashed #ddd; padding-top: 10px; margin-top: 10px; }
    
    .actions { display: flex; flex-direction: column; gap: 15px; }
    .btn { padding: 15px 30px; border-radius: 20px; border: none; font-size: 1.2rem; font-weight: bold; cursor: pointer; transition: transform 0.2s; }
    .btn:hover { transform: scale(1.05); }
    .btn-primary { background: #FF6B6B; color: white; }
    .btn-secondary { background: #f0f4f8; color: #555; }

    @keyframes pop {
      0% { transform: scale(0); opacity: 0; }
      80% { transform: scale(1.4); }
      100% { transform: scale(1); opacity: 1; }
    }
  `]
})
export class LevelModalComponent {
  @Input() visible = false;
  @Input() title = 'Tebrikler!';
  @Input() score = 0;
  @Input() bonus = 0;
  @Output() onNext = new EventEmitter<void>();
  @Output() onHome = new EventEmitter<void>();
}
