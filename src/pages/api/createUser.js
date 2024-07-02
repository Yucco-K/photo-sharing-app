import supabase from '../../lib/supabase';
import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, name, nickname, role } = req.body;

    if (!email || !password || !name || !nickname || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      // Supabaseでのユーザー作成
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        console.error('Supabase sign up error:', error.message); // ログにエラーメッセージを記録
        return res.status(400).json({ error: 'Error creating user in Supabase', details: error.message });
      }

      const userId = data.user.user_id; // Supabaseから取得したユーザーID

      // Prismaでのユーザー作成
      const newUser = await prisma.user.create({
        data: {
          user_id: userId, // SupabaseのユーザーIDをPrismaのユーザーIDとして設定
          email,
          password, // これはハッシュ化されたパスワードを使用することをお勧めします
          name,
          nickname,
          role,
        },
      });

      res.status(200).json({ user: newUser });
    } catch (error) {
      console.error('Prisma create user error:', error.message); // ログにエラーメッセージを記録
      res.status(500).json({ error: 'Error creating user', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
