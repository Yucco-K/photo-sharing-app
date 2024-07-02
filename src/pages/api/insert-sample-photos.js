import supabase from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  try {
    const { data, error } = await supabase
    .from('photo')
    .insert([
      {
        url: 'https://jfnvofbefneggthfzvkx.supabase.co/storage/v1/object/public/public_photos/0.7789819895170047.jpg',
        title: 'Sample Photo',
        comment: 'This is a sample photo.',
        user_id: '03b1b180-6ad3-4a23-87ae-6a74250fdbfe', // 適切なユーザーIDを指定
        user: { name: 'Sample User' }, // 名前を追加
        createdAt: new Date().toISOString() // 日付を文字列に変換
      },
      {
        url: 'https://jfnvofbefneggthfzvkx.supabase.co/storage/v1/object/public/public_photos/0.05631904896111872.jpg?t=2024-06-20T10%3A56%3A48.529Z',
        title: 'Sample Photo 2',
        comment: 'This is another sample photo.',
        user_id: '03b1b180-6ad3-4a23-87ae-6a74250fdbfe', // 適切なユーザーIDを指定
        user: { name: 'Sample User 2' }, // 名前を追加
        createdAt: new Date().toISOString(), // 日付を文字列に変換
      },
    ])
    .select();

    if (error) {
      console.error('Error inserting sample photos:', JSON.stringify(error, null, 2)); // JSON.stringifyで詳細なエラーメッセージを表示
      return res.status(500).json({ error: 'Error inserting sample photos', details: error.message });
    }

    res.status(200).json({ message: 'Sample photos inserted successfully', data });
  } catch (err) {
    console.error('Unexpected error inserting sample photos:', err.message);
    res.status(500).json({ error: 'Unexpected error inserting sample photos', details: err.message });
  }
}
     //setPhotos(photos);