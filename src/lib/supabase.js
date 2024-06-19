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

export const getSession = async (req) => {
  const token = req.headers.cookie?.split('=')[1]; // クッキーからトークンを取得

  if (!token) {
    return null;
  }

  const { data: { session }, error } = await supabase.auth.getSession(token);

  if (error || !session) {
    return null;
  }

  const { data: user, error: userError } = await supabase.auth.getUser(session.access_token);

  if (userError || !user) {
    return null;
  }

  // ユーザーの役割を含む情報を返す
  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.user_metadata.role, // 役割情報を含める
    },
  };
};

export default supabase;
