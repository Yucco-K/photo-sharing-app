import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  throw new Error('Supabase URL またはキーが設定されていません。');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  schema: 'public',
  ssl: { rejectUnauthorized: false }
});

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  schema: 'public',
  ssl: { rejectUnauthorized: false }
});

export const getSession = async (req) => {
  const token = req.headers.cookie?.split('=')[1];

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

  return {
    user: {
      id: user.user_id,
      email: user.email,
      role: user.role,
    },
  };
};

export const deleteUser = async (req, res) => {
  const { userId } = req.body;

  try {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      throw new Error(error.message);
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user: ' + error.message });
  }
};

export default supabase;
export { supabaseAdmin };
