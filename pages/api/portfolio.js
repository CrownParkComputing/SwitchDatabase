import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  // Authentication middleware
  const authenticateUser = (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded.userId;
    } catch (error) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return null;
    }
  };

  switch (method) {
    case 'GET':
      try {
        const userId = authenticateUser(req, res);
        if (!userId) return;

        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json(user.portfolio);
      } catch (error) {
        console.error('GET portfolio error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
      break;
    case 'POST':
      try {
        const userId = authenticateUser(req, res);
        if (!userId) return;

        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }

        const { gameId } = req.body;
        
        if (!gameId) {
          return res.status(400).json({ success: false, message: 'Game ID is required' });
        }

        if (!user.portfolio.includes(gameId)) {
          user.portfolio.push(gameId);
          await user.save();
        }
        
        res.status(200).json({ success: true, message: 'Game added to portfolio' });
      } catch (error) {
        console.error('POST portfolio error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
      break;
    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}