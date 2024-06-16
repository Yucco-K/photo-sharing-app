import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid login credentials' });
      }

      let isPasswordValid;
      try {
        isPasswordValid = bcrypt.compareSync(password, user.password);
      } catch (syncError) {
        isPasswordValid = await bcrypt.compare(password, user.password);
      }

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid login credentials' });
      }

      // 認証が成功した場合の処理 (例えば、JWT トークンの生成)
      res.status(200).json({ user });
    } catch (error) {
      console.error('Error signing in:', error);
      res.status(500).json({ error: 'Failed to sign in' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
