import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-desafio-semanal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="page">
  <div class="page-header">
    <div>
      <p class="eyebrow">DESAFIO SEMANAL ENEM</p>
      <h1>Os desafios da inteligência artificial no mundo do trabalho contemporâneo</h1>
      <p class="page-sub">Escreva uma dissertação argumentativa entre 250 e 350 palavras. A RedalMind IA avalia automaticamente.</p>
    </div>
  </div>

  <div class="challenge-layout">
    <!-- Editor column -->
    <div class="editor-col">
      <div class="editor-toolbar">
        <div class="toolbar-left">
          <span class="word-count-badge" [class.warn]="wordCount() > 350" [class.ok]="wordCount() >= 250 && wordCount() <= 350">
            {{ wordCount() }} palavras
          </span>
          <span class="sep">·</span>
          <span class="sent-count">{{ sentenceCount() }} frases</span>
          <span class="sep">·</span>
          <button class="toolbar-btn" (click)="focusMode.set(!focusMode())" [class.active]="focusMode()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
            Modo foco
          </button>
        </div>
        <button class="btn-submit-essay" (click)="submitEssay()" [disabled]="wordCount() < 50">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
          Enviar para IA
        </button>
      </div>

      <div class="editor-area" [class.focus-mode]="focusMode()">
        <textarea
          class="essay-textarea"
          [(ngModel)]="essayText"
          placeholder="Comece sua redação aqui..."
          spellcheck="true"
          (keydown.escape)="focusMode.set(false)"
        ></textarea>
      </div>

      <div class="editor-footer">
        <div class="progress-mini">
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="progressPct()"></div>
          </div>
          <span class="progress-label">{{ progressPct() | number:'1.0-0' }}% da meta (250 palavras)</span>
        </div>
        @if (submitted()) {
          <div class="success-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Redação enviada! A IA está analisando...
          </div>
        }
      </div>
    </div>

    <!-- Sidebar column -->
    <div class="sidebar-col">
      <!-- ENEM Checklist -->
      <div class="checklist-card card">
        <h3>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          Checklist ENEM
        </h3>
        @for (item of checklist; track item.label) {
          <div class="check-item" [class.done]="item.done" (click)="item.done = !item.done">
            <div class="check-box" [class.checked]="item.done">
              @if (item.done) {
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              }
            </div>
            <span>{{ item.label }}</span>
          </div>
        }
      </div>

      <!-- Structural Tips -->
      <div class="tips-card card">
        <h3>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Dicas estruturais
        </h3>
        <ul class="tips-list">
          <li>Apresente a tese na introdução</li>
          <li>Use repertório sociocultural validado</li>
          <li>Cada parágrafo de desenvolvimento tem 1 argumento</li>
          <li>Conclua com proposta de intervenção completa</li>
          <li>Entre 250–350 palavras (0)</li>
        </ul>
      </div>

      <!-- Word target -->
      <div class="target-card card">
        <div class="target-header">
          <span class="target-label">Progresso da redação</span>
          <span class="target-val" [class.ok]="wordCount() >= 250">{{ wordCount() }}/350</span>
        </div>
        <div class="progress-bar thick">
          <div class="progress-fill" [style.width.%]="Math.min(progressPct(), 100)"
            [style.background]="wordCount() > 350 ? 'var(--red)' : wordCount() >= 250 ? 'var(--green)' : 'linear-gradient(90deg,#0080d0,var(--accent))'">
          </div>
        </div>
        <div class="zones">
          <span>0</span><span class="zone-min">250</span><span class="zone-max">350</span>
        </div>
      </div>
    </div>
  </div>
</div>
  `,
  styles: [`
.page { max-width: 1200px; margin: 0 auto; animation: fadeIn 0.4s ease; }

.eyebrow { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; color: var(--accent); text-transform: uppercase; margin-bottom: 8px; }
h1 { font-size: 1.4rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 8px; line-height: 1.3; }
.page-sub { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 28px; }
.page-header { margin-bottom: 8px; }

.challenge-layout { display: grid; grid-template-columns: 1fr 300px; gap: 20px; }

