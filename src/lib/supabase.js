// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL またはキーが設定されていません。');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  schema: 'public',
  ssl: { rejectUnauthorized: false } // SSLオプションの設定
});

export default supabase;
