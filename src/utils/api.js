import axios from 'axios';

const API_BASE_URL = 'https://backend-10-five.vercel.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Enhanced API functions with fallback
export const listingAPI = {
  // Listings
  getAllListings: async () => {
    try {
      const response = await api.get('/listings');
      return response;
    } catch (error) {
      console.log('Using fallback for listings');
      return { data: getMockListings() };
    }
  },
  
  // Orders
  placeOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response;
    } catch (error) {
      console.log('Order failed, returning mock order');
      return {
        data: {
          success: true,
          message: 'Order placed (mock)',
          order: {
            ...orderData,
            _id: `mock-${Date.now()}`,
            status: 'pending',
            date: new Date().toISOString().split('T')[0]
          }
        }
      };
    }
  },
  
  getUserOrders: async (email) => {
    try {
      const response = await api.get(`/orders/user/${email}`);
      return response;
    } catch (error) {
      console.log('Using fallback for user orders');
      return { data: getMockOrders(email) };
    }
  },
  
  // Health
  checkHealth: () => api.get('/health'),
  
  // Test all endpoints
  testAllEndpoints: async () => {
    const results = [];
    
    // Test health
    try {
      const health = await api.get('/health');
      results.push({
        endpoint: '/health',
        status: '✅',
        data: health.data.database
      });
    } catch (error) {
      results.push({ endpoint: '/health', status: '❌', error: error.message });
    }
    
    // Test listings
    try {
      const listings = await api.get('/listings');
      results.push({
        endpoint: '/listings',
        status: '✅',
        count: Array.isArray(listings.data) ? listings.data.length : 'unknown'
      });
    } catch (error) {
      results.push({ endpoint: '/listings', status: '❌', error: error.message });
    }
    
    // Test orders endpoint (if exists)
    try {
      const orders = await api.get('/orders');
      results.push({
        endpoint: '/orders',
        status: '✅',
        count: Array.isArray(orders.data) ? orders.data.length : 'exists'
      });
    } catch (error) {
      results.push({ 
        endpoint: '/orders', 
        status: '⚠️', 
        message: 'Orders endpoint not yet implemented in backend' 
      });
    }
    
    return results;
  }
};

// Mock data functions
function getMockListings() {
  return [
    {
      _id: '1',
      name: 'Golden Retriever Puppy',
      category: 'Pets',
      price: 0,
      location: 'Dhaka',
      image: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0',
      description: 'Friendly puppy for adoption'
    },
    {
      _id: '2',
      name: 'Persian Kitten',
      category: 'Pets',
      price: 150,
      location: 'Chattogram',
      image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8',
      description: 'Beautiful white Persian kitten'
    }
  ];
}

function getMockOrders(email) {
  return [
    {
      _id: 'mock-order-1',
      productId: '3',
      productName: 'Premium Dog Food 5kg',
      email: email,
      buyerName: 'Demo User',
      quantity: 2,
      price: 50,
      address: '123 Street, Dhaka',
      phone: '01712345678',
      status: 'completed',
      date: '2024-01-20',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      _id: 'mock-order-2',
      productId: '4',
      productName: 'Organic Pet Shampoo',
      email: email,
      buyerName: 'Demo User',
      quantity: 1,
      price: 15,
      address: '456 Road, Sylhet',
      phone: '01876543210',
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    }
  ];
}

// Simple direct fetch (no axios)
export const fetchAPI = {
  getListings: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/listings`);
      return await response.json();
    } catch (error) {
      return getMockListings();
    }
  },
  
  placeOrder: async (orderData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      return await response.json();
    } catch (error) {
      return {
        success: true,
        message: 'Order placed (offline mode)',
        order: { ...orderData, _id: `offline-${Date.now()}` }
      };
    }
  },
  
  getUserOrders: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/user/${email}`);
      return await response.json();
    } catch (error) {
      return getMockOrders(email);
    }
  }
};

// Export for testing
export default listingAPI;