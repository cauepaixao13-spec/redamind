import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="page">
  <div class="page-header">
    <div>
      <h1>Configurações</h1>
      <p class="page-sub">Preferências de conta, notificações e tema.</p>
    </div>
  </div>

  <div class="config-grid">
    <!-- Profile section -->
    <div class="config-section card">
      <h2 class="section-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
        Perfil
      </h2>
      <div class="config-row">
        <label>Nome de usuário</label>
        <div class="config-input-wrap">
          <input type="text" value="Caue" readonly class="config-input" />
        </div>
      </div>
      <div class="config-row">
        <label>Email</label>
        <div class="config-input-wrap">
          <input type="email" value="caue@redamind.com.br" readonly class="config-input" />
        </div>
      </div>
      <div class="config-row">
        <label>Plano</label>
        <div class="plan-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="color:var(--amber)">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          Pro
        </div>
      </div>
    </div>

    <!-- Notifications -->
    <div class="config-section card">
      <h2 class="section-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        Notificações
      </h2>
      @for (notif of notifications; track notif.id) {
        <div class="config-row toggle-row">
          <div class="toggle-info">
            <span class="toggle-label">{{ notif.label }}</span>
            <span class="toggle-desc">{{ notif.desc }}</span>
          </div>
          <button class="toggle-switch" [class.on]="notif.enabled" (click)="notif.enabled = !notif.enabled">
            <span class="toggle-thumb"></span>
          </button>
        </div>
      }
    </div>

    <!-- Theme -->
    <div class="config-section card">
      <h2 class="section-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
        </svg>
        Aparência
      </h2>
      <div class="theme-options">
        @for (theme of themes; track theme.id) {
          <div class="theme-option" [class.active]="activeTheme() === theme.id" (click)="activeTheme.set(theme.id)">
            <div class="theme-preview" [style.background]="theme.preview"></div>
            <span>{{ theme.label }}</span>
            @if (activeTheme() === theme.id) {
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            }
          </div>
        }
      </div>
    </div>

    <!-- Study -->
    <div class="config-section card">
      <h2 class="section-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
        Estudo
      </h2>
      <div class="config-row">
        <label>Meta diária de flashcards</label>
        <select class="config-select">
          <option>10 cards</option>
          <option selected>20 cards</option>
          <option>30 cards</option>
          <option>50 cards</option>
        </select>
      </div>
      <div class="config-row">
        <label>Tempo de sessão preferido</label>
        <select class="config-select">
          <option>15 minutos</option>
          <option selected>30 minutos</option>
          <option>45 minutos</option>
          <option>1 hora</option>
        </select>
      </div>
    </div>
  </div>

  <!-- Danger zone -->
  <div class="danger-zone">
    <h3>Zona de perigo</h3>
    <p>Estas ações são irreversíveis. Proceda com cautela.</p>
    <div class="danger-actions">
      <button class="danger-btn soft">Resetar progresso</button>
      <button class="danger-btn hard">Excluir conta</button>
    </div>
  </div>
</div>
  `,
  styles: [`
.page { max-width: 900px; margin: 0 auto; animation: fadeIn 0.4s ease; display: flex; flex-direction: column; gap: 24px; }
h1 { font-size: 1.8rem; font-weight: 800; letter-spacing: -0.02em; }
.page-sub { font-size: 0.85rem; color: var(--text-muted); margin-top: 4px; }

.config-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.config-section { padding: 28px; }
.section-title {
  display: flex; align-items: center; gap: 8px; font-size: 0.88rem; font-weight: 700;
  color: var(--text-secondary); margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.06em;
}
.config-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border-card); gap: 16px;
  &:last-child { border-bottom: none; } }
.config-row label { font-size: 0.85rem; color: var(--text-secondary); font-weight: 500; }
.config-input-wrap { flex-shrink: 0; }
.config-input {
  background: rgba(255,255,255,0.04); border: 1px solid var(--border-card); border-radius: 6px;
  padding: 7px 12px; font-size: 0.83rem; color: var(--text-primary); min-width: 180px;
}
.config-select {
  background: rgba(255,255,255,0.04); border: 1px solid var(--border-card); border-radius: 6px;
  padding: 7px 12px; font-size: 0.83rem; color: var(--text-primary); cursor: pointer;
}
.plan-badge {
  display: flex; align-items: center; gap: 5px; padding: 4px 12px; border-radius: 999px;
  background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.2); color: var(--amber);
  font-size: 0.78rem; font-weight: 700;
}
.toggle-row { align-items: center; }
.toggle-info { display: flex; flex-direction: column; gap: 2px; }
.toggle-label { font-size: 0.85rem; color: var(--text-secondary); font-weight: 500; }
.toggle-desc { font-size: 0.75rem; color: var(--text-muted); }
.toggle-switch {
  width: 40px; height: 22px; border-radius: 999px; position: relative; cursor: pointer; flex-shrink: 0;
  background: rgba(255,255,255,0.1); border: 1px solid var(--border-card); transition: all 0.25s;
  &.on { background: var(--accent); border-color: var(--accent); }
}
.toggle-thumb {
  position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%;
  background: white; transition: transform 0.25s; display: block;
  .toggle-switch.on & { transform: translateX(18px); }
}

.theme-options { display: flex; flex-direction: column; gap: 8px; }
.theme-option {
  display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: var(--radius-sm);
  cursor: pointer; border: 1px solid transparent; transition: all 0.2s;
  font-size: 0.85rem; color: var(--text-secondary);
  &:hover { background: rgba(255,255,255,0.04); border-color: var(--border-card); }
  &.active { border-color: var(--border); color: var(--text-primary); background: var(--accent-10); }
}
.theme-preview { width: 28px; height: 28px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); flex-shrink: 0; }

.danger-zone {
  padding: 24px 28px; background: rgba(239,68,68,0.04); border: 1px solid rgba(239,68,68,0.15);
  border-radius: var(--radius-lg);
}
.danger-zone h3 { font-size: 0.88rem; font-weight: 700; color: var(--red); margin-bottom: 6px; }
.danger-zone p { font-size: 0.82rem; color: var(--text-muted); margin-bottom: 16px; }
.danger-actions { display: flex; gap: 12px; }
.danger-btn {
  padding: 8px 18px; border-radius: var(--radius-sm); font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
  &.soft { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: var(--red); &:hover { background: rgba(239,68,68,0.15); } }
  &.hard { background: var(--red); border: 1px solid var(--red); color: white; &:hover { opacity: 0.85; } }
}

@media (max-width: 768px) { .config-grid { grid-template-columns: 1fr; } }
  `]
})
export class ConfiguracoesComponent {
  activeTheme = signal('dark');

  notifications = [
    { id: 1, label: 'Desafio semanal', desc: 'Lembre-me quando um novo desafio estiver disponível', enabled: true },
    { id: 2, label: 'Revisão de flashcards', desc: 'Notifique quando houver cards para revisar', enabled: true },
    { id: 3, label: 'Streak em risco', desc: 'Avise quando meu streak estiver prestes a quebrar', enabled: false },
    { id: 4, label: 'Ranking semanal', desc: 'Resumo do meu desempenho no ranking', enabled: false },
  ];

  themes = [
    { id: 'dark', label: 'Escuro (padrão)', preview: 'linear-gradient(135deg, #070c18, #0a0f1e)' },
    { id: 'midnight', label: 'Meia-noite', preview: 'linear-gradient(135deg, #050510, #0a0520)' },
    { id: 'navy', label: 'Naval', preview: 'linear-gradient(135deg, #0c1a2e, #0a2040)' },
  ];
}
