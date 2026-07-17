import { CompetenciaResult } from './correcao.model';

export interface CorrecaoHistorico {
  redacaoId: string;
  tema: string;
  texto: string;
  criadoEm: string;
  notaTotal: number;
  competencias: CompetenciaResult[];
  pontosFortes: string;
  pontosAMelhorar: string;
  modeloIa: string;
}
