/** Planos de assinatura disponíveis no cadastro. */
export type PlanId = 'free' | 'bronze' | 'prata' | 'ouro';

export interface PlanInfo {
  id: PlanId;
  label: string;
  tagline: string;
  perks: string[];
}

export const PLANOS: PlanInfo[] = [
  { id: 'free', label: 'Free', tagline: 'Pra começar sem compromisso', perks: ['3 correções de redação/mês', 'Flashcards ilimitados', 'Ranking básico'] },
  { id: 'bronze', label: 'Bronze', tagline: 'Constância no dia a dia', perks: ['10 correções/mês', 'Metas personalizadas', 'Desafio semanal'] },
  { id: 'prata', label: 'Prata', tagline: 'Pra quem já sente a evolução', perks: ['Correções ilimitadas', 'Módulos avançados', 'Estatísticas detalhadas'] },
  { id: 'ouro', label: 'Ouro', tagline: 'Preparação máxima pro ENEM', perks: ['Tudo do Prata', 'Mentoria em grupo', 'Prioridade no suporte'] },
];

/** Preferências e metas do usuário — tudo aqui reflete direto nas telas de Metas/Configurações/Dashboard. */
export interface UserSettings {
  dailyGoalCards: number;      // meta diária de flashcards revisados
  weeklyGoalEssays: number;    // meta semanal de redações
  sessionMinutes: number;      // duração de sessão de estudo preferida
  theme: 'dark' | 'midnight' | 'navy';
  notifications: {
    desafioSemanal: boolean;
    revisaoFlashcards: boolean;
    streakEmRisco: boolean;
    rankingSemanal: boolean;
  };
}

export const DEFAULT_SETTINGS: UserSettings = {
  dailyGoalCards: 20,
  weeklyGoalEssays: 1,
  sessionMinutes: 30,
  theme: 'dark',
  notifications: {
    desafioSemanal: true,
    revisaoFlashcards: true,
    streakEmRisco: false,
    rankingSemanal: false,
  },
};

/**
 * Usuário autenticado via Supabase Auth. `id`/`email` vêm de `auth.users`;
 * o resto vem da tabela `profiles` (criada automaticamente no cadastro via
 * trigger `handle_new_user`, ver migration).
 */
export interface PublicUser {
  id: string;
  email: string;
  fullName: string;
  displayName: string;
  plan: PlanId;
  lgpdAcceptedAt: string;
  createdAt: string;
  settings: UserSettings;
}
