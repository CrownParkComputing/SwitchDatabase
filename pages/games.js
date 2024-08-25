import { useState, useEffect } from 'react';
import GameGrid from '../components/GameGrid';
import Layout from '../components/Layout';

export default function Games() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Games</h2>
      <GameGrid isLoggedIn={isLoggedIn} />
    </Layout>
  );
}