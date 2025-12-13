import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  FaFilePdf, 
  FaShoppingCart, 
  FaMoneyBillWave, 
  FaRedo, 
  FaPlus,
  FaFilter,
  FaDownload,
  FaUser,
  FaCalendar,
  FaPhone,
  FaMapMarkerAlt,
  FaTag
} from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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

  // Fetch orders 
  const fetchOrders = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('🔍 Fetching orders for:', user.email);

      let ordersData = [];
      try {
        const response = await axios.get(
          `http://localhost:5000/api/orders/user/${user.email}`,
          { timeout: 5000 }
        );
        
        if (Array.isArray(response.data)) {
          ordersData = response.data;
        } else if (response.data?.data) {
          ordersData = response.data.data;
        }
        
        console.log('✅ Real orders:', ordersData.length);
      } catch (backendError) {
        console.log('Backend unavailable, using mock data');
        
        ordersData = getMockOrders();
      }

      const processedOrders = ordersData.map(order => ({
        _id: order._id || `order-${Date.now()}-${Math.random()}`,
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

      setOrders(processedOrders);
      
    } catch (error) {
      console.error('Error fetching orders:', error);
     
      setOrders(getMockOrders());
      toast.error('Using demo data. Backend server not available.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getMockOrders = () => {
    const mockOrders = [
      {
        _id: 'order-1',
        productName: 'Golden Retriever Puppy',
        buyerName: user?.displayName || 'John Doe',
        email: user?.email || 'john@example.com',
        price: 0,
        quantity: 1,
        address: '123 Main St, Dhaka 1212',
        date: '2024-01-15',
        phone: '01712345678',
        status: 'completed',
        type: 'Pet Adoption'
      },
      {
        _id: 'order-2',
        productName: 'Premium Dog Food 5kg',
        buyerName: user?.displayName || 'John Doe',
        email: user?.email || 'john@example.com',
        price: 25,
        quantity: 2,
        address: '123 Main St, Dhaka 1212',
        date: '2024-01-10',
        phone: '01712345678',
        status: 'delivered',
        type: 'Product'
      },
      {
        _id: 'order-3',
        productName: 'Cat Scratching Post',
        buyerName: user?.displayName || 'John Doe',
        email: user?.email || 'john@example.com',
        price: 35,
        quantity: 1,
        address: '123 Main St, Dhaka 1212',
        date: '2024-01-05',
        phone: '01712345678',
        status: 'shipped',
        type: 'Product'
      },
      {
        _id: 'order-4',
        productName: 'Persian Kitten',
        buyerName: user?.displayName || 'John Doe',
        email: user?.email || 'john@example.com',
        price: 150,
        quantity: 1,
        address: '123 Main St, Dhaka 1212',
        date: '2023-12-20',
        phone: '01712345678',
        status: 'completed',
        type: 'Pet Adoption'
      },
      {
        _id: 'order-5',
        productName: 'Pet Shampoo',
        buyerName: user?.displayName || 'John Doe',
        email: user?.email || 'john@example.com',
        price: 12,
        quantity: 3,
        address: '123 Main St, Dhaka 1212',
        date: '2023-12-15',
        phone: '01712345678',
        status: 'pending',
        type: 'Product'
      }
    ];
    
    return mockOrders;
  };

  // Initial fetch
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

  // Create test order
  const createTestOrder = () => {
    const testOrder = {
      _id: `test-${Date.now()}`,
      productName: 'Test Product - Pet Toys',
      buyerName: user?.displayName || 'Test User',
      email: user?.email,
      price: 19.99,
      quantity: 1,
      address: '456 Test Avenue, Dhaka',
      date: new Date().toISOString().split('T')[0],
      phone: '01876543210',
      status: 'pending',
      type: 'Product'
    };
    
    setOrders(prev => [testOrder, ...prev]);
    toast.success('Test order added successfully!');
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'pets') return order.price === 0;
    if (filter === 'products') return order.price > 0;
    return true;
  });

  // Generate PDF Report
  const generatePDF = () => {
    if (filteredOrders.length === 0) {
      toast.error('No orders to export');
      return;
    }

    try {
      const doc = new jsPDF();
      
      // Title and Header
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text('PET MARKETPLACE - ORDER REPORT', 20, 20);
      
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text(`Customer: ${user?.displayName || user?.email || 'User'}`, 20, 30);
      doc.text(`Report Date: ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`, 20, 37);
      doc.text(`Total Orders: ${filteredOrders.length}`, 20, 44);
      
      // Prepare table data
      const tableData = filteredOrders.map((order, index) => [
        index + 1,
        order.productName,
        order.buyerName,
        order.type,
        order.quantity,
        order.price === 0 ? 'FREE' : `$${order.price.toFixed(2)}`,
        `$${(order.price * order.quantity).toFixed(2)}`,
        order.address,
        order.date.split('T')[0],
        order.phone,
        order.status.toUpperCase()
      ]);
      
      // Create table
      autoTable(doc, {
        startY: 50,
        head: [
          ['#', 'Product Name', 'Buyer', 'Type', 'Qty', 'Unit Price', 'Total', 'Address', 'Date', 'Phone', 'Status']
        ],
        body: tableData,
        theme: 'grid',
        headStyles: { 
          fillColor: [59, 130, 246],
          textColor: 255,
          fontSize: 10,
          fontStyle: 'bold'
        },
        bodyStyles: { fontSize: 9 },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
          0: { cellWidth: 10 },  // #
          1: { cellWidth: 35 },  // Product Name
          2: { cellWidth: 25 },  // Buyer
          3: { cellWidth: 20 },  // Type
          4: { cellWidth: 15 },  // Qty
          5: { cellWidth: 20 },  // Unit Price
          6: { cellWidth: 20 },  // Total
          7: { cellWidth: 40 },  // Address
          8: { cellWidth: 25 },  // Date
          9: { cellWidth: 25 },  // Phone
          10: { cellWidth: 20 }  // Status
        },
        margin: { left: 20 },
        styles: { overflow: 'linebreak', cellPadding: 2 },
        didDrawPage: (data) => {
          // Footer
          doc.setFontSize(10);
          doc.setTextColor(150, 150, 150);
          doc.text(
            `Page ${data.pageNumber}`,
            data.settings.margin.left,
            doc.internal.pageSize.height - 10
          );
        }
      });
      
      // Save PDF
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `orders-report-${user?.email?.split('@')[0] || 'user'}-${timestamp}.pdf`;
      doc.save(filename);
      
      toast.success('PDF report downloaded successfully!');
      
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF');
    }
  };

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
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={createTestOrder}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg transition duration-200 flex items-center gap-2"
              >
                <FaPlus /> Add Test Order
              </button>
              <button
                onClick={refreshOrders}
                disabled={refreshing}
                className="px-4 py-2 bg-white text-blue-600 hover:bg-gray-100 font-medium rounded-lg transition duration-200 flex items-center gap-2 disabled:opacity-50"
              >
                <FaRedo className={`${refreshing ? 'animate-spin' : ''}`} /> Refresh
              </button>
              {filteredOrders.length > 0 && (
                <button
                  onClick={generatePDF}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition duration-200 flex items-center gap-2"
                >
                  <FaFilePdf /> Export PDF
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
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

        {/* Filter Tabs */}
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
              <FaFilter /> All Orders ({stats.total})
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

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingCart className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Orders Found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't placed any orders yet. Browse our pets and products to get started!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/pets-supplies')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center gap-2"
              >
                <FaShoppingCart /> Browse Marketplace
              </button>
              <button
                onClick={createTestOrder}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center gap-2"
              >
                <FaPlus /> Add Test Order
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
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
            
            {/* Table Footer */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white rounded-xl shadow-lg">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredOrders.length}</span> orders
                {filter !== 'all' && ` (filtered from ${orders.length} total)`}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={refreshOrders}
                  disabled={refreshing}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition duration-200 flex items-center gap-2 disabled:opacity-50"
                >
                  <FaRedo className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button
                  onClick={generatePDF}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition duration-200 flex items-center gap-2"
                >
                  <FaDownload /> Download PDF Report
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyOrders;