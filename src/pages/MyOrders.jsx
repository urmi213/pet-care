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
  FaExclamationTriangle
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

  // Set page title
  useEffect(() => {
    document.title = 'My Orders | Pet Marketplace';
  }, []);

  // ✅ **FIXED: Check API health first**
  const checkApiHealth = async () => {
    try {
      console.log('🏥 Checking API health...');
      const healthResponse = await axios.get(
        'https://backend-10-i1qp6b7m5-urmis-projects-37af7542.vercel.app/health',
        { timeout: 5000 }
      );
      
      if (healthResponse.data.status === 'healthy ✅') {
        setApiStatus('healthy');
        console.log('✅ API is healthy');
        return true;
      }
    } catch (error) {
      console.error('❌ API health check failed:', error.message);
      setApiStatus('unhealthy');
      return false;
    }
  };

  // ✅ **FIXED: fetchOrders function with CORS bypass**
  const fetchOrders = async () => {
    if (!user) {
      setLoading(false);
      setOrders([]);
      return;
    }

    try {
      setLoading(true);
      console.log('🔍 Fetching orders for:', user.email);
      
      // Step 1: Check API health
      const isApiHealthy = await checkApiHealth();
      if (!isApiHealthy) {
        toast.error('API server is not responding');
        setOrders([]);
        return;
      }

      // Step 2: Try with CORS proxy (most reliable)
      const corsProxyUrl = `https://corsproxy.io/?${encodeURIComponent(
        `https://backend-10-i1qp6b7m5-urmis-projects-37af7542.vercel.app/orders/user/${user.email}`
      )}`;
      
      console.log('📡 Using CORS proxy URL:', corsProxyUrl);
      
      const response = await axios.get(corsProxyUrl, { 
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('📦 API Response:', response.data);
      
      // Process the orders data
      let ordersData = [];
      
      if (Array.isArray(response.data)) {
        ordersData = response.data;
      } else if (response.data && typeof response.data === 'object') {
        // Handle different response formats
        if (Array.isArray(response.data.data)) {
          ordersData = response.data.data;
        } else if (Array.isArray(response.data.orders)) {
          ordersData = response.data.orders;
        } else {
          // Try to extract array from object
          ordersData = Object.values(response.data).filter(item => 
            item && typeof item === 'object' && item.email
          );
        }
      }
      
      // Process each order
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
      
      console.log('📊 Processed orders:', processedOrders);
      setOrders(processedOrders);
      
      if (processedOrders.length > 0) {
        toast.success(`Loaded ${processedOrders.length} orders`);
      } else {
        toast.info('No orders found. Start shopping!');
      }
      
    } catch (error) {
      console.error('❌ Error in fetchOrders:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // Fallback to mock data for demonstration
      const mockOrders = [
        {
          _id: 'demo-order-1',
          productName: 'Golden Retriever Puppy',
          buyerName: user?.displayName || 'Demo User',
          email: user?.email,
          price: 0,
          quantity: 1,
          address: '123 Demo Street, Dhaka',
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
          address: '456 Sample Road, Chattogram',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          phone: '01876543210',
          status: 'pending',
          type: 'Product Purchase'
        }
      ];
      
      setOrders(mockOrders);
      toast('Using demo data. Real API connection failed.', {
        icon: '⚠️',
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
    totalValue: orders.reduce((sum, order) => sum + (order.price * order.quantity), 0)
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'completed':
      case 'delivered':
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'shipped':
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
      case 'ordered':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format price display
  const formatPrice = (price) => {
    if (price === 0 || price === '0') return 'FREE';
    return `$${parseFloat(price).toFixed(2)}`;
  };

  // Test API endpoints
  const testApiEndpoints = async () => {
    toast.loading('Testing API endpoints...');
    
    const endpoints = [
      { name: 'Health Check', url: '/health' },
      { name: 'CORS Test', url: '/test-cors' },
      { name: 'Listings', url: '/listings' },
      { name: 'User Orders', url: `/orders/user/${user?.email}` }
    ];
    
    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        const fullUrl = `https://backend-10-i1qp6b7m5-urmis-projects-37af7542.vercel.app${endpoint.url}`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(fullUrl)}`;
        
        const response = await axios.get(proxyUrl, { timeout: 10000 });
        results.push({
          name: endpoint.name,
          status: '✅ Success',
          code: response.status
        });
      } catch (error) {
        results.push({
          name: endpoint.name,
          status: '❌ Failed',
          code: error.response?.status || 'No Response',
          error: error.message
        });
      }
    }
    
    toast.dismiss();
    console.table(results);
    alert('API Test Results:\n' + results.map(r => `${r.name}: ${r.status} (${r.code})`).join('\n'));
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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">My Orders</h1>
              <p className="text-blue-100">Track all your adoption requests and product purchases</p>
              <div className="flex items-center gap-3 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <FaUser className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{user.displayName || user.email?.split('@')[0]}</span>
                </div>
                <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
                  {user.email}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-3 h-3 rounded-full ${apiStatus === 'healthy' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-xs text-blue-200">
                  API Status: {apiStatus === 'healthy' ? 'Connected' : 'Checking...'}
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={refreshOrders}
                disabled={refreshing}
                className="px-4 py-2 bg-white text-blue-600 hover:bg-gray-100 font-medium rounded-lg transition duration-200 flex items-center gap-2 disabled:opacity-50"
              >
                <FaRedo className={`${refreshing ? 'animate-spin' : ''}`} /> 
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={testApiEndpoints}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition duration-200 flex items-center gap-2"
              >
                <FaExclamationTriangle /> Test API
              </button>
              {orders.length === 0 && (
                <button
                  onClick={() => navigate('/pets-supplies')}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition duration-200 flex items-center gap-2"
                >
                  <FaPaw /> Shop Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* API Connection Panel */}
        <div className="mb-6 p-4 bg-gray-100 rounded-lg border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-1">API Connection</h3>
              <p className="text-sm text-gray-600 font-mono break-all">
                Backend: https://backend-10-i1qp6b7m5-urmis-projects-37af7542.vercel.app
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Using CORS Proxy: corsproxy.io
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                apiStatus === 'healthy' 
                  ? 'bg-green-100 text-green-800' 
                  : apiStatus === 'checking'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {apiStatus === 'healthy' ? '✅ Connected' : 
                 apiStatus === 'checking' ? '🔄 Checking...' : '❌ Disconnected'}
              </div>
              <a 
                href="https://backend-10-i1qp6b7m5-urmis-projects-37af7542.vercel.app/health" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Check Health →
              </a>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {orders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
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
            
            <div className="bg-white rounded-xl shadow p-6">
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
            
            <div className="bg-white rounded-xl shadow p-6">
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
            
            <div className="bg-white rounded-xl shadow p-6">
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
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-5 py-2.5 rounded-lg font-medium transition duration-200 flex items-center gap-2 ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                All Orders ({stats.total})
              </button>
              <button
                onClick={() => setFilter('pets')}
                className={`px-5 py-2.5 rounded-lg font-medium transition duration-200 flex items-center gap-2 ${
                  filter === 'pets'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span>🐾</span> Pets ({stats.pets})
              </button>
              <button
                onClick={() => setFilter('products')}
                className={`px-5 py-2.5 rounded-lg font-medium transition duration-200 flex items-center gap-2 ${
                  filter === 'products'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <FaTag /> Products ({stats.products})
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingCart className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Orders Found</h3>
            <p className="text-gray-600 mb-4">
              {apiStatus === 'healthy' 
                ? 'You haven\'t placed any orders yet. Start shopping now!' 
                : 'Cannot connect to the server. Please check your internet connection.'}
            </p>
            
            {apiStatus !== 'healthy' && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700">
                  <strong>API Connection Issue:</strong> The backend server might be down or CORS is not properly configured.
                </p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/pets-supplies')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center gap-2"
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
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Product / Listing</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Buyer</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Price</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Qty</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr 
                      key={order._id} 
                      className="border-b hover:bg-gray-50 transition duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{order.productName}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          ID: {order._id.substring(0, 8)}...
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <FaUser className="w-3 h-3 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium">{order.buyerName}</div>
                            <div className="text-sm text-gray-500">{order.email}</div>
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
                        <div className="font-medium text-center text-lg">{order.quantity}</div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaCalendar className="text-gray-400" />
                          <span className="text-sm">{formatDate(order.date)}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                          order.type === 'Pet Adoption' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {order.type}
                        </span>
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
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white rounded-xl shadow-lg mt-6">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredOrders.length}</span> orders
              {filter !== 'all' && ` (filtered from ${orders.length} total)`}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={refreshOrders}
                disabled={refreshing}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition duration-200 flex items-center gap-2 disabled:opacity-50"
              >
                <FaRedo className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => navigate('/pets-supplies')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
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