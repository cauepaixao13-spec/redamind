import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ModulosService } from '../../../../../core/services/modulos.service';
import { MarkdownLitePipe } from '../../../../../shared/pipes/markdown-lite.pipe';
import { Modulo, Aula } from '../../../../../core/models/modulo.model';

@Component({
  selector: 'app-aula',
  standalone: true,
  imports: [CommonModule, RouterLink, MarkdownLitePipe],
  template: `
@if (modulo && aula) {
  <div class="page aula-page">
    <a class="voltar" [routerLink]="['/dashboard/modulos']">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
      </svg>
      Voltar pros módulos
    </a>

    <div class="aula-header">
      <p class="eyebrow">{{ modulo.titulo }} · Aula {{ posicao }} de {{ modulo.aulas.length }}</p>
      <h1>{{ aula.titulo }}</h1>
      <span class="duracao">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        {{ aula.duracaoEstimada }}
      </span>
    </div>

    <div class="progress-bar modulo-progress">
      <div class="progress-fill" [style.width.%]="modulo.progresso"></div>
    </div>

    <div class="card conteudo-aula" [innerHTML]="aula.conteudo | markdownLite"></div>

    <div class="aula-footer">
      @if (aula.concluida) {
        <div class="ja-concluida">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Aula já concluída
        </div>
      }
      <button class="btn-continuar" (click)="concluirEContinuar()" [disabled]="salvando">
        {{ salvando ? 'Salvando...' : (proxima ? 'Concluir e ir pra próxima →' : 'Concluir módulo ✓') }}
      </button>
    </div>
  </div>
} @else if (carregando) {
  <div class="page"><p class="eyebrow">Carregando aula...</p></div>
} @else {
  <div class="page">
    <p>Aula não encontrada.</p>
    <a [routerLink]="['/dashboard/modulos']">Voltar pros módulos</a>
  </div>
}
  `,
  styles: [`
.aula-page { max-width: 760px; }
.voltar {
  display: inline-flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 600;
  color: var(--text-secondary); text-decoration: none; margin-bottom: 20px;
  &:hover { color: var(--accent); }
}
.aula-header { margin-bottom: 16px; }
.aula-header h1 { font-size: 1.4rem; font-weight: 800; margin: 4px 0 8px; }
.duracao {
  display: inline-flex; align-items: center; gap: 6px; font-size: 0.78rem;
  color: var(--text-muted); font-weight: 600;
}
.modulo-progress { margin-bottom: 24px; height: 6px; }
.conteudo-aula {
  padding: 28px; line-height: 1.8; font-size: 0.94rem; color: var(--text-secondary);
  p { margin-bottom: 16px; }
  ul { margin: 0 0 16px 20px; }
  li { margin-bottom: 8px; }
  strong { color: var(--text-primary); }
}
.aula-footer {
  display: flex; align-items: center; justify-content: space-between; margin-top: 24px; gap: 16px;
  flex-wrap: wrap;
}
.ja-concluida {
  display: flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 600; color: var(--green);
}
.btn-continuar {
  margin-left: auto; padding: 12px 22px; border-radius: 8px; border: none; cursor: pointer;
  background: linear-gradient(90deg, #0080d0, var(--accent)); color: #fff; font-weight: 700;
  font-size: 0.88rem; transition: opacity var(--duration) var(--ease);
  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
}
  `],
})
export class AulaComponent implements OnInit {
  modulo: Modulo | null = null;
  aula: Aula | null = null;
  proxima: Aula | null = null;
  posicao = 0;
  carregando = true;
  salvando = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modulosService: ModulosService,
  ) {}

  async ngOnInit() {
    if (!this.modulosService.carregado()) {
      await this.modulosService.carregar();
    }
    this.carregarAula();

    this.route.params.subscribe(() => this.carregarAula());
  }

  private carregarAula() {
    const moduloId = Number(this.route.snapshot.paramMap.get('moduloId'));
    const aulaId = Number(this.route.snapshot.paramMap.get('aulaId'));
    const resultado = this.modulosService.getAula(moduloId, aulaId);

    this.carregando = false;
    if (!resultado) {
      this.modulo = null;
      this.aula = null;
      return;
    }

    this.modulo = resultado.modulo;
    this.aula = resultado.aula;
    this.proxima = resultado.proxima;
    this.posicao = this.modulo.aulas.findIndex(a => a.id === this.aula!.id) + 1;
  }

  async concluirEContinuar() {
    if (!this.aula || !this.modulo) return;
    this.salvando = true;

    if (!this.aula.concluida) {
      await this.modulosService.marcarConcluida(this.aula.id);
    }

    this.salvando = false;

    if (this.proxima) {
      this.router.navigate(['/dashboard/modulos', this.modulo.id, 'aula', this.proxima.id]);
    } else {
      this.router.navigate(['/dashboard/modulos']);
    }
  }
}
