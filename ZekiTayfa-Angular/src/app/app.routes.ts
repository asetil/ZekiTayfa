import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { MemoryGameComponent } from './games/memory/memory.component';
import { XoxComponent } from './games/xox/xox.component';
import { CountingGameComponent } from './games/counting/counting.component';
import { PatternGameComponent } from './games/pattern/pattern.component';
import { SequenceGameComponent } from './games/sequence/sequence.component';
import { OddOneGameComponent } from './games/odd-one/odd-one.component';
import { CipherGameComponent } from './games/cipher/cipher.component';
import { AssociationGameComponent } from './games/association/association.component';
import { QuizGameComponent } from './games/quiz/quiz.component';
import { LevelMapComponent } from './pages/level-map/level-map.component';
import { inject } from '@angular/core';
import { GameStateService } from './services/game-state.service';
import { Router } from '@angular/router';

const authGuard = () => {
    const gameState = inject(GameStateService);
    const router = inject(Router);

    if (gameState.name()) {
        return true;
    }
    return router.parseUrl('/welcome');
};

export const routes: Routes = [
    { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    { path: 'welcome', component: WelcomeComponent },
    { path: 'levels', component: LevelMapComponent },
    {
        path: 'games',
        canActivate: [authGuard],
        children: [
            { path: 'memory', component: MemoryGameComponent },
            { path: 'xox', component: XoxComponent },
            { path: 'counting', component: CountingGameComponent },
            { path: 'pattern', component: PatternGameComponent },
            { path: 'sequence', component: SequenceGameComponent },
            { path: 'odd-one', component: OddOneGameComponent },
            { path: 'cipher', component: CipherGameComponent },
            { path: 'association', component: AssociationGameComponent },
            { path: 'quiz', component: QuizGameComponent },
        ]
    }
];
