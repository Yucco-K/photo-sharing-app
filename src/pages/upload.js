import React, { useState } from 'react';
import Modal from '../components/Modal';
import { useModal } from '../context/ModalContext';
import { supabase } from '../lib/supabase';
import styles from '../styles/Upload.module.css';

export default function Upload() {
  const { modalType, closeModal, setUploadedImageUrl } = useModal();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      console.log('No file selected');
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
      return;
    }

    let { data, error: urlError } = await supabase.storage
      .from('public_photos')
      .getPublicUrl(filePath);

    if (urlError) {
      console.log('Error fetching URL: ', urlError.message);
      return;
    }

    const publicURL = data.publicUrl;
    const finalURL = publicURL ? `${publicURL}?t=${new Date().getTime()}` : null;
    console.log('Final URL:', finalURL); // デバッグログ
    setUploadedImageUrl(finalURL); // 変更が反映されるようにセット
    setFile(null);
    setPreviewUrl(null);
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
        {previewUrl && (
          <img src={previewUrl} alt="Preview" width={300} height={300} />
        )}
        <button onClick={handleUpload} className={styles.button}>Upload</button>
      </div>
    </Modal>
  );
}
