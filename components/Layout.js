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
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>{isLoggedIn ? 'Logged In | ' : ''}Claude-SwitchManager</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <header className="bg-black text-white py-4">
        <div className="container mx-auto px-4">
          <nav>
            <ul className="flex justify-center space-x-4">
              <li><Link href="/" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Home</Link></li>
              <li><Link href="/games" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Games</Link></li>
              {isLoggedIn ? (
                <>
                  <li><Link href="/portfolio" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Portfolio</Link></li>
                  <li><button onClick={handleLogout} className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Logout</button></li>
                </>
              ) : (
                <>
                  <li><Link href="/login" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Login</Link></li>
                  <li><Link href="/signup" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Sign Up</Link></li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>
      <div className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            <span className="text-red-500">Claude-SwitchManager</span>
            {isLoggedIn && <span className="text-white ml-2">(Logged In)</span>}
          </h1>
        </div>
      </div>
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>Your IP: {userIp}</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;