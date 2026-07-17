import { Injectable, signal } from '@angular/core';
import { supabase } from '../config/supabase.client';
import { CorrecaoHistorico } from '../models/correcao-historico.model';

@Injectable({ providedIn: 'root' })
export class HistoricoCorrecoesService {
  historico = signal<CorrecaoHistorico[]>([]);
  carregado = signal(false);
  carregando = signal(false);

  async carregar(): Promise<void> {
    this.carregando.set(true);

    // RLS já garante que só vêm as redações do próprio usuário logado.
    const { data, error } = await supabase
      .from('redacoes')
      .select('id, tema, texto, criado_em, correcoes(nota_total, competencias, pontos_fortes, pontos_a_melhorar, modelo_ia)')
      .order('criado_em', { ascending: false });

    if (!error && data) {
      this.historico.set(
        data
          .filter((r: any) => r.correcoes)
          .map((r: any) => {
            const c = Array.isArray(r.correcoes) ? r.correcoes[0] : r.correcoes;
            return {
              redacaoId: r.id,
              tema: r.tema,
              texto: r.texto,
              criadoEm: r.criado_em,
              notaTotal: c.nota_total,
              competencias: c.competencias,
              pontosFortes: c.pontos_fortes,
              pontosAMelhorar: c.pontos_a_melhorar,
              modeloIa: c.modelo_ia,
            };
          }),
      );
    }

    this.carregando.set(false);
    this.carregado.set(true);
  }
}