/* Editor */
.editor-col { display: flex; flex-direction: column; gap: 0; }
.editor-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  background: var(--bg-card); border: 1px solid var(--border-card);
  border-bottom: none; border-radius: var(--radius-md) var(--radius-md) 0 0;
  padding: 10px 16px;
}
.toolbar-left { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: var(--text-muted); }
.sep { color: var(--border-card); }
.word-count-badge {
  padding: 3px 8px; border-radius: 4px;
  background: rgba(255,255,255,0.05); font-size: 0.78rem; font-weight: 600; color: var(--text-secondary);
  &.warn { background: rgba(239,68,68,0.1); color: var(--red); }
  &.ok   { background: rgba(16,185,129,0.1); color: var(--green); }
}
.sent-count { font-size: 0.78rem; color: var(--text-muted); }
.toolbar-btn {
  display: flex; align-items: center; gap: 5px; padding: 4px 10px;
  border-radius: 4px; background: rgba(255,255,255,0.04); border: 1px solid var(--border-card);
  font-size: 0.75rem; color: var(--text-muted); transition: all 0.2s;
  &:hover, &.active { border-color: var(--border); color: var(--accent); background: var(--accent-10); }
}
.btn-submit-essay {
  display: flex; align-items: center; gap: 6px; padding: 7px 16px;
  background: linear-gradient(135deg, #0080d0, var(--accent)); color: white;
  border: none; border-radius: 6px; font-size: 0.8rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
  &:hover { box-shadow: 0 0 16px var(--accent-glow); }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
}
.editor-area {
  flex: 1; background: var(--bg-card); border: 1px solid var(--border-card);
  border-bottom: none; min-height: 400px;
  &.focus-mode { position: fixed; inset: 0; z-index: 200; min-height: 100vh; border: none; border-radius: 0; }
}
.essay-textarea {
  width: 100%; min-height: 400px; height: 100%; background: none; border: none;
  padding: 24px; font-size: 0.95rem; color: var(--text-primary); line-height: 1.8; resize: none;
  .focus-mode & { min-height: 100vh; }
  &::placeholder { color: var(--text-muted); }
}
.editor-footer {
  background: var(--bg-card); border: 1px solid var(--border-card);
  border-radius: 0 0 var(--radius-md) var(--radius-md); padding: 12px 16px;
  display: flex; align-items: center; gap: 16px;
}
.progress-mini { flex: 1; display: flex; align-items: center; gap: 12px; }
.progress-label { font-size: 0.72rem; color: var(--text-muted); white-space: nowrap; }
.success-banner {
  display: flex; align-items: center; gap: 8px; padding: 6px 14px;
  background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2);
  border-radius: 6px; color: var(--green); font-size: 0.78rem; font-weight: 600;
}

/* Sidebar cards */
.sidebar-col { display: flex; flex-direction: column; gap: 16px; }
.checklist-card, .tips-card, .target-card { padding: 20px; }
.checklist-card h3, .tips-card h3 {
  display: flex; align-items: center; gap: 7px; font-size: 0.82rem; font-weight: 700;
  color: var(--text-secondary); margin-bottom: 14px; text-transform: uppercase; letter-spacing: 0.06em;
}
.check-item {
  display: flex; align-items: flex-start; gap: 10px; padding: 8px 0;
  border-bottom: 1px solid var(--border-card); cursor: pointer; transition: opacity 0.2s;
  font-size: 0.82rem; color: var(--text-secondary);
  &:last-child { border-bottom: none; }
  &.done { opacity: 0.5; text-decoration: line-through; }
  &:hover { color: var(--text-primary); }
}
.check-box {
  width: 16px; height: 16px; border-radius: 4px; border: 1.5px solid var(--border);
  flex-shrink: 0; display: flex; align-items: center; justify-content: center; margin-top: 1px;
  &.checked { background: var(--accent); border-color: var(--accent); }
}
.tips-list { display: flex; flex-direction: column; gap: 8px; }
.tips-list li {
  font-size: 0.8rem; color: var(--text-muted); padding-left: 14px; position: relative; line-height: 1.5;
  &::before { content: '·'; position: absolute; left: 0; color: var(--accent); font-weight: 700; }
}
.target-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.target-label { font-size: 0.78rem; color: var(--text-muted); font-weight: 600; }
.target-val { font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); &.ok { color: var(--green); } }
.progress-bar.thick { height: 8px; border-radius: 4px; }
.zones { display: flex; justify-content: space-between; margin-top: 6px; font-size: 0.7rem; color: var(--text-muted); position: relative; }
.zone-min { position: absolute; left: 71%; transform: translateX(-50%); color: var(--green); font-weight: 600; }
.zone-max { color: var(--text-muted); }

@media (max-width: 900px) {
  .challenge-layout { grid-template-columns: 1fr; }
}
  `]
})
export class DesafioSemanalComponent {
  essayText = signal('');
  focusMode = signal(false);
  submitted = signal(false);
  Math = Math;

  checklist = [
    { label: 'Introdução com tese', done: false },
    { label: 'Dois parágrafos de desenvolvimento', done: false },
    { label: 'Proposta de intervenção', done: false },
    { label: 'Uso variado de conectivos', done: false },
    { label: 'Entre 250–350 palavras', done: false },
  ];

  wordCount = computed(() => {
    const t = this.essayText().trim();
    return t === '' ? 0 : t.split(/\s+/).length;
  });

  sentenceCount = computed(() =>
    (this.essayText().match(/[.!?]+/g) || []).length
  );

  progressPct = computed(() => Math.min((this.wordCount() / 250) * 100, 100));

  submitEssay() {
    if (this.wordCount() < 50) return;
    this.submitted.set(true);
    setTimeout(() => this.submitted.set(false), 4000);
  }
}
