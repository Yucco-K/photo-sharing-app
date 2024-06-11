import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import styles from '../styles/Auth.module.css';
import Link from 'next/link';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください。');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError('アカウント作成に失敗しました');
    } else {
      setError(null); // エラーがない場合、エラーメッセージをクリア
      router.push('/'); // サインアップ成功後にホームページにリダイレクト
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSignUp} className={styles.form}>
        <h2 className={styles.header}>アカウント作成画面</h2>
        {error && <p className={styles.error}>{error}</p>}
        <input className={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input className={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className={styles.button}>アカウント作成</button>
        <p className={styles.p1}><Link href="/signin">すでにアカウントをお持ちですか？<br/>ログイン</Link></p>
      </form>
    </div>
  );
}
