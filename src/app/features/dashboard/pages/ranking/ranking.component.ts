import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, RankingUser } from '../../../../core/services/data.service';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="page">
  <div class="page-header">
    <div>
      <p class="eyebrow">GAMIFICAÇÃO</p>
      <h1>Ranking <span class="highlight">semanal</span></h1>
    </div>
    <div class="period-badge">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
      Esta semana
    </div>
  </div>

  <!-- Top 3 podium -->
  <div class="podium">
    @for (user of topThree; track user.position) {
      <div class="podium-item" [class.first]="user.position === 1">
        <div class="podium-avatar" [class.first]="user.position === 1">
          {{ user.name[0] }}
          @if (user.position === 1) {
            <div class="crown">👑</div>
          }
        </div>
        <div class="podium-name">{{ user.name }}</div>
        <div class="podium-level">Nível {{ user.level }}</div>
        <div class="podium-xp">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          {{ user.xp.toLocaleString('pt-BR') }} XP
        </div>
        <div class="podium-medal" [class]="'medal-' + user.position">
          {{ user.position === 1 ? '🥇' : user.position === 2 ? '🥈' : '🥉' }}
        </div>
      </div>
    }
  </div>

  <!-- Full ranking list -->
  <div class="ranking-list">
    @for (user of ranking; track user.position) {
      <div class="rank-row" [class.current-user]="user.isCurrentUser" [class.top3]="user.position <= 3">
        <div class="rank-pos" [class]="'pos-' + (user.position <= 3 ? user.position : 'other')">
          @if (user.position <= 3) {
            {{ user.position === 1 ? '🥇' : user.position === 2 ? '🥈' : '🥉' }}
          } @else {
            {{ user.position }}
          }
        </div>
        <div class="rank-avatar" [class.current]="user.isCurrentUser">
          {{ user.name[0] }}
        </div>
        <div class="rank-info">
          <span class="rank-name">
            {{ user.name }}
            @if (user.isCurrentUser) {
              <span class="you-tag">Você</span>
            }
          </span>
          <span class="rank-level">Nível {{ user.level }}</span>
        </div>
        <div class="rank-xp">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="color: var(--amber);">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          {{ user.xp.toLocaleString('pt-BR') }} XP
        </div>
      </div>
    }
  </div>

  <!-- My position summary -->
  @if (myUser) {
    <div class="my-position-card card">
      <div class="my-pos-left">
        <div class="my-rank-num">#{{ myUser.position }}</div>
        <div>
          <p class="my-rank-label">Sua posição esta semana</p>
          <p class="my-rank-hint">Continue estudando para subir no ranking!</p>
        </div>
      </div>
      <div class="my-pos-right">
        <div class="xp-display">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="color: var(--amber);">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          {{ myUser.xp.toLocaleString('pt-BR') }} XP
        </div>
        <div class="xp-to-next">
          {{ (ranking[myUser.position - 2]?.xp || 0) - myUser.xp }} XP para #{{ myUser.position - 1 }}
        </div>
      </div>
    </div>
  }
</div>
  `,
  styles: [`
.page { max-width: 760px; margin: 0 auto; animation: fadeIn 0.4s ease; display: flex; flex-direction: column; gap: 24px; }
.eyebrow { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; color: var(--accent); text-transform: uppercase; margin-bottom: 8px; }
h1 { font-size: 1.8rem; font-weight: 800; letter-spacing: -0.02em; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; }
.period-badge {
  display: flex; align-items: center; gap: 6px; padding: 6px 14px;
  background: rgba(255,255,255,0.04); border: 1px solid var(--border-card);
  border-radius: 6px; font-size: 0.78rem; color: var(--text-muted);
}

