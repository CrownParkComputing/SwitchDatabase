import dbConnect from '../../lib/dbConnect';
import UpdateStage from '../../models/UpdateStage';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    const stages = await UpdateStage.find().sort({ timestamp: -1 }).limit(20);
    res.status(200).json(stages);
  } catch (error) {
    console.error('Error fetching update stages:', error);
    res.status(500).json({ message: 'Error fetching update stages', error: error.message });
  }
}