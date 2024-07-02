import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { url, title, comment, user_id } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: user_id,
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
          user_id,
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
