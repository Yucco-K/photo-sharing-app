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

    // Perform any necessary cleanup here
    return () => {
      // Cleanup code goes here
      // For example, you can unsubscribe from any subscriptions or clear timers
      // that were set up in the useEffect hook

      // Unsubscribe from any subscriptions
      // subscription.unsubscribe();

      // Clear any timers
      // clearTimeout(timer);
      subscription.unsubscribe()
    };
  }, [router]);

  return (
    <div>Signing out...</div>
  );
}