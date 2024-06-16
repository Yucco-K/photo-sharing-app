import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { url, title, comment, userId } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const photo = await prisma.photo.create({
        data: {
          url,
          title,
          comment,
          userId: userId,
        },
      });
      res.status(200).json(photo);
    } catch (error) {
      res.status(500).json({ error: 'Error creating photo' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
