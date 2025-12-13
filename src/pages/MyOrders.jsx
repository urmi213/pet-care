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
  FaPaw
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
  const navigate = useNavigate();

  // Set page title
  useEffect(() => {
    document.title = 'My Orders | Pet Marketplace';
  }, []);

  // Fetch REAL orders only (no mock data)
  const fetchOrders = async () => {
    if (!user) {
      setLoading(false);
      setOrders([]); // Empty array if no user
      return;
    }

    try {
      setLoading(true);
      console.log('🔍 Fetching REAL orders for:', user.email);
      console.log('📡 API URL:', `http://localhost:5000/orders/user/${user.email}`);

      // ✅ CORRECTED URL - removed /api prefix
      const response = await axios.get(
        `http://localhost:5000/orders/user/${user.email}`,  // শুধু /orders/user/:email
        { timeout: 5000 }
      );
      
      console.log('📦 Backend response:', response.data);
      
      let ordersData = [];
      
      if (response.data && Array.isArray(response.data)) {
        ordersData = response.data;
        console.log('✅ Found orders (direct array):', ordersData.length);
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        ordersData = response.data.data;
        console.log('✅ Found orders (nested data):', ordersData.length);
      } else if (response.data?.success && Array.isArray(response.data.data)) {
        ordersData = response.data.data;
        console.log('✅ Found orders (success format):', ordersData.length);
      }

      // Process the orders
      const processedOrders = ordersData.map(order => ({
        _id: order._id || order.id,
        productName: order.productName || order.product || 'Unknown Product',
        buyerName: order.buyerName || user.displayName || user.email?.split('@')[0] || 'Customer',
        email: order.email || user.email,
        price: order.price || 0,
        quantity: order.quantity || 1,
        address: order.address || order.shippingAddress || 'Address not specified',
        date: order.date || order.createdAt || new Date().toISOString(),
        phone: order.phone || order.contactNumber || 'Not provided',
        status: order.status || 'pending',
        type: order.price === 0 ? 'Pet Adoption' : 'Product'
      }));

      console.log('📊 Processed orders:', processedOrders);
      setOrders(processedOrders);
      
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // No mock data - show empty state
      setOrders([]);
      
      if (error.response?.status === 404) {
        toast.error('Orders API not found. Check backend URL.');
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        toast.error('Cannot connect to backend server.');
      } else {
        toast.error('No orders found. Place your first order!');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch - only real orders
  useEffect(() => {
    if (!authLoading) {
      fetchOrders();
    }
  }, [user, authLoading]);

  // Refresh orders
  const refreshOrders = () => {
    setRefreshing(true);
    fetchOrders();
    toast.success('Refreshing orders...');
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'pets') return order.price === 0;
    if (filter === 'products') return order.price > 0;
    return true;
  });

  // Calculate statistics
  const stats = {
    total: orders.length,
    pets: orders.filter(o => o.price === 0).length,
    products: orders.filter(o => o.price > 0).length,
    totalValue: orders.reduce((sum, order) => sum + (order.price * order.quantity), 0)
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
              <p className="text-xs text-blue-200 mt-2">
                API: http://localhost:5000/orders/user/{user.email}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={refreshOrders}
                disabled={refreshing}
                className="px-4 py-2 bg-white text-blue-600 hover:bg-gray-100 font-medium rounded-lg transition duration-200 flex items-center gap-2 disabled:opacity-50"
              >
                <FaRedo className={`${refreshing ? 'animate-spin' : ''}`} /> Refresh
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
        {/* Stats Cards - Show only if there are orders */}
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

        {/* Filter Tabs - Show only if there are orders */}
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

        {/* Empty State - When no orders */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingCart className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Browse our pets and products to make your first order!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/pets-supplies')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center gap-2"
              >
                <FaShoppingCart /> Browse Marketplace
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition duration-200"
              >
                Go to Home
              </button>
            </div>
            <div className="mt-6 text-xs text-gray-500">
              <p>API Status: <span className="font-mono">http://localhost:5000/orders/user/{user?.email}</span></p>
            </div>
          </div>
        ) : (
          /* Orders Table - When there are orders */
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Product / Listing</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Buyer</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Price</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Qty</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Address</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Phone</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Status</th>
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
                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            order.type === 'Pet Adoption' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {order.type}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <FaUser className="w-3 h-3 text-gray-600" />
                          </div>
                          <span className="font-medium">{order.buyerName}</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{order.email}</div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className={`font-bold ${
                          order.price === 0 ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {order.price === 0 ? 'FREE' : `$${order.price.toFixed(2)}`}
                        </div>
                        {order.price > 0 && order.quantity > 1 && (
                          <div className="text-sm text-gray-500">
                            Total: ${(order.price * order.quantity).toFixed(2)}
                          </div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="font-medium text-center">{order.quantity}</div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 max-w-[180px]">
                          <FaMapMarkerAlt className="text-gray-400 flex-shrink-0" />
                          <span className="text-sm truncate" title={order.address}>
                            {order.address}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaCalendar className="text-gray-400" />
                          <span className="text-sm">{formatDate(order.date)}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaPhone className="text-gray-400" />
                          <span className="text-sm font-mono">{order.phone}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Table Footer - Only show if there are orders */}
        {orders.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white rounded-xl shadow-lg mt-6">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredOrders.length}</span> orders
              {filter !== 'all' && ` (filtered from ${orders.length} total)`}
            </div>
            <button
              onClick={refreshOrders}
              disabled={refreshing}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition duration-200 flex items-center gap-2 disabled:opacity-50"
            >
              <FaRedo className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;