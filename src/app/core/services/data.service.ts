import { Injectable } from '@angular/core';

export interface Module {
  id: number;
  title: string;
  subtitle: string;
  lessons: number;
  duration: string;
  progress: number;
  completed: boolean;
}

export interface Flashcard {
  id: number;
  question: string;
  answer: string;
}

export interface RankingUser {
  position: number;
  name: string;
  level: number;
  xp: number;
  isCurrentUser: boolean;
}

export interface Goal {
  id: number;
  title: string;
  subtitle: string;
  progress: number;
  completed: boolean;
}

@Injectable({ providedIn: 'root' })
export class DataService {
  getModules(): Module[] {
    return [
      { id: 1, title: 'Introdução à redação', subtitle: 'Fundamentos da dissertação argumentativa', lessons: 8, duration: '45min', progress: 100, completed: true },
      { id: 2, title: 'Estrutura ENEM', subtitle: 'Os 4 parágrafos canônicos e suas funções', lessons: 8, duration: '1h 10min', progress: 100, completed: true },
      { id: 3, title: 'Introdução e tese', subtitle: 'Como construir teses claras e estratégicas', lessons: 7, duration: '1h', progress: 99, completed: false },
      { id: 4, title: 'Desenvolvimento argumentativo', subtitle: 'Argumentos sólidos e bem articulados', lessons: 10, duration: '1h 30min', progress: 82, completed: false },
      { id: 5, title: 'Repertório sociocultural', subtitle: 'Banco de citações, dados e referências', lessons: 12, duration: '2h', progress: 23, completed: false },
      { id: 6, title: 'Coesão e coerência', subtitle: 'Conectivos, progressão e referenciação', lessons: 8, duration: '1h', progress: 0, completed: false },
      { id: 7, title: 'Proposta de intervenção', subtitle: 'Agente, ação, meio, finalidade e detalhamento', lessons: 6, duration: '50min', progress: 17, completed: false },
      { id: 8, title: 'Revisão estratégica', subtitle: 'Como revisar e identificar erros estruturais', lessons: 5, duration: '40min', progress: 0, completed: false },
      { id: 9, title: 'Redação nota 1000', subtitle: 'Análise de redações exemplares', lessons: 6, duration: '1h 20min', progress: 0, completed: false },
    ];
  }

  getFlashcards(): Flashcard[] {
    return [
      { id: 1, question: 'O que é tese?', answer: 'Posicionamento claro do autor sobre a temática, geralmente apresentado na introdução.' },
      { id: 2, question: 'Quais elementos compõem a proposta de intervenção completa?', answer: 'Agente, ação, meio/modo, finalidade e detalhamento.' },
      { id: 3, question: 'Cite 3 conectivos de adição.', answer: 'Ademais, outrossim, além disso.' },
      { id: 4, question: 'O que avalia a Competência 1 do ENEM?', answer: 'Domínio da modalidade escrita formal da Língua Portuguesa.' },
      { id: 5, question: 'Exemplo de repertório legítimo para tema social.', answer: 'Constituição Federal de 1988, Art. 5° — princípio da igualdade.' },
    ];
  }

  getRanking(): RankingUser[] {
    return [
      { position: 1, name: 'Mariana L.', level: 18, xp: 4820, isCurrentUser: false },
      { position: 2, name: 'Lucas A.', level: 17, xp: 4310, isCurrentUser: false },
      { position: 3, name: 'Júlia T.', level: 17, xp: 3980, isCurrentUser: false },
      { position: 4, name: 'Você', level: 12, xp: 2480, isCurrentUser: true },
      { position: 5, name: 'Pedro M.', level: 11, xp: 2210, isCurrentUser: false },
      { position: 6, name: 'Bianca R.', level: 10, xp: 1980, isCurrentUser: false },
      { position: 7, name: 'Rafael S.', level: 9, xp: 1700, isCurrentUser: false },
    ];
  }

  getGoals(): Goal[] {
    return [
      { id: 1, title: 'Atingir 960 pontos no ENEM', subtitle: 'Até dezembro', progress: 79, completed: false },
      { id: 2, title: 'Escrever 1 redação por semana', subtitle: 'Semanalmente', progress: 100, completed: true },
      { id: 3, title: 'Completar módulo de Repertório', subtitle: 'Esta semana', progress: 13, completed: false },
      { id: 4, title: 'Manter streak de 30 dias', subtitle: 'Em andamento', progress: 23, completed: false },
    ];
  }

  getEvolutionData() {
    return {
      gradeHistory: [420, 540, 600, 680, 720, 800, 860, 880, 900, 920],
      studyTimeByWeek: [2.0, 3.5, 2.5, 4.0, 4.5, 5.0, 4.0],
      competenciasByWeek: {
        c1: [120, 140, 160, 170, 180, 180],
        c2: [100, 130, 160, 180, 190, 200],
        c3: [80, 110, 140, 160, 170, 180],
        c4: [100, 120, 140, 150, 160, 180],
        c5: [60, 90, 120, 150, 160, 180],
      }
    };
  }

  getUserStats() {
    return {
      streak: 7,
      level: 12,
      redacoes: 14,
      xp: 2480,
      competencias: [90, 80, 90, 60, 80], // C1-C5 percentages
    };
  }
}
