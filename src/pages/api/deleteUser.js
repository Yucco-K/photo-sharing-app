import supabase from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;

    try {
      // Supabaseでのマジックリンク送信
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: 'http://localhost:3000/welcome', // リダイレクト先を設定
        },
      });

      if (error) {
        throw new Error(error.message || 'Error sending magic link in Supabase');
      }

      res.status(200).json({ message: 'Magic link sent successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error sending magic link', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
//