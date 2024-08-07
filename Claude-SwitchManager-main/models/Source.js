import mongoose from 'mongoose';

const SourceSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Please provide a source URL'],
    unique: true,
  },
  type: {
    type: String,
    required: [true, 'Please specify the source type'],
    enum: ['titles', 'versions'],
  },
});

export default mongoose.models.Source || mongoose.model('Source', SourceSchema);