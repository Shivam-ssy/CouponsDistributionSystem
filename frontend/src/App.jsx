// client/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = import.meta.env.VITE_BACKEND_API || 'http://localhost:3000/api/v1';
axios.defaults.withCredentials = true;
function App() {
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [myCoupons, setMyCoupons] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loading,setLoading]= useState(false)
  const [isError, setIsError] = useState(false);
  const [activeTab, setActiveTab] = useState('available'); 
  // Fetch available coupons and user's claimed coupons on page load
  useEffect(() => {
    const get= async()=>{
      setLoading(true)
      await fetchAvailableCoupons();
      await fetchMyCoupons();
      setLoading(false)
    }
    get()
  }, []);

  const fetchAvailableCoupons = async () => {
    try {
      const response = await axios.get(`${API_URL}/coupons/available`);
      console.log("available",response);
      
      setAvailableCoupons(response.data.data);
    } catch (error) {
      console.error('Error fetching available coupons:', error);
      setMessage('Failed to load available coupons. Please try again later.');
      setIsError(true);
    }
  };

  const fetchMyCoupons = async () => {
    try {
      const response = await axios.get(`${API_URL}/coupons/my-coupons`);
      console.log("my",response);
      
      setMyCoupons(response.data.data);
    } catch (error) {
      console.error('Error fetching claimed coupons:', error);
    }
  };

  const claimRandomCoupon = async () => {
    setIsLoading(true);
    setIsError(false);
    setMessage('');

    try {
      const response = await axios.get(`${API_URL}/coupons/claim`);

      if (response.data.success) {
        setMessage(response.data.message);
        // Refresh both coupon lists
        fetchAvailableCoupons();
        fetchMyCoupons();
        // Switch to claimed tab
        setActiveTab('claimed');
      }
    } catch (error) {
      setIsError(true);
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred while claiming your coupon. Please try again later.');
      }
      console.error('Error claiming random coupon:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const claimSpecificCoupon = async (couponId) => {
    setIsLoading(true);
    setIsError(false);
    setMessage('');

    try {
      const response = await axios.post(`${API_URL}/coupons/claim/${couponId}`);

      if (response.data.success) {
        setMessage(response.data.message);
        // Refresh both coupon lists
        fetchAvailableCoupons();
        fetchMyCoupons();
        // Switch to claimed tab
        setActiveTab('claimed');
      }
    } catch (error) {
      setIsError(true);
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred while claiming your coupon. Please try again later.');
      }
      console.error('Error claiming specific coupon:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date to readable string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Coupon Distribution System</h1>
        <p>Browse and claim special coupons for your next purchase!</p>
        <div className="coupon-count">
          <span>Available coupons: {availableCoupons?.length}</span>
          <span>Your coupons: {myCoupons?.length}</span>
        </div>
      </header>

      <main className="App-main">
        {message && (
          <div className={`message-container ${isError ? 'error' : 'success'}`}>
            <div className="message">{message}</div>
            <button className="close-message" onClick={() => setMessage('')}>×</button>
          </div>
        )}
        {
          loading && <div>Loading...</div>
        }
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            Available Coupons
          </button>
          <button 
            className={`tab ${activeTab === 'claimed' ? 'active' : ''}`}
            onClick={() => setActiveTab('claimed')}
          >
            My Coupons
          </button>
        </div>

        {activeTab === 'available' && (
          <div className="tab-content">
            <div className="random-coupon-container">
              <button 
                className="random-claim-button" 
                onClick={claimRandomCoupon} 
                disabled={isLoading || availableCoupons?.length === 0}
              >
                {isLoading ? 'Processing...' : 'Claim Random Coupon'}
              </button>
              <p className="hint">Don't know which coupon to choose? Click here for a surprise!</p>
            </div>

            {availableCoupons?.length === 0 ? (
              <div className="no-coupons">
                <p>No available coupons at this time. Please check back later.</p>
              </div>
            ) : (
              <div className="coupons-grid">
                {availableCoupons?.length && availableCoupons.map(coupon => (
                  <div key={coupon._id} className="coupon-card available">
                    <div className="coupon-header">
                      <span className="coupon-category">{coupon.category}</span>
                      <span className="coupon-expires">Expires: {formatDate(coupon.expiryDate)}</span>
                    </div>
                    <div className="coupon-code">{coupon.code}</div>
                    <div className="coupon-description">{coupon.description}</div>
                    <div className="coupon-discount">
                      {coupon.category === 'Percentage Discount' ? `${coupon.discount}% OFF` : 
                       coupon.category === 'Fixed Amount' ? `$${coupon.discount} OFF` : 
                       coupon.category === 'Free Shipping' ? 'FREE SHIPPING' : 
                       coupon.category === 'BOGO' ? 'BUY 1 GET 1 FREE' : 
                       coupon.category === 'Gift Card' ? `$${coupon.discount} GIFT CARD` : ''}
                    </div>
                    <button 
                      className="claim-button" 
                      onClick={() => claimSpecificCoupon(coupon._id)}
                      disabled={isLoading}
                    >
                      Claim This Coupon
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'claimed' && (
          <div className="tab-content">
            {myCoupons?.length === 0 ? (
              <div className="no-coupons">
                <p>You haven't claimed any coupons yet. Go to "Available Coupons" tab to claim some!</p>
                <button className="switch-tab-button" onClick={() => setActiveTab('available')}>
                  View Available Coupons
                </button>
              </div>
            ) : (
              <div className="coupons-grid">
                {myCoupons?.length && myCoupons.map(coupon => (
                  <div key={coupon._id} className="coupon-card claimed">
                    <div className="claimed-badge">Claimed</div>
                    <div className="coupon-header">
                      <span className="coupon-category">{coupon.category}</span>
                      <span className="coupon-expires">Expires: {formatDate(coupon.expiryDate)}</span>
                    </div>
                    <div className="coupon-code">{coupon.code}</div>
                    <div className="coupon-description">{coupon.description}</div>
                    <div className="coupon-discount">
                      {coupon.category === 'Percentage Discount' ? `${coupon.discount}% OFF` : 
                       coupon.category === 'Fixed Amount' ? `$${coupon.discount} OFF` : 
                       coupon.category === 'Free Shipping' ? 'FREE SHIPPING' : 
                       coupon.category === 'BOGO' ? 'BUY 1 GET 1 FREE' : 
                       coupon.category === 'Gift Card' ? `$${coupon.discount} GIFT CARD` : ''}
                    </div>
                    <div className="claimed-date">
                      Claimed on {formatDate(coupon.assignedAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="App-footer">
        <p>Round-Robin Coupon Distribution System &copy; 2025</p>
      </footer>
    </div>
  );
}

export default App;
