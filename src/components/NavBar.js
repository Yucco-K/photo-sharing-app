import React, { useState , useEffect } from 'react';
import { useRouter } from 'next/router';
import { useModal } from '../context/ModalContext';
import styles from '../styles/NavBar.module.css';
import supabase from '../lib/supabase'; // Supabaseクライアントをインポート


export default function NavBar({user, setUser}) {
  const { openModal, closeModal, modalType } = useModal();
  const [currentUser, setCurrentUser] = useState(user);
  const router = useRouter();

  useEffect(() => {
  //  if (typeof window !== 'undefined') {
  //    const storedUser = localStorage.getItem('user');
  //    if (storedUser) {
  //      setUser(JSON.parse(storedUser));
  //    }
  //  }
      setCurrentUser(true);
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Logout failed:', error.message);
        return;
      }

      // ローカルセッションのクリア
// ローカルセッションのクリア
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user'); // 必要に応じてセッション情報をクリア
      }

      setUser(null);
      router.push('/'); // ログインページにリダイレクト

    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarBrand}>Photo-Sharing-App</div>
      {currentUser ? (
        <div>
          <button onClick={() => openModal('upload')} className={styles.uploadButton}>Upload Photo</button>
          <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
        </div>
      ) : (
        <div>
          <button onClick={() => openModal('signin')} className={styles.loginButton}>Login</button>
        </div>
      )}
    </nav>
  );
}
