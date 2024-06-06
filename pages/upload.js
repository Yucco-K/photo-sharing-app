// pages/upload.js
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Upload() {
  const [image, setImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const handleUpload = async () => {
    if (!image) return;

    const fileExt = image.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log(`Uploading: ${filePath}`);

    let { error: uploadError } = await supabase.storage
      .from('public_photos')
      .upload(filePath, image);

    if (uploadError) {
      console.log('Error during upload: ', uploadError.message);
      return;
    }

    console.log('File uploaded successfully');

    let { data, error: urlError } = await supabase.storage
      .from('public_photos')
      .getPublicUrl(filePath);

    if (urlError) {
      console.log('Error fetching URL: ', urlError.message);
      return;
    }

    const publicURL = data.publicUrl;
    console.log('Public URL: ', publicURL);

    // キャッシュバスターを追加して、キャッシュの問題を解決
    const finalURL = publicURL ? `${publicURL}?t=${new Date().getTime()}` : null;
    console.log('File available at: ', finalURL);

    // アップロードした画像のURLを設定
    setUploadedImageUrl(finalURL);
  };

  return (
    <div>
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
      {uploadedImageUrl && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={uploadedImageUrl} alt="Uploaded File" />
        </div>
      )}
    </div>
  );
}
