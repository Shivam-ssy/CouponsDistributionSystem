import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { IpTracking } from "../models/ipTracking.model.js";
export const checkRecentClaims = asyncHandler(async (req, res, next) => {
  const ipAddress = req.ip || req.connection.remoteAddress;
  const couponCookie = req.cookies.lastCouponClaim;
  const currentTime = new Date();
  const timeLimit = 60 * 60 * 1000; // 1 hour in milliseconds

  // Check cookie first (browser session tracking)
  if (couponCookie) {
    const cookieTime = new Date(couponCookie);
    const timeDiff = currentTime - cookieTime;

    if (timeDiff < timeLimit) {
      const waitTime = Math.ceil((timeLimit - timeDiff) / 60000); // minutes remaining
      throw new ApiError(
        429,
        `You recently claimed a coupon. Please wait ${waitTime} minutes before claimin another`
      );
    }
  }

  const ipRecord = await IpTracking.findOne({ ipAddress });
  if (ipRecord) {
    const timeDiff = currentTime - ipRecord.lastClaimTime;

    if (timeDiff < timeLimit) {
      const waitTime = Math.ceil((timeLimit - timeDiff) / 60000); // minutes remaining
      throw new ApiError(
        429,
        `This IP adress recently claimed a coupon. Please wait ${waitTime} minutes before claimin another`
      );
    }
  }

  next();
});
