import { fetchPhotos } from '../../lib/photos';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const photos = await fetchPhotos();
      res.status(200).json(photos);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching photos' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
