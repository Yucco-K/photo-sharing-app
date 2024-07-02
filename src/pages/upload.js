import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { useModal } from '../context/ModalContext';
import supabase from '../lib/supabase';
import styles from '../styles/Upload.module.css';
import Image from 'next/image';

export default function Upload() {
  const { modalType, closeModal } = useModal();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [uploadStatus, setUploadStatus] = useState(''); // アップロードのステータス


  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser(); // カレントユーザー情報を取得
      if (error) {
        setError(error.message);
        console.error('Error fetching user:', error.message);
      } else {
        setUser(data.user);
      }
      setLoading(false);
    };
  
    fetchUser();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // ファイルの種類とサイズをチェック
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm', 'video/ogg'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setUploadStatus('Only JPG, PNG, GIF, MP4, WEBM, and OGG files are allowed.');
        return;
      }
      if (selectedFile.size > 50 * 1024 * 1024) { // 50MB制限
        setUploadStatus('File size should be less than 50MB.');
        return;
      }

      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      console.log('No file selected');
      setUploadStatus('No file selected');
      return;
    }

    if (!user) {
      setUploadStatus('You must be logged in to upload files.');
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    let { error: uploadError } = await supabase.storage
      .from('public_photos')
      .upload(filePath, file);

    if (uploadError) {
      console.log('Error during upload: ', uploadError.message);
      setUploadStatus(`Error during upload: ${uploadError.message}`);
      return;
    }

    let { data, error: urlError } = await supabase.storage
      .from('public_photos')
      .getPublicUrl(filePath);

    if (urlError) {
      console.log('Error fetching URL: ', urlError.message);
      setUploadStatus(`Error fetching URL: ${urlError.message}`);
      return;
    }

    const publicURL = data.publicUrl;
    const finalURL = publicURL ? `${publicURL}?t=${new Date().getTime()}` : null;
    console.log('Final URL:', finalURL);

    // RPC関数(create_photo)を呼び出してデータを挿入
    const { data: rpcData, error: rpcError } = await supabase.rpc('create_photo', {
      url: finalURL,
      title,
      comment,
      user_id: user.user_id // フィールド名をuser_idに変更
    });

    if (rpcError) {
      console.log('Error creating photo:', rpcError.message);
      setUploadStatus(`Error creating photo: ${rpcError.message}`);
      return;
    }

    setFile(null);
    setPreviewUrl(null);
    setTitle(''); // タイトルをリセット
    setComment(''); // コメントをリセット
    setUploadStatus('Upload successful!');
    closeModal();
  };

  if (modalType !== 'upload') return null;

  return (
    <Modal isOpen={modalType === 'upload'} onClose={closeModal}>
      <div className={styles.formContainer}>
        <input
          type="file"
          onChange={handleFileChange}
          className={styles.input}
        />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className={styles.input}
        />
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Comment"
          className={styles.input}
        />
        {previewUrl && (
          <>
            {file.type.startsWith('image/') ? (
              <Image src={previewUrl} alt="Preview" layout="intrinsic" width={300} height={300} />
            ) : (
              <video controls width="300">
                <source src={previewUrl} type={file.type} />
                Your browser does not support the video tag.
              </video>
            )}
          </>
        )}
        <button onClick={handleUpload} className={styles.button}>Upload</button>
        {uploadStatus && <p>{uploadStatus}</p>}
      </div>
    </Modal>
  );
}
// Compare this snippet from src/pages/upload.js: