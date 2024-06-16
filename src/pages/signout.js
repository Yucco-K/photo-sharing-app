import React, { useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabase';
import styles from '../styles/Auth.module.css';
import Link from 'next/link';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  // サインイン処理のハンドラ関数
  const handleSignIn = async (e) => {
    e.preventDefault(); // フォームのデフォルトの送信動作を防止

    // メールアドレスとパスワードが入力されているかをチェック
    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください。');
      return; // メールアドレスとパスワードが入力されていない場合、関数の処理を終了
    }

    // サインイン処理
    const { data: { session, user }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // 認証結果に応じてエラーメッセージを設定またはリダイレクト
    if (error) {
      setError('ログインに失敗しました。'); // 認証失敗時にエラーメッセージを設定
    } else {
      setError(null); // 認証成功時にエラーメッセージをクリア
      console.log('Base URL:', process.env.NEXT_PUBLIC_BASE_URL); // 環境変数をコンソールにログ
      router.push(process.env.NEXT_PUBLIC_BASE_URL + '/'); // 認証成功後にホームページにリダイレクト
    }
  };

  // メール確認の再送信
  const resendVerificationEmail = async (email) => {
    const { error } = await supabase.auth.api.sendVerificationEmail(email);
    if (error) {
      console.error('確認メールの再送信に失敗しました:', error.message);
    } else {
      console.log('確認メールが再送信されました。');
      setWaiting(true);
      setMessage('確認メールが再送信されました。1分以内にメールを確認して認証を行ってください。');
      setTimeout(() => {
        setWaiting(false);
        setMessage('');
      }, 60000); // 1分（60,000ミリ秒）後にウェイティングをキャンセル
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
        <button type="submit" className={styles.button} disabled={waiting}>ログイン</button>
        <p className={styles.p1}><Link href="/signup">アカウントをお持ちではないですか?<br />アカウント作成</Link></p>
      </form>
      <button onClick={() => resendVerificationEmail(email)} className={styles.button} disabled={waiting}>
        確認メール再送信
      </button>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
