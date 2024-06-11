import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useModal } from '../context/ModalContext';
import { supabase } from '../lib/supabase';

export default function NavBar({ user }) {
  const { openModal } = useModal();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/signin');
  };

  return (
    <nav>
      <Link href="/">Home</Link>
      {user ? (
        <>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={() => openModal('upload')}>Upload</button>
        </>
      ) : (
        <>
          <Link href="/signin">Sign In</Link>
          <Link href="/signup">Sign Up</Link>
        </>
      )}
    </nav>
  );
}
