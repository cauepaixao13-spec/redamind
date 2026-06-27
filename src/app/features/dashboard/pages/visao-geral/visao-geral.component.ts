import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../../../core/services/data.service';

@Component({
  selector: 'app-visao-geral',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
<div class="page">
  <!-- Header -->
  <div class="page-header">
    <div>
      <p class="page-eyebrow">Olá estudante 👋</p>
      <h1>Sua jornada para a <span class="highlight">aprovação</span></h1>
    </div>
    <a routerLink="/dashboard/desafio-semanal" class="btn-primary">
      Novo desafio →
    </a>
  </div>

  <!-- Stats Row -->
  <div class="stats-row">
    <div class="stat-card">
      <div class="stat-icon fire">🔥</div>
      <div class="stat-body">
        <span class="stat-label">Streak</span>
        <span class="stat-value">7 dias</span>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon level">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      </div>
      <div class="stat-body">
        <span class="stat-label">Nível</span>
        <span class="stat-value">Lv. 12</span>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon redacoes">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </div>
      <div class="stat-body">
        <span class="stat-label">Redações</span>
        <span class="stat-value">14</span>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon xp">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
        </svg>
      </div>
      <div class="stat-body">
        <span class="stat-label">XP Total</span>
        <span class="stat-value">2.480</span>
      </div>
    </div>
  </div>

  <!-- Charts Row -->
  <div class="charts-row">
    <!-- Line Chart -->
    <div class="chart-card card">
      <div class="chart-header">
        <div>
          <h3>Evolução da nota</h3>
          <p class="chart-sub">Últimas 7 semanas</p>
        </div>
        <span class="trend-badge positive">+200 pts</span>
      </div>
      <div class="line-chart-wrap">
        <svg viewBox="0 0 400 150" class="line-chart" preserveAspectRatio="none">
          <!-- Grid lines -->
          <line x1="0" y1="30"  x2="400" y2="30"  stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
          <line x1="0" y1="60"  x2="400" y2="60"  stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
          <line x1="0" y1="90"  x2="400" y2="90"  stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
          <line x1="0" y1="120" x2="400" y2="120" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
          <!-- Gradient fill -->
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(0,196,255,0.3)"/>
              <stop offset="100%" stop-color="rgba(0,196,255,0)"/>
            </linearGradient>
          </defs>
          <path d="M 0,130 L 44,120 L 88,100 L 133,85 L 177,70 L 222,55 L 266,40 L 311,32 L 355,22 L 400,18 L 400,150 L 0,150 Z"
                fill="url(#lineGrad)"/>
          <!-- Line -->
          <path d="M 0,130 L 44,120 L 88,100 L 133,85 L 177,70 L 222,55 L 266,40 L 311,32 L 355,22 L 400,18"
                fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          <!-- Dots -->
          @for (pt of linePoints; track pt.x) {
            <circle [attr.cx]="pt.x" [attr.cy]="pt.y" r="3.5" fill="var(--accent)" stroke="var(--bg-card)" stroke-width="2"/>
          }
        </svg>
        <!-- X labels -->
        <div class="x-labels">
          @for (lbl of ['S1','S2','S3','S4','S5','S6','S7']; track lbl) {
            <span>{{ lbl }}</span>
          }
        </div>
      </div>
    </div>

    <!-- Radar Chart -->
    <div class="chart-card card">
      <div class="chart-header">
        <div>
          <h3>Competências ENEM</h3>
          <p class="chart-sub">Última redação</p>
        </div>
      </div>
      <div class="radar-wrap">
        <svg viewBox="0 0 200 200" class="radar-chart">
          <defs>
            <radialGradient id="radarFill" cx="50%" cy="50%">
              <stop offset="0%" stop-color="rgba(0,196,255,0.4)"/>
              <stop offset="100%" stop-color="rgba(0,128,208,0.15)"/>
            </radialGradient>
          </defs>
          <!-- Background rings -->
          @for (ring of [70,56,42,28,14]; track ring) {
            <polygon [attr.points]="getPentagonPoints(ring)" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
          }
          <!-- Axes -->
          @for (axis of axisEndpoints; track axis.x2) {
            <line x1="100" y1="100" [attr.x2]="axis.x2" [attr.y2]="axis.y2" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
          }
          <!-- Data polygon -->
          <polygon [attr.points]="radarDataPoints" fill="url(#radarFill)" stroke="var(--accent)" stroke-width="2"/>
          <!-- Labels -->
          @for (lbl of radarLabels; track lbl.text) {
            <text [attr.x]="lbl.x" [attr.y]="lbl.y" text-anchor="middle" fill="rgba(148,163,184,0.9)" font-size="9" font-family="Inter, sans-serif">{{ lbl.text }}</text>
          }
        </svg>
      </div>
    </div>
  </div>

  <!-- Action Cards -->
  <div class="actions-row">
    <div class="action-card card">
      <div class="action-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </div>
      <div class="action-body">
        <p class="action-eyebrow">Desafio Semanal</p>
        <h4>Inteligência artificial e o mundo do trabalho</h4>
      </div>
      <a routerLink="/dashboard/desafio-semanal" class="action-link">Iniciar →</a>
    </div>

    <div class="action-card card">
      <div class="action-icon modules">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      </div>
      <div class="action-body">
        <p class="action-eyebrow">Continuar módulo</p>
        <h4>Proposta de intervenção — 82% concluído</h4>
      </div>
      <a routerLink="/dashboard/modulos" class="action-link">Continuar →</a>
    </div>

    <div class="action-card card">
      <div class="action-icon flashcards">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="5" width="20" height="14" rx="2"/>
          <line x1="2" y1="10" x2="22" y2="10"/>
        </svg>
      </div>
      <div class="action-body">
        <p class="action-eyebrow">Revisão de hoje</p>
        <h4>12 flashcards aguardando — repetição espaçada</h4>
      </div>
      <a routerLink="/dashboard/flashcards" class="action-link">Revisar →</a>
    </div>
  </div>
</div>
  `,
  styles: [`
.page { display: flex; flex-direction: column; gap: 28px; max-width: 1200px; margin: 0 auto; animation: fadeIn 0.4s ease; }

.page-header { display: flex; align-items: flex-end; justify-content: space-between; }
.page-eyebrow { font-size: 0.78rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 500; }
h1 { font-size: 1.8rem; font-weight: 800; letter-spacing: -0.02em; }

.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.stat-card {
  display: flex; align-items: center; gap: 14px;
  background: var(--bg-card); border: 1px solid var(--border-card);
  border-radius: var(--radius-md); padding: 18px 20px;
  transition: border-color 0.2s;
  &:hover { border-color: var(--border); }
}
.stat-icon {
  width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center;
  justify-content: center; font-size: 1.1rem; flex-shrink: 0;
  &.fire  { background: rgba(255,100,0,0.12); }
  &.level { background: rgba(245,158,11,0.12); color: var(--amber); }
  &.redacoes { background: rgba(59,130,246,0.12); color: var(--blue); }
  &.xp    { background: rgba(16,185,129,0.12); color: var(--green); }
}
.stat-body { display: flex; flex-direction: column; gap: 2px; }
.stat-label { font-size: 0.72rem; color: var(--text-muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.04em; }
.stat-value { font-size: 1.4rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; }

.charts-row { display: grid; grid-template-columns: 1.6fr 1fr; gap: 20px; }
.chart-card { padding: 24px; }
.chart-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.chart-header h3 { font-size: 0.95rem; font-weight: 700; margin-bottom: 3px; }
.chart-sub { font-size: 0.75rem; color: var(--text-muted); }
.trend-badge { padding: 4px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 700; }
.trend-badge.positive { background: rgba(16,185,129,0.12); color: var(--green); border: 1px solid rgba(16,185,129,0.2); }

.line-chart-wrap { }
.line-chart { width: 100%; height: 150px; display: block; }
.x-labels {
  display: flex; justify-content: space-between; padding: 8px 0 0;
  font-size: 0.68rem; color: var(--text-muted);
}

.radar-wrap { display: flex; align-items: center; justify-content: center; padding: 8px 0; }
.radar-chart { width: 180px; height: 180px; display: block; }

.actions-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.action-card { padding: 20px; display: flex; flex-direction: column; gap: 14px; cursor: pointer; transition: border-color 0.2s, transform 0.2s; }
.action-card:hover { border-color: var(--border); transform: translateY(-2px); }
.action-icon {
  width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center;
  justify-content: center; background: rgba(0,196,255,0.1); color: var(--accent);
  &.modules { background: rgba(59,130,246,0.1); color: var(--blue); }
  &.flashcards { background: rgba(124,58,237,0.1); color: var(--violet); }
}
.action-body { flex: 1; }
.action-eyebrow { font-size: 0.7rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; }
.action-card h4 { font-size: 0.88rem; font-weight: 600; color: var(--text-primary); line-height: 1.4; }
.action-link {
  font-size: 0.82rem; font-weight: 600; color: var(--accent);
  display: inline-flex; align-items: center; gap: 4px;
  transition: gap 0.2s;
  text-decoration: none;
  &:hover { gap: 8px; }
}

@media (max-width: 1024px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .charts-row { grid-template-columns: 1fr; }
  .actions-row { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .stats-row { grid-template-columns: 1fr 1fr; }
  .page-header { flex-direction: column; align-items: flex-start; gap: 16px; }
}
  `]
})
export class VisaoGeralComponent implements OnInit {
  linePoints = [
    { x: 0, y: 130 }, { x: 44, y: 120 }, { x: 88, y: 100 }, { x: 133, y: 85 },
    { x: 177, y: 70 }, { x: 222, y: 55 }, { x: 266, y: 40 }, { x: 311, y: 32 },
    { x: 355, y: 22 }, { x: 400, y: 18 }
  ];

  radarLabels = [
    { text: 'C1', x: 100, y: 18 },
    { text: 'C2', x: 180, y: 74 },
    { text: 'C3', x: 150, y: 182 },
    { text: 'C4', x: 50,  y: 182 },
    { text: 'C5', x: 20,  y: 74 },
  ];

  axisEndpoints = [
    { x2: 100, y2: 30 },
    { x2: 167, y2: 77 },
    { x2: 140, y2: 170 },
    { x2: 60,  y2: 170 },
    { x2: 33,  y2: 77 },
  ];

  radarDataPoints = '';

  scores = [0.9, 0.8, 0.9, 0.6, 0.8]; // C1-C5 as fractions

  constructor(private dataService: DataService) {}

  ngOnInit() {
    const cx = 100, cy = 100, maxR = 70;
    const angles = [-Math.PI/2, -Math.PI/2 + 2*Math.PI/5, -Math.PI/2 + 4*Math.PI/5,
                    -Math.PI/2 + 6*Math.PI/5, -Math.PI/2 + 8*Math.PI/5];
    this.radarDataPoints = this.scores.map((s, i) => {
      const r = s * maxR;
      return `${cx + r * Math.cos(angles[i])},${cy + r * Math.sin(angles[i])}`;
    }).join(' ');
  }

  getPentagonPoints(r: number): string {
    const cx = 100, cy = 100;
    const angles = [-Math.PI/2, -Math.PI/2 + 2*Math.PI/5, -Math.PI/2 + 4*Math.PI/5,
                    -Math.PI/2 + 6*Math.PI/5, -Math.PI/2 + 8*Math.PI/5];
    return angles.map(a => `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`).join(' ');
  }
}
