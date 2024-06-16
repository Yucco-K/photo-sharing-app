import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Auth.module.css';
import Link from 'next/link';

async function signUp(email, password, name, nickname) {
  try {
    const response = await fetch('/api/signupUsers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name, nickname }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to sign up');
    }

    return { data };
  } catch (error) {
    console.error('Error signing up:', error.message);
    return { error };
  }
}

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!email || !password || !name || !nickname) {
      setError('全てのフィールドを入力してください。');
      return;
    }

    const { error } = await signUp(email, password, name, nickname);

    if (error) {
      setError('アカウント作成に失敗しました: ' + error.message);
    } else {
      setError(null);
      router.push('/signin'); // サインアップ成功後にサインインページにリダイレクト
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSignUp} className={styles.form}>
        <h2 className={styles.header}>アカウント作成画面</h2>
        {error && <p className={styles.error}>{error}</p>}
        <input
          className={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <button type="submit" className={styles.button}>アカウント作成</button>
        <p className={styles.p1}>
          <Link href="/signin">すでにアカウントをお持ちですか?<br />ログイン</Link>
        </p>
      </form>
    </div>
  );
}
