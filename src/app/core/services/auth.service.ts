import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { supabase } from '../config/supabase.client';
import {
  PublicUser, PlanId, UserSettings, DEFAULT_SETTINGS
} from '../models/user.model';

/** Dados vindos do formulário de cadastro. */
export interface RegisterPayload {
  fullName: string;
  displayName: string;
  email: string;
  emailConfirm: string;
  password: string;
  passwordConfirm: string;
  lgpdAccepted: boolean;
  plan: PlanId;
}

/** Resultado de uma tentativa de registro/login — em vez de lançar exceções, devolvemos isso pra UI decidir o que mostrar. */
export interface AuthResult {
  success: boolean;
  error?: string;
}

/** Formato da linha de `profiles` (snake_case, como está no banco). */
interface ProfileRow {
  id: string;
  full_name: string;
  display_name: string;
  plan: PlanId;
  lgpd_accepted_at: string;
  settings: UserSettings;
  created_at: string;
}

function toPublicUser(email: string, profile: ProfileRow): PublicUser {
  return {
    id: profile.id,
    email,
    fullName: profile.full_name,
    displayName: profile.display_name,
    plan: profile.plan,
    lgpdAcceptedAt: profile.lgpd_accepted_at,
    createdAt: profile.created_at,
    settings: { ...DEFAULT_SETTINGS, ...profile.settings },
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Usuário autenticado no momento — `null` se ninguém estiver logado. */
  currentUser = signal<PublicUser | null>(null);
  /** Facilita o uso em *ngIf / guard sem precisar checar `currentUser() !== null` toda vez. */
  isAuthenticated = signal<boolean>(false);
  /** true assim que a sessão inicial (restaurada do Supabase) já foi checada. */
  ready = signal<boolean>(false);

  constructor(private storage: StorageService, private router: Router) {
    this.init();
  }

  // ---------------------------------------------------------------------
  // Sessão
  // ---------------------------------------------------------------------

  private async init() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await this.loadProfileIntoSession(session.user.id, session.user.email ?? '');
    }
    this.ready.set(true);

    // Mantém os signals sincronizados se o token expirar/renovar ou o usuário
    // deslogar em outra aba.
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await this.loadProfileIntoSession(session.user.id, session.user.email ?? '');
      } else {
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
      }
    });
  }

  private async loadProfileIntoSession(userId: string, email: string) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      this.currentUser.set(null);
      this.isAuthenticated.set(false);
      return;
    }

    this.currentUser.set(toPublicUser(email, profile as ProfileRow));
    this.isAuthenticated.set(true);
  }

  // ---------------------------------------------------------------------
  // Registro
  // ---------------------------------------------------------------------

  async register(payload: RegisterPayload): Promise<AuthResult> {
    const validation = this.validateRegister(payload);
    if (!validation.success) return validation;

    const { data, error } = await supabase.auth.signUp({
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
      options: {
        data: {
          full_name: payload.fullName.trim(),
          display_name: payload.displayName.trim(),
          plan: payload.plan,
        },
      },
    });

    if (error) {
      return { success: false, error: this.mapAuthError(error.message) };
    }
    if (!data.session) {
      // Confirmação de e-mail está ligada no projeto — sem sessão imediata.
      return {
        success: false,
        error: 'Conta criada! Confirme seu e-mail antes de entrar (verifique sua caixa de entrada).',
      };
    }

    await this.loadProfileIntoSession(data.session.user.id, data.session.user.email ?? '');
    return { success: true };
  }

  /** Todas as validações do formulário de cadastro, centralizadas aqui (não na UI) pra poderem ser reaproveitadas/testadas. */
  private validateRegister(payload: RegisterPayload): AuthResult {
    if (!payload.fullName.trim() || !payload.displayName.trim()) {
      return { success: false, error: 'Preencha seu nome completo e como quer ser chamado(a).' };
    }
    if (!payload.email.trim() || !payload.email.includes('@')) {
      return { success: false, error: 'Informe um e-mail válido.' };
    }
    if (payload.email.trim().toLowerCase() !== payload.emailConfirm.trim().toLowerCase()) {
      return { success: false, error: 'Os e-mails informados não coincidem.' };
    }
    if (payload.password.length < 8) {
      return { success: false, error: 'A senha precisa ter pelo menos 8 caracteres.' };
    }
    if (payload.password !== payload.passwordConfirm) {
      return { success: false, error: 'As senhas informadas não coincidem.' };
    }
    if (!payload.lgpdAccepted) {
      return { success: false, error: 'É necessário aceitar os termos da LGPD para continuar.' };
    }
    return { success: true };
  }

  private mapAuthError(message: string): string {
    if (message.includes('already registered') || message.includes('already been registered')) {
      return 'Já existe uma conta cadastrada com este e-mail.';
    }
    if (message.includes('Invalid login credentials')) {
      return 'E-mail ou senha incorretos.';
    }
    if (message.includes('Password should be at least')) {
      return 'A senha precisa ter pelo menos 8 caracteres.';
    }
    return message;
  }

  // ---------------------------------------------------------------------
  // Login / logout
  // ---------------------------------------------------------------------

  async login(email: string, password: string): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      return { success: false, error: this.mapAuthError(error.message) };
    }

    await this.loadProfileIntoSession(data.user.id, data.user.email ?? '');
    return { success: true };
  }

  async logout(): Promise<void> {
    await supabase.auth.signOut();
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/']);
  }

  // ---------------------------------------------------------------------
  // Configurações do usuário
  // ---------------------------------------------------------------------

  /** Aplica um patch parcial nas configurações do usuário logado, salva e já reflete no signal `currentUser`. */
  async updateSettings(patch: Partial<UserSettings>): Promise<void> {
    const current = this.currentUser();
    if (!current) return;

    const newSettings = { ...current.settings, ...patch };
    const { error } = await supabase
      .from('profiles')
      .update({ settings: newSettings })
      .eq('id', current.id);

    if (!error) {
      this.currentUser.set({ ...current, settings: newSettings });
    }
  }

  async updatePlan(plan: PlanId): Promise<void> {
    const current = this.currentUser();
    if (!current) return;

    const { error } = await supabase
      .from('profiles')
      .update({ plan })
      .eq('id', current.id);

    if (!error) {
      this.currentUser.set({ ...current, plan });
    }
  }

  // ---------------------------------------------------------------------
  // Zona de perigo (Configurações)
  // ---------------------------------------------------------------------

  /**
   * Apaga permanentemente a conta do usuário logado. Deletar de `auth.users`
   * exige privilégio de admin (service_role), por isso chamamos o Edge
   * Function `deletar-conta`, que faz isso com o token da própria sessão
   * (garantindo que só dá pra apagar a própria conta, nunca a de outra pessoa).
   */
  async deleteAccount(): Promise<void> {
    const current = this.currentUser();
    if (!current) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await fetch(`https://xoxlnhodlxsamzlxnmof.supabase.co/functions/v1/deletar-conta`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    this.storage.remove(`flashcards:${current.id}`);
    this.storage.remove(`study-sessions:${current.id}`);
    this.storage.remove(`goals:${current.id}`);

    await this.logout();
  }
}
