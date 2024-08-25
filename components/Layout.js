import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';

const Layout = ({ children }) => {
  const [userIp, setUserIp] = useState('Loading...');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/get-ip')
      .then(res => res.json())
      .then(data => setUserIp(data.ip))
      .catch(err => {
        console.error('Failed to fetch IP:', err);
        setUserIp('Failed to load IP');
      });

    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>{isLoggedIn ? 'Logged In | ' : ''}Claude-SwitchManager</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen flex flex-col">
        <header className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-bold text-red-500">
              Claude-SwitchManager {isLoggedIn ? '(Logged In)' : ''}
            </h1>
            <nav>
              <ul className="flex space-x-4">
                <li><Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Home</Link></li>
                <li><Link href="/games" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Games</Link></li>
                {isLoggedIn ? (
                  <>
                    <li><Link href="/portfolio" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Portfolio</Link></li>
                    <li><button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Logout</button></li>
                  </>
                ) : (
                  <>
                    <li><Link href="/login" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Login</Link></li>
                    <li><Link href="/signup" className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">Sign Up</Link></li>
                  </>
                )}
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