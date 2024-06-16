import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { query } = req.query;
    try {
      const photos = await prisma.photo.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { comment: { contains: query } },
          ],
        },
        include: {
          user: {
            select: {
              email: true, // Userモデルからemailフィールドのみを取得
            },
          },
        },
      });
      res.status(200).json(photos);
    } catch (error) {
      console.error('Error searching photos:', error);
      res.status(500).json({ error: 'Error searching photos' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
