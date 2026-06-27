import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Module } from '../../../../core/services/data.service';

@Component({
  selector: 'app-modulos',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="page">
  <div class="page-header">
    <div>
      <p class="eyebrow">CURSOS</p>
      <h1>Módulos do <span class="highlight">programa</span></h1>
      <p class="page-sub">Microlearning + active recall + repetição espaçada</p>
    </div>
    <div class="header-stats">
      <div class="h-stat">
        <span class="h-val">{{ completedCount }}</span>
        <span class="h-lbl">Concluídos</span>
      </div>
      <div class="h-stat">
        <span class="h-val">{{ modules.length }}</span>
        <span class="h-lbl">Total</span>
      </div>
    </div>
  </div>

  <div class="modules-grid">
    @for (mod of modules; track mod.id) {
      <div class="module-card card" [class.completed]="mod.completed">
        <div class="module-top">
          <div class="module-icon" [class.done]="mod.completed">
            @if (mod.completed) {
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            } @else {
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            }
          </div>
          @if (mod.completed) {
            <div class="badge-done">Concluído</div>
          } @else if (mod.progress > 0) {
            <div class="badge-progress">Em andamento</div>
          }
        </div>

        <h3>{{ mod.title }}</h3>
        <p class="mod-subtitle">{{ mod.subtitle }}</p>

        <div class="mod-meta">
          <span class="meta-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            {{ mod.duration }}
          </span>
          <span class="meta-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            {{ mod.lessons }} aulas
          </span>
        </div>

        <div class="mod-progress">
          <div class="progress-bar">
            <div class="progress-fill"
              [style.width.%]="mod.progress"
              [style.background]="mod.completed ? 'var(--green)' : 'linear-gradient(90deg,#0080d0,var(--accent))'">
            </div>
          </div>
          <span class="prog-label">{{ mod.progress }}%</span>
        </div>

        <button class="mod-btn"
          [class.resume]="mod.progress > 0 && !mod.completed"
          [class.start]="mod.progress === 0"
          [class.done]="mod.completed">
          {{ mod.completed ? 'Revisar' : mod.progress > 0 ? 'Continuar' : 'Iniciar' }}
          @if (!mod.completed) {
            →
          }
        </button>
      </div>
    }
  </div>
</div>
  `,
  styles: [`
.page { max-width: 1200px; margin: 0 auto; animation: fadeIn 0.4s ease; }
.eyebrow { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; color: var(--accent); text-transform: uppercase; margin-bottom: 8px; }
h1 { font-size: 1.8rem; font-weight: 800; letter-spacing: -0.02em; }
.page-sub { font-size: 0.85rem; color: var(--text-muted); margin-top: 4px; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
.header-stats { display: flex; gap: 24px; }
.h-stat { text-align: center; }
.h-val { display: block; font-size: 1.6rem; font-weight: 800; color: var(--accent); line-height: 1.1; }
.h-lbl { font-size: 0.72rem; color: var(--text-muted); font-weight: 500; }

.modules-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

.module-card {
  padding: 22px; display: flex; flex-direction: column; gap: 10px;
  transition: border-color 0.2s, transform 0.2s;
  &:hover { border-color: var(--border); transform: translateY(-2px); }
  &.completed { border-color: rgba(16,185,129,0.2); }
}
.module-top { display: flex; align-items: center; justify-content: space-between; }
.module-icon {
  width: 36px; height: 36px; border-radius: 9px; display: flex; align-items: center; justify-content: center;
  background: rgba(0,196,255,0.1); color: var(--accent);
  &.done { background: rgba(16,185,129,0.12); color: var(--green); }
}
.badge-done {
  font-size: 0.68rem; font-weight: 700; padding: 3px 8px; border-radius: 4px;
  background: rgba(16,185,129,0.12); color: var(--green); border: 1px solid rgba(16,185,129,0.2);
}
.badge-progress {
  font-size: 0.68rem; font-weight: 700; padding: 3px 8px; border-radius: 4px;
  background: rgba(0,196,255,0.08); color: var(--accent); border: 1px solid var(--border);
}
.module-card h3 { font-size: 0.92rem; font-weight: 700; color: var(--text-primary); line-height: 1.3; }
.mod-subtitle { font-size: 0.78rem; color: var(--text-muted); line-height: 1.4; flex: 1; }
.mod-meta { display: flex; gap: 14px; }
.meta-item { display: flex; align-items: center; gap: 5px; font-size: 0.72rem; color: var(--text-muted); }
.mod-progress { display: flex; align-items: center; gap: 10px; }
.prog-label { font-size: 0.72rem; color: var(--text-muted); font-weight: 600; white-space: nowrap; min-width: 30px; }
.mod-btn {
  padding: 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; text-align: center;
  border: 1px solid var(--border); color: var(--text-secondary); background: rgba(255,255,255,0.03);
  cursor: pointer; transition: all 0.2s; margin-top: 4px;
  &:hover, &.resume { border-color: var(--accent); color: var(--accent); background: var(--accent-10); }
  &.done { border-color: rgba(16,185,129,0.3); color: var(--green); background: rgba(16,185,129,0.06); }
  &.start { border-color: var(--border-card); }
  &.start:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-10); }
}

@media (max-width: 1024px) { .modules-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px)  { .modules-grid { grid-template-columns: 1fr; } .page-header { flex-direction: column; gap: 16px; } }
  `]
})
export class ModulosComponent implements OnInit {
  modules: Module[] = [];
  completedCount = 0;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.modules = this.dataService.getModules();
    this.completedCount = this.modules.filter(m => m.completed).length;
  }
}
