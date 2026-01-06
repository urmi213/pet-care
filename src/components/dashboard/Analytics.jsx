import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router';
import {
  TrendingUp, Users, DollarSign, ShoppingCart, Package,
  Calendar, Filter, Download, RefreshCw, BarChart3, PieChart as PieChartIcon,
  LineChart, Target, Eye, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
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

const Analytics = () => {
  const { user } = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const revenueData = [
    { month: 'Jan', revenue: 4000, orders: 240 },
    { month: 'Feb', revenue: 3000, orders: 139 },
    { month: 'Mar', revenue: 2000, orders: 980 },
    { month: 'Apr', revenue: 2780, orders: 390 },
    { month: 'May', revenue: 1890, orders: 480 },
    { month: 'Jun', revenue: 2390, orders: 380 },
    { month: 'Jul', revenue: 3490, orders: 430 },
  ];

  const categoryData = [
    { name: 'Dogs', value: 35, color: '#3b82f6' },
    { name: 'Cats', value: 25, color: '#10b981' },
    { name: 'Birds', value: 15, color: '#8b5cf6' },
    { name: 'Fish', value: 10, color: '#f59e0b' },
    { name: 'Accessories', value: 15, color: '#ef4444' },
  ];

  const userGrowthData = [
    { month: 'Jan', users: 400, newUsers: 120 },
    { month: 'Feb', users: 450, newUsers: 50 },
    { month: 'Mar', users: 520, newUsers: 70 },
    { month: 'Apr', users: 590, newUsers: 70 },
    { month: 'May', users: 650, newUsers: 60 },
    { month: 'Jun', users: 720, newUsers: 70 },
    { month: 'Jul', users: 800, newUsers: 80 },
  ];

  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231',
      change: '+20.1%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Total Orders',
      value: '2,340',
      change: '+12.3%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Active Users',
      value: '1,234',
      change: '+5.2%',
      trend: 'up',
      icon: Users,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '-0.5%',
      trend: 'down',
      icon: Target,
      color: 'from-orange-500 to-red-500'
    },
  ];

  const topProducts = [
    { name: 'Premium Dog Food', sales: 234, revenue: 4567 },
    { name: 'Cat Toy Bundle', sales: 189, revenue: 3789 },
    { name: 'Large Bird Cage', sales: 156, revenue: 3120 },
    { name: 'Aquarium Tank', sales: 142, revenue: 2840 },
    { name: 'Pet Carrier', sales: 128, revenue: 2560 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'revenue' ? '$' : ''}{entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your business performance and metrics</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {['day', 'week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  timeRange === range
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
          
          <button className="p-2 border rounded-lg hover:bg-gray-50">
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
              <p className="text-gray-600">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Revenue Overview</h2>
              <p className="text-gray-600 text-sm">Monthly revenue and orders</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                <BarChart3 className="h-5 w-5" />
              </button>
              <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg">
                <LineChart className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="revenue" name="Revenue ($)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="orders" name="Orders" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Category Distribution</h2>
              <p className="text-gray-600 text-sm">Sales by product category</p>
            </div>
            <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg">
              <PieChartIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">User Growth</h2>
              <p className="text-gray-600 text-sm">Total users and new registrations</p>
            </div>
            <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg">
              <TrendingUp className="h-5 w-5" />
            </button>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#8b5cf6" 
                  fill="#8b5cf6" 
                  fillOpacity={0.1}
                  name="Total Users"
                />
                <Area 
                  type="monotone" 
                  dataKey="newUsers" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.1}
                  name="New Users"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Top Selling Products</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700">
              View All →
            </button>
          </div>

          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${product.revenue}</p>
                  <p className="text-sm text-green-600">+{Math.floor(Math.random() * 20)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Metrics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Bounce Rate</span>
              <span className="text-sm font-bold text-green-600">-2.3%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="h-2 rounded-full bg-green-500" style={{ width: '32%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Lower is better</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Avg. Session Duration</span>
              <span className="text-sm font-bold text-green-600">+45s</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="h-2 rounded-full bg-blue-500" style={{ width: '68%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">4m 23s</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Customer Satisfaction</span>
              <span className="text-sm font-bold text-green-600">+3.2%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="h-2 rounded-full bg-purple-500" style={{ width: '89%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Based on 234 reviews</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Return Rate</span>
              <span className="text-sm font-bold text-red-600">+0.8%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="h-2 rounded-full bg-red-500" style={{ width: '12%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">12 returns this month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;