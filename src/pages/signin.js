import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Auth.module.css';
import Link from 'next/link';

async function signIn(email, password) {
  try {
    const response = await fetch('/api/signInUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to sign in');
    }

    return { data };
  } catch (error) {
    console.error('Error signing in:', error.message);
    return { error };
  }
}

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください。');
      return;
    }

    const { error } = await signIn(email, password);

    if (error) {
      setError('ログインに失敗しました: ' + error.message);
    } else {
      setError(null);
      router.push('/'); // サインイン成功後にホームページにリダイレクト
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSignIn} className={styles.form}>
        <h2 className={styles.header}>ログイン画面</h2>
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
        <button type="submit" className={styles.button}>ログイン</button>
        <p className={styles.p1}>
          <Link href="/signup">アカウントをお持ちではないですか?<br />アカウント作成</Link>
        </p>
      </form>
    </div>
  );
}
