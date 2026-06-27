import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../../core/services/data.service';

@Component({
  selector: 'app-evolucao',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="page">
  <div class="page-header">
    <div>
      <p class="eyebrow">EVOLUÇÃO</p>
      <h1>Sua jornada em <span class="highlight">números</span></h1>
    </div>
  </div>

  <!-- Top row charts -->
  <div class="charts-top">
    <!-- Nota evolution line chart -->
    <div class="chart-card card">
      <div class="chart-header">
        <h3>Evolução da nota</h3>
        <span class="trend-badge positive">+500 pts em 10 semanas</span>
      </div>
      <div class="line-chart-container">
        <svg viewBox="0 0 440 160" class="line-chart" preserveAspectRatio="none">
          <defs>
            <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(0,196,255,0.35)"/>
              <stop offset="100%" stop-color="rgba(0,196,255,0)"/>
            </linearGradient>
          </defs>
          <!-- Y grid lines and labels -->
          @for (line of yGridLines; track line.y) {
            <line [attr.x1]="40" [attr.y1]="line.y" [attr.x2]="440" [attr.y2]="line.y" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
            <text [attr.x]="35" [attr.y]="line.y + 4" text-anchor="end" fill="rgba(148,163,184,0.5)" font-size="9" font-family="Inter">{{ line.label }}</text>
          }
          <!-- Area fill -->
          <path [attr.d]="gradePath" fill="url(#grad1)"/>
          <!-- Line -->
          <path [attr.d]="linePath" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          <!-- Dots -->
          @for (pt of linePoints; track pt.x) {
            <circle [attr.cx]="pt.x" [attr.cy]="pt.y" r="3.5" fill="var(--accent)" stroke="var(--bg-card)" stroke-width="2"/>
          }
        </svg>
        <div class="x-labels">
          @for (l of ['S1','S2','S3','S4','S5','S6','S7','S8','S9','S10']; track l) {
            <span>{{ l }}</span>
          }
        </div>
      </div>
    </div>

    <!-- Study time bar chart -->
    <div class="chart-card card">
      <div class="chart-header">
        <h3>Tempo estudado</h3>
        <span class="sub-label">horas/semana</span>
      </div>
      <div class="bar-chart-container">
        <svg viewBox="0 0 220 140" class="bar-chart" preserveAspectRatio="none">
          @for (bar of barData; track bar.x; let i = $index) {
            <rect [attr.x]="bar.x" [attr.y]="bar.y" [attr.width]="22" [attr.height]="bar.h"
                  rx="4" [attr.fill]="i === barData.length - 1 ? 'var(--accent)' : 'rgba(124,58,237,0.6)'"/>
            <text [attr.x]="bar.x + 11" [attr.y]="135" text-anchor="middle" fill="rgba(148,163,184,0.5)" font-size="8" font-family="Inter">{{ bar.label }}</text>
          }
        </svg>
      </div>
    </div>
  </div>

  <!-- Competências multi-line chart -->
  <div class="chart-card card full-width">
    <div class="chart-header">
      <h3>Evolução por competência</h3>
      <div class="legend">
        @for (leg of legendItems; track leg.label) {
          <div class="leg-item">
            <div class="leg-dot" [style.background]="leg.color"></div>
            <span>{{ leg.label }}</span>
          </div>
        }
      </div>
    </div>
    <div class="multiline-container">
      <svg viewBox="0 0 800 180" class="multiline-chart" preserveAspectRatio="none">
        <defs>
          @for (leg of legendItems; track leg.label; let i = $index) {
            <linearGradient [attr.id]="'cGrad' + i" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" [attr.stop-color]="leg.color" stop-opacity="0.2"/>
              <stop offset="100%" [attr.stop-color]="leg.color" stop-opacity="0"/>
            </linearGradient>
          }
        </defs>
        <!-- Grid -->
        @for (gl of [30,60,90,120,150]; track gl) {
          <line x1="0" [attr.y1]="gl" x2="800" [attr.y2]="gl" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
          <text x="0" [attr.y]="gl - 3" fill="rgba(148,163,184,0.4)" font-size="9" font-family="Inter">{{ 200 - gl }}</text>
        }
        <!-- Lines -->
        @for (comp of compLines; track comp.label; let i = $index) {
          <path [attr.d]="comp.path" fill="none" [attr.stroke]="comp.color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        }
        <!-- X labels -->
        @for (xl of xLabels; track xl.x) {
          <text [attr.x]="xl.x" y="175" text-anchor="middle" fill="rgba(148,163,184,0.4)" font-size="9" font-family="Inter">{{ xl.label }}</text>
        }
      </svg>
    </div>
  </div>

  <!-- Summary stats row -->
  <div class="summary-row">
    @for (stat of summaryStats; track stat.label) {
      <div class="summary-card card">
        <div class="sum-icon" [style.background]="stat.iconBg" [style.color]="stat.color">
          <span [innerHTML]="stat.icon"></span>
        </div>
        <div class="sum-body">
          <span class="sum-val" [style.color]="stat.color">{{ stat.value }}</span>
          <span class="sum-label">{{ stat.label }}</span>
        </div>
      </div>
    }
  </div>
</div>
  `,
  styles: [`
.page { max-width: 1200px; margin: 0 auto; animation: fadeIn 0.4s ease; display: flex; flex-direction: column; gap: 24px; }
.eyebrow { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; color: var(--accent); text-transform: uppercase; margin-bottom: 8px; }
h1 { font-size: 1.8rem; font-weight: 800; letter-spacing: -0.02em; }

.charts-top { display: grid; grid-template-columns: 1.6fr 1fr; gap: 20px; }
.chart-card { padding: 24px; }
.chart-card.full-width { }
.chart-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 8px; }
.chart-header h3 { font-size: 0.95rem; font-weight: 700; }
.sub-label { font-size: 0.75rem; color: var(--text-muted); }
.trend-badge.positive { padding: 4px 10px; border-radius: 999px; font-size: 0.72rem; font-weight: 700; background: rgba(16,185,129,0.12); color: var(--green); border: 1px solid rgba(16,185,129,0.2); }

.line-chart-container { }
.line-chart { width: 100%; height: 160px; display: block; }
.x-labels { display: flex; justify-content: space-between; padding: 6px 0 0; font-size: 0.68rem; color: var(--text-muted); }

.bar-chart-container { }
.bar-chart { width: 100%; height: 140px; display: block; }

.multiline-container { }
.multiline-chart { width: 100%; height: 180px; display: block; }

.legend { display: flex; flex-wrap: wrap; gap: 12px; }
.leg-item { display: flex; align-items: center; gap: 5px; font-size: 0.75rem; color: var(--text-secondary); }
.leg-dot { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }

.summary-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.summary-card { padding: 20px; display: flex; align-items: center; gap: 14px; }
.sum-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
.sum-body { display: flex; flex-direction: column; gap: 2px; }
.sum-val { font-size: 1.4rem; font-weight: 800; line-height: 1.1; }
.sum-label { font-size: 0.72rem; color: var(--text-muted); font-weight: 500; }

@media (max-width: 1024px) { .charts-top { grid-template-columns: 1fr; } .summary-row { grid-template-columns: repeat(2,1fr); } }
@media (max-width: 640px)  { .summary-row { grid-template-columns: 1fr 1fr; } }
  `]
})
export class EvolucaoComponent implements OnInit {
  // Line chart: grade evolution
  grades = [420, 540, 600, 680, 720, 800, 860, 880, 900, 920];
  linePoints: { x: number; y: number }[] = [];
  linePath = '';
  gradePath = '';
  yGridLines = [
    { y: 20, label: '1000' }, { y: 50, label: '800' },
    { y: 80, label: '600' }, { y: 110, label: '400' }, { y: 140, label: '200' }
  ];

  // Bar chart: study time
  studyHours = [2.0, 3.5, 2.5, 4.0, 4.5, 5.0, 4.0];
  barData: { x: number; y: number; h: number; label: string }[] = [];

  // Competências multi-line
  compColors = ['#00c4ff', '#7c3aed', '#10b981', '#f59e0b', '#ef4444'];
  legendItems = [
    { label: 'C1 Norma', color: '#00c4ff' },
    { label: 'C2 Tema', color: '#7c3aed' },
    { label: 'C3 Argum.', color: '#10b981' },
    { label: 'C4 Coesão', color: '#f59e0b' },
    { label: 'C5 Interv.', color: '#ef4444' },
  ];
  compRawData = [
    [120, 140, 160, 170, 180, 180],
    [100, 130, 160, 180, 190, 200],
    [80,  110, 140, 160, 170, 180],
    [100, 120, 140, 150, 160, 180],
    [60,  90,  120, 150, 160, 180],
  ];
  compLines: { path: string; color: string; label: string }[] = [];
  xLabels: { x: number; label: string }[] = [];

  summaryStats = [
    { label: 'Redações enviadas', value: '14', icon: '✏️', color: 'var(--accent)', iconBg: 'rgba(0,196,255,0.1)' },
    { label: 'Nota mais alta', value: '920', icon: '🏆', color: 'var(--amber)', iconBg: 'rgba(245,158,11,0.1)' },
    { label: 'Streak atual', value: '7 dias', icon: '🔥', color: '#ff8040', iconBg: 'rgba(255,100,0,0.1)' },
    { label: 'Horas estudadas', value: '26h', icon: '⏱️', color: 'var(--violet)', iconBg: 'rgba(124,58,237,0.1)' },
  ];

  ngOnInit() {
    this.buildLineChart();
    this.buildBarChart();
    this.buildCompLines();
  }

  private buildLineChart() {
    const w = 440, h = 160, pad = 40, maxGrade = 1000;
    this.linePoints = this.grades.map((g, i) => ({
      x: pad + (i / (this.grades.length - 1)) * (w - pad),
      y: h - 15 - ((g / maxGrade) * (h - 30))
    }));
    const pts = this.linePoints;
    this.linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
    this.gradePath = this.linePath + ` L ${pts[pts.length-1].x},${h} L ${pts[0].x},${h} Z`;
  }

  private buildBarChart() {
    const maxH = 110, w = 220;
    const maxVal = Math.max(...this.studyHours);
    const spacing = Math.floor(w / this.studyHours.length);
    this.barData = this.studyHours.map((v, i) => {
      const h = Math.round((v / maxVal) * maxH);
      return { x: i * spacing + 5, y: 120 - h, h, label: ['Seg','Ter','Qua','Qui','Sex','Sab','Dom'][i] };
    });
  }

  private buildCompLines() {
    const w = 800, h = 160, n = 6;
    this.xLabels = Array.from({ length: n }, (_, i) => ({
      x: 20 + (i / (n - 1)) * (w - 40), label: `S${i + 1}`
    }));
    this.compLines = this.compRawData.map((data, ci) => {
      const pts = data.map((v, i) => ({
        x: 20 + (i / (n - 1)) * (w - 40),
        y: h - ((v / 200) * (h - 20)) - 5
      }));
      const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
      return { path, color: this.compColors[ci], label: this.legendItems[ci].label };
    });
  }
}
