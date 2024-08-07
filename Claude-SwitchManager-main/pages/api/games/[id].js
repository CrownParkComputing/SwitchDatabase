import dbConnect from '../../../lib/dbConnect';
import Game from '../../../models/Game';
import DLC from '../../../models/DLC';
import Version from '../../../models/Version';

export default async function handler(req, res) {
  const { id } = req.query;
  await dbConnect();

  try {
    const game = await Game.findOne({ id: id });
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const dlcPrefix = id.substring(0, 12);
    const linkedDLCs = await DLC.find({ id: new RegExp(`^${dlcPrefix}`) });

    const versionInfo = await Version.findOne({ gameId: id });

    console.log('Id:', id);
    console.log('Linked DLCs:', linkedDLCs);
    console.log('Version Info:', versionInfo);

    res.status(200).json({ game, linkedDLCs, versionInfo });
  } catch (error) {
    console.error('Error fetching game and related data:', error);
    res.status(500).json({ error: 'Error fetching game and related data' });
  }
}
