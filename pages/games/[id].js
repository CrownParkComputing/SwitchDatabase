import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '../../components/Layout';

export default function GameDetails() {
  const [game, setGame] = useState(null);
  const [linkedDLCs, setLinkedDLCs] = useState([]);
  const [versionInfo, setVersionInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchGameDetails();
    }
  }, [id]);

  const fetchGameDetails = async () => {
    try {
      const response = await fetch(`/api/games/${id}`);
      if (response.ok) {
        const data = await response.json();
        setGame(data.game);
        setLinkedDLCs(data.linkedDLCs);
        setVersionInfo(data.versionInfo);
      } else {
        console.error('Failed to fetch game details');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!game) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{game.name} - Game Details</title>
        <meta name="description" content={`Details for ${game.name}`} />
      </Head>
      <main>
        <h1>{game.name}</h1>
        {game.bannerUrl && (
          <div>
            <Image src={game.bannerUrl} alt={game.name} width={1920} height={1080} />
          </div>
        )}
        <div>
          <section>
            <article>
              <h2>Description</h2>
              <p>{game.description}</p>
            </article>
            <article>
              <h2>Game Details</h2>
              <p><strong>ID:</strong> {game.id}</p>
              <p><strong>Region:</strong> {game.region}</p>
              <p><strong>Release Date:</strong> {new Date(game.releaseDate).toLocaleDateString()}</p>
              <p><strong>Size:</strong> {game.size} bytes</p>
            </article>
            {game.screenshots && game.screenshots.length > 0 && (
              <article>
                <h2>Screenshots</h2>
                <div>
                  {game.screenshots.map((screenshot, index) => (
                    <div key={index}>
                      <Image src={screenshot} alt={`Screenshot ${index + 1}`} width={300} height={169} />
                    </div>
                  ))}
                </div>
              </article>
            )}
          </section>
          <aside>
            {linkedDLCs.length > 0 && (
              <section>
                <h2>Related DLC</h2>
                <ul>
                  {linkedDLCs.map(dlc => (
                    <li key={dlc.id}>{dlc.name}</li>
                  ))}
                </ul>
              </section>
            )}
            {versionInfo && (
              <section>
                <h2>Related Versions</h2>
                <div>
                  <p><strong>Latest Version:</strong> {versionInfo.version}</p>
                  <p><strong>Required System Version:</strong> {versionInfo.requiredSystemVersion}</p>
                </div>
              </section>
            )}
          </aside>
        </div>
      </main>
    </Layout>
  );
}