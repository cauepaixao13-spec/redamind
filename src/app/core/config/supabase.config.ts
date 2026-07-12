/**
 * Config pública do Supabase. A anon key é FEITA pra ser exposta no client
 * (é assim que o Supabase funciona) — o que protege os dados é o RLS no banco
 * e a lógica do Edge Function, nunca esconder essa key.
 */
export const SUPABASE_CONFIG = {
  url: 'https://xoxlnhodlxsamzlxnmof.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhveGxuaG9kbHhzYW16bHhubW9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMTY2NzUsImV4cCI6MjA5MjY5MjY3NX0.wUWICrLWZxLV-Q9YsmBXBPkuBZGEIGpn-rDLG4wQ1LE',
};

export const CORRIGIR_REDACAO_URL = `${SUPABASE_CONFIG.url}/functions/v1/corrigir-redacao`;
