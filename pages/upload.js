// pages/upload.js
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Upload() {
  const [image, setImage] = useState(null);

  const handleUpload = async () => {
    if (!image) return;

    const fileExt = image.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    let { error: uploadError } = await supabase.storage
      .from('public_photos')
      .upload(filePath, image);

    if (uploadError) {
      console.log('Error: ', uploadError.message);
      return;
    }

    let { publicURL, error: urlError } = await supabase.storage
      .from('public_photos')
      .getPublicUrl(filePath);

    if (urlError) {
      console.log('Error: ', urlError.message);
      return;
    }

    console.log('File available at: ', publicURL);
  };

  return (
    <div>
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}