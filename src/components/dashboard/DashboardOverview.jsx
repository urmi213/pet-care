import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp,
  ShoppingCart,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Filter,
  Calendar,
  MoreVertical,
  ArrowUp,
  ArrowDown,
  Eye,
  Edit,
  Trash2
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
  ResponsiveContainer
} from 'recharts';
import { useOutletContext } from 'react-router';
import axios from 'axios';

const DashboardOverview = () => {
  const { user } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [activeChart, setActiveChart] = useState('revenue');
  
  // State for all data
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);

  // API base URL
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch stats
        const statsResponse = await axios.get(`${API_BASE}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setStats(statsResponse.data);

        // Fetch chart data
        const chartResponse = await axios.get(
          `${API_BASE}/dashboard/charts?range=${timeRange}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setChartData(chartResponse.data);

        // Fetch recent activities
        const activitiesResponse = await axios.get(
          `${API_BASE}/dashboard/activities`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setRecentActivities(activitiesResponse.data);

        // Fetch pie chart data
        const pieResponse = await axios.get(
          `${API_BASE}/dashboard/pie-chart`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setPieChartData(pieResponse.data);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to mock data if API fails
        loadMockData();
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange]);

  // Mock data fallback
  const loadMockData = () => {
    // Mock stats
    setStats({
      totalUsers: 1245,
      totalOrders: 356,
      totalRevenue: 45200,
      conversionRate: 12.5,
      activeUsers: 823,
      pendingTasks: 12,
      documents: 89,
      growthRate: 15.2
    });

    // Mock chart data
    const mockChartData = [
      { month: 'Jan', revenue: 4000, users: 2400, orders: 1400 },
      { month: 'Feb', revenue: 3000, users: 1398, orders: 1800 },
      { month: 'Mar', revenue: 2000, users: 9800, orders: 900 },
      { month: 'Apr', revenue: 2780, users: 3908, orders: 1200 },
      { month: 'May', revenue: 1890, users: 4800, orders: 1100 },
      { month: 'Jun', revenue: 2390, users: 3800, orders: 1600 },
      { month: 'Jul', revenue: 3490, users: 4300, orders: 2100 },
    ];
    setChartData(mockChartData);

    // Mock recent activities
    const mockActivities = [
      { id: 1, user: 'John Doe', action: 'Uploaded document', type: 'document', time: '10:30 AM', status: 'completed' },
      { id: 2, user: 'Sarah Smith', action: 'Placed order #ORD-7892', type: 'order', time: '11:15 AM', status: 'pending' },
      { id: 3, user: 'Mike Johnson', action: 'Updated profile', type: 'profile', time: '12:45 PM', status: 'completed' },
      { id: 4, user: 'Emily Davis', action: 'Submitted support ticket', type: 'support', time: '2:30 PM', status: 'pending' },
      { id: 5, user: 'David Wilson', action: 'Made payment', type: 'payment', time: '4:15 PM', status: 'completed' },
    ];
    setRecentActivities(mockActivities);

    // Mock pie chart data
    const mockPieData = [
      { name: 'Completed', value: 400, color: '#00C49F' },
      { name: 'Pending', value: 300, color: '#FFBB28' },
      { name: 'In Progress', value: 200, color: '#0088FE' },
      { name: 'Cancelled', value: 100, color: '#FF8042' },
    ];
    setPieChartData(mockPieData);
  };

  // Overview Cards Data
  const overviewCards = [
    { 
      title: 'Total Users', 
      value: stats.totalUsers || 0, 
      icon: Users, 
      color: 'bg-blue-500',
      change: '+12%',
      trend: 'up',
      description: 'Active users this month'
    },
    { 
      title: 'Total Revenue', 
      value: `$${(stats.totalRevenue || 0).toLocaleString()}`, 
      icon: DollarSign, 
      color: 'bg-green-500',
      change: '+15%',
      trend: 'up',
      description: 'Revenue generated'
    },
    { 
      title: 'Total Orders', 
      value: stats.totalOrders || 0, 
      icon: ShoppingCart, 
      color: 'bg-purple-500',
      change: '+8%',
      trend: 'up',
      description: 'Orders placed'
    },
    { 
      title: 'Conversion Rate', 
      value: `${stats.conversionRate || 0}%`, 
      icon: TrendingUp, 
      color: 'bg-orange-500',
      change: '+5%',
      trend: 'up',
      description: 'Conversion percentage'
    },
    { 
      title: 'Active Users', 
      value: stats.activeUsers || 0, 
      icon: Users, 
      color: 'bg-indigo-500',
      change: '+3%',
      trend: 'up',
      description: 'Currently online'
    },
    { 
      title: 'Pending Tasks', 
      value: stats.pendingTasks || 0, 
      icon: Clock, 
      color: 'bg-yellow-500',
      change: '-2%',
      trend: 'down',
      description: 'Tasks to complete'
    },
  ];

  // Handle export data
  const handleExport = () => {
    const dataStr = JSON.stringify({ stats, chartData, recentActivities }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `dashboard-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
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
              {entry.name === 'revenue' ? '' : entry.name === 'users' ? ' users' : ' orders'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your {user.role === 'admin' ? 'system' : 'account'} today.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex items-center bg-white border rounded-lg p-1">
            {['day', 'week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-sm rounded-md capitalize ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {overviewCards.map((card, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} p-3 rounded-xl`}>
                <card.icon size={24} className="text-white" />
              </div>
              <div className={`flex items-center text-sm ${
                card.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {card.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                <span className="ml-1">{card.change}</span>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
            <p className="text-gray-900 font-medium mt-1">{card.title}</p>
            <p className="text-sm text-gray-500 mt-1">{card.description}</p>
            
            {/* Progress bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    card.trend === 'up' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: '75%' }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar/Line Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Revenue & Users Analytics</h2>
              <p className="text-sm text-gray-500">Showing data for the last {timeRange}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveChart('revenue')}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  activeChart === 'revenue'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Revenue
              </button>
              <button
                onClick={() => setActiveChart('users')}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  activeChart === 'users'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveChart('orders')}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  activeChart === 'orders'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Orders
              </button>
            </div>
          </div>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              {activeChart === 'revenue' ? (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="revenue" 
                    fill="#3B82F6" 
                    name="Revenue ($)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              ) : activeChart === 'users' ? (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Users"
                  />
                </LineChart>
              ) : (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="orders" 
                    fill="#8B5CF6" 
                    name="Orders"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Status Distribution</h2>
              <p className="text-sm text-gray-500">Breakdown of all activities</p>
            </div>
            <Filter size={20} className="text-gray-400" />
          </div>
          
          <div className="h-[300px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend Details */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {pieChartData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color || COLORS[index] }}
                  ></div>
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <span className="text-sm font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
              <p className="text-sm text-gray-500">Latest user activities and actions</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                <Calendar size={16} />
                Filter by Date
              </button>
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
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
              {recentActivities.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-800 font-medium">
                          {activity.user.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="font-medium text-gray-900">{activity.user}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{activity.action}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activity.type === 'order' ? 'bg-purple-100 text-purple-800' :
                      activity.type === 'document' ? 'bg-blue-100 text-blue-800' :
                      activity.type === 'payment' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {activity.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {activity.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activity.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {activity.status === 'completed' ? (
                        <CheckCircle size={12} className="mr-1" />
                      ) : (
                        <Clock size={12} className="mr-1" />
                      )}
                      {activity.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1">
                        <Eye size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1">
                        <Edit size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-900 p-1">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{recentActivities.length}</span> of{' '}
              <span className="font-medium">124</span> results
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 border rounded-lg hover:bg-gray-50 disabled:opacity-50">
                Previous
              </button>
              <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                1
              </button>
              <button className="px-3 py-1.5 border rounded-lg hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-1.5 border rounded-lg hover:bg-gray-50">
                3
              </button>
              <button className="px-3 py-1.5 border rounded-lg hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Average Session Duration</p>
              <p className="text-2xl font-bold mt-2">4m 32s</p>
            </div>
            <Clock size={24} className="opacity-80" />
          </div>
          <div className="mt-4 text-sm">
            <span className="text-green-300">+12% </span>from last month
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Bounce Rate</p>
              <p className="text-2xl font-bold mt-2">28.5%</p>
            </div>
            <TrendingUp size={24} className="opacity-80" />
          </div>
          <div className="mt-4 text-sm">
            <span className="text-green-300">-3.2% </span>from last month
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Customer Satisfaction</p>
              <p className="text-2xl font-bold mt-2">94%</p>
            </div>
            <CheckCircle size={24} className="opacity-80" />
          </div>
          <div className="mt-4 text-sm">
            <span className="text-green-300">+2.1% </span>from last month
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;