/* Podium */
.podium {
  display: flex; align-items: flex-end; justify-content: center; gap: 16px; padding: 32px 16px 24px;
  background: linear-gradient(180deg, rgba(0,50,120,0.2) 0%, transparent 100%);
  border-radius: var(--radius-xl); border: 1px solid var(--border-card);
}
.podium-item {
  display: flex; flex-direction: column; align-items: center; gap: 6px; position: relative;
  flex: 1; max-width: 160px;
}
.podium-item.first { order: 2; }
.podium-avatar {
  width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, var(--violet), var(--accent));
  font-size: 1.3rem; font-weight: 700; color: white; position: relative;
  border: 2px solid rgba(255,255,255,0.1);
  &.first { width: 68px; height: 68px; font-size: 1.5rem; border: 2px solid var(--amber); box-shadow: 0 0 20px rgba(245,158,11,0.3); }
}
.crown { position: absolute; top: -18px; font-size: 1.1rem; }
.podium-name { font-size: 0.88rem; font-weight: 700; color: var(--text-primary); }
.podium-level { font-size: 0.72rem; color: var(--text-muted); }
.podium-xp {
  display: flex; align-items: center; gap: 4px; font-size: 0.78rem; font-weight: 700; color: var(--amber);
}
.podium-medal { font-size: 1.4rem; }

/* Ranking list */
.ranking-list { display: flex; flex-direction: column; gap: 4px; }
.rank-row {
  display: flex; align-items: center; gap: 14px; padding: 14px 20px;
  background: var(--bg-card); border: 1px solid var(--border-card); border-radius: var(--radius-md);
  transition: border-color 0.2s;
  &:hover { border-color: var(--border); }
  &.current-user { border-color: var(--border); background: var(--accent-10); }
  &.top3 { opacity: 0.7; }
}
.rank-pos {
  width: 32px; text-align: center; font-size: 0.82rem; font-weight: 700; color: var(--text-muted); flex-shrink: 0;
  font-size: 1rem;
  &.pos-1, &.pos-2, &.pos-3 { font-size: 1.2rem; }
  &.pos-other { color: var(--text-muted); }
}
.rank-avatar {
  width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #1e3a8a, var(--accent));
  display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; color: white; flex-shrink: 0;
  &.current { background: linear-gradient(135deg, #0080d0, var(--accent)); box-shadow: 0 0 10px var(--accent-glow); }
}
.rank-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.rank-name { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 8px; }
.you-tag {
  padding: 2px 7px; background: var(--accent); color: var(--bg-dark);
  border-radius: 4px; font-size: 0.65rem; font-weight: 800; letter-spacing: 0.04em;
}
.rank-level { font-size: 0.72rem; color: var(--text-muted); }
.rank-xp {
  display: flex; align-items: center; gap: 5px; font-size: 0.82rem; font-weight: 700; color: var(--amber);
  white-space: nowrap;
}

/* My position */
.my-position-card {
  display: flex; align-items: center; justify-content: space-between; padding: 20px 24px;
}
.my-pos-left { display: flex; align-items: center; gap: 16px; }
.my-rank-num { font-size: 2.2rem; font-weight: 900; color: var(--accent); line-height: 1; }
.my-rank-label { font-size: 0.88rem; font-weight: 600; margin-bottom: 3px; }
.my-rank-hint { font-size: 0.75rem; color: var(--text-muted); }
.my-pos-right { text-align: right; }
.xp-display {
  display: flex; align-items: center; gap: 5px; justify-content: flex-end;
  font-size: 1.2rem; font-weight: 800; color: var(--amber); margin-bottom: 4px;
}
.xp-to-next { font-size: 0.75rem; color: var(--text-muted); }

@media (max-width: 640px) {
  .podium { gap: 8px; padding: 20px 8px; }
  .podium-avatar { width: 44px; height: 44px; &.first { width: 56px; height: 56px; } }
}
  `]
})
export class RankingComponent implements OnInit {
  ranking: RankingUser[] = [];
  topThree: RankingUser[] = [];
  myUser: RankingUser | undefined;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.ranking = this.dataService.getRanking();
    // Reorder podium: 2nd, 1st, 3rd
    const sorted = this.ranking.slice(0, 3);
    this.topThree = [sorted[1], sorted[0], sorted[2]];
    this.myUser = this.ranking.find(u => u.isCurrentUser);
  }
}
