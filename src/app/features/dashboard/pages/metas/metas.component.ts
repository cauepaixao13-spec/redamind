import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Goal } from '../../../../core/services/data.service';

@Component({
  selector: 'app-metas',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="page">
  <div class="page-header">
    <div>
      <p class="eyebrow">METAS</p>
      <h1>Seus <span class="highlight">objetivos</span></h1>
    </div>
  <button class="btn-add" (click)="showAddModal.set(!showAddModal.value)">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      Nova meta
    </button>
  </div>

  <!-- Goals grid -->
  <div class="goals-grid">
    @for (goal of goals; track goal.id) {
      <div class="goal-card card" [class.completed]="goal.completed">
        <div class="goal-top">
          <div class="goal-icon" [class.done]="goal.completed">
            @if (goal.completed) {
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            } @else {
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
              </svg>
            }
          </div>
          <div class="goal-pct" [style.color]="getColor(goal)">{{ goal.progress }}%</div>
        </div>

        <h3>{{ goal.title }}</h3>
        <p class="goal-sub">{{ goal.subtitle }}</p>

        <div class="goal-progress-wrap">
          <div class="progress-bar">
            <div class="progress-fill"
                 [style.width.%]="goal.progress"
                 [style.background]="goal.completed ? 'var(--green)' : goal.progress >= 75 ? 'linear-gradient(90deg,var(--green),#34d399)' : 'linear-gradient(90deg,#0080d0,var(--accent))'">
            </div>
          </div>
          <span class="progress-text">{{ goal.progress }}% concluído</span>
        </div>

        @if (goal.completed) {
          <div class="goal-badge done">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Concluído
          </div>
        } @else {
          <div class="goal-badge ongoing">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            Em andamento
          </div>
        }
      </div>
    }

    <!-- Empty add card -->
    <div class="goal-card add-card" (click)="showAddModal.set(true)">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      <span>Adicionar meta</span>
    </div>
  </div>

  <!-- Summary -->
  <div class="goals-summary">
    <div class="summary-item">
      <div class="sum-circle done">{{ completedGoals }}</div>
      <span>Concluídas</span>
    </div>
    <div class="sum-divider"></div>
    <div class="summary-item">
      <div class="sum-circle active">{{ activeGoals }}</div>
      <span>Em andamento</span>
    </div>
    <div class="sum-divider"></div>
    <div class="summary-item">
      <div class="sum-circle total">{{ goals.length }}</div>
      <span>Total</span>
    </div>
  </div>
</div>
  `,
  styles: [`
.page { max-width: 1200px; margin: 0 auto; animation: fadeIn 0.4s ease; display: flex; flex-direction: column; gap: 28px; }
.eyebrow { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; color: var(--accent); text-transform: uppercase; margin-bottom: 8px; }
h1 { font-size: 1.8rem; font-weight: 800; letter-spacing: -0.02em; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; }
.btn-add {
  display: flex; align-items: center; gap: 7px; padding: 9px 18px;
  background: var(--accent-10); border: 1px solid var(--border); border-radius: var(--radius-sm);
  color: var(--accent); font-size: 0.83rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
  &:hover { background: rgba(0,196,255,0.15); box-shadow: 0 0 12px var(--accent-glow); }
}

.goals-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }

.goal-card {
  padding: 28px; display: flex; flex-direction: column; gap: 12px;
  transition: border-color 0.2s, transform 0.2s;
  &:hover { border-color: var(--border); transform: translateY(-2px); }
  &.completed { border-color: rgba(16,185,129,0.25); background: rgba(16,185,129,0.02); }
}
.goal-top { display: flex; justify-content: space-between; align-items: center; }
.goal-icon {
  width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
  background: rgba(0,196,255,0.1); color: var(--accent);
  &.done { background: rgba(16,185,129,0.12); color: var(--green); }
}
.goal-pct { font-size: 1.6rem; font-weight: 900; letter-spacing: -0.03em; }
.goal-card h3 { font-size: 1rem; font-weight: 700; color: var(--text-primary); }
.goal-sub { font-size: 0.8rem; color: var(--text-muted); }
.goal-progress-wrap { display: flex; flex-direction: column; gap: 6px; }
.progress-text { font-size: 0.72rem; color: var(--text-muted); }
.goal-badge {
  display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px;
  border-radius: 999px; font-size: 0.72rem; font-weight: 600; align-self: flex-start;
  &.done { background: rgba(16,185,129,0.1); color: var(--green); border: 1px solid rgba(16,185,129,0.2); }
  &.ongoing { background: rgba(0,196,255,0.08); color: var(--accent); border: 1px solid var(--border); }
}

.add-card {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;
  min-height: 160px; background: rgba(255,255,255,0.02); border: 2px dashed rgba(255,255,255,0.08);
  cursor: pointer; color: var(--text-muted); font-size: 0.88rem; transition: all 0.2s;
  &:hover { border-color: var(--border); color: var(--accent); background: var(--accent-10); transform: translateY(-2px); }
}

.goals-summary {
  display: flex; align-items: center; gap: 0; padding: 24px 32px;
  background: var(--bg-card); border: 1px solid var(--border-card); border-radius: var(--radius-lg);
  justify-content: center;
}
.summary-item { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 0 40px; }
.summary-item span { font-size: 0.78rem; color: var(--text-muted); font-weight: 500; }
.sum-circle {
  width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem; font-weight: 900;
  &.done { background: rgba(16,185,129,0.12); color: var(--green); border: 2px solid rgba(16,185,129,0.25); }
  &.active { background: rgba(0,196,255,0.1); color: var(--accent); border: 2px solid var(--border); }
  &.total { background: rgba(124,58,237,0.1); color: var(--violet); border: 2px solid rgba(124,58,237,0.2); }
}
.sum-divider { width: 1px; height: 48px; background: var(--border-card); }

@media (max-width: 768px) { .goals-grid { grid-template-columns: 1fr; } }
  `]
})
export class MetasComponent implements OnInit {
  goals: Goal[] = [];
 showAddModal = {
  value: false,
  set(v: boolean) {
    this.value = v;
  }
};
  completedGoals = 0;
  activeGoals = 0;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.goals = this.dataService.getGoals();
    this.completedGoals = this.goals.filter(g => g.completed).length;
    this.activeGoals = this.goals.filter(g => !g.completed).length;
  }

  getColor(goal: Goal): string {
    if (goal.completed) return 'var(--green)';
    if (goal.progress >= 75) return 'var(--green)';
    if (goal.progress >= 40) return 'var(--accent)';
    return 'var(--amber)';
  }
}
