import { Injectable, signal } from '@angular/core';
import { supabase } from '../config/supabase.client';

@Injectable({ providedIn: 'root' })
export class TemasSemanaisService {
  temaAtual = signal<string>('');
  carregado = signal(false);

  async carregar(): Promise<void> {
    const { data, error } = await supabase
      .from('temas_semanais')
      .select('titulo')
      .order('id');

    if (error || !data || data.length === 0) {
      this.temaAtual.set('Os desafios da inteligência artificial no mundo do trabalho contemporâneo');
      this.carregado.set(true);
      return;
    }

    const indice = this.numeroDaSemanaISO(new Date()) % data.length;
    this.temaAtual.set(data[indice].titulo);
    this.carregado.set(true);
  }

  /**
   * Número da semana no ano (padrão ISO-8601), usado pra "sortear" o tema de
   * forma determinística — todo mundo vê o mesmo tema na mesma semana, e a
   * rotação continua automaticamente ano após ano, sem precisar de ninguém
   * trocando manualmente nem de tarefa agendada.
   */
  private numeroDaSemanaISO(data: Date): number {
    const d = new Date(Date.UTC(data.getFullYear(), data.getMonth(), data.getDate()));
    const diaSemana = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - diaSemana);
    const inicioDoAno = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - inicioDoAno.getTime()) / 86400000) + 1) / 7);
  }
}
