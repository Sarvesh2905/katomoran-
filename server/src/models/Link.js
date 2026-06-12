import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true, index: true },
  customAlias: { type: String, unique: true, sparse: true, index: true },
  title: { type: String, trim: true },
  qrCode: { type: String },
  expiryDate: { type: Date },
  status: { 
    type: String, 
    enum: ['active', 'expired', 'disabled'], 
    default: 'active' 
  },
  clickCount: { type: Number, default: 0 },
  lastVisited: { type: Date }
}, { timestamps: true });

linkSchema.index({ createdAt: -1 });
linkSchema.index({ clickCount: -1 });

const Link = mongoose.model('Link', linkSchema);
export default Link;