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
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user && !['/signin', '/signup'].includes(router.pathname)) {
          router.push('/signin');
        }
      });

      authListener = subscription;

      if (!session?.user && !['/signin', '/signup'].includes(router.pathname)) {
        router.push('/signin');
      }
    };

    getSession();

    return () => {
      authListener?.unsubscribe();
    };
  }, [router]);

  return (
    <ModalProvider>
      <Component {...pageProps} user={user} />
    </ModalProvider>
  );
}

export default App;
