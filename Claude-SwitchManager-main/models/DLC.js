import mongoose from 'mongoose';

const DLCSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  size: Number,
  releaseDate: String,
  price: Number,
});

export default mongoose.models.DLC || mongoose.model('DLC', DLCSchema);