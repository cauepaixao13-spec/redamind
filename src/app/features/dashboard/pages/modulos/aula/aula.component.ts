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

    @if (aula.quiz) {
      <div class="card quiz-card">
        <p class="quiz-eyebrow">✏️ Teste rápido</p>
        <p class="quiz-pergunta">{{ aula.quiz.pergunta }}</p>
        <div class="quiz-alternativas">
          @for (alt of aula.quiz.alternativas; track $index) {
            <button
              class="quiz-alt"
              [class.selecionada]="respostaSelecionada === $index"
              [class.correta]="respostaSelecionada !== null && $index === aula.quiz.correta"
              [class.errada]="respostaSelecionada === $index && $index !== aula.quiz.correta"
              [disabled]="respostaSelecionada !== null"
              (click)="responderQuiz($index)">
              {{ alt }}
            </button>
          }
        </div>
        @if (respostaSelecionada !== null) {
          <p class="quiz-explicacao">
            {{ respostaSelecionada === aula.quiz.correta ? '✅ Isso mesmo!' : '❌ Quase.' }}
            {{ aula.quiz.explicacao }}
          </p>
        }
      </div>
    }

    <div class="aula-footer">
      @if (aula.concluida) {
        <div class="ja-concluida">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Aula já concluída
          <button class="link-reiniciar" (click)="reiniciarAula()" [disabled]="salvando">reiniciar essa aula</button>
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
  .callout {
    background: rgba(0, 196, 255, 0.06); border-left: 3px solid var(--accent);
    border-radius: 6px; padding: 14px 16px; margin-bottom: 16px;
    font-size: 0.88rem; color: var(--text-secondary);
  }
}
.quiz-card {
  margin-top: 20px; padding: 24px;
}
.quiz-eyebrow {
  font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
  color: var(--accent); margin-bottom: 10px;
}
.quiz-pergunta { font-size: 0.95rem; font-weight: 700; margin-bottom: 16px; }
.quiz-alternativas { display: flex; flex-direction: column; gap: 10px; }
.quiz-alt {
  text-align: left; padding: 12px 16px; border-radius: 8px; cursor: pointer;
  background: rgba(255,255,255,0.03); border: 1px solid var(--border-card);
  color: var(--text-secondary); font-size: 0.86rem; transition: all var(--duration) var(--ease);
  &:hover:not(:disabled) { border-color: var(--accent); background: rgba(0,196,255,0.05); }
  &:disabled { cursor: default; }
  &.correta { border-color: var(--green); background: rgba(16,185,129,0.08); color: var(--text-primary); }
  &.errada { border-color: var(--red); background: rgba(239,68,68,0.08); color: var(--text-primary); }
}
.quiz-explicacao {
  margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-card);
  font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6;
}
.aula-footer {
  display: flex; align-items: center; justify-content: space-between; margin-top: 24px; gap: 16px;
  flex-wrap: wrap;
}
.ja-concluida {
  display: flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 600; color: var(--green);
}
.link-reiniciar {
  background: none; border: none; padding: 0; margin-left: 6px; cursor: pointer;
  color: var(--text-muted); font-size: 0.75rem; font-weight: 600; text-decoration: underline;
  &:hover { color: var(--text-secondary); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
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
  respostaSelecionada: number | null = null;

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
    this.respostaSelecionada = null;
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

  responderQuiz(indice: number) {
    if (this.respostaSelecionada !== null) return;
    this.respostaSelecionada = indice;
  }

  async reiniciarAula() {
    if (!this.aula) return;
    this.salvando = true;
    await this.modulosService.reiniciarAula(this.aula.id);
    this.carregarAula();
    this.salvando = false;
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
