import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { GameStateService } from './services/game-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <header class="main-header">
        <div class="brand" routerLink="/">ZekiTayfa 🧠</div>
        
        <div class="user-info" *ngIf="gameState.name()">
          <span class="hello">Merhaba, {{ gameState.name() }}!</span>
          <span class="score">🏆 {{ gameState.score() }}</span>
          <span class="level">⭐ Seviye {{ gameState.level() }}</span>
          <button class="reset-btn" (click)="resetGame()" title="Oyunu Sıfırla">🔄</button>
        </div>
      </header>
      
      <main>
        <router-outlet></router-outlet>
      </main>

      <nav class="bottom-nav">
        <a routerLink="/games/memory" routerLinkActive="active">🎴 Hafıza</a>
        <a routerLink="/games/xox" routerLinkActive="active">⭕ XOX</a>
        <a routerLink="/games/counting" routerLinkActive="active">🔢 Sayma</a>
        <a routerLink="/games/quiz" routerLinkActive="active">❓ Quiz</a>
      </nav>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100vh; font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
    .main-header { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; background: rgba(0,0,0,0.2); backdrop-filter: blur(10px); }
    .brand { font-size: 1.5rem; font-weight: bold; cursor: pointer; }
    .user-info { display: flex; align-items: center; gap: 15px; font-weight: bold; font-size: 0.95rem; }
    .hello { color: #FFD700; text-shadow: 1px 1px 0 rgba(0,0,0,0.3); }
    .reset-btn { background: rgba(255,255,255,0.2); border: none; color: white; cursor: pointer; border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; transition: background 0.2s; }
    .reset-btn:hover { background: rgba(255,255,255,0.4); transform: rotate(180deg); transition: transform 0.4s; }
    
    main { padding: 20px; padding-bottom: 80px; height: calc(100vh - 140px); overflow-y: auto; }
    .bottom-nav { position: fixed; bottom: 0; width: 100%; height: 70px; background: white; display: flex; justify-content: space-around; align-items: center; color: #333; border-top-left-radius: 20px; border-top-right-radius: 20px; box-shadow: 0 -5px 20px rgba(0,0,0,0.1); z-index: 100; }
    .bottom-nav a { text-decoration: none; color: #888; font-size: 0.9rem; display: flex; flex-direction: column; align-items: center; gap: 5px; }
    .bottom-nav a.active { color: #764ba2; font-weight: bold; transform: translateY(-5px); transition: transform 0.2s; }
  `]
})
export class AppComponent {
  gameState = inject(GameStateService);
  private router = inject(Router);

  resetGame() {
    if (confirm('Oyun ilerlemeni sıfırlamak istiyor musun?')) {
      this.gameState.resetGame();
      this.router.navigate(['/welcome']);
    }
  }
}
