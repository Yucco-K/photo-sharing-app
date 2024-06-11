import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import styles from '../styles/Auth.module.css';
import Link from 'next/link';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault(); // フォームのデフォルトの送信動作を防止
  
    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください。');
      return; // メールアドレスとパスワードが入力されていない場合、関数の処理を終了
    }
  
    // この部分のコードは、上の条件が真の場合には実行されません
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      setError('ログインに失敗しました。'); // 認証失敗時にエラーメッセージを設定
    } else {
      setError(null); // 認証成功時にエラーメッセージをクリア
      router.push('/'); // 認証成功後にホームページにリダイレクト
    }
  };
  
  return (
    <div className={styles.container}>
      <form onSubmit={handleSignIn} className={styles.form}>
        <h2 className={styles.header}>ログイン画面</h2>
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
        <button type="submit" className={styles.button}>ログイン</button>
        <p className={styles.p1}><Link href="/signup">アカウントをお持ちではないですか?<br/>アカウント作成</Link></p>
      </form>
    </div>
  );
}
