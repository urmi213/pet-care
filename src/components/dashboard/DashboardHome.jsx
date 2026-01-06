import React, { useState, useEffect, useContext } from 'react';
import { useOutletContext, useNavigate } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Package,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Heart,
  Star,
  RefreshCw,
  Zap,
  Calendar,
  Activity,
  Target,
  CreditCard,
  ShoppingBag,
  PlusCircle,
  List,
  MessageCircle,
  BarChart as ChartIcon,
  Filter
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import LoadingSpinner from '../../components/LoadingSpinner';

const DashboardHome = () => {
  const { user } = useOutletContext();
  const { user: authUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('month');
  const [chartType, setChartType] = useState('revenue');
  const [orders, setOrders] = useState([]);
  const [listings, setListings] = useState([]);

  // Fetch real data from localStorage/backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      try {
        // Fetch orders from localStorage/API
        const storedOrders = JSON.parse(localStorage.getItem('myOrders')) || [];
        const storedListings = JSON.parse(localStorage.getItem('myListings')) || [];
        
        // Filter for current user if not admin
        let userOrders = storedOrders;
        let userListings = storedListings;
        
        if (authUser?.role !== 'admin') {
          userOrders = storedOrders.filter(order => 
            order.email === authUser?.email || 
            order.userId === authUser?.uid ||
            order.buyerEmail === authUser?.email
          );
          
          userListings = storedListings.filter(listing => 
            listing.email === authUser?.email || 
            listing.userId === authUser?.uid
          );
        }
        
        setOrders(userOrders);
        setListings(userListings);
        
        // Calculate stats
        const totalOrders = userOrders.length;
        const completedOrders = userOrders.filter(order => 
          order.status === 'completed' || order.status === 'delivered'
        ).length;
        
        const pendingOrders = userOrders.filter(order => 
          order.status === 'pending' || !order.status
        ).length;
        
        const totalRevenue = userOrders.reduce((sum, order) => {
          return sum + (parseFloat(order.price || 0) * (parseInt(order.quantity) || 1));
        }, 0);
        
        const activeListings = userListings.filter(listing => 
          listing.status === 'active'
        ).length;
        
        const totalListings = userListings.length;
        
        // Process chart data
        const monthlyData = processChartData(userOrders, timeFilter);
        
        // Prepare dashboard data based on role
        const data = {
          stats: authUser?.role === 'admin' ? [
            { 
              title: 'Total Users', 
              value: '1,254', 
              icon: Users, 
              change: '+12%', 
              color: 'from-blue-500 to-cyan-500',
              trend: 'up',
              description: 'Registered users'
            },
            { 
              title: 'Total Orders', 
              value: totalOrders.toString(), 
              icon: ShoppingCart, 
              change: totalOrders > 0 ? `+${Math.floor(totalOrders * 0.2)}` : '+0', 
              color: 'from-green-500 to-emerald-500',
              trend: 'up',
              description: 'All orders'
            },
            { 
              title: 'Total Revenue', 
              value: `$${totalRevenue.toLocaleString()}`, 
              icon: DollarSign, 
              change: `+$${Math.floor(totalRevenue * 0.15)}`, 
              color: 'from-purple-500 to-pink-500',
              trend: 'up',
              description: 'Platform revenue'
            },
            { 
              title: 'Active Listings', 
              value: totalListings.toString(), 
              icon: Package, 
              change: activeListings > 0 ? `+${activeListings}` : '+0', 
              color: 'from-orange-500 to-red-500',
              trend: 'up',
              description: 'Available listings'
            },
          ] : [
            { 
              title: 'My Orders', 
              value: totalOrders.toString(), 
              icon: ShoppingCart, 
              change: totalOrders > 0 ? '+New' : '+0', 
              color: 'from-blue-500 to-cyan-500',
              trend: totalOrders > 0 ? 'up' : 'neutral',
              description: 'Your total orders'
            },
            { 
              title: 'Completed', 
              value: completedOrders.toString(), 
              icon: CheckCircle, 
              change: completedOrders > 0 ? `+${completedOrders}` : '+0', 
              color: 'from-green-500 to-emerald-500',
              trend: completedOrders > 0 ? 'up' : 'neutral',
              description: 'Delivered orders'
            },
            { 
              title: 'Total Spent', 
              value: `$${totalRevenue.toFixed(2)}`, 
              icon: DollarSign, 
              change: totalRevenue > 0 ? `+$${totalRevenue}` : '+$0', 
              color: 'from-purple-500 to-pink-500',
              trend: totalRevenue > 0 ? 'up' : 'neutral',
              description: 'Lifetime spending'
            },
            { 
              title: 'Active Listings', 
              value: activeListings.toString(), 
              icon: Package, 
              change: activeListings > 0 ? `+${activeListings}` : '+0', 
              color: 'from-orange-500 to-yellow-500',
              trend: activeListings > 0 ? 'up' : 'neutral',
              description: 'Your listings'
            },
          ],
          chartData: monthlyData,
          recentOrders: userOrders.slice(0, 5).map((order, index) => ({
            id: order.id || index + 1,
            orderId: `#${order.id || 'ORD' + (1000 + index)}`,
            product: order.productName || order.title || 'Unknown Product',
            date: new Date(order.createdAt || order.date || new Date()).toLocaleDateString(),
            amount: `$${parseFloat(order.price || 0).toFixed(2)}`,
            status: order.status || 'pending',
            customer: order.buyerName || 'Customer'
          })),
          performance: authUser?.role === 'admin' ? [
            { label: 'Conversion Rate', value: 65, color: 'from-blue-500 to-cyan-500' },
            { label: 'User Satisfaction', value: 89, color: 'from-green-500 to-emerald-500' },
            { label: 'Revenue Growth', value: 42, color: 'from-purple-500 to-pink-500' },
            { label: 'Platform Uptime', value: 99.9, color: 'from-orange-500 to-red-500' },
          ] : [
            { label: 'Order Completion', value: totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0, color: 'from-blue-500 to-cyan-500' },
            { label: 'Response Rate', value: 92, color: 'from-green-500 to-emerald-500' },
            { label: 'Profile Strength', value: 78, color: 'from-purple-500 to-pink-500' },
            { label: 'Satisfaction Score', value: 88, color: 'from-orange-500 to-yellow-500' },
          ],
          quickActions: [
            { 
              title: 'View All Orders', 
              icon: ShoppingBag, 
              color: 'blue',
              path: '/dashboard/my-orders',
              description: 'See complete history'
            },
            { 
              title: 'Add New Listing', 
              icon: PlusCircle, 
              color: 'green',
              path: '/dashboard/add-listing',
              description: 'Sell your pet/products'
            },
            { 
              title: 'Manage Listings', 
              icon: List, 
              color: 'purple',
              path: '/dashboard/my-listings',
              description: 'Edit or delete'
            },
            { 
              title: 'Analytics', 
              icon: ChartIcon, 
              color: 'orange',
              path: '/dashboard/analytics',
              description: 'View insights'
            },
          ]
        };
        
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [authUser, timeFilter]);

  // Process chart data
  const processChartData = (orders, filter) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    if (filter === 'today') {
      // Today's data by hour
      return Array.from({ length: 12 }, (_, i) => ({
        time: `${i * 2}:00`,
        orders: Math.floor(Math.random() * 10),
        revenue: Math.floor(Math.random() * 500)
      }));
    } else if (filter === 'week') {
      // Weekly data
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return days.map(day => ({
        day,
        orders: Math.floor(Math.random() * 20),
        revenue: Math.floor(Math.random() * 1000)
      }));
    } else {
      // Monthly data (default)
      return months.slice(0, 6).map(month => ({
        month,
        orders: Math.floor(Math.random() * 50),
        revenue: Math.floor(Math.random() * 5000),
        completed: Math.floor(Math.random() * 40)
      }));
    }
  };

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span> {entry.name === 'revenue' ? '$' : ''}{entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading || !dashboardData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Welcome back, <span className="text-blue-600">{user?.name}!</span>
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your {authUser?.role === 'admin' ? 'platform' : 'account'} today.
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {['today', 'week', 'month'].map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  timeFilter === filter 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
          
          <button
            onClick={refreshData}
            disabled={loading}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardData.stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-md`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' :
                  stat.trend === 'down' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : stat.trend === 'down' ? (
                    <ArrowDownRight className="h-4 w-4" />
                  ) : null}
                  <span>{stat.change}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-gray-900 font-medium">{stat.title}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Performance Overview</h2>
              <p className="text-gray-600 text-sm">Based on your {timeFilter}ly data</p>
            </div>
            
            <div className="flex items-center space-x-2 mt-3 sm:mt-0">
              <div className="flex bg-gray-100 p-1 rounded-lg">
                {['revenue', 'orders', 'completed'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md capitalize ${
                      chartType === type 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'revenue' ? (
                <AreaChart data={dashboardData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis 
                    dataKey={timeFilter === 'today' ? 'time' : timeFilter === 'week' ? 'day' : 'month'} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fill="url(#colorRevenue)"
                    name="Revenue ($)"
                  />
                </AreaChart>
              ) : chartType === 'orders' ? (
                <BarChart data={dashboardData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis 
                    dataKey={timeFilter === 'today' ? 'time' : timeFilter === 'week' ? 'day' : 'month'} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="orders" 
                    fill="#10b981" 
                    radius={[4, 4, 0, 0]}
                    name="Orders"
                  />
                </BarChart>
              ) : (
                <LineChart data={dashboardData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis 
                    dataKey={timeFilter === 'today' ? 'time' : timeFilter === 'week' ? 'day' : 'month'} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Completed Orders"
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Metrics</h2>
          
          <div className="space-y-6">
            {dashboardData.performance.map((metric, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                  <span className="text-sm font-bold text-gray-900">{metric.value}{metric.label.includes('Rate') ? '%' : ''}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-2.5 rounded-full bg-gradient-to-r ${metric.color}`}
                    style={{ width: `${metric.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {dashboardData.quickActions.map((action, index) => {
                const Icon = action.icon;
                const colorClasses = {
                  blue: 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100',
                  green: 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100',
                  purple: 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100',
                  orange: 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100',
                };
                
                return (
                  <button
                    key={index}
                    onClick={() => navigate(action.path)}
                    className={`p-3 border rounded-lg text-left transition-colors ${colorClasses[action.color]}`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5" />
                      <div>
                        <div className="font-medium text-sm">{action.title}</div>
                        <div className="text-xs opacity-75">{action.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <p className="text-gray-600 text-sm">Your latest transactions</p>
          </div>
          <button
            onClick={() => navigate('/dashboard/my-orders')}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View All →
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dashboardData.recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{order.orderId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{order.product}</div>
                    <div className="text-xs text-gray-500">{order.customer}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{order.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/dashboard/my-orders/${order.id}`)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {dashboardData.recentOrders.length === 0 && (
            <div className="p-8 text-center">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
              <p className="text-gray-600 mb-4">Start shopping to see your orders here!</p>
              <button
                onClick={() => navigate('/pets-supplies')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Browse Marketplace
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;