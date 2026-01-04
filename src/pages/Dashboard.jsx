
import React, { useState, useEffect } from 'react';

import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { 
  Activity, 
  TrendingUp, 
  Users as UsersIcon, 
  ShoppingCart,
  Package,
  DollarSign
} from 'lucide-react';

const DashboardHome = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call - replace with actual API
    const fetchDashboardData = async () => {
      setLoading(true);
      // Mock data based on user role
      const mockData = user.role === 'admin' ? {
        stats: [
          { title: 'Total Users', value: '1,254', icon: UsersIcon, change: '+12%', color: 'blue' },
          { title: 'Total Orders', value: '342', icon: ShoppingCart, change: '+8%', color: 'green' },
          { title: 'Revenue', value: '$24,580', icon: DollarSign, change: '+23%', color: 'purple' },
          { title: 'Active Products', value: '89', icon: Package, change: '+5%', color: 'orange' },
        ],
        recentActivity: [
          { id: 1, user: 'John Doe', action: 'placed new order', time: '10 min ago' },
          { id: 2, user: 'Jane Smith', action: 'updated profile', time: '25 min ago' },
          { id: 3, user: 'Admin', action: 'added new product', time: '1 hour ago' },
        ]
      } : {
        stats: [
          { title: 'My Orders', value: '12', icon: ShoppingCart, change: '+2', color: 'blue' },
          { title: 'Pending', value: '3', icon: Package, change: '-1', color: 'yellow' },
          { title: 'Total Spent', value: '$1,240', icon: DollarSign, change: '+$120', color: 'green' },
          { title: 'Reward Points', value: '1,250', icon: Activity, change: '+50', color: 'purple' },
        ],
        recentActivity: [
          { id: 1, product: 'Premium Widget', status: 'Delivered', date: 'Today' },
          { id: 2, product: 'Basic Plan', status: 'Processing', date: 'Yesterday' },
        ]
      };
      
      setTimeout(() => {
        setDashboardData(mockData);
        setLoading(false);
      }, 500);
    };

    fetchDashboardData();
  }, [user.role]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's what's happening with your account today.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <TrendingUp className="h-4 w-4" />
          <span>Last updated: Just now</span>
        </div>
      </div>

      
     

      {/* Charts and Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {dashboardData.recentActivity.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {activity.user || activity.product}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.action || activity.status}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {activity.time || activity.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Performance</span>
              <span className="font-bold">94%</span>
            </div>
            <div className="w-full bg-blue-400/30 rounded-full h-2">
              <div className="bg-white h-2 rounded-full w-3/4"></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Engagement</span>
              <span className="font-bold">78%</span>
            </div>
            <div className="w-full bg-blue-400/30 rounded-full h-2">
              <div className="bg-white h-2 rounded-full w-2/3"></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Satisfaction</span>
              <span className="font-bold">89%</span>
            </div>
            <div className="w-full bg-blue-400/30 rounded-full h-2">
              <div className="bg-white h-2 rounded-full w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;