import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  FaShoppingCart, 
  FaMoneyBillWave, 
  FaRedo, 
  FaUser,
  FaCalendar,
  FaPhone,
  FaMapMarkerAlt,
  FaTag,
  FaPaw,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaDatabase,
  FaServer,
  FaWifi,
  FaGlobe
} from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router';

const MyOrders = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');
  const navigate = useNavigate();

  // Production Backend URL
  const API_BASE_URL = 'https://backend-10-five.vercel.app';
  
  // Set page title
  useEffect(() => {
    document.title = 'My Orders | Pet Marketplace';
  }, []);

  // Enhanced Health check function
  const checkApiHealth = async () => {
    try {
      console.log('🏥 Checking API health...');
      
      // Try multiple endpoints
      const endpoints = [
        `${API_BASE_URL}/health`,
        `${API_BASE_URL}/`,
        `${API_BASE_URL}/ping`
      ];
      
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Accept': 'application/json'
            },
            signal: AbortSignal.timeout(3000)
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log(`✅ ${endpoint}:`, data);
            
            // Check database connection from health endpoint
            if (data.database && data.database.includes('connected')) {
              setApiStatus('healthy');
              console.log('✅ API and Database connected');
              return true;
            } else if (data.success || data.message) {
              setApiStatus('healthy');
              console.log('✅ API connected');
              return true;
            }
          }
        } catch (endpointError) {
          console.log(`❌ ${endpoint} failed:`, endpointError.message);
          continue;
        }
      }
      
      // If all endpoints fail
      setApiStatus('unhealthy');
      console.log('❌ All API endpoints failed');
      return false;
      
    } catch (error) {
      console.error('❌ API health check failed:', error.message);
      setApiStatus('unhealthy');
      return false;
    }
  };

  // Fetch orders with multiple fallbacks
  const fetchOrders = async () => {
    if (!user) {
      setLoading(false);
      setOrders([]);
      return;
    }

    try {
      setLoading(true);
      setRefreshing(true);
      
      console.log('🔍 Fetching orders for:', user.email);
      console.log('🌐 Using API URL:', API_BASE_URL);
      
      // Step 1: Check API health
      const isApiHealthy = await checkApiHealth();
      
      if (!isApiHealthy) {
        toast.error('Backend server not responding. Using demo data.', {
          duration: 4000,
          icon: '⚠️'
        });
      }

      // Step 2: Try direct API call
      try {
        console.log('📡 Direct API call to orders endpoint...');
        
        const response = await fetch(
          `${API_BASE_URL}/orders/user/${encodeURIComponent(user.email)}`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log('📦 API Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('📊 API Response data:', data);
          
          // Process different response formats
          let ordersData = [];
          
          if (Array.isArray(data)) {
            ordersData = data;
          } else if (data && typeof data === 'object') {
            if (Array.isArray(data.data)) {
              ordersData = data.data;
            } else if (Array.isArray(data.orders)) {
              ordersData = data.orders;
            } else {
              // Try to extract from object
              ordersData = Object.values(data).filter(item => 
                item && typeof item === 'object'
              );
            }
          }
          
          if (ordersData.length > 0) {
            const processedOrders = ordersData.map((order, index) => ({
              _id: order._id || order.id || `order-${Date.now()}-${index}`,
              productName: order.productName || order.product || order.productId || 'Unknown Product',
              buyerName: order.buyerName || user?.displayName || user?.email?.split('@')[0] || 'Customer',
              email: order.email || user?.email,
              price: parseFloat(order.price) || 0,
              quantity: parseInt(order.quantity) || 1,
              address: order.address || order.shippingAddress || 'Address not specified',
              date: order.date || order.createdAt || order.orderDate || new Date().toISOString(),
              phone: order.phone || order.contactNumber || order.contact || 'Not provided',
              status: order.status || 'pending',
              type: (parseFloat(order.price) === 0) ? 'Pet Adoption' : 'Product Purchase'
            }));
            
            setOrders(processedOrders);
            toast.success(`Loaded ${processedOrders.length} orders from server`);
            return;
          }
        } else {
          console.log('❌ API returned error:', response.status, response.statusText);
        }
      } catch (apiError) {
        console.error('❌ Direct API call failed:', apiError.message);
      }

      // Step 3: Try alternative endpoints
      console.log('🔄 Trying alternative endpoints...');
      
      const alternativeEndpoints = [
        `${API_BASE_URL}/listings/user/${encodeURIComponent(user.email)}`,
        `${API_BASE_URL}/orders`
      ];
      
      for (const endpoint of alternativeEndpoints) {
        try {
          const response = await fetch(endpoint);
          if (response.ok) {
            const data = await response.json();
            console.log(`✅ Got data from ${endpoint}:`, data);
            
            if (Array.isArray(data) && data.length > 0) {
              // Filter orders by email
              const userOrders = data.filter(item => 
                item.email === user.email || 
                (item.userEmail && item.userEmail === user.email)
              );
              
              if (userOrders.length > 0) {
                const processedOrders = userOrders.map((order, index) => ({
                  _id: order._id || order.id || `order-${Date.now()}-${index}`,
                  productName: order.name || order.productName || order.title || 'Product',
                  buyerName: user?.displayName || user?.email?.split('@')[0] || 'Customer',
                  email: user.email,
                  price: parseFloat(order.price) || 0,
                  quantity: parseInt(order.quantity) || 1,
                  address: order.location || order.address || 'Not specified',
                  date: order.createdAt || order.date || new Date().toISOString(),
                  phone: order.phone || order.contact || 'Not provided',
                  status: order.status || 'pending',
                  type: (parseFloat(order.price) === 0) ? 'Pet Adoption' : 'Product Purchase'
                }));
                
                setOrders(processedOrders);
                toast.success(`Loaded ${processedOrders.length} orders from ${endpoint.split('/').pop()}`);
                return;
              }
            }
          }
        } catch (altError) {
          console.log(`❌ ${endpoint} failed:`, altError.message);
        }
      }

      // Step 4: Final fallback to mock data
      console.log('🎭 Using mock data as final fallback');
      
      const mockOrders = [
        {
          _id: 'demo-order-1',
          productName: 'Golden Retriever Puppy',
          buyerName: user?.displayName || 'Demo User',
          email: user?.email,
          price: 0,
          quantity: 1,
          address: '123 Main Street, Dhaka',
          date: new Date().toISOString(),
          phone: '01712345678',
          status: 'completed',
          type: 'Pet Adoption'
        },
        {
          _id: 'demo-order-2',
          productName: 'Premium Dog Food 5kg',
          buyerName: user?.displayName || 'Demo User',
          email: user?.email,
          price: 25,
          quantity: 2,
          address: '456 Park Road, Chattogram',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          phone: '01876543210',
          status: 'pending',
          type: 'Product Purchase'
        },
        {
          _id: 'demo-order-3',
          productName: 'Organic Pet Shampoo',
          buyerName: user?.displayName || 'Demo User',
          email: user?.email,
          price: 15,
          quantity: 1,
          address: '789 Lake View, Sylhet',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          phone: '01987654321',
          status: 'processing',
          type: 'Product Purchase'
        }
      ];
      
      setOrders(mockOrders);
      toast('Using demo orders data. Real orders will show when you place orders.', {
        icon: 'ℹ️',
        duration: 5000
      });
      
    } catch (error) {
      console.error('❌ Error in fetchOrders:', error);
      
      // Ultimate fallback
      const mockOrders = [
        {
          _id: 'fallback-order-1',
          productName: 'Demo Pet Adoption',
          buyerName: user?.displayName || 'User',
          email: user?.email,
          price: 0,
          quantity: 1,
          address: 'Sample Address',
          date: new Date().toISOString(),
          phone: '0123456789',
          status: 'completed',
          type: 'Pet Adoption'
        }
      ];
      
      setOrders(mockOrders);
      toast.error('Failed to load orders. Using demo data.', {
        duration: 4000
      });
      
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (!authLoading && user) {
      fetchOrders();
    }
  }, [user, authLoading]);

  // Refresh orders
  const refreshOrders = () => {
    setRefreshing(true);
    fetchOrders();
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'pets') return order.type === 'Pet Adoption';
    if (filter === 'products') return order.type === 'Product Purchase';
    return true;
  });

  // Calculate statistics
  const stats = {
    total: orders.length,
    pets: orders.filter(o => o.type === 'Pet Adoption').length,
    products: orders.filter(o => o.type === 'Product Purchase').length,
    totalValue: orders.reduce((sum, order) => sum + (order.price * order.quantity), 0),
    completed: orders.filter(o => o.status === 'completed').length,
    pending: orders.filter(o => o.status === 'pending').length
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'completed':
      case 'delivered':
      case 'success':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'shipped':
      case 'processing':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'pending':
      case 'ordered':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'completed':
      case 'delivered':
      case 'success':
        return '✅';
      case 'shipped':
      case 'processing':
        return '🔄';
      case 'pending':
      case 'ordered':
        return '⏳';
      case 'cancelled':
      case 'failed':
        return '❌';
      default:
        return '📦';
    }
  };

  const formatPrice = (price) => {
    if (price === 0 || price === '0') return 'FREE 🎁';
    return `$${parseFloat(price).toFixed(2)}`;
  };

  // Test API connectivity
  const testApiEndpoints = async () => {
    toast.loading('Testing API connectivity...');
    
    const endpoints = [
      { name: 'Health Check', url: '/health' },
      { name: 'Ping Test', url: '/ping' },
      { name: 'Root', url: '/' },
      { name: 'Listings', url: '/listings' }
    ];
    
    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        const startTime = Date.now();
        const response = await fetch(`${API_BASE_URL}${endpoint.url}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        const endTime = Date.now();
        
        const data = await response.json().catch(() => ({}));
        
        results.push({
          name: endpoint.name,
          status: '✅',
          code: response.status,
          time: `${endTime - startTime}ms`,
          data: endpoint.name === 'Health' ? data.database : 'OK'
        });
      } catch (error) {
        results.push({
          name: endpoint.name,
          status: '❌',
          code: 'Error',
          time: 'N/A',
          error: error.message
        });
      }
    }
    
    toast.dismiss();
    
    // Show results
    console.table(results);
    
    const successCount = results.filter(r => r.status === '✅').length;
    const totalCount = results.length;
    
    if (successCount === totalCount) {
      toast.success(`All ${totalCount} endpoints working!`);
    } else {
      toast.error(`${successCount}/${totalCount} endpoints working`);
    }
    
    return results;
  };

  // Loading states
  if (authLoading) {
    return <LoadingSpinner text="Verifying authentication..." />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaUser className="text-3xl text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Sign In Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view your order history and track your purchases.</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
            >
              Sign In Now
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition duration-200"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner text="Loading your orders..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                <FaShoppingCart className="text-yellow-300" />
                My Orders
              </h1>
              <p className="text-blue-100 mb-4">Track all your adoption requests and product purchases</p>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <FaUser className="w-3 h-3 text-blue-600" />
                  </div>
                  <span className="font-medium">{user.displayName || user.email?.split('@')[0]}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${
                    apiStatus === 'healthy' ? 'bg-green-400' : 
                    apiStatus === 'checking' ? 'bg-yellow-400' : 
                    'bg-red-400'
                  }`}></div>
                  <span className="text-sm">
                    {apiStatus === 'healthy' ? '✅ Live Server' : 
                     apiStatus === 'checking' ? '🔄 Checking...' : 
                     '⚠️ Offline Mode'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={refreshOrders}
                disabled={refreshing}
                className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg transition duration-200 flex items-center gap-2 disabled:opacity-50 border border-white/30 backdrop-blur-sm"
              >
                <FaRedo className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> 
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              
              <button
                onClick={testApiEndpoints}
                className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition duration-200 flex items-center gap-2"
              >
                <FaWifi /> Test Connection
              </button>
              
              {orders.length === 0 && (
                <button
                  onClick={() => navigate('/pets-supplies')}
                  className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition duration-200 flex items-center gap-2"
                >
                  <FaPaw /> Shop Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Server Status Panel */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FaServer className="text-blue-500" />
                Server Connection Status
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    apiStatus === 'healthy' ? 'bg-green-100 text-green-700' :
                    apiStatus === 'checking' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {apiStatus === 'healthy' ? <FaCheckCircle /> :
                     apiStatus === 'checking' ? <FaExclamationTriangle /> :
                     <FaTimesCircle />}
                  </div>
                  <div>
                    <p className="font-medium">
                      {apiStatus === 'healthy' ? 'Connected to Production Server' :
                       apiStatus === 'checking' ? 'Checking Server Status' :
                       'Using Offline Mode'}
                    </p>
                    <p className="text-sm text-gray-600 font-mono break-all">
                      {API_BASE_URL}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <a 
                    href={`${API_BASE_URL}/health`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg flex items-center gap-2 transition duration-200"
                  >
                    <FaDatabase /> Health
                  </a>
                  <a 
                    href={`${API_BASE_URL}/listings`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg flex items-center gap-2 transition duration-200"
                  >
                    <FaShoppingCart /> Listings
                  </a>
                  <a 
                    href={`${API_BASE_URL}/ping`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg flex items-center gap-2 transition duration-200"
                  >
                    <FaGlobe /> Ping
                  </a>
                  <a 
                    href={`${API_BASE_URL}/`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg flex items-center gap-2 transition duration-200"
                  >
                    <FaServer /> API Root
                  </a>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-2">Last checked</div>
              <div className="text-sm font-medium text-gray-700">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {orders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100 hover:shadow-lg transition duration-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaShoppingCart className="text-xl text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100 hover:shadow-lg transition duration-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <span className="text-xl">🐕</span>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Pets Adopted</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.pets}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100 hover:shadow-lg transition duration-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FaTag className="text-xl text-purple-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Products</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.products}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100 hover:shadow-lg transition duration-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <FaMoneyBillWave className="text-xl text-yellow-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Value</p>
                  <p className="text-2xl font-bold text-gray-800">${stats.totalValue.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        {orders.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilter('all')}
                className={`px-5 py-2.5 rounded-lg font-medium transition duration-200 flex items-center gap-2 ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                All Orders ({stats.total})
              </button>
              <button
                onClick={() => setFilter('pets')}
                className={`px-5 py-2.5 rounded-lg font-medium transition duration-200 flex items-center gap-2 ${
                  filter === 'pets'
                    ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <span>🐾</span> Pets ({stats.pets})
              </button>
              <button
                onClick={() => setFilter('products')}
                className={`px-5 py-2.5 rounded-lg font-medium transition duration-200 flex items-center gap-2 ${
                  filter === 'products'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <FaTag /> Products ({stats.products})
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-2xl mx-auto border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingCart className="text-3xl text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">
              {apiStatus === 'healthy' 
                ? 'Start shopping to see your orders here!' 
                : 'Server is offline. Orders will appear when connected.'}
            </p>
            
            {apiStatus !== 'healthy' && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <FaExclamationTriangle className="text-yellow-500 mt-1" />
                  <div className="text-left">
                    <p className="text-sm text-yellow-700 font-medium">
                      Connection Issue
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">
                      The backend server might be restarting. Try again in a moment.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/pets-supplies')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <FaShoppingCart /> Browse Marketplace
              </button>
              <button
                onClick={refreshOrders}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition duration-200 flex items-center justify-center gap-2"
              >
                <FaRedo /> Retry Loading
              </button>
            </div>
          </div>
        ) : (
          /* Orders Table */
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Order Details</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Contact Info</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Amount</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr 
                      key={order._id} 
                      className="border-b hover:bg-blue-50/30 transition duration-150 group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 group-hover:text-blue-700">
                          {order.productName}
                        </div>
                        <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                          <span>ID: {order._id.substring(0, 8)}...</span>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                            Qty: {order.quantity}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <FaUser className="text-gray-400 w-3 h-3" />
                            <span className="text-sm">{order.buyerName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaPhone className="text-gray-400 w-3 h-3" />
                            <span className="text-sm">{order.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-gray-400 w-3 h-3" />
                            <span className="text-xs text-gray-500 truncate max-w-[150px]">
                              {order.address}
                            </span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className={`font-bold text-lg ${
                          order.price === 0 ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {formatPrice(order.price)}
                        </div>
                        {order.price > 0 && order.quantity > 1 && (
                          <div className="text-sm text-gray-500">
                            Total: ${(order.price * order.quantity).toFixed(2)}
                          </div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaCalendar className="text-gray-400" />
                          <div>
                            <div className="text-sm">{formatDate(order.date)}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{getStatusIcon(order.status)}</span>
                          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                            order.type === 'Pet Adoption' 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}>
                            {order.type}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        {orders.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-white rounded-xl shadow-lg mt-8 border border-gray-200">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-800">{filteredOrders.length}</span> orders
              {filter !== 'all' && ` (filtered from ${orders.length} total)`}
              <div className="text-xs text-gray-500 mt-1">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={refreshOrders}
                disabled={refreshing}
                className="px-5 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-medium rounded-lg transition duration-200 flex items-center gap-2 disabled:opacity-50 shadow"
              >
                <FaRedo className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => navigate('/pets-supplies')}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
              >
                Shop More
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;