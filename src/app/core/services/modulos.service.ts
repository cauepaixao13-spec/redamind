import { Injectable, signal } from '@angular/core';
import { supabase } from '../config/supabase.client';
import { Modulo, Aula } from '../models/modulo.model';

@Injectable({ providedIn: 'root' })
export class ModulosService {
  modulos = signal<Modulo[]>([]);
  carregado = signal(false);

  async carregar(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [{ data: modulosRows }, { data: aulasRows }, { data: progressoRows }] = await Promise.all([
      supabase.from('modulos').select('*').order('ordem'),
      supabase.from('aulas').select('*').order('ordem'),
      supabase.from('progresso_aulas').select('aula_id').eq('user_id', user.id),
    ]);

    const concluidas = new Set((progressoRows ?? []).map((p: any) => p.aula_id));

    const modulos: Modulo[] = (modulosRows ?? []).map((m: any) => {
      const aulasDoModulo: Aula[] = (aulasRows ?? [])
        .filter((a: any) => a.modulo_id === m.id)
        .map((a: any) => ({
          id: a.id,
          moduloId: a.modulo_id,
          ordem: a.ordem,
          titulo: a.titulo,
          duracaoEstimada: a.duracao_estimada,
          conteudo: a.conteudo,
          concluida: concluidas.has(a.id),
          quiz: a.quiz ?? null,
        }));

      const total = aulasDoModulo.length;
      const feitas = aulasDoModulo.filter(a => a.concluida).length;
      const progresso = total === 0 ? 0 : Math.round((feitas / total) * 100);

      return {
        id: m.id,
        ordem: m.ordem,
        titulo: m.titulo,
        subtitulo: m.subtitulo,
        aulas: aulasDoModulo,
        progresso,
        completo: total > 0 && feitas === total,
      };
    });

    this.modulos.set(modulos);
    this.carregado.set(true);
  }

  getModulo(id: number): Modulo | undefined {
    return this.modulos().find(m => m.id === id);
  }

  getAula(moduloId: number, aulaId: number): { modulo: Modulo; aula: Aula; proxima: Aula | null } | undefined {
    const modulo = this.getModulo(moduloId);
    if (!modulo) return undefined;
    const idx = modulo.aulas.findIndex(a => a.id === aulaId);
    if (idx === -1) return undefined;
    return {
      modulo,
      aula: modulo.aulas[idx],
      proxima: modulo.aulas[idx + 1] ?? null,
    };
  }

  /** Primeira aula não concluída do módulo (ou a primeira de todas, se nenhuma foi feita). */
  proximaAulaDoModulo(modulo: Modulo): Aula | null {
    return modulo.aulas.find(a => !a.concluida) ?? modulo.aulas[0] ?? null;
  }

  async marcarConcluida(aulaId: number): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('progresso_aulas').insert({ user_id: user.id, aula_id: aulaId });

    this.modulos.update(modulos => modulos.map(m => ({
      ...m,
      aulas: m.aulas.map(a => a.id === aulaId ? { ...a, concluida: true } : a),
    })).map(m => {
      const total = m.aulas.length;
      const feitas = m.aulas.filter(a => a.concluida).length;
      return { ...m, progresso: total === 0 ? 0 : Math.round((feitas / total) * 100), completo: total > 0 && feitas === total };
    }));
  }

  /** Reinicia SÓ uma aula específica (tira a marcação de concluída dela, sem mexer nas outras). */
  async reiniciarAula(aulaId: number): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('progresso_aulas').delete().eq('user_id', user.id).eq('aula_id', aulaId);

    this.modulos.update(modulos => modulos.map(m => ({
      ...m,
      aulas: m.aulas.map(a => a.id === aulaId ? { ...a, concluida: false } : a),
    })).map(m => {
      const total = m.aulas.length;
      const feitas = m.aulas.filter(a => a.concluida).length;
      return { ...m, progresso: total === 0 ? 0 : Math.round((feitas / total) * 100), completo: total > 0 && feitas === total };
    }));
  }

  /** Reinicia TODO o progresso de módulos do usuário (usado no "Resetar progresso" das Configurações). */
  async resetarTodoProgresso(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('progresso_aulas').delete().eq('user_id', user.id);

    this.modulos.update(modulos => modulos.map(m => ({
      ...m,
      progresso: 0,
      completo: false,
      aulas: m.aulas.map(a => ({ ...a, concluida: false })),
    })));
  }
}
