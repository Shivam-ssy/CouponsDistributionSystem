import mongoose from "mongoose";

const DistributionTrackerSchema = new mongoose.Schema({
    currentIndex: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  });
  
export const DistributionTracker = mongoose.model('DistributionTracker', DistributionTrackerSchema);