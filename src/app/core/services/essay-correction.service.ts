import { Injectable } from '@angular/core';
import { CORRIGIR_REDACAO_URL } from '../config/supabase.config';
import { supabase } from '../config/supabase.client';
import { CorrecaoResult } from '../models/correcao.model';

@Injectable({ providedIn: 'root' })
export class EssayCorrectionService {
  async corrigir(params: { tema: string; texto: string }): Promise<CorrecaoResult> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Você precisa estar logado para corrigir uma redação.');

    const res = await fetch(CORRIGIR_REDACAO_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Não foi possível corrigir a redação agora. Tente novamente.');
    }
    return data as CorrecaoResult;
  }
}
