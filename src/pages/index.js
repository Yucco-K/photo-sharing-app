import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import NavBar from '../components/NavBar';
import Upload from './upload';
import Modal from '../components/Modal';
import { useModal } from '../context/ModalContext';

export default function Home({ user }) {
  const [photos, setPhotos] = useState([]);
  const { modalType, closeModal } = useModal();

  const fetchPhotos = async () => {
    const { data: photos, error } = await supabase.storage.from('public_photos').list('');
    if (error) {
      console.log('Error fetching photo list: ', error.message);
      return;
    }

    const publicURLs = await Promise.all(photos.map(async (photo) => {
      const { data, error } = await supabase.storage.from('public_photos').getPublicUrl(photo.name);
      if (error) {
        console.log(`Error getting public URL for ${photo.name}:`, error.message);
        return null;
      }

      return data.publicUrl ? `${data.publicUrl}?t=${new Date().getTime()}` : null;
    }));

    const filteredURLs = publicURLs.filter(url => url && !url.includes('.emptyFolderPlaceholder'));
    setPhotos(filteredURLs);
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <div>
      <NavBar user={user} />
      <Modal isOpen={modalType === 'upload'} onClose={closeModal}>
        <Upload />
      </Modal>
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
