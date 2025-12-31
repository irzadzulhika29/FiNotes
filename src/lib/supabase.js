import { createClient } from '@supabase/supabase-js';

// Ambil environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validasi environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase URL dan Anon Key harus diisi di file .env\n' +
    'VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY'
  );
}

// Buat Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Tidak perlu session karena no auth
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'X-Client-Info': 'financial-notes-app',
    },
  },
});

// Helper function untuk handle error
export const handleSupabaseError = (error) => {
  if (error) {
    console.error('Supabase Error:', error);
    return {
      success: false,
      error: error.message || 'Terjadi kesalahan pada database',
    };
  }
  return { success: true };
};

