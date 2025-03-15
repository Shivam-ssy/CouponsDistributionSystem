import mongoose from 'mongoose'

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  isAssigned: {
    type: Boolean,
    default: false
  },
  assignedAt: {
    type: Date,
    default: null
  },
  assignedTo: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});
export const Coupon = mongoose.model('Coupon', CouponSchema);