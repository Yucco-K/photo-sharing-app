// pages/api/createUser.js
import prisma from '../../lib/prisma';
import supabase from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, name, bio, avatarUrl } = req.body;
    try {
      // Supabaseでのユーザー作成
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        return res.status(500).json({ error: 'Error creating user in Supabase' });
      }

      const userId = data.user.id;

      // プロフィールの作成
      const profile = await prisma.profile.create({
        data: {
          userId,
          bio: bio || null,
          avatarUrl: avatarUrl || null,
        },
      });

      res.status(200).json({ user: data.user, profile });
    } catch (error) {
      res.status(500).json({ error: 'Error creating user' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
