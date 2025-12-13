import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});


export const listingAPI = {
  
  getUserListings: (email) => 
    api.get(`/listings/user/${encodeURIComponent(email)}`),
  
  
  getAllListings: () => 
    api.get('/listings'),
  
 
  getRecentListings: () => 
    api.get('/listings/recent'),
  
  // Create listing
  createListing: (listingData) => 
    api.post('/listings', listingData),
  
  // Update listing
  updateListing: (id, updates) => 
    api.put(`/listings/${id}`, updates),
  
  // Delete listing
  deleteListing: (id) => 
    api.delete(`/listings/${id}`)
};

// Health check
export const checkBackendHealth = async () => {
  try {
    const response = await axios.get('http://localhost:5000/health');
    return {
      connected: true,
      data: response.data
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message
    };
  }
};

export default api;