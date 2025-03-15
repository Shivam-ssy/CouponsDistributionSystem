import { Router } from "express";
import { claimLimiter } from "../middlewares/claimLimiter.middleware.js";
import { checkRecentClaims } from "../middlewares/recentclaims.middleware.js";
import { availableCoupons, claimCoupon, claimCouponById, countCoupon, seedCoupons, userClaimedCoupons } from "../controllers/couponClaim.controller.js";
import { generateUserIdentifier } from "../middlewares/generateUserIdentifer.js";

const router= Router()

router.get('/claim',claimLimiter,checkRecentClaims,generateUserIdentifier,claimCoupon)
router.get('/available',generateUserIdentifier,availableCoupons)
router.get('/my-coupons',generateUserIdentifier,userClaimedCoupons)
router.post('/claim/:id',claimLimiter,generateUserIdentifier,checkRecentClaims,claimCouponById)
router.post('/seed',seedCoupons)
router.get('/count',countCoupon)


export default router