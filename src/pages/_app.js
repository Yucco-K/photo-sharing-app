import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabase';
import { ModalProvider } from '../context/ModalContext';
import '../styles/globals.css';

function App({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    let authListener;

    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      console.log('Session:', session); // デバッグ用ログ
      setUser(session?.user ?? null);

      const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
        console.log('Auth state changed:', session); // デバッグ用ログ
        setUser(session?.user ?? null);

        // ユーザーが認証されていない場合、サインインページにリダイレクト
        if (!session?.user && !['/signin', '/signup'].includes(router.pathname)) {
          router.push('/signin');
        }
      });

      authListener = subscription;

      // 初回セッションチェック時もリダイレクト処理を実行
      if (!session?.user && !['/signin', '/signup'].includes(router.pathname)) {
        router.push('/signin');
      }
    };

    getSession();

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [router]); // 依存関係配列にrouterを追加

  return (
    <ModalProvider>
      <Component {...pageProps} user={user} />
    </ModalProvider>
  );
}

export default App;
