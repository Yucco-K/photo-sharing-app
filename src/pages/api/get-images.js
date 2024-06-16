import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const photos = await prisma.photo.findMany({
        include: {
          user: true,
        },
      });
      res.status(200).json(photos);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching photos' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
