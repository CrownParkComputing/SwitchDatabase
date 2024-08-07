import dbConnect from '../../lib/dbConnect';
import Game from '../../models/Game';

export default async function handler(req, res) {
  await dbConnect();

  const { search, year, month } = req.query;

  let query = {};
  if (year && month) {
    query.releaseDate = { $regex: `^${year}${month}`, $options: 'i' };
  } else if (year) {
    query.releaseDate = { $regex: `^${year}`, $options: 'i' };
  } else if (month) {
    query.releaseDate = { $regex: `^\\d{4}${month}`, $options: 'i' };
  }
  if (search) query.name = { $regex: search, $options: 'i' };

  try {
    const games = await Game.find(query).sort({ releaseDate: -1 });
    res.status(200).json({ games });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching games' });
  }
}