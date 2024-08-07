import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Layout from '../components/Layout';

export default function Admin() {
  const [log, setLog] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isValidatingDB, setIsValidatingDB] = useState(false);
  const [titlesUrl, setTitlesUrl] = useState('https://tinfoil.media/repo/db/titles.json');
  const [versionsUrl, setVersionsUrl] = useState('https://tinfoil.media/repo/db/versions.json');
  const [updateStages, setUpdateStages] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    checkAuthorization();
    fetchUpdateStages();
    const intervalId = setInterval(fetchUpdateStages, 5000); // Refresh every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  const checkAuthorization = async () => {
    try {
      const response = await fetch('/api/check-auth');
      if (response.ok) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error('Error checking authorization:', error);
      setIsAuthorized(false);
    }
  };

  const fetchUpdateStages = async () => {
    try {
      const response = await fetch('/api/updateStages');
      if (response.ok) {
        const data = await response.json();
        setUpdateStages(data);
      }
    } catch (error) {
      console.error('Error fetching update stages:', error);
    }
  };

  const updateDatabase = async () => {
    setIsUpdating(true);
    setLog('Updating database...');
    try {
      const response = await fetch('/api/updateDatabase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ titlesUrl, versionsUrl }),
      });
      const data = await response.json();
      setLog(data.message);
    } catch (error) {
      setLog('Error updating database: ' + error.message);
    }
    setIsUpdating(false);
  };

  const validateSources = async () => {
    setIsValidating(true);
    setLog('Validating sources...');
    try {
      const response = await fetch('/api/validate-sources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ titlesUrl, versionsUrl }),
      });
      const data = await response.json();
      setLog(data.message);
    } catch (error) {
      setLog('Error validating sources: ' + error.message);
    }
    setIsValidating(false);
  };

  const validateDatabaseConnection = async () => {
    setIsValidatingDB(true);
    setLog('Validating database connection...');
    try {
      const response = await fetch('/api/validate-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setLog(data.message);
    } catch (error) {
      setLog('Error validating database connection: ' + error.message);
    }
    setIsValidatingDB(false);
  };

  if (!isAuthorized) {
    return (
      <Layout>
        <Head>
          <title>Admin - Unauthorized</title>
        </Head>
        <main className={styles.main}>
          <h1 className={styles.title}>Unauthorized Access</h1>
          <p>You are not authorized to view this page.</p>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Switch Manager - Admin</title>
        <meta name="description" content="Admin page for Switch Manager" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Admin Dashboard</h1>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>Update Database</h2>
            <input
              type="text"
              className={styles.input}
              value={titlesUrl}
              onChange={(e) => setTitlesUrl(e.target.value)}
              placeholder="Titles JSON URL"
            />
            <input
              type="text"
              className={styles.input}
              value={versionsUrl}
              onChange={(e) => setVersionsUrl(e.target.value)}
              placeholder="Versions JSON URL"
            />
            <button onClick={updateDatabase} className={styles.button} disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Database'}
            </button>
          </div>

          <div className={styles.card}>
            <h2>Validate Sources</h2>
            <button onClick={validateSources} className={styles.button} disabled={isValidating}>
              {isValidating ? 'Validating...' : 'Validate Sources'}
            </button>
          </div>

          <div className={styles.card}>
            <h2>Validate Database Connection</h2>
            <button onClick={validateDatabaseConnection} className={styles.button} disabled={isValidatingDB}>
              {isValidatingDB ? 'Validating...' : 'Validate DB Connection'}
            </button>
          </div>
        </div>

        <div className={styles.updateStages}>
          <h2>Update Stages</h2>
          <div style={{overflowX: 'auto'}}>
            <table className={styles.stageTable}>
              <thead>
                <tr>
                  <th>Stage</th>
                  <th>Status</th>
                  <th>Timestamp</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {updateStages.filter(stage => {
                  const today = new Date();
                  const stageDate = new Date(stage.timestamp);
                  return stageDate.toDateString() === today.toDateString();
                }).map((stage, index) => (
                  <tr key={index}>
                    <td>{stage.stage}</td>
                    <td>{stage.status}</td>
                    <td>{new Date(stage.timestamp).toLocaleString()}</td>
                    <td>{stage.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.logWindow}>
          <h2>Log</h2>
          <pre>{log}</pre>
        </div>
      </main>
    </Layout>
  );
}