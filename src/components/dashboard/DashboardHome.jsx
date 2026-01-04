import React, { useState, useEffect, useContext } from 'react';
import { useOutletContext } from 'react-router';
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
  BarChart3,
  Target,
  CreditCard,
  ShoppingBag,
  PlusCircle,
  List
} from 'lucide-react';

// Recharts imports
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
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('month');
  const [chartType, setChartType] = useState('revenue');
  const [ordersCount, setOrdersCount] = useState(0);
  const [orderChartData, setOrderChartData] = useState([]);

  // Fetch user's orders from localStorage
  useEffect(() => {
    const fetchUserOrders = () => {
      try {
        // Get orders from localStorage
        const allOrders = JSON.parse(localStorage.getItem('myOrders')) || [];
        
        // Filter orders for current user
        const userOrders = allOrders.filter(order => 
          order.email === authUser?.email || 
          order.userId === authUser?.uid ||
          order.buyerEmail === authUser?.email
        );
        
        setOrdersCount(userOrders.length);
        
        // Process chart data from orders
        const monthlyData = processOrderDataForChart(userOrders);
        setOrderChartData(monthlyData);
        
        return userOrders;
      } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
      }
    };

    fetchUserOrders();
  }, [authUser]);

  // Process orders for chart data
  const processOrderDataForChart = (orders) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize data for current year
    const currentYear = new Date().getFullYear();
    const monthlyData = months.map(month => ({
      month,
      orders: 0,
      revenue: 0,
      completed: 0
    }));
    
    // Process each order
    orders.forEach(order => {
      const orderDate = new Date(order.createdAt || order.date || new Date());
      const orderMonth = orderDate.getMonth();
      const orderYear = orderDate.getFullYear();
      
      if (orderYear === currentYear) {
        monthlyData[orderMonth].orders += 1;
        monthlyData[orderMonth].revenue += parseFloat(order.price || 0);
        if (order.status === 'completed' || order.status === 'delivered') {
          monthlyData[orderMonth].completed += 1;
        }
      }
    });
    
    return monthlyData;
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      // Get user's listings from localStorage
      const userListings = JSON.parse(localStorage.getItem('myListings')) || [];
      const activeListings = userListings.filter(listing => listing.status === 'active');
      
      // Calculate total revenue from orders
      const allOrders = JSON.parse(localStorage.getItem('myOrders')) || [];
      const userOrders = allOrders.filter(order => 
        order.email === authUser?.email || 
        order.userId === authUser?.uid
      );
      
      const totalRevenue = userOrders.reduce((sum, order) => {
        return sum + (parseFloat(order.price || 0) * (parseInt(order.quantity) || 1));
      }, 0);
      
      const completedOrders = userOrders.filter(order => 
        order.status === 'completed' || order.status === 'delivered'
      ).length;
      
      const pendingOrders = userOrders.filter(order => 
        order.status === 'pending' || !order.status
      ).length;

      // Enhanced mock data with real orders count
      const mockData = authUser?.role === 'admin' ? {
        stats: [
          { 
            title: 'Total Users', 
            value: '1,254', 
            icon: Users, 
            change: '+12%', 
            color: 'from-blue-500 to-cyan-500',
            trend: 'up',
            description: 'Active accounts'
          },
          { 
            title: 'Total Orders', 
            value: '342', 
            icon: ShoppingCart, 
            change: '+8%', 
            color: 'from-green-500 to-emerald-500',
            trend: 'up',
            description: 'This month'
          },
          { 
            title: 'Revenue', 
            value: `$${totalRevenue.toLocaleString()}`, 
            icon: DollarSign, 
            change: '+23%', 
            color: 'from-purple-500 to-pink-500',
            trend: 'up',
            description: 'Total revenue'
          },
          { 
            title: 'Active Products', 
            value: '89', 
            icon: Package, 
            change: '+5%', 
            color: 'from-orange-500 to-red-500',
            trend: 'up',
            description: 'In stock'
          },
        ],
        recentActivity: [
          { 
            id: 1, 
            user: 'John Doe', 
            action: 'placed new order', 
            time: '10 min ago',
            type: 'order',
            avatarColor: 'bg-blue-500'
          },
          { 
            id: 2, 
            user: 'Jane Smith', 
            action: 'updated profile', 
            time: '25 min ago',
            type: 'profile',
            avatarColor: 'bg-green-500'
          },
          { 
            id: 3, 
            user: 'Admin', 
            action: 'added new product', 
            time: '1 hour ago',
            type: 'product',
            avatarColor: 'bg-purple-500'
          },
          { 
            id: 4, 
            user: 'Mike Johnson', 
            action: 'completed payment', 
            time: '2 hours ago',
            type: 'payment',
            avatarColor: 'bg-yellow-500'
          },
        ],
        performance: {
          website: { value: 94, label: 'Website Performance' },
          engagement: { value: 78, label: 'User Engagement' },
          satisfaction: { value: 89, label: 'Customer Satisfaction' },
          conversion: { value: 42, label: 'Conversion Rate' }
        },
        quickStats: [
          { label: 'Avg. Session', value: '4m 32s', change: '+12s' },
          { label: 'Page Views', value: '2.4K', change: '+124' },
          { label: 'Bounce Rate', value: '34%', change: '-2%' },
          { label: 'New Users', value: '187', change: '+23' }
        ]
      } : {
        // User data with REAL ORDER COUNT
        stats: [
          { 
            title: 'My Orders', 
            value: ordersCount.toString(), // Real order count
            icon: ShoppingCart, 
            change: ordersCount > 0 ? '+New' : '+0', 
            color: 'from-blue-500 to-cyan-500',
            trend: ordersCount > 0 ? 'up' : 'neutral',
            description: 'Total orders'
          },
          { 
            title: 'Pending', 
            value: pendingOrders.toString(), 
            icon: Clock, 
            change: pendingOrders > 0 ? `+${pendingOrders}` : '+0', 
            color: 'from-yellow-500 to-amber-500',
            trend: pendingOrders > 0 ? 'up' : 'down',
            description: 'Awaiting delivery'
          },
          { 
            title: 'Total Spent', 
            value: `$${totalRevenue.toFixed(2)}`, 
            icon: DollarSign, 
            change: totalRevenue > 0 ? `+$${totalRevenue}` : '+$0', 
            color: 'from-green-500 to-emerald-500',
            trend: totalRevenue > 0 ? 'up' : 'neutral',
            description: 'Lifetime value'
          },
          { 
            title: 'Active Listings', 
            value: activeListings.length.toString(), 
            icon: Package, 
            change: activeListings.length > 0 ? `+${activeListings.length}` : '+0', 
            color: 'from-purple-500 to-pink-500',
            trend: activeListings.length > 0 ? 'up' : 'neutral',
            description: 'Your listings'
          },
        ],
        recentActivity: userOrders.slice(0, 4).map((order, index) => ({
          id: index + 1,
          user: authUser?.displayName || authUser?.email?.split('@')[0] || 'You',
          product: order.productName || 'Unknown Product',
          status: order.status || 'pending',
          date: new Date(order.createdAt || order.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          }),
          type: order.type || 'order',
          icon: order.status === 'completed' ? CheckCircle : Clock,
          iconColor: order.status === 'completed' ? 'text-green-500' : 'text-yellow-500',
          price: `$${parseFloat(order.price || 0).toFixed(2)}`
        })),
        performance: {
          activity: { 
            value: Math.min(ordersCount * 10, 100), 
            label: 'Order Activity' 
          },
          completion: { 
            value: ordersCount > 0 ? Math.round((completedOrders / ordersCount) * 100) : 0, 
            label: 'Completion Rate' 
          },
          engagement: { 
            value: Math.min(activeListings.length * 15, 100), 
            label: 'Marketplace Engagement' 
          },
          satisfaction: { 
            value: ordersCount > 0 ? Math.min(85 + (completedOrders * 3), 100) : 85, 
            label: 'Your Satisfaction' 
          }
        },
        quickStats: [
          { label: 'Items Viewed', value: '47', change: '+8' },
          { label: 'Wishlist', value: '12', change: '+3' },
          { label: 'Reviews', value: '8', change: '+2' },
          { label: 'Support Tickets', value: '2', change: '-1' }
        ],
        // Real chart data from orders
        chartData: orderChartData.length > 0 ? orderChartData : [
          { month: 'Jan', orders: ordersCount, revenue: totalRevenue, completed: completedOrders },
          { month: 'Feb', orders: 0, revenue: 0, completed: 0 },
          { month: 'Mar', orders: 0, revenue: 0, completed: 0 },
          { month: 'Apr', orders: 0, revenue: 0, completed: 0 },
          { month: 'May', orders: 0, revenue: 0, completed: 0 },
          { month: 'Jun', orders: 0, revenue: 0, completed: 0 },
        ],
        pieChartData: [
          { name: 'Completed', value: completedOrders, color: '#00C49F' },
          { name: 'Pending', value: pendingOrders, color: '#FFBB28' },
          { name: 'Processing', value: ordersCount - completedOrders - pendingOrders, color: '#0088FE' },
        ].filter(item => item.value > 0)
      };
      
      setTimeout(() => {
        setDashboardData(mockData);
        setLoading(false);
      }, 800);
    };

    fetchDashboardData();
  }, [authUser?.role, ordersCount, orderChartData]);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'revenue' ? '$' : ''}{entry.value}
              {entry.name === 'revenue' ? '' : entry.name === 'orders' ? ' orders' : ''}
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Header with gradient */}
      <div className="relative rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 p-6 md:p-8 text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent rounded-full"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="h-5 w-5 text-yellow-300 animate-pulse" />
                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                  {authUser?.role === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold mb-2">
                {getGreeting()}, <span className="text-yellow-300">{authUser?.name || 'User'}!</span>
              </h1>
              <p className="text-blue-100 text-lg">
                You have {ordersCount} orders • ${dashboardData.stats[2]?.value?.replace('$', '') || '0'} total spent
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              
              <button
                onClick={refreshData}
                className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="font-medium">Refresh</span>
              </button>
            </div>
          </div>
          
          {/* Time filter buttons */}
          <div className="flex space-x-2 mt-6">
            {['today', 'week', 'month', 'year'].map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  timeFilter === filter 
                    ? 'bg-white text-blue-600 font-medium' 
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardData.stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <span className={`flex items-center space-x-1 text-sm font-medium ${
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
                  </span>
                </div>
                
                <div className="mb-2">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {stat.title}
                  </p>
                  <div className="w-8 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent group-hover:via-blue-500 transition-all duration-300"></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts and Table */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Charts Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Order Analytics
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setChartType('orders')}
                  className={`px-3 py-1 rounded-lg ${
                    chartType === 'orders' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  Orders
                </button>
                <button
                  onClick={() => setChartType('revenue')}
                  className={`px-3 py-1 rounded-lg ${
                    chartType === 'revenue' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  Revenue
                </button>
                <button
                  onClick={() => setChartType('completed')}
                  className={`px-3 py-1 rounded-lg ${
                    chartType === 'completed' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>

            {/* Bar/Line Chart */}
            <div className="h-64 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'revenue' ? (
                  <AreaChart data={dashboardData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      fill="url(#colorRevenue)"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Revenue ($)"
                    />
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                ) : chartType === 'orders' ? (
                  <BarChart data={dashboardData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar 
                      dataKey="orders" 
                      fill="#10b981" 
                      name="Total Orders"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                ) : (
                  <LineChart data={dashboardData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="completed" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Completed Orders"
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            {dashboardData.pieChartData.length > 0 && (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardData.pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dashboardData.pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Activity className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Orders
                </h3>
              </div>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                View All →
              </button>
            </div>
            
            {/* Table Structure */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {dashboardData.recentActivity.map((activity) => {
                    const IconComponent = activity.icon;
                    return (
                      <tr key={activity.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${activity.iconColor}`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div className="ml-3">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {activity.product}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {activity.user}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {activity.date}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {activity.price || '$0.00'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            activity.status === 'completed' || activity.status === 'delivered'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {activity.status?.toUpperCase() || 'PENDING'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {dashboardData.recentActivity.length === 0 && (
              <div className="p-8 text-center">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Orders Yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Start shopping to see your orders here!
                </p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Browse Marketplace
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Stats Card */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Quick Stats</h3>
                <TrendingUp className="h-5 w-5" />
              </div>
              
              <div className="space-y-4">
                {dashboardData.quickStats.map((stat, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                    <span className="text-sm">{stat.label}</span>
                    <div className="text-right">
                      <div className="font-bold text-lg">{stat.value}</div>
                      <div className={`text-xs ${
                        stat.change.startsWith('+') ? 'text-green-300' : 'text-red-300'
                      }`}>
                        {stat.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Summary */}
              <div className="mt-6 pt-4 border-t border-white/20">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Orders</span>
                  <span className="font-bold">{ordersCount}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm">Total Value</span>
                  <span className="font-bold">${dashboardData.stats[2]?.value?.replace('$', '') || '0'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/dashboard/my-orders'}
                className="flex items-center w-full p-3 text-left bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <ShoppingBag size={20} className="text-blue-600 dark:text-blue-400 mr-3" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">View All Orders</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">See your complete order history</div>
                </div>
              </button>
              
              <button
                onClick={() => window.location.href = '/dashboard/add-listing'}
                className="flex items-center w-full p-3 text-left bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                <PlusCircle size={20} className="text-green-600 dark:text-green-400 mr-3" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Add New Listing</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Sell your pet or products</div>
                </div>
              </button>
              
              <button
                onClick={() => window.location.href = '/dashboard/my-listings'}
                className="flex items-center w-full p-3 text-left bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <List size={20} className="text-purple-600 dark:text-purple-400 mr-3" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Manage Listings</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Edit or delete your listings</div>
                </div>
              </button>
            </div>
          </div>

          {/* Performance Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Performance
              </h3>
              <Target className="h-5 w-5 text-blue-500" />
            </div>
            
            <div className="space-y-6">
              {Object.entries(dashboardData.performance).map(([key, metric], index) => (
                <div key={key}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {metric.label}
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {metric.value}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out"
                      style={{ width: `${metric.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;