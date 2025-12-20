import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameStateService } from '../../services/game-state.service';
import { LevelManagerService, Level } from '../../services/level-manager.service';

@Component({
    selector: 'app-level-map',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="map-container bounce-in">
      <h2>Seviye Haritası 🗺️</h2>
      
      <div class="levels-grid">
        <button *ngFor="let lvl of levels" 
                class="level-btn"
                [class.locked]="lvl.id > userLevel()"
                [class.current]="lvl.id === userLevel()"
                [disabled]="lvl.id > userLevel()"
                (click)="startLevel(lvl)">
           <div class="lvl-num">{{ lvl.id }}</div>
           <div class="lvl-title" *ngIf="lvl.id <= userLevel()">{{ lvl.title }}</div>
           <div class="lvl-lock" *ngIf="lvl.id > userLevel()">🔒</div>
        </button>
      </div>
    </div>
  `,
    styles: [`
    .map-container { padding: 20px; max-width: 800px; margin: 0 auto; text-align: center; }
    h2 { color: white; margin-bottom: 30px; font-size: 2.5rem; }
    
    .levels-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 20px; }
    
    .level-btn {
      aspect-ratio: 1; border-radius: 25px; border: none; background: white; 
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
      cursor: pointer; transition: all 0.2s; box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      position: relative; overflow: hidden;
    }
    
    .level-btn:hover:not(:disabled) { transform: translateY(-5px); background: #FFD700; }
    
    .lvl-num { font-size: 3rem; font-weight: 800; color: #eee; position: absolute; top: -10px; right: 10px; }
    .level-btn:hover .lvl-num { color: rgba(255,255,255,0.4); }
    
    .lvl-title { font-weight: bold; font-size: 1.1rem; color: #333; z-index: 1; }
    
    .level-btn.locked { background: rgba(255,255,255,0.2); cursor: not-allowed; }
    .level-btn.locked .lvl-num { color: rgba(0,0,0,0.2); }
    .level-btn.current { border: 4px solid #FFD700; animation: pulse 2s infinite; }
    
    @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(255, 215, 0, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0); } }
  `]
})
export class LevelMapComponent {
    gameState = inject(GameStateService);
    levelManager = inject(LevelManagerService);
    router = inject(Router);

    levels: Level[] = [];
    userLevel = this.gameState.level;

    constructor() {
        this.levels = this.levelManager.getLevelsForAge(this.gameState.age() || 6);
    }

    startLevel(lvl: Level) {
        this.router.navigate(['/games', lvl.gameType]);
    }
}
