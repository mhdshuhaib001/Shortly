import mongoose, { mongo } from "mongoose";

const analyticsSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "URL",
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  userAgent: String,
  ipAddress: String,
  country: String,
  city: String,
  osType: String,
  deviceType: String,
  browser: String,
  referrer: String,
  uniqueVisitorId: String
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics