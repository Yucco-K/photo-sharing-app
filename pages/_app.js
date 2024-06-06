// pages/_app.js
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import Link from 'next/link';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My Next.js App</title>
      </Head>
      <div className={inter.className}>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/signup">Sign Up</Link>
          <Link href="/upload">Upload</Link>
        </nav>
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default App;
