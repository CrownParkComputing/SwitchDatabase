import mongoose from 'mongoose';

const UpdateRecordSchema = new mongoose.Schema({
  updateDateTime: {
    type: Date,
    default: Date.now,
  },
  recordsAdded: {
    type: Number,
    required: true,
  },
});

export default mongoose.models.UpdateRecord || mongoose.model('UpdateRecord', UpdateRecordSchema);