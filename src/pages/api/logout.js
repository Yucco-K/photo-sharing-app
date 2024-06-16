// pages/api/logout.js
import supabase from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { error } = await supabase.auth.signOut();
    if (error) {
      res.status(500).json({ error: 'Logout failed' });
      return;
    }
    res.status(200).json({ message: 'Logout successful' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
