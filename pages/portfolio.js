import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import GameGrid from '../components/GameGrid';

export default function Portfolio() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('/api/portfolio', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else if (res.status === 401) {
          throw new Error('Unauthorized');
        } else {
          throw new Error('Failed to fetch portfolio games');
        }
      })
      .then(data => {
        setGames(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Portfolio error:', err);
        if (err.message === 'Unauthorized') {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          router.push('/login');
        } else {
          setError(err.message);
          setLoading(false);
        }
      });
  }, [router]);

  if (loading) return <Layout><p>Loading...</p></Layout>;
  if (error) return <Layout><p>Error: {error}</p></Layout>;

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">My Portfolio</h1>
      {games.length === 0 ? (
        <p>You haven't added any games to your portfolio yet.</p>
      ) : (
        <GameGrid games={games} />
      )}
    </Layout>
  );
}