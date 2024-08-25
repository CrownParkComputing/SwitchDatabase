import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import styles from '../styles/Grid.module.css';
import { useFilterContext } from '../context/FilterContext';

export default function GameGrid({ isLoggedIn }) {
  const { filters, setFilters } = useFilterContext();
  const [games, setGames] = useState([]);
  const [years, setYears] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchYearsAndRegions = useCallback(async () => {
    try {
      const response = await fetch('/api/games/filters');
      const data = await response.json();
      console.log('Filters data:', data);
      setYears(data.years || []);
    } catch (error) {
      console.error('Error fetching years and regions:', error);
    }
  }, []);

  const fetchGames = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/games?search=${filters.searchTerm}&year=${filters.yearFilter}&month=${filters.monthFilter}`);
      const data = await response.json();
      setGames(data.games);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters.searchTerm, filters.yearFilter, filters.monthFilter]);

  useEffect(() => {
    fetchYearsAndRegions();
  }, [fetchYearsAndRegions]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      return `${day}/${month}/${year}`;
    }
    return date.toLocaleDateString();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGames();
  };

  const handleAddToPortfolio = async (gameId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ gameId })
      });
      const data = await response.json();
      if (data.success) {
        alert('Game added to portfolio successfully!');
      } else {
        alert('Failed to add game to portfolio. Please try again.');
      }
    } catch (error) {
      console.error('Error adding game to portfolio:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  return (
    <div className={styles.gridContainer}>
      <div className={styles.filters} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Search by title"
          value={filters.searchTerm}
          onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
          style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <select 
          value={filters.yearFilter} 
          onChange={(e) => setFilters({ ...filters, yearFilter: e.target.value })}
          style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">All Years</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <select 
          value={filters.monthFilter} 
          onChange={(e) => setFilters({ ...filters, monthFilter: e.target.value })}
          style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">All Months</option>
          {months.map(month => (
            <option key={month.value} value={month.value}>{month.label}</option>
          ))}
        </select>
        <button 
          onClick={handleSearch}
          style={{ padding: '5px 10px', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }}
        >
          Apply Filters
        </button>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className={styles.gameGrid}>
          {games.map((game) => (
            <div key={game.id} className={styles.gameCard}>
              <div className={styles.bannerContainer}>
                {game.bannerUrl ? (
                  <img
                    src={game.bannerUrl}
                    alt={`${game.name} banner`}
                    className={styles.banner}
                  />
                ) : (
                  <div className={styles.noBanner}>No banner available</div>
                )}
              </div>
              <div className={styles.gameTitleContainer}>
                <h3 className={styles.gameTitle}>{game.name}</h3>
              </div>
              <p>ID: {game.id}</p>
              <p>Size: {game.size}</p>
              <p>Region: {game.region}</p>
              <p>Release Date: {formatDate(game.releaseDate)}</p>
              <Link href={`/game/${game.id}`}>
                <button className={styles.viewDetailsButton}>View Details</button>
              </Link>
              {isLoggedIn && (
                <button
                  onClick={() => handleAddToPortfolio(game.id)}
                  className={styles.addToPortfolioButton}
                  style={{ marginTop: '10px', padding: '5px 10px', borderRadius: '4px', border: 'none', backgroundColor: '#28a745', color: 'white', cursor: 'pointer' }}
                >
                  Add to Portfolio
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}