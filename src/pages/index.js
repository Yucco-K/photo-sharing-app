// pages/index.js
import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Modal from '../components/Modal';
import Upload from './upload';
import { useModal } from '../context/ModalContext';
import Image from 'next/image';
import DeleteUserComponent from '../components/DeleteUserComponent';
import { getSession } from '../lib/supabase';
import supabase from '../lib/supabase';

// Fetch photos from Supabase
const fetchPhotos = async () => {
  let { data: photos, error } = await supabase.from('Photo').select('*');
  if (error) {
    throw new Error(error.message);
  }
  return photos;
};

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

  const initialPhotos = photos.map(photo => ({
    ...photo,
    createdAt: photo.created_at ? new Date(photo.created_at).toISOString() : null, // Dateオブジェクトを文字列に変換
  }));

  return {
    props: {
      user,
      isAdmin,
      initialPhotos,
      error,
    },
  };
}

export default function Home({ user, isAdmin, initialPhotos, error }) {
  const [photos, setPhotos] = useState(initialPhotos || []); // 初期状態の設定
  const [fetchError, setFetchError] = useState(null); // Fetchエラーの状態
  const { modalType, closeModal } = useModal();

  const fetchPhotosFromAPI = async () => {
    try {
      const response = await fetch('/api/get-images');
      if (!response.ok) {
        throw new Error(`Error fetching photo list: ${response.statusText}`);
      }

      const photos = await response.json();
      setPhotos(photos);
      setFetchError(null); // エラーをクリア
    } catch (error) {
      console.error(error);
      setFetchError(error.message); // エラーメッセージを設定
    }
  };

  useEffect(() => {
    fetchPhotosFromAPI();
  }, []);

  const sendEmail = async () => {
    try {
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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error sending email');
      }
    } catch (error) {
      console.error('Error sending email:', error.message);
      alert(`Error sending email: ${error.message}`);
    }
  };

  const insertSamplePhotos = async () => {
    try {
      const response = await fetch('/api/insert-sample-photos', {
        method: 'POST',
      });

      if (response.ok) {
        alert('Sample photos inserted successfully');
        fetchPhotosFromAPI(); // サンプルデータを挿入後に写真リストを更新
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error inserting sample photos');
      }
    } catch (error) {
      console.error('Error inserting sample photos:', error.message);
      alert(`Error inserting sample photos: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <NavBar user={user} />
      <Modal isOpen={modalType === 'upload'} onClose={closeModal}>
        <Upload />
      </Modal>
      <h1 className="text-2xl font-semibold">Photo Gallery</h1>
      {fetchError && <p className="text-red-500">{fetchError}</p>} {/* エラーメッセージの表示 */}
      {photos.length === 0 ? (
        <p className="text-center text-gray-500">No photos found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <Image src={photo.url} alt={`Photo ${index}`} width={300} height={300} className="rounded-md" unoptimized priority /> {/* unoptimizedとpriorityを追加*/}
              <div className="mt-2">
                <p>{photo.title}</p>
                <p>{photo.comment}</p>
                <p>Uploaded by: {photo.user?.name || 'Unknown User'}</p>
                <p>Uploaded on: {photo.createdAt}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {isAdmin && <DeleteUserComponent />}
      {isAdmin && <button className="btn btn-primary" onClick={sendEmail}>Send Email</button>}
      {isAdmin && <button className="btn btn-secondary" onClick={insertSamplePhotos}>Insert Sample Photos</button>}
    </div>
  );
}
