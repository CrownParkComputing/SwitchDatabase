import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../../styles/GameDetails.module.css';

export default function GameDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [game, setGame] = useState(null);
  const [linkedDLCs, setLinkedDLCs] = useState([]);
  const [versionInfo, setVersionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);

  useEffect(() => {
    const fetchGameAndRelatedData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/games/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch game details');
        }
        const data = await response.json();
        console.log('Fetched data:', data);
        setGame(data.game);
        setLinkedDLCs(data.linkedDLCs || []);
        setVersionInfo(data.versionInfo);
      } catch (err) {
        console.error('Error fetching game details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGameAndRelatedData();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      return `${month}/${day}/${year}`;
    }
    return date.toLocaleDateString();
  };

  if (loading) return <div className={styles.loadingMessage}>Loading...</div>;
  if (error) return <div className={styles.errorMessage}>Error: {error}</div>;
  if (!game) return <div className={styles.noGameMessage}>No game found</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{game.name}</h1>
      {game.bannerUrl && (
        <div className={styles.bannerContainer}>
          <img 
            src={game.bannerUrl} 
            alt="Game Banner" 
            className={styles.bannerImage}
          />
        </div>
      )}

      {game.screenshots && game.screenshots.length > 0 && (
        <div className={styles.screenshotsContainer}>
          <h2 className={styles.screenshotsTitle}>Screenshots</h2>
          <div className={styles.screenshotsGrid}>
            {game.screenshots.map((screenshot, index) => (
              <img
                key={index}
                src={screenshot}
                alt={`Screenshot ${index + 1}`}
                className={styles.screenshot}
                onClick={() => setZoomedImage(screenshot)}
              />
            ))}
          </div>
        </div>
      )}

      <div className={styles.contentContainer}>
        <div className={styles.gameDetails}>
          <h2 className={styles.sectionTitle}>Game Details</h2>
          <p><strong>ID:</strong> {game.id}</p>
          <p><strong>Size:</strong> {game.size}</p>
          <p><strong>Region:</strong> {game.region}</p>
          <p><strong>Release Date:</strong> {formatDate(game.releaseDate)}</p>
          <p><strong>Developer:</strong> {game.developer}</p>
          <p><strong>Publisher:</strong> {game.publisher}</p>
          <p><strong>Category:</strong> {game.category?.join(', ')}</p>
          <p><strong>Languages:</strong> {game.languages?.join(', ')}</p>
          <p><strong>Number of Players:</strong> {game.numberOfPlayers}</p>
          <p><strong>Rating:</strong> {game.rating}</p>
        </div>

        <div className={styles.rightColumn}>
          {versionInfo && versionInfo.versions && versionInfo.versions.length > 0 && (
            <div className={styles.scrollableSection}>
              <h2 className={styles.sectionTitle}>Version History</h2>
              <div className={styles.scrollableContent}>
                <ul className={styles.list}>
                  {versionInfo.versions.map((version, index) => (
                    <li key={index} className={styles.listItem}>
                      <strong>Version {version.versionNumber}</strong> - Released: {formatDate(version.releaseDate)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {linkedDLCs && linkedDLCs.length > 0 && (
            <div className={styles.scrollableSection}>
              <h2 className={styles.sectionTitle}>Linked DLCs</h2>
              <div className={styles.scrollableContent}>
                <ul className={styles.list}>
                  {linkedDLCs.map(dlc => (
                    <li key={dlc.id} className={styles.dlcItem}>
                      <strong>{dlc.name}</strong> - Released: {formatDate(dlc.releaseDate)}
                      {dlc.description && <p>{dlc.description}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.description}>
        <h2 className={styles.sectionTitle}>Description</h2>
        <p>{game.description}</p>
      </div>

      <div className={styles.backLink}>
        <Link href="/games" className={styles.link}>
          Back to Games List
        </Link>
      </div>

      {zoomedImage && (
        <div className={styles.zoomedImageOverlay} onClick={() => setZoomedImage(null)}>
          <img
            src={zoomedImage}
            alt="Zoomed Screenshot"
            className={styles.zoomedImage}
          />
        </div>
      )}
    </div>
  );
}