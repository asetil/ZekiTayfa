import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GameStateService } from '../../services/game-state.service';

@Component({
    selector: 'app-welcome',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="welcome-container bounce-in">
      <h1>Merhaba! 👋</h1>
      <p class="subtitle">ZekiTayfa'ya Hoşgeldin</p>

      <div class="input-group">
        <input type="text" 
               [(ngModel)]="name" 
               placeholder="İsmin nedir?" 
               class="name-input"
               (keyup.enter)="step = 2">
      </div>

      <div class="age-section" *ngIf="name() && name().length > 2">
        <h3>Kaç Yaşındasın?</h3>
        <div class="age-grid">
          <button *ngFor="let age of ages" 
                  class="age-btn" 
                  (click)="selectAge(age)">
            {{ age }}
          </button>
        </div>
      </div>
      <div class="credits">
        <div class="credit-item">
          <span class="role">Proje Sahibi</span>
          <span class="name">Osman SOKUOĞLU</span>
        </div>
        <div class="divider"></div>
        <div class="credit-item">
          <span class="role">Angular Geliştirme</span>
          <span class="name">Fatih KARAKAŞ</span>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .welcome-container { text-align: center; padding: 40px; color: #333; max-width: 500px; margin: 30px auto; background: white; border-radius: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); position: relative; overflow: hidden; }
    h1 { font-size: 3rem; color: #FF6B6B; margin-bottom: 5px; }
    .subtitle { font-size: 1.2rem; color: #666; margin-bottom: 25px; }
    
    .name-input {
      font-size: 1.5rem; padding: 15px 25px; border-radius: 50px; border: 2px solid #ddd; width: 80%; text-align: center; outline: none; transition: border-color 0.3s;
    }
    .name-input:focus { border-color: #4ECDC4; }
    
    .age-section { margin-top: 25px; animation: fadeIn 0.5s ease; }
    .age-grid { display: flex; gap: 10px; justify-content: center; margin-top: 15px; }
    .age-btn {
      width: 60px; height: 60px; border-radius: 18px; border: none; background: #f0f4f8; color: #333; font-size: 1.3rem; font-weight: bold; cursor: pointer; transition: all 0.2s;
    }
    .age-btn:hover { background: #FFD700; color: white; transform: translateY(-5px); }

    .credits {
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #eee;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        font-size: 0.9rem;
    }
    .credit-item { display: flex; flex-direction: column; gap: 2px; }
    .role { font-size: 0.75rem; color: #888; text-transform: uppercase; letter-spacing: 1px; }
    .name { font-weight: bold; color: #2C3E50; background: linear-gradient(45deg, #2C3E50, #4ECDC4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .divider { width: 1px; height: 30px; background: #ddd; }
  `]
})
export class WelcomeComponent {
    name = signal('');
    ages = [4, 5, 6, 7, 8];
    step = 1;

    constructor(private gameState: GameStateService, private router: Router) {
        // If user already exists, redirect to games
        if (this.gameState.name()) {
            this.router.navigate(['/games/memory']);
        }
    }

    selectAge(age: number) {
        if (!this.name()) return;

        this.gameState.updateUser({
            name: this.name(),
            age: age,
            unlockedLevel: 1,
            score: 0
        });

        this.router.navigate(['/games/memory']);
    }
}
