import { useState } from 'react';
import styles from '../styles/Auth.module.css';
import supabase from '../lib/supabase'; // Supabaseクライアントのインポート

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/createUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name, nickname, role }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage('Check your email for the login link.');
    } else {
      setMessage(`Error: ${data.error}. Details: ${data.details}`);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSignUp} className={styles.form}>
        <h2 className={styles.header}>アカウント作成</h2>
        {message && <p className={styles.message}>{message}</p>}
        <input
          className={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
        <button type="submit" className={styles.button}>
          アカウント作成
        </button>
      </form>
    </div>
  );
}
