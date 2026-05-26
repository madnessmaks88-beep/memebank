import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✅ Стандартная инициализация. 
// Supabase клиент автоматически обрабатывает retries, compression и keep-alive для мобильных.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);