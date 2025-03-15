# Coupon Distribution Project

## Introduction
This project implements a Round-Robin Coupon Distribution system with Abuse Prevention. The application distributes coupons evenly among guest users and incorporates mechanisms to prevent users from exploiting page refreshes to claim multiple coupons within a restricted time frame.

### Features
1. **Coupon Distribution:** Coupons are distributed sequentially to ensure fair allocation among users.
2. **Guest Access:** Users can access the system without the need for login or account creation.
3. **Abuse Prevention:**
   - IP Tracking: Tracks user IPs to restrict subsequent claims from the same IP within a specified time frame (e.g., one hour).
   - Cookie Tracking: Uses cookies to monitor coupon claims from the same browser session.
4. **User Feedback:** Provides clear messages for successful claims or informs users about the remaining time before claiming another coupon.
5. **Deployment:** Hosted on a public URL for live access.

## Project Structure
The project follows an MVC (Model-View-Controller) structure:
- **Controllers:** Handle business logic.
- **Middlewares:** Implement abuse prevention mechanisms.
- **Routes:** Define API endpoints.
- **Models:** Handle database operations.

### Backend Structure
- **Server:** Uses Express.js to handle API routes.
- **Middleware:**
  - `claimLimiter`: Limits the number of claims per IP.
  - `checkRecentClaims`: Verifies the time gap between subsequent claims.
  - `generateUserIdentifier`: Generates a unique identifier for the user.
- **Controllers:**
  - `claimCoupon`: Handles coupon claiming.
  - `availableCoupons`: Returns a list of available coupons.
  - `userClaimedCoupons`: Returns the coupons claimed by a user.
  - `claimCouponById`: Allows claiming a coupon using its ID.
  - `seedCoupons`: Populates the database with initial coupons.
  - `countCoupon`: Returns the total number of available coupons.

## Setup Instructions

### Frontend Setup
The frontend is built using Vite and React.

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and visit the URL provided by Vite (typically `http://localhost:5173`).

### Backend Setup
### Prerequisites
- Node.js (version 18 or higher)
- MongoDB (local or cloud instance)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Shivam-ssy/CouponsDistributionSystem.git
   cd coupon-distribution
   ```

### Folder Structure
The project repository has the following structure:
```
CouponsDistributionSystem/
├── backend/    # Backend server and APIs (Express.js)
└── frontend/   # Frontend application (Vite + React)
```

   ```bash
   git clone https://github.com/Shivam-ssy/CouponsDistributionSystem.git
   cd CouponsDistributionSystem
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env` file:
   ```env
   PORT = 3000
FRONTEND_URL=http://localhost:5173
DB_URL
   ```

4. Start the server:
   ```bash
   npm run start
   ```
6. Visit `http://localhost:3000` to access the application.

## Deployment
The application can be deployed using services like Heroku, Vercel, or any cloud provider. Ensure that environment variables are properly configured on the server.

## Abuse Prevention Strategies
1. **IP Rate Limiting:** Uses `claimLimiter` middleware to restrict the number of claims from the same IP within an hour.
2. **Cookie-Based Tracking:** Uses browser cookies to monitor claims and prevent abuse during the same session.

## License
This project is licensed under the MIT License.
