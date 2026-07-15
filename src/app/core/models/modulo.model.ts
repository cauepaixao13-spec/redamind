export interface Aula {
  id: number;
  moduloId: number;
  ordem: number;
  titulo: string;
  duracaoEstimada: string;
  conteudo: string;
  concluida: boolean;
}

export interface Modulo {
  id: number;
  ordem: number;
  titulo: string;
  subtitulo: string;
  aulas: Aula[];
  progresso: number; // 0-100
  completo: boolean;
}
