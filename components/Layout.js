import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

const Layout = ({ children }) => {
  const [userIp, setUserIp] = useState('Loading...');

  useEffect(() => {
    fetch('/api/get-ip')
      .then(res => res.json())
      .then(data => setUserIp(data.ip))
      .catch(err => {
        console.error('Failed to fetch IP:', err);
        setUserIp('Failed to load IP');
      });
  }, []);

  return (
    <>
      <Head>
        <title>Claude-SwitchManager</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen flex flex-col">
        <header className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-bold text-red-500">Claude-SwitchManager</h1>
            <nav>
              <ul className="flex space-x-4">
                <li><Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Home</Link></li>
                <li><Link href="/games" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Games</Link></li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-gray-800 text-white p-4">
          <div className="container mx-auto text-center">
            <p>Your IP: {userIp}</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout;