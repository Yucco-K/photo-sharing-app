// pages/api/signinUser.js

import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const SECRET_KEY = process.env.JWT_SECRET_KEY; // 秘密鍵は環境変数に保存します
const prisma = new PrismaClient();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      // Supabaseで認証
      const { data: { user }, error: signinError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signinError) {
        return res.status(401).json({ error: 'Invalid login credentials' });
      }

      // Prismaで追加のユーザーデータを取得
      const prismaUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!prismaUser) {
        return res.status(401).json({ error: 'Invalid login credentials' });
      }

      // JWTトークンの生成
      const token = jwt.sign(
        { userId: prismaUser.id },
        SECRET_KEY,
        { expiresIn: '1h' } // トークンの有効期限を1時間に設定
      );

      // 認証が成功した場合の処理 (JWTトークンの返却)
      res.status(200).json({ user: prismaUser, token });
    } catch (error) {
      console.error('Error signing in:', error);
      res.status(500).json({ error: 'Failed to sign in' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
