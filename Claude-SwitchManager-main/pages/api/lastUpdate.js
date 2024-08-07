import dbConnect from '../../lib/dbConnect';
import UpdateRecord from '../../models/UpdateRecord';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    const lastUpdate = await UpdateRecord.findOne().sort({ updateDateTime: -1 });
    
    if (lastUpdate) {
      res.status(200).json({
        updateDateTime: lastUpdate.updateDateTime,
        recordsAdded: lastUpdate.recordsAdded,
      });
    } else {
      res.status(404).json({ message: 'No update records found' });
    }
  } catch (error) {
    console.error('Error fetching last update:', error);
    res.status(500).json({ message: 'Error fetching last update', error: error.message });
  }
}