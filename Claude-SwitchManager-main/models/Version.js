import mongoose from 'mongoose';

const VersionSchema = new mongoose.Schema({
  gameId: String,
  versions: [{
    versionNumber: String,
    releaseDate: Date
  }]
});

export default mongoose.models.Version || mongoose.model('Version', VersionSchema);