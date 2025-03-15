import mongoose from "mongoose";

const IpTrackingSchema = new mongoose.Schema({
    ipAddress: {
      type: String,
      required: true
    },
    lastClaimTime: {
      type: Date,
      required: true,
      default: Date.now
    },
    claimHistory: [{
      couponId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon'
      },
      claimTime: {
        type: Date,
        default: Date.now
      }
    }]
  });
  
export const IpTracking = mongoose.model('IpTracking', IpTrackingSchema);