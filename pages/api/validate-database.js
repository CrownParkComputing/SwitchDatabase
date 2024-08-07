import dbConnect from '../../lib/dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Attempt to connect to the database
    await dbConnect();
    
    // If successful, send a success message
    res.status(200).json({ message: 'Database connection successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error connecting to database', error: error.message });
  }
}