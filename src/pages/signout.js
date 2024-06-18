// src/pages/signout.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabase';

export default function Signout() {
  const router = useRouter();

  useEffect(() => {
    const signOutUser = async () => {
      await supabase.auth.signOut();
      router.push('/signin');
    };

    signOutUser();
  }, [router]);

  return <div>Signing out...</div>;
}
