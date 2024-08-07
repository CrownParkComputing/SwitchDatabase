import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Switch Manager</title>
        <meta name="description" content="Manage your Nintendo Switch games" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Switch Manager
        </h1>
        <div className={styles.imageContainer}>
          <img src="/switch.jpg" alt="Nintendo Switch" className={styles.switchImage} />
        </div>
      </main>
    </Layout>
  );
}