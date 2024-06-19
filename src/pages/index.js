// pages/index.js
import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Modal from '../components/Modal';
import Upload from './upload';
import { useModal } from '../context/ModalContext';
import Image from 'next/image';
import { fetchPhotos } from '../lib/photos';
import DeleteUserComponent from '../components/DeleteUserComponent';
import { getSession } from '../lib/supabase';

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession(req); // セッション情報を取得

  if (!session) {
    return {
      redirect: {
        destination: '/signin', // ログインしていない場合はサインインページにリダイレクト
        permanent: false,
      },
    };
  }

  const { user } = session;

  // ここでユーザーの役割を取得して判定
  const isAdmin = user.role === 'admin';

  let photos = [];
  let error = null;

  try {
    photos = await fetchPhotos();
  } catch (err) {
    console.error('Error fetching photos:', err);
    error = 'Error fetching photos';
  }

  return {
    props: {
      user,
      isAdmin,
      initialPhotos: photos,
      error,
    },
  };
}

export default function Home({ user, isAdmin, initialPhotos, error }) {
  const [photos, setPhotos] = useState(initialPhotos);
  const { modalType, closeModal } = useModal();

  const fetchPhotos = async () => {
    const response = await fetch('/api/get-images');
    if (!response.ok) {
      console.log('Error fetching photo list: ', response.statusText);
      return;
    }

    const photos = await response.json();
    setPhotos(photos);
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const sendEmail = async () => {
    const response = await fetch('/api/sendEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'recipient@example.com',
        subject: 'New Photos Uploaded',
        text: 'New photos have been uploaded.',
        html: '<p>New photos have been uploaded.</p>',
      }),
    });

    if (response.ok) {
      alert('Email sent successfully');
    } else {
      alert('Error sending email');
    }
  };

  return (
    <div>
      <NavBar user={user} />
      <Modal isOpen={modalType === 'upload'} onClose={closeModal}>
        <Upload />
      </Modal>
      <button onClick={sendEmail}>Send Email</button>
      {photos.length === 0 ? (
        <p>No photos found.</p>
      ) : (
        photos.map((photo, index) => (
          <div key={index}>
            <Image src={photo.url} alt={`Photo ${index}`} width={300} height={300} />
            <p>{photo.title}</p>
            <p>{photo.comment}</p>
            <p>Uploaded by: {photo.user.name}</p>
          </div>
        ))
      )}
      {isAdmin && <DeleteUserComponent />}
    </div>
  );
}
