import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { SUPABASE_CONFIG, CORRIGIR_REDACAO_URL } from '../config/supabase.config';
import { CorrecaoResult } from '../models/correcao.model';

@Injectable({ providedIn: 'root' })
export class EssayCorrectionService {
  constructor(private http: HttpClient) {}

  corrigir(params: { userId: string; plan: string; tema: string; texto: string }): Observable<CorrecaoResult> {
    return this.http.post<CorrecaoResult>(CORRIGIR_REDACAO_URL, params, {
      headers: {
        Authorization: `Bearer ${SUPABASE_CONFIG.anonKey}`,
        apikey: SUPABASE_CONFIG.anonKey,
        'Content-Type': 'application/json',
      },
    }).pipe(
      catchError((err: HttpErrorResponse) => {
        const msg = err.error?.error || 'Não foi possível corrigir a redação agora. Tente novamente.';
        return throwError(() => new Error(msg));
      }),
    );
  }
}
