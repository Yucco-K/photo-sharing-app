import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, name, nickname } = req.body;

    if (!email || !password || !name || !nickname) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          nickname,
        },
      });
      res.status(201).json({
        id: user.id,
        email: user.email,
        name: user.name,
        nickname: user.nickname,
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
