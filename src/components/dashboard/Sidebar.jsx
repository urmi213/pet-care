
import React from 'react';
import { NavLink } from 'react-router';
import { 
  Home, 
  User, 
  Settings, 
  Users, 
  BarChart3,
  FileText,
  ShoppingBag,
  Bell,
  HelpCircle
} from 'lucide-react';

const Sidebar = ({ isOpen, userRole }) => {
  // Menu items based on role
  const getMenuItems = () => {
    const baseItems = [
      { name: 'Dashboard', icon: Home, path: '/dashboard', role: ['user', 'admin'] },
      { name: 'My Profile', icon: User, path: '/dashboard/profile', role: ['user', 'admin'] },
      { name: 'Notifications', icon: Bell, path: '/dashboard/notifications', role: ['user', 'admin'] },
    ];

    if (userRole === 'user') {
      return [
        ...baseItems,
        { name: 'My Orders', icon: ShoppingBag, path: '/dashboard/orders', role: ['user'] },
        { name: 'Settings', icon: Settings, path: '/dashboard/settings', role: ['user'] },
      ];
    }

    if (userRole === 'admin') {
      return [
        ...baseItems,
        { name: 'User Management', icon: Users, path: '/dashboard/admin/users', role: ['admin'] },
        { name: 'Analytics', icon: BarChart3, path: '/dashboard/admin/analytics', role: ['admin'] },
        { name: 'Content', icon: FileText, path: '/dashboard/admin/content', role: ['admin'] },
        { name: 'Help Center', icon: HelpCircle, path: '/dashboard/admin/help', role: ['admin'] },
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 z-30 ${
      isOpen ? 'w-64 md:w-72' : 'w-16'
    }`}>
      <div className="h-full flex flex-col">
        <div className="p-4 border-b dark:border-gray-700">
          {isOpen ? (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-gray-800 dark:text-white">
                {userRole === 'admin' ? 'Admin Panel' : 'My Dashboard'}
              </span>
            </div>
          ) : (
            <div className="flex justify-center">
              <User className="h-6 w-6 text-blue-500" />
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center rounded-lg transition-all duration-200 group
                    ${isActive 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l-4 border-blue-500' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                    ${isOpen ? 'px-4 py-3' : 'px-2 py-3 justify-center'}
                  `}
                >
                  <item.icon className={`h-5 w-5 ${isOpen ? 'mr-3' : ''}`} />
                  {isOpen && (
                    <span className="font-medium text-sm">{item.name}</span>
                  )}
                  {!isOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.name}
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar footer */}
        {isOpen && (
          <div className="p-4 border-t dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p>v1.0.0</p>
              <p className="mt-1">Role: {userRole}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;