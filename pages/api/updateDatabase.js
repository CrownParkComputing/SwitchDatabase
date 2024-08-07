import dbConnect from '../../lib/dbConnect';
import Game from '../../models/Game';
import DLC from '../../models/DLC';
import Version from '../../models/Version';
import UpdateStage from '../../models/UpdateStage';

async function recordStage(stage, status, details = '') {
  try {
    const updateStage = new UpdateStage({
      stage,
      status,
      details,
    });
    await updateStage.save();
    console.log(`Recorded stage: ${stage} - ${status}`);
  } catch (error) {
    console.error(`Error recording stage ${stage}: ${error.message}`);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { titlesUrl, versionsUrl } = req.body;

  try {

    const titlesResponse = await fetch(titlesUrl);
    const versionsResponse = await fetch(versionsUrl);
    const titlesData = await titlesResponse.json();
    const versionsData = await versionsResponse.json();

    await dbConnect();
    await recordStage('Database Connection', 'completed');

    await recordStage('Data Deletion', 'started');
    await Game.deleteMany({});
    await DLC.deleteMany({});
    await Version.deleteMany({});
    await recordStage('Data Deletion', 'completed');

    const games = [];
    const dlcs = [];
    const versions = [];

    await recordStage('Processing Titles', 'started');
    for (const [id, titleData] of Object.entries(titlesData)) {
      const defaultData = {
        ...titleData,
        releasedate: titleData.releasedate || '20200101',
        region: titleData.region || 'Unknown'
      };

      if (id.endsWith('000')) {
        games.push({ 
          ...defaultData,
          id
        });
      } else if (id && parseInt(id.slice(-3)) >= 1 && !id.endsWith('000') && !id.endsWith('800')) {
        dlcs.push({
          ...defaultData,
          id,
        });
      }
    }
    await recordStage('Processing Titles', 'completed', `Processed ${games.length} games and ${dlcs.length} DLCs`);

    await recordStage('Inserting Games', 'started');
    await Game.insertMany(games);
    await recordStage('Inserting Games', 'completed', `Inserted ${games.length} games`);

    await recordStage('Inserting DLCs', 'started');
    await DLC.insertMany(dlcs);
    await recordStage('Inserting DLCs', 'completed', `Inserted ${dlcs.length} DLCs`);

    await recordStage('Processing Versions', 'started');
    for (const [gameId, versionData] of Object.entries(versionsData)) {
      const uppercaseGameId = gameId.toUpperCase();
      versions.push({
        gameId: uppercaseGameId,
        versions: Object.entries(versionData).map(([versionNumber, releaseDate]) => ({
          versionNumber,
          releaseDate: new Date(releaseDate)
        }))
      });
    }
    await recordStage('Processing Versions', 'completed', `Processed ${versions.length} game versions`);

    await recordStage('Inserting Versions', 'started');
    await Version.insertMany(versions);
    await recordStage('Inserting Versions', 'completed', `Inserted ${versions.length} game versions`);

    const totalRecordsAdded = games.length + dlcs.length + versions.length;
    await recordStage('Update Completed', 'completed', `Total records added: ${totalRecordsAdded}`);

    res.status(200).json({ 
      message: 'Database updated successfully', 
      details: [
        `Processed ${games.length} games`,
        `Processed ${dlcs.length} DLCs`,
        `Processed ${versions.length} game versions`,
      ],
      totalRecordsAdded,
    });
  } catch (error) {
    console.error('Error in updateDatabase:', error);
    await recordStage('Update Failed', 'failed', error.message);
    res.status(500).json({ message: 'Error updating database', error: error.message });
  }
}