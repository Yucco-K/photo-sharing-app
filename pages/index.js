import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    let { data: photos, error } = await supabase.storage.from('public_photos').list('');
    if (error) {
      console.log('Error fetching photo list: ', error.message);
      return;
    }

    console.log('Fetched photo list:', photos);

    const publicURLs = await Promise.all(photos.map(async (photo) => {
      const result = supabase.storage.from('public_photos').getPublicUrl(photo.name);
      if (result.error) {
        console.log(`Error getting public URL for ${photo.name}:`, result.error.message);
        return null;
      }

      console.log(`Result for ${photo.name}:`, result);

      const publicUrl = result.publicUrl || (result.data && result.data.publicUrl) || result.data.publicUrl;

      // キャッシュバスティングのためにタイムスタンプを追加
      return publicUrl ? `${publicUrl}?t=${new Date().getTime()}` : null;
    }));

    console.log('Public URLs:', publicURLs);

    // .emptyFolderPlaceholderや不要なプレースホルダー画像を除外
    const filteredURLs = publicURLs.filter(url => url && !url.includes('.emptyFolderPlaceholder'));
    console.log('Filtered URLs:', filteredURLs);

    setPhotos(filteredURLs);
  };

  return (
    <div>
      {photos.length === 0 ? (
        <p>No photos found.</p>
      ) : (
        photos.map((url, index) => (
          url ? (
            <img key={index} src={url} alt={`Photo ${index}`} width={300} height={300} />
          ) : (
            <p key={index}>Photo {index} URL is missing</p>
          )
        ))
      )}
    </div>
  );
}
