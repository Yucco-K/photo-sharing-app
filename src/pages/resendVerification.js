// pages/resendVerification.js
import { useState } from 'react';
import supabase from '../lib/supabase';

export default function ResendVerification() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleResend = async () => {
    setStatus('');
    setError('');

    try {
      const { error } = await supabase.auth.api.sendVerificationEmail(email);
      if (error) throw error;

      setStatus('Verification email resent successfully');
    } catch (error) {
      setError('Error resending verification email');
      console.error('Error resending verification email:', error.message);
    }
  };

  return (
    <div>
      <h1>Resend Verification Email</h1>
      {status && <p style={{ color: 'green' }}>{status}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleResend}>Resend Email</button>
    </div>
  );
}
