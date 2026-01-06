import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router';
import {
  FileText, Download, Calendar, TrendingUp, Users,
  DollarSign, Package, Filter, RefreshCw, Printer
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
import LoadingSpinner from '../../components/LoadingSpinner';

const Reports = () => {
  const { user } = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('month');
  const [reportData, setReportData] = useState(null);

  const salesData = [
    { month: 'Jan', revenue: 4000, orders: 240, customers: 120 },
    { month: 'Feb', revenue: 3000, orders: 139, customers: 98 },
    { month: 'Mar', revenue: 2000, orders: 980, customers: 240 },
    { month: 'Apr', revenue: 2780, orders: 390, customers: 190 },
    { month: 'May', revenue: 1890, orders: 480, customers: 210 },
    { month: 'Jun', revenue: 2390, orders: 380, customers: 180 },
  ];

  const categoryData = [
    { name: 'Dogs', value: 35 },
    { name: 'Cats', value: 25 },
    { name: 'Birds', value: 15 },
    { name: 'Fish', value: 10 },
    { name: 'Accessories', value: 15 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

  const reports = [
    { id: 1, name: 'Monthly Sales Report', type: 'sales', date: 'Nov 2023', size: '2.4 MB' },
    { id: 2, name: 'User Activity Report', type: 'users', date: 'Oct 2023', size: '1.8 MB' },
    { id: 3, name: 'Inventory Report', type: 'inventory', date: 'Nov 2023', size: '3.2 MB' },
    { id: 4, name: 'Revenue Analysis', type: 'revenue', date: 'Sep 2023', size: '1.5 MB' },
  ];

  useEffect(() => {
    // Fetch report data
    setReportData({
      sales: salesData,
      categories: categoryData,
      summary: {
        totalRevenue: 15960,
        totalOrders: 2609,
        avgOrderValue: 158.32,
        customerGrowth: 12.5,
      }
    });
  }, []);

  const handleGenerateReport = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Report generated successfully!');
    }, 2000);
  };

  const handleExport = (format) => {
    alert(`Exporting report as ${format.toUpperCase()}`);
  };

  if (!reportData) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Generate and analyze business reports</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex flex-wrap gap-3">
          {['sales', 'users', 'inventory', 'revenue', 'customers'].map((type) => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                reportType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type} Report
            </button>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">Date Range</span>
          </div>
          <div className="flex space-x-2">
            {['day', 'week', 'month', 'quarter', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 text-sm rounded-lg capitalize ${
                  dateRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${reportData.summary.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            +8.2% from last period
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.summary.totalOrders}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            +12.5% from last period
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Order Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${reportData.summary.avgOrderValue}
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            +3.2% from last period
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Customer Growth</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.summary.customerGrowth}%
              </p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            +5.8% from last period
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Sales Overview</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData.sales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" name="Revenue ($)" fill="#3b82f6" />
                <Bar dataKey="orders" name="Orders" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Category Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reportData.categories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {reportData.categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Previous Reports */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Previous Reports</h2>
          <p className="text-gray-600 text-sm mt-1">Download or view previous reports</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-600 mr-3" />
                      <span className="font-medium text-gray-900">{report.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 capitalize">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{report.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{report.size}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleExport('pdf')}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </button>
                      <button
                        onClick={() => handleExport('excel')}
                        className="flex items-center text-sm text-green-600 hover:text-green-800"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Excel
                      </button>
                      <button className="flex items-center text-sm text-gray-600 hover:text-gray-800">
                        <Printer className="h-4 w-4 mr-1" />
                        Print
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Export Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleExport('pdf')}
            className="p-4 border rounded-lg hover:bg-gray-50 text-center"
          >
            <FileText className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Export as PDF</p>
            <p className="text-sm text-gray-600">Best for printing</p>
          </button>

          <button
            onClick={() => handleExport('excel')}
            className="p-4 border rounded-lg hover:bg-gray-50 text-center"
          >
            <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Export as Excel</p>
            <p className="text-sm text-gray-600">Best for analysis</p>
          </button>

          <button
            onClick={() => handleExport('csv')}
            className="p-4 border rounded-lg hover:bg-gray-50 text-center"
          >
            <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Export as CSV</p>
            <p className="text-sm text-gray-600">Best for data import</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;