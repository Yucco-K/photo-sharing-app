import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { useModal } from '../context/ModalContext';
import supabase from '../lib/supabase';
import styles from '../styles/Upload.module.css';
import Image from 'next/image';

export default function Upload() {
  const { modalType, closeModal, setUploadedImageUrl } = useModal();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [uploadStatus, setUploadStatus] = useState(''); // アップロードのステータス
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error.message);
      } else {
        setUser(data.user);
      }
    };

    fetchUser();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // ファイルの種類とサイズをチェック
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setUploadStatus('Only JPG, PNG, and GIF files are allowed.');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB制限
        setUploadStatus('File size should be less than 5MB.');
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

    const response = await fetch('/api/createPhoto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: finalURL,
        title,
        comment,
        userId: user.id,
      }),
    });

    const responseData = await response.json();
    if (!response.ok) {
      console.log('Error creating photo:', responseData.error);
      setUploadStatus(`Error creating photo: ${responseData.error}`);
      return;
    }

    setUploadedImageUrl(finalURL);
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
          <Image src={previewUrl} alt="Preview" layout="intrinsic" width={300} height={300} />
        )}
        <button onClick={handleUpload} className={styles.button}>Upload</button>
        {uploadStatus && <p>{uploadStatus}</p>}
      </div>
    </Modal>
  );
}
