// /pages/api/signupUser.js
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, name, nickname } = req.body;

    if (!email || !password || !name || !nickname) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    try {
      // Supabaseでユーザーを作成
      const { data: { user }, error: supabaseError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (supabaseError) {
        throw supabaseError;
      }

      // PrismaでUserテーブルにユーザー情報を追加
      const prismaUser = await prisma.user.create({
        data: {
          id: user.user_id, // SupabaseのユーザーIDを使用
          email,
          password: bcrypt.hashSync(password, 10), // パスワードをハッシュ化
          name,
          nickname,
        },
      });

      res.status(201).json({
        id: prismaUser.id,
        email: prismaUser.email,
        name: prismaUser.name,
        nickname: prismaUser.nickname,
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
