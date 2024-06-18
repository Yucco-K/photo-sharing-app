import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/NavBar.module.css';
import supabase from '../lib/supabase'; // Supabaseクライアントをインポート

export default function NavBar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Logout failed:', error.message);
        return;
      }

      // ローカルセッションのクリア
      localStorage.removeItem('user'); // 必要に応じてセッション情報をクリア
      router.push('/signin'); // ログインページにリダイレクト
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarBrand}>App</div>
      <button onClick={handleLogout} className={styles.logoutButton}>ログアウト</button>
    </nav>
  );
}
