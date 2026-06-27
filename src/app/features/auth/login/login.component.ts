import { Component, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
<div class="login-page">
  <!-- Background orbs -->
  <div class="orb orb-1"></div>
  <div class="orb orb-2"></div>
  <div class="grid-bg"></div>

  <!-- Back link -->
  <a routerLink="/" class="back-link">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
    Voltar
  </a>

  <div class="login-card">
    <!-- Logo -->
    <div class="login-logo">
      <div class="logo-mark">R</div>
      <span>RedalMind</span>
    </div>

    <h1>Bem-vindo de volta</h1>
    <p class="login-sub">Entre para continuar sua jornada rumo ao 1000.</p>

    <form class="login-form" (ngSubmit)="onSubmit()">
      <div class="field-group">
        <label for="username">Usuário</label>
        <div class="input-wrap" [class.focused]="usernameFocused()">
          <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
          </svg>
          <input
            id="username" type="text" placeholder="Seu usuário"
            [(ngModel)]="username" name="username"
            (focus)="usernameFocused.set(true)"
            (blur)="usernameFocused.set(false)"
            autocomplete="username"
          />
        </div>
      </div>

      <div class="field-group">
        <label for="password">Senha</label>
        <div class="input-wrap" [class.focused]="passwordFocused()">
          <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <input
            id="password" [type]="showPass() ? 'text' : 'password'" placeholder="Sua senha"
            [(ngModel)]="password" name="password"
            (focus)="passwordFocused.set(true)"
            (blur)="passwordFocused.set(false)"
            autocomplete="current-password"
          />
          <button type="button" class="toggle-pass" (click)="showPass.set(!showPass())">
            @if (showPass()) {
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/>
              </svg>
            } @else {
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
            }
          </button>
        </div>
      </div>

      @if (errorMsg()) {
        <div class="error-msg">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13" stroke="white" stroke-width="2"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="white" stroke-width="2"/>
          </svg>
          {{ errorMsg() }}
        </div>
      }

      <button type="submit" class="btn-submit" [class.loading]="loading()">
        @if (loading()) {
          <span class="spinner"></span>
          Entrando...
        } @else {
          Entrar na plataforma →
        }
      </button>
    </form>

    <div class="login-hint">
      <span>Credenciais de demonstração:</span>
      <div class="hint-creds">
        <code>Caue</code> / <code>Admin</code>
      </div>
    </div>
  </div>
</div>
  `,
  styles: [`
:host { display: block; }

.login-page {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  padding: 24px; position: relative; overflow: hidden;
  background: radial-gradient(ellipse 60% 80% at 30% 40%, rgba(0, 60, 150, 0.4) 0%, transparent 60%),
              radial-gradient(ellipse 50% 70% at 80% 70%, rgba(0, 30, 100, 0.3) 0%, transparent 60%),
              var(--bg-deepest);
}
.orb { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(80px); animation: floatOrb 10s ease-in-out infinite; }
.orb-1 { width: 400px; height: 400px; top: -100px; right: 10%; background: radial-gradient(circle, rgba(0,196,255,0.2) 0%, transparent 70%); animation-delay: 0s; }
.orb-2 { width: 300px; height: 300px; bottom: -50px; left: 10%; background: radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%); animation-delay: -5s; }
.grid-bg {
  position: absolute; inset: 0; pointer-events: none;
  background-image: linear-gradient(rgba(0,196,255,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,196,255,0.03) 1px, transparent 1px);
  background-size: 48px 48px;
}
.back-link {
  position: fixed; top: 24px; left: 24px; z-index: 10;
  display: flex; align-items: center; gap: 6px;
  font-size: 0.85rem; color: var(--text-muted);
  transition: color 0.2s;
  &:hover { color: var(--accent); }
}

.login-card {
  position: relative; z-index: 2; width: 100%; max-width: 420px;
  background: rgba(13, 21, 38, 0.85); backdrop-filter: blur(20px);
  border: 1px solid var(--border-card); border-radius: var(--radius-xl);
  padding: 44px 40px; animation: fadeInUp 0.5s ease both;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5);
}

.login-logo {
  display: flex; align-items: center; gap: 10px;
  font-weight: 700; font-size: 1.1rem; margin-bottom: 32px; justify-content: center;
}
.logo-mark {
  width: 32px; height: 32px; border-radius: 8px;
  background: linear-gradient(135deg, #0080d0, var(--accent));
  display: flex; align-items: center; justify-content: center;
  font-weight: 900; font-size: 1rem; color: white;
}

h1 { font-size: 1.5rem; font-weight: 800; text-align: center; margin-bottom: 8px; }
.login-sub { color: var(--text-muted); text-align: center; font-size: 0.9rem; margin-bottom: 36px; }

.login-form { display: flex; flex-direction: column; gap: 20px; }
.field-group { display: flex; flex-direction: column; gap: 8px; }
.field-group label { font-size: 0.82rem; font-weight: 600; color: var(--text-secondary); letter-spacing: 0.02em; }
.input-wrap {
  display: flex; align-items: center; gap: 10px;
  background: rgba(255,255,255,0.04); border: 1px solid var(--border-card);
  border-radius: var(--radius-sm); padding: 12px 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
  &.focused { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-10); }
}
.input-icon { color: var(--text-muted); flex-shrink: 0; }
.input-wrap input {
  flex: 1; background: none; border: none; font-size: 0.9rem;
  color: var(--text-primary); min-width: 0;
  &::placeholder { color: var(--text-muted); }
}
.toggle-pass { background: none; color: var(--text-muted); padding: 0; line-height: 0; &:hover { color: var(--accent); } }

.error-msg {
  display: flex; align-items: center; gap: 8px; padding: 10px 14px;
  background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: var(--radius-sm); color: var(--red); font-size: 0.83rem;
}

.btn-submit {
  margin-top: 4px; padding: 14px; border-radius: var(--radius-sm); font-size: 0.95rem;
  font-weight: 700; background: linear-gradient(135deg, #0080d0, var(--accent));
  color: white; border: none; cursor: pointer; display: flex; align-items: center;
  justify-content: center; gap: 8px;
  transition: box-shadow 0.2s, transform 0.2s;
  &:hover { box-shadow: 0 0 24px var(--accent-glow); transform: translateY(-1px); }
  &.loading { opacity: 0.8; pointer-events: none; }
}
.spinner {
  width: 16px; height: 16px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
  animation: spin 0.8s linear infinite;
}

.login-hint {
  margin-top: 28px; padding: 16px; border-radius: var(--radius-md);
  background: rgba(255,255,255,0.03); border: 1px solid var(--border-card);
  text-align: center;
  span { display: block; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 8px; }
}
.hint-creds { display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 0.85rem; color: var(--text-secondary); }
code {
  padding: 3px 8px; background: rgba(0,196,255,0.1); border: 1px solid var(--border);
  border-radius: 4px; color: var(--accent); font-family: 'Courier New', monospace; font-size: 0.85rem;
}

@media (max-width: 480px) {
  .login-card { padding: 32px 24px; }
}
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  errorMsg = signal('');
  loading = signal(false);
  showPass = signal(false);
  usernameFocused = signal(false);
  passwordFocused = signal(false);

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    if (!this.username.trim() || !this.password) {
      this.errorMsg.set('Preencha usuário e senha.');
      return;
    }
    this.loading.set(true);
    this.errorMsg.set('');

    setTimeout(() => {
      const ok = this.authService.login(this.username, this.password);
      this.loading.set(false);
      if (ok) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMsg.set('Usuário ou senha incorretos.');
      }
    }, 800);
  }
}
