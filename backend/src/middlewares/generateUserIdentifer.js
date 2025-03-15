import {v4 as uuidv4} from 'uuid';
import { asyncHandler } from '../utils/asyncHandler.js';

export const generateUserIdentifier =asyncHandler(async (req, res, next) => {
    if (!req.cookies.userIdentifier) {
      const userIdentifier = uuidv4();
      
      res.cookie('userIdentifier', userIdentifier, {
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        httpOnly: true,
        secure: true,
        sameSite: 'None'
      });
      
      req.userIdentifier = userIdentifier;
    } else {
      req.userIdentifier = req.cookies.userIdentifier;
    }
    
    next();
  });