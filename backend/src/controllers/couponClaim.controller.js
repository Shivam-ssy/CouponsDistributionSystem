import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { DistributionTracker } from "../models/distributionTracker.model.js";
import { IpTracking } from "../models/ipTracking.model.js";
import { Coupon } from "../models/coupon.model.js";

const availableCoupons = asyncHandler(async (req, res, next) => {
  const availableCoupons = await Coupon.find({ isAssigned: false })
    .select("code description discount category expiryDate")
    .sort({ category: 1, discount: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, availableCoupons, "Available coupons"));
});

const userClaimedCoupons = asyncHandler(async (req, res, next) => {
  const userIdentifier = req.userIdentifier;
  console.log(userIdentifier);

  const claimedCoupons = await Coupon.find({
    isAssigned: true,
    assignedTo: userIdentifier,
  }).sort({ assignedAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, claimedCoupons, "User Claimed Coupons"));
});

const claimCouponById = asyncHandler(async (req, res, next) => {
  const couponId = req.params.id;
  const ipAddress = req.ip || req.connection.remoteAddress;
  const userIdentifier = req.userIdentifier;

  // Find the specific coupon
  const coupon = await Coupon.findById(couponId);

  if (!coupon) {
    throw new ApiError(404, "coupon not found");
  }

  if (coupon.isAssigned) {
    throw new ApiError(400, "this coupon has already been claimed ");
  }

  // Update the coupon
  coupon.isAssigned = true;
  coupon.assignedAt = new Date();
  coupon.assignedTo = userIdentifier;
  await coupon.save();

  // Update or create IP tracking record
  let ipRecord = await IpTracking.findOne({ ipAddress });
  if (!ipRecord) {
    ipRecord = new IpTracking({
      ipAddress,
      lastClaimTime: new Date(),
      claimHistory: [{ couponId: coupon._id }],
    });
  } else {
    ipRecord.lastClaimTime = new Date();
    ipRecord.claimHistory.push({ couponId: coupon._id });
  }
  await ipRecord.save();

  // Set cookie for browser tracking
  res.cookie("lastCouponClaim", new Date(), {
    maxAge: 60 * 60 * 1000, // 1 hour
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        code: coupon.code,
        description: coupon.description,
        discount: coupon.discount,
        category: coupon.category,
        expiryDate: coupon.expiryDate,
      },
      "Claimed successfully"
    )
  );
});
const claimCoupon = asyncHandler(async (req, res, next) => {
  const ipAddress = req.ip || req.connection.remoteAddress;
  const userIdentifier = req.userIdentifier;

  let tracker = await DistributionTracker.findOne();
  if (!tracker) {
    tracker = new DistributionTracker({ currentIndex: 0 });
    await tracker.save();
  }

  // Find all available coupons
  const availableCoupons = await Coupon.find({ isAssigned: false });

  if (availableCoupons.length === 0) {
    throw new ApiError(404, "No coupons available at this time");
  }

  // Get next coupon in round-robin fashion
  const couponIndex = tracker.currentIndex % availableCoupons.length;
  const selectedCoupon = availableCoupons[couponIndex];

  selectedCoupon.isAssigned = true;
  selectedCoupon.assignedAt = new Date();
  selectedCoupon.assignedTo = userIdentifier;
  await selectedCoupon.save();

  tracker.currentIndex = tracker.currentIndex + 1;
  tracker.lastUpdated = new Date();
  await tracker.save();

  let ipRecord = await IpTracking.findOne({ ipAddress });
  if (!ipRecord) {
    ipRecord = new IpTracking({
      ipAddress,
      lastClaimTime: new Date(),
      claimHistory: [{ couponId: selectedCoupon._id }],
    });
  } else {
    ipRecord.lastClaimTime = new Date();
    ipRecord.claimHistory.push({ couponId: selectedCoupon._id });
  }
  await ipRecord.save();

  // Set cookie for browser tracking
  res.cookie("lastCouponClaim", new Date(), {
    maxAge: 60 * 60 * 1000, // 1 hour
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        code: selectedCoupon.code,
        description: selectedCoupon.description,
        discount: selectedCoupon.discount,
        category: selectedCoupon.category,
        expiryDate: selectedCoupon.expiryDate,
      },
      "Coupon claimed successfully!"
    )
  );
});

const seedCoupons = asyncHandler(async (req, res, next) => {
  const today = new Date();
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(today.getMonth() + 1);

  const twoMonthsLater = new Date();
  twoMonthsLater.setMonth(today.getMonth() + 2);

  const coupons = [
    {
      code: "DISCOUNT10",
      description: "10% off your next purchase",
      discount: 10,
      category: "Percentage Discount",
      expiryDate: oneMonthLater,
    },
    {
      code: "FREESHIP",
      description: "Free shipping on orders over $50",
      discount: 0,
      category: "Free Shipping",
      expiryDate: twoMonthsLater,
    },
    {
      code: "BOGO2023",
      description: "Buy one get one free",
      discount: 100,
      category: "BOGO",
      expiryDate: oneMonthLater,
    },
    {
      code: "WELCOME25",
      description: "25% off for new customers",
      discount: 25,
      category: "Percentage Discount",
      expiryDate: twoMonthsLater,
    },
    {
      code: "HOLIDAY50",
      description: "$50 off orders over $200",
      discount: 50,
      category: "Fixed Amount",
      expiryDate: oneMonthLater,
    },
    {
      code: "FLASH30",
      description: "30% off flash sale",
      discount: 30,
      category: "Percentage Discount",
      expiryDate: oneMonthLater,
    },
    {
      code: "TECH15",
      description: "15% off electronics",
      discount: 15,
      category: "Percentage Discount",
      expiryDate: twoMonthsLater,
    },
    {
      code: "SUMMER10",
      description: "10% off summer collection",
      discount: 10,
      category: "Percentage Discount",
      expiryDate: twoMonthsLater,
    },
    {
      code: "BULK20",
      description: "20% off orders over $500",
      discount: 20,
      category: "Percentage Discount",
      expiryDate: oneMonthLater,
    },
    {
      code: "GIFT25",
      description: "$25 gift card with purchase",
      discount: 25,
      category: "Gift Card",
      expiryDate: twoMonthsLater,
    },
  ];

  await Coupon.deleteMany({}); // Clear existing coupons
  await Coupon.insertMany(coupons);

  res.status(201).json(new ApiResponse(201, null, "created successfully"));
});

const countCoupon = asyncHandler(async (req, res, next) => {
  const count = await Coupon.countDocuments({ isAssigned: false });
  res.status(200).json(new ApiResponse(200, count, "Successfully fetched"));
});

export {
  claimCoupon,
  seedCoupons,
  countCoupon,
  availableCoupons,
  userClaimedCoupons,
  claimCouponById,
};
