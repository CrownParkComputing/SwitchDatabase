import dbConnect from '../../../lib/dbConnect';
import Game from '../../../models/Game';

export default async function handler(req, res) {
  await dbConnect();

  try {
    const [yearResult, regionResult] = await Promise.all([
      Game.aggregate([
        {
          $group: {
            _id: { $substr: ['$releaseDate', 0, 4] },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: -1 } },
        { $match: { _id: { $ne: '' } } }
      ]),
      Game.aggregate([
        {
          $group: {
            _id: '$region',
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } },
        { $match: { _id: { $ne: '' } } }
      ])
    ]);

    const years = yearResult.map(y => y._id);
    const regions = regionResult.map(r => r._id);

    res.status(200).json({ years, regions });
  } catch (error) {
    console.error('Error fetching filters:', error);
    res.status(500).json({ error: 'Error fetching filters' });
  }
}