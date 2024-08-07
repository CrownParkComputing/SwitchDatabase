import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
  id: String,
  bannerUrl: String,
  name: String,
  size: Number,
  region: String,
  releaseDate: String,
  description: String,
  developer: String,
  publisher: String,
  category: [String],
  languages: [String],
  numberOfPlayers: Number,
  rating: Number,
  screenshots: { type: [String], required: false }
});

export default mongoose.models.Game || mongoose.model('Game', GameSchema);