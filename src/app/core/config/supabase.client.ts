import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './supabase.config';

/**
 * Client único do Supabase pra todo o app. A anonKey é pública por design
 * (ver supabase.config.ts) — segurança real vem do RLS no banco.
 */
export const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
