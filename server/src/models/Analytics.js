import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  link: { type: mongoose.Schema.Types.ObjectId, ref: 'Link', required: true, index: true },
  timestamp: { type: Date, default: Date.now, index: true },
  ipAddress: { type: String },
  userAgent: { type: String },
  device: { type: String, enum: ['mobile', 'desktop', 'tablet', 'unknown'], default: 'unknown' },
  browser: { type: String, enum: ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera', 'Other', 'Unknown'], default: 'Unknown' },
  os: { type: String, default: 'Unknown' },
  country: { type: String, default: 'Unknown' },
  state: { type: String, default: 'Unknown' },
  city: { type: String, default: 'Unknown' },
  referrer: { type: String, default: 'Direct' }
}, { timestamps: true });

analyticsSchema.index({ link: 1, timestamp: -1 });
analyticsSchema.index({ country: 1 });
analyticsSchema.index({ device: 1 });
analyticsSchema.index({ browser: 1 });
analyticsSchema.index({ referrer: 1 });

const Analytics = mongoose.model('Analytics', analyticsSchema);
export default Analytics;