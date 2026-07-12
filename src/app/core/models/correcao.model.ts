export interface CompetenciaResult {
  numero: number;
  nota: number; // 0, 40, 80, 120, 160 ou 200
  justificativa: string;
}

export interface CorrecaoResult {
  redacaoId: string;
  nota_total: number;
  competencias: CompetenciaResult[];
  pontos_fortes: string;
  pontos_a_melhorar: string;
}

export interface CorrecaoErro {
  error: string;
}

export const NOMES_COMPETENCIAS: Record<number, string> = {
  1: 'Norma culta',
  2: 'Compreensão do tema',
  3: 'Argumentação',
  4: 'Coesão textual',
  5: 'Proposta de intervenção',
};
