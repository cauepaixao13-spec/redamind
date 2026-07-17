import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoricoCorrecoesService } from '../../../../core/services/historico-correcoes.service';
import { NOMES_COMPETENCIAS } from '../../../../core/models/correcao.model';

@Component({
  selector: 'app-minhas-correcoes',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="page">
  <div class="page-header">
    <h1>Minhas correções</h1>
    <p class="page-subtitle">Histórico de todas as redações já corrigidas pela IA</p>
  </div>

  @if (historico.carregando()) {
    <p class="estado-vazio">Carregando histórico...</p>
  } @else if (historico.historico().length === 0) {
    <div class="card estado-vazio-card">
      <p>Você ainda não corrigiu nenhuma redação.</p>
      <p class="dica">Vá até o <strong>Desafio Semanal</strong> e envie sua primeira redação pra IA.</p>
    </div>
  } @else {
    <div class="lista-correcoes">
      @for (item of historico.historico(); track item.redacaoId) {
        <div class="card correcao-item" [class.expandido]="expandidoId() === item.redacaoId">
          <button class="correcao-header" (click)="toggleExpandir(item.redacaoId)">
            <div class="correcao-info">
              <p class="correcao-tema">{{ item.tema }}</p>
              <p class="correcao-data">{{ item.criadoEm | date:'dd/MM/yyyy, HH:mm' }}</p>
            </div>
            <div class="correcao-nota" [class]="corDaNota(item.notaTotal)">
              {{ item.notaTotal }}<span>/1000</span>
            </div>
            <svg class="chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          @if (expandidoId() === item.redacaoId) {
            <div class="correcao-detalhe">
              <div class="competencias-grid">
                @for (c of item.competencias; track c.numero) {
                  <div class="competencia-item">
                    <div class="competencia-top">
                      <span class="competencia-label">C{{ c.numero }} · {{ nomesCompetencias[c.numero] }}</span>
                      <span class="competencia-nota">{{ c.nota }}/200</span>
                    </div>
                    <div class="progress-bar">
                      <div class="progress-fill" [style.width.%]="(c.nota / 200) * 100"></div>
                    </div>
                    <p class="competencia-justificativa">{{ c.justificativa }}</p>
                  </div>
                }
              </div>
              <div class="feedback-cols">
                <div>
                  <h4>Pontos fortes</h4>
                  <p>{{ item.pontosFortes }}</p>
                </div>
                <div>
                  <h4>Pontos a melhorar</h4>
                  <p>{{ item.pontosAMelhorar }}</p>
                </div>
              </div>
              <details class="ver-texto">
                <summary>Ver texto da redação</summary>
                <p>{{ item.texto }}</p>
              </details>
            </div>
          }
        </div>
      }
    </div>
  }
</div>
  `,
  styles: [`
.page-header { margin-bottom: 24px; }
.page-header h1 { font-size: 1.4rem; font-weight: 800; }
.page-subtitle { font-size: 0.85rem; color: var(--text-muted); margin-top: 4px; }

.estado-vazio { color: var(--text-muted); font-size: 0.9rem; }
.estado-vazio-card { padding: 32px; text-align: center; }
.estado-vazio-card .dica { color: var(--text-muted); font-size: 0.85rem; margin-top: 8px; }

.lista-correcoes { display: flex; flex-direction: column; gap: 14px; }
.correcao-item { padding: 0; overflow: hidden; }
.correcao-header {
  width: 100%; display: flex; align-items: center; gap: 16px; padding: 18px 22px;
  background: none; border: none; cursor: pointer; text-align: left;
  color: var(--text-primary);
}
.correcao-info { flex: 1; min-width: 0; }
.correcao-tema {
  font-size: 0.9rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.correcao-data { font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; }
.correcao-nota {
  font-size: 1.2rem; font-weight: 800; flex-shrink: 0;
  span { font-size: 0.7rem; font-weight: 500; color: var(--text-muted); }
  &.nota-alta { color: var(--green); }
  &.nota-media { color: #f5a623; }
  &.nota-baixa { color: var(--red); }
}
.chevron { flex-shrink: 0; color: var(--text-muted); transition: transform var(--duration) var(--ease); }
.expandido .chevron { transform: rotate(180deg); }

.correcao-detalhe { padding: 0 22px 22px; border-top: 1px solid var(--border-card); margin-top: 4px; padding-top: 20px; }
.competencias-grid { display: flex; flex-direction: column; gap: 16px; margin-bottom: 20px; }
.competencia-item { padding-bottom: 14px; border-bottom: 1px solid var(--border-card); &:last-child { border-bottom: none; padding-bottom: 0; } }
.competencia-top { display: flex; justify-content: space-between; margin-bottom: 6px; }
.competencia-label { font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); }
.competencia-nota { font-size: 0.8rem; font-weight: 700; color: var(--accent); }
.competencia-justificativa { font-size: 0.78rem; color: var(--text-muted); margin-top: 8px; line-height: 1.6; }

.feedback-cols {
  display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding-top: 16px; border-top: 1px solid var(--border-card);
  h4 { font-size: 0.74rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-secondary); margin-bottom: 6px; }
  p { font-size: 0.8rem; color: var(--text-muted); line-height: 1.6; }
}
@media (max-width: 700px) { .feedback-cols { grid-template-columns: 1fr; } }

.ver-texto {
  margin-top: 16px; font-size: 0.78rem; color: var(--text-muted);
  summary { cursor: pointer; font-weight: 600; }
  p { margin-top: 10px; line-height: 1.7; white-space: pre-wrap; }
}
  `],
})
export class MinhasCorrecoesComponent implements OnInit {
  expandidoId = signal<string | null>(null);
  nomesCompetencias = NOMES_COMPETENCIAS;

  constructor(public historico: HistoricoCorrecoesService) {}

  async ngOnInit() {
    if (!this.historico.carregado()) {
      await this.historico.carregar();
    }
  }

  toggleExpandir(id: string) {
    this.expandidoId.set(this.expandidoId() === id ? null : id);
  }

  corDaNota(nota: number): string {
    if (nota >= 800) return 'nota-alta';
    if (nota >= 500) return 'nota-media';
    return 'nota-baixa';
  }
}
