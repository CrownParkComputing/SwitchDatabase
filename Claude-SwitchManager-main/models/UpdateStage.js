import mongoose from 'mongoose';

const UpdateStageSchema = new mongoose.Schema({
  stage: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['started', 'completed', 'failed'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  details: {
    type: String,
  },
});

export default mongoose.models.UpdateStage || mongoose.model('UpdateStage', UpdateStageSchema);