import { useState, useEffect, useContext, useRef } from 'react';
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
  FaGlobe,
  FaPlus,
  FaSync,
  FaFilePdf,
  FaFilter,
  FaDownload,
  FaTrash,
  FaEye,
  FaEdit,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaPrint,
  FaExternalLinkAlt
} from 'react-icons/fa';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [selectedOrders, setSelectedOrders] = useState([]);
  const navigate = useNavigate();
  const tableRef = useRef();

  const API_BASE_URL = 'https://backend-10-five.vercel.app';
  
  useEffect(() => {
    document.title = 'My Orders | Pet Marketplace';
  }, []);

  const checkLocalStorage = () => {
    try {
      const allOrders = JSON.parse(localStorage.getItem('myOrders')) || [];
      const realOrders = allOrders.filter(order => {
        const isDemoOrder = 
          order._id?.includes('demo-order-') || 
          order._id?.includes('test-') ||
          order.productName?.includes('Test Product') ||
          order.productName?.includes('Demo') ||
          order.buyerName?.includes('Demo User') ||
          order.email?.includes('test@') ||
          order.source === 'demo';
        
        return !isDemoOrder;
      });
      
      return realOrders;
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return [];
    }
  };

  const saveOrderToLocal = (orderData) => {
    try {
      const existingOrders = checkLocalStorage();
      const newOrder = {
        ...orderData,
        _id: orderData._id || `order-real-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        type: (orderData.price === 0 || orderData.price === '0') ? 'Pet Adoption' : 'Product Purchase',
        source: 'user'
      };
      
      const updatedOrders = [newOrder, ...existingOrders];
      localStorage.setItem('myOrders', JSON.stringify(updatedOrders));
      
      return newOrder;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return null;
    }
  };

  const syncWithBackend = async () => {
    if (!user?.email) return;
    
    try {
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
      
      if (response.ok) {
        let backendOrders = await response.json();
        
        if (!Array.isArray(backendOrders)) {
          if (backendOrders && Array.isArray(backendOrders.orders)) {
            backendOrders = backendOrders.orders;
          } else if (backendOrders && Array.isArray(backendOrders.data)) {
            backendOrders = backendOrders.data;
          } else {
            backendOrders = [];
          }
        }
        
        const realBackendOrders = backendOrders.filter(order => 
          !order.productName?.includes('Test') && 
          !order.productName?.includes('Demo')
        );
        
        const localOrders = checkLocalStorage();
        const allOrders = [...localOrders, ...realBackendOrders];
        const orderMap = new Map();
        
        allOrders.forEach(order => {
          const key = order._id || order.id;
          if (key && !key.includes('demo') && !key.includes('test')) {
            orderMap.set(key, order);
          }
        });
        
        const uniqueOrders = Array.from(orderMap.values());
        localStorage.setItem('myOrders', JSON.stringify(uniqueOrders));
        
        return uniqueOrders;
      }
    } catch (error) {
      console.log('Backend sync failed:', error.message);
    }
    
    return checkLocalStorage();
  };

  const checkApiHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.database && data.database.includes('connected')) {
          setApiStatus('healthy');
          return true;
        }
      }
    } catch (error) {
      console.error('API health check failed:', error);
    }
    
    setApiStatus('unhealthy');
    return false;
  };

  const fetchOrders = async (forceRefresh = false) => {
    if (!user) {
      setOrders(checkLocalStorage());
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setRefreshing(true);
      
      let localOrders = checkLocalStorage();
      setOrders(localOrders);
      
      if (localOrders.length > 0 && !forceRefresh) {
        toast.success(`Loaded ${localOrders.length} orders`);
      }

      const isApiHealthy = await checkApiHealth();
      
      if (isApiHealthy) {
        const syncedOrders = await syncWithBackend();
        if (syncedOrders && syncedOrders.length > 0) {
          setOrders(syncedOrders);
          if (syncedOrders.length > localOrders.length) {
            toast.success(`Synced ${syncedOrders.length - localOrders.length} new orders`);
          }
        }
      }
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders(checkLocalStorage());
      toast.error('Using cached orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchOrders();
    }
  }, [user, authLoading]);

  // ✅ FIXED: PDF Download Function (Working Version)
  const downloadReport = () => {
    try {
      if (filteredOrders.length === 0) {
        toast.error('No orders to download');
        return;
      }

      toast.loading('Generating PDF report...');
      
      // Dynamically load jsPDF
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.onload = () => {
        try {
          const { jsPDF } = window.jspdf;
          const doc = new jsPDF('p', 'mm', 'a4');
          
          const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          
          const userName = user?.displayName || user?.email?.split('@')[0] || 'Customer';
          const pageWidth = doc.internal.pageSize.getWidth();
          
          // Title
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(24);
          doc.setTextColor(59, 130, 246);
          doc.text('MY ORDERS REPORT', pageWidth / 2, 20, { align: 'center' });
          
          // User info
          doc.setFontSize(11);
          doc.setTextColor(100, 100, 100);
          doc.text(`Customer: ${userName}`, 20, 35);
          doc.text(`Report Date: ${currentDate}`, 20, 42);
          doc.text(`Total Orders: ${filteredOrders.length}`, 20, 49);
          
          // Calculate total value
          const totalValue = filteredOrders.reduce((sum, order) => 
            sum + (parseFloat(order.price) || 0) * (parseInt(order.quantity) || 1), 0
          );
          doc.text(`Total Value: $${totalValue.toFixed(2)}`, 150, 49, { align: 'right' });
          
          // Table header
          let yPos = 60;
          doc.setFillColor(59, 130, 246);
          doc.rect(15, yPos, 180, 10, 'F');
          
          doc.setFontSize(12);
          doc.setTextColor(255, 255, 255);
          doc.setFont('helvetica', 'bold');
          doc.text('Product', 20, yPos + 7);
          doc.text('Buyer', 70, yPos + 7);
          doc.text('Price', 100, yPos + 7);
          doc.text('Qty', 120, yPos + 7);
          doc.text('Date', 135, yPos + 7);
          doc.text('Status', 170, yPos + 7);
          
          yPos += 12;
          
          // Table rows
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'normal');
          
          filteredOrders.forEach((order, index) => {
            if (yPos > 270) {
              doc.addPage();
              yPos = 20;
            }
            
            // Alternate row colors
            if (index % 2 === 0) {
              doc.setFillColor(245, 247, 250);
              doc.rect(15, yPos, 180, 8, 'F');
            }
            
            // Product name (truncated)
            const productName = order.productName?.length > 25 
              ? order.productName.substring(0, 22) + '...' 
              : order.productName || 'N/A';
            
            // Buyer name (truncated)
            const buyerName = order.buyerName?.length > 15
              ? order.buyerName.substring(0, 12) + '...'
              : order.buyerName || 'N/A';
            
            doc.text(productName, 20, yPos + 6);
            doc.text(buyerName, 70, yPos + 6);
            doc.text(`$${parseFloat(order.price || 0).toFixed(2)}`, 100, yPos + 6);
            doc.text((order.quantity || 1).toString(), 120, yPos + 6);
            doc.text(formatDate(order.date), 135, yPos + 6);
            
            // Status with color
            const status = order.status?.toUpperCase() || 'PENDING';
            if (status === 'COMPLETED') {
              doc.setTextColor(34, 197, 94);
            } else if (status === 'PENDING') {
              doc.setTextColor(245, 158, 11);
            } else {
              doc.setTextColor(100, 100, 100);
            }
            doc.text(status, 170, yPos + 6, { align: 'right' });
            doc.setTextColor(0, 0, 0);
            
            yPos += 8;
          });
          
          // Footer
          doc.setFontSize(9);
          doc.setTextColor(150, 150, 150);
          doc.text('Generated by Pet Marketplace', pageWidth / 2, 285, { align: 'center' });
          doc.text(`Page 1 of 1`, pageWidth - 20, 285, { align: 'right' });
          
          // Save PDF
          const fileName = `Orders_${userName}_${new Date().toISOString().split('T')[0]}.pdf`;
          doc.save(fileName);
          
          toast.dismiss();
          toast.success('PDF report downloaded successfully! 🎉');
          
        } catch (error) {
          console.error('PDF generation error:', error);
          toast.dismiss();
          toast.error('Failed to generate PDF');
        }
      };
      
      script.onerror = () => {
        toast.dismiss();
        toast.error('Failed to load PDF library');
      };
      
      document.head.appendChild(script);
      
    } catch (error) {
      console.error('Error in downloadReport:', error);
      toast.dismiss();
      toast.error('Failed to generate PDF');
    }
  };

  // ✅ Alternative: Simple HTML to PDF
  const downloadSimplePDF = () => {
    try {
      if (filteredOrders.length === 0) {
        toast.error('No orders to download');
        return;
      }

      toast.loading('Creating PDF...');
      
      // Create HTML content
      const printContent = `
        <html>
          <head>
            <title>My Orders Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              h1 { color: #3b82f6; text-align: center; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th { background-color: #3b82f6; color: white; padding: 10px; text-align: left; }
              td { padding: 8px; border-bottom: 1px solid #ddd; }
              tr:nth-child(even) { background-color: #f8fafc; }
              .footer { margin-top: 30px; text-align: center; color: #666; }
              .total { font-weight: bold; margin-top: 20px; }
            </style>
          </head>
          <body>
            <h1>MY ORDERS REPORT</h1>
            <div style="margin-bottom: 20px;">
              <p><strong>Customer:</strong> ${user?.displayName || user?.email || 'Customer'}</p>
              <p><strong>Report Date:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>Total Orders:</strong> ${filteredOrders.length}</p>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Buyer Name</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${filteredOrders.map(order => `
                  <tr>
                    <td>${order.productName || 'N/A'}</td>
                    <td>${order.buyerName || 'N/A'}</td>
                    <td>$${parseFloat(order.price || 0).toFixed(2)}</td>
                    <td>${order.quantity || 1}</td>
                    <td>${formatDate(order.date)}</td>
                    <td>${order.status?.toUpperCase() || 'PENDING'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="total">
              Total Value: $${filteredOrders.reduce((sum, order) => 
                sum + (parseFloat(order.price) || 0) * (parseInt(order.quantity) || 1), 0
              ).toFixed(2)}
            </div>
            
            <div class="footer">
              Generated by Pet Marketplace
            </div>
            
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 500);
              }
            </script>
          </body>
        </html>
      `;
      
      // Create a new window and print
      const printWindow = window.open('', '_blank');
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      toast.dismiss();
      toast.success('Opening print dialog...');
      
    } catch (error) {
      console.error('Error in downloadSimplePDF:', error);
      toast.dismiss();
      toast.error('Failed to generate PDF');
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedOrders = (ordersToSort) => {
    if (!sortConfig.key) return ordersToSort;
    
    return [...ordersToSort].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      if (sortConfig.key === 'date') {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      }
      
      if (sortConfig.key === 'price') {
        aValue = parseFloat(aValue || 0);
        bValue = parseFloat(bValue || 0);
      }
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const filteredOrders = getSortedOrders(orders.filter(order => {
    let matchesFilter = true;
    if (filter === 'pets') matchesFilter = order.type === 'Pet Adoption';
    if (filter === 'products') matchesFilter = order.type === 'Product Purchase';
    if (filter === 'pending') matchesFilter = order.status === 'pending';
    if (filter === 'completed') matchesFilter = order.status === 'completed';
    
    const matchesSearch = searchTerm === '' || 
      order.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone?.includes(searchTerm);
    
    return matchesFilter && matchesSearch;
  }));

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const deleteSelectedOrders = () => {
    if (selectedOrders.length === 0) {
      toast.error('No orders selected');
      return;
    }
    
    if (window.confirm(`Delete ${selectedOrders.length} selected order(s)?`)) {
      const updatedOrders = orders.filter(order => !selectedOrders.includes(order._id));
      localStorage.setItem('myOrders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
      setSelectedOrders([]);
      toast.success(`${selectedOrders.length} order(s) deleted`);
    }
  };

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

  const formatPrice = (price) => {
    const priceNum = parseFloat(price);
    if (priceNum === 0 || isNaN(priceNum)) return 'FREE 🎁';
    return `$${priceNum.toFixed(2)}`;
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'processing':
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const stats = {
    total: orders.length,
    pets: orders.filter(o => o.type === 'Pet Adoption').length,
    products: orders.filter(o => o.type === 'Product Purchase').length,
    totalValue: orders.reduce((sum, order) => sum + (parseFloat(order.price) || 0) * (parseInt(order.quantity) || 1), 0),
    completed: orders.filter(o => o.status === 'completed').length,
    pending: orders.filter(o => o.status === 'pending').length
  };

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
          <p className="text-gray-600 mb-6">Please sign in to view your order history.</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner text="Loading your orders..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                <FaShoppingCart className="text-yellow-300" />
                My Orders
              </h1>
              <p className="text-blue-100 mb-4">Track your adoption requests and product purchases</p>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
                  <FaUser className="w-3 h-3 text-blue-600" />
                  <span className="font-medium">{user.displayName || user.email?.split('@')[0]}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${
                    apiStatus === 'healthy' ? 'bg-green-400' : 'bg-red-400'
                  }`}></div>
                  <span className="text-sm">
                    {apiStatus === 'healthy' ? '✅ Connected' : '⚠️ Offline'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {/* ✅ PDF Download Button */}
              {filteredOrders.length > 0 && (
                <>
                  <button
                    onClick={downloadReport}
                    className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-lg transition duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <FaFilePdf /> Download PDF
                  </button>
                  
                  <button
                    onClick={downloadSimplePDF}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center gap-2"
                  >
                    <FaPrint /> Print Report
                  </button>
                </>
              )}
              
              <button
                onClick={() => fetchOrders(true)}
                disabled={refreshing}
                className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg transition duration-200 flex items-center gap-2 disabled:opacity-50"
              >
                <FaSync className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> 
                {refreshing ? 'Syncing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
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
          
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
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
          
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
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
          
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
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

        <div className="mb-6 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {selectedOrders.length > 0 && (
                <button
                  onClick={deleteSelectedOrders}
                  className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition duration-200 flex items-center gap-2"
                >
                  <FaTrash /> Delete ({selectedOrders.length})
                </button>
              )}
              
              <button
                onClick={downloadReport}
                disabled={filteredOrders.length === 0}
                className="px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-lg transition duration-200 flex items-center gap-2 disabled:opacity-50"
              >
                <FaFilePdf /> Download PDF
              </button>
            </div>
          </div>
        </div>

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
              🐾 Pets ({stats.pets})
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
            <button
              onClick={() => setFilter('pending')}
              className={`px-5 py-2.5 rounded-lg font-medium transition duration-200 flex items-center gap-2 ${
                filter === 'pending'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              ⏳ Pending ({stats.pending})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-5 py-2.5 rounded-lg font-medium transition duration-200 flex items-center gap-2 ${
                filter === 'completed'
                  ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              ✅ Completed ({stats.completed})
            </button>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-2xl mx-auto border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingCart className="text-3xl text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'No orders match your search.' : 'Start shopping to see your orders here!'}
            </p>
            
            <button
              onClick={() => navigate('/pets-supplies')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <FaShoppingCart /> Browse Marketplace
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full" ref={tableRef}>
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedOrders.length === filteredOrders.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOrders(filteredOrders.map(order => order._id));
                          } else {
                            setSelectedOrders([]);
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th 
                      className="text-left px-6 py-4 font-semibold text-gray-700 cursor-pointer"
                      onClick={() => handleSort('productName')}
                    >
                      <div className="flex items-center gap-2">
                        Product Name
                        {sortConfig.key === 'productName' && (
                          sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                        )}
                      </div>
                    </th>
                    <th 
                      className="text-left px-6 py-4 font-semibold text-gray-700 cursor-pointer"
                      onClick={() => handleSort('buyerName')}
                    >
                      <div className="flex items-center gap-2">
                        Buyer Name
                        {sortConfig.key === 'buyerName' && (
                          sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                        )}
                      </div>
                    </th>
                    <th 
                      className="text-left px-6 py-4 font-semibold text-gray-700 cursor-pointer"
                      onClick={() => handleSort('price')}
                    >
                      <div className="flex items-center gap-2">
                        Price
                        {sortConfig.key === 'price' && (
                          sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                        )}
                      </div>
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Quantity</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Address</th>
                    <th 
                      className="text-left px-6 py-4 font-semibold text-gray-700 cursor-pointer"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center gap-2">
                        Date
                        {sortConfig.key === 'date' && (
                          sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                        )}
                      </div>
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Phone</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr 
                      key={order._id} 
                      className="border-b hover:bg-blue-50/30 transition duration-150"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order._id)}
                          onChange={() => toggleOrderSelection(order._id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">
                          {order.productName || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.type === 'Pet Adoption' ? '🐕 Adoption' : '🛒 Product'}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaUser className="text-gray-400 w-4 h-4" />
                          <span>{order.buyerName || 'N/A'}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="font-bold text-blue-600">
                          {formatPrice(order.price)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                          {order.quantity || 1}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 max-w-[200px]">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-gray-400 w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{order.address || 'N/A'}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaCalendar className="text-gray-400 w-4 h-4" />
                          <span>{formatDate(order.date)}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaPhone className="text-gray-400 w-4 h-4" />
                          <span>{order.phone || 'N/A'}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status?.toUpperCase() || 'PENDING'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{filteredOrders.length}</span> orders
                  {searchTerm && ` for "${searchTerm}"`}
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={downloadReport}
                    className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-lg transition duration-200 flex items-center gap-2 shadow-lg"
                  >
                    <FaFilePdf /> Download PDF
                  </button>
                  <button
                    onClick={downloadSimplePDF}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center gap-2"
                  >
                    <FaPrint /> Print Report
                  </button>
                  <button
                    onClick={() => navigate('/pets-supplies')}
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition duration-200"
                  >
                    Shop More
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;