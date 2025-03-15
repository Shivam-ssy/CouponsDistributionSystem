import rateLimit from "express-rate-limit";


export const claimLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, 
    message: 'Too many coupon claim attempts, please try again later'
});