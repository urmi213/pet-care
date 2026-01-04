import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  User, 
  Settings, 
  Users,
  ShoppingBag,
  Package,
  PlusCircle,
  List,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Bell,
  Home,
  Shield,
  TrendingUp,
  Search,
  BarChart3,
  FileText,
  ShoppingCart,
  Heart,
  MessageCircle,
  BarChart,
  Calendar,
  DollarSign,
  Target,
  Activity
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../LoadingSpinner';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user, loading, logOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for mobile
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  // User data
  const fullUser = {
    ...user,
    role: user?.role || 'user',
    name: user?.name || user?.displayName || user?.email?.split('@')[0] || 'User',
    avatar: user?.photoURL || user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`
  };

  // User Role Menu (Minimum 2 items)
  const userMenuItems = [
    { 
      id: 'dashboard',
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: LayoutDashboard,
      roles: ['user'],
      description: 'Overview'
    },
    { 
      id: 'profile',
      name: 'My Profile', 
      href: '/dashboard/profile', 
      icon: User,
      roles: ['user'],
      description: 'Manage profile'
    },
    { 
      id: 'my-orders',
      name: 'My Orders', 
      href: '/dashboard/my-orders', 
      icon: ShoppingBag,
      roles: ['user'],
      description: 'View orders'
    },
    { 
      id: 'my-listings',
      name: 'My Listings', 
      href: '/dashboard/my-listings', 
      icon: List,
      roles: ['user'],
      description: 'Your listings'
    },
    { 
      id: 'add-listing',
      name: 'Add Listing', 
      href: '/dashboard/add-listing', 
      icon: PlusCircle,
      roles: ['user'],
      description: 'Create new'
    }
  ];

  // Admin Role Menu (Minimum 3 items)
  const adminMenuItems = [
    { 
      id: 'dashboard',
      name: 'Admin Dashboard', 
      href: '/dashboard', 
      icon: Shield,
      roles: ['admin'],
      description: 'System overview'
    },
    { 
      id: 'users',
      name: 'User Management', 
      href: '/dashboard/users', 
      icon: Users,
      roles: ['admin'],
      description: 'Manage users'
    },
    { 
      id: 'listings',
      name: 'All Listings', 
      href: '/dashboard/listings', 
      icon: Package,
      roles: ['admin'],
      description: 'Manage listings'
    },
    { 
      id: 'orders',
      name: 'All Orders', 
      href: '/dashboard/orders', 
      icon: ShoppingCart,
      roles: ['admin'],
      description: 'View all orders'
    },
    { 
      id: 'analytics',
      name: 'Analytics', 
      href: '/dashboard/analytics', 
      icon: TrendingUp,
      roles: ['admin'],
      description: 'Reports & stats'
    },
    { 
      id: 'settings',
      name: 'Settings', 
      href: '/dashboard/settings', 
      icon: Settings,
      roles: ['admin'],
      description: 'System settings'
    }
  ];

  // Get menu items based on role
  const getMenuItems = () => {
    if (fullUser.role === 'admin') {
      return adminMenuItems.filter(item => item.roles.includes('admin'));
    }
    return userMenuItems.filter(item => item.roles.includes('user'));
  };

  const menuItems = getMenuItems();
  const currentPath = location.pathname;

  const handleLogout = async () => {
    await logOut();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  // Get page title
  const getPageTitle = () => {
    if (currentPath === '/dashboard') return 'Dashboard Overview';
    if (currentPath.includes('/my-orders')) return 'My Orders';
    if (currentPath.includes('/my-listings')) return 'My Listings';
    if (currentPath.includes('/add-listing')) return 'Add New Listing';
    if (currentPath.includes('/profile')) return 'My Profile';
    if (currentPath.includes('/users')) return 'User Management';
    if (currentPath.includes('/listings')) return 'All Listings';
    if (currentPath.includes('/orders')) return 'All Orders';
    if (currentPath.includes('/analytics')) return 'Analytics';
    if (currentPath.includes('/settings')) return 'Settings';
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            
            {/* Left Section */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 mr-3 text-gray-600 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              
              <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                <div className="flex items-center justify-center w-10 h-10 mr-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                  <Home size={22} className="text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">{getPageTitle()}</h1>
                  <p className="text-xs text-gray-500 capitalize">{fullUser.role} Panel</p>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search dashboard..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </form>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotificationDropdownOpen(!notificationDropdownOpen);
                    setProfileDropdownOpen(false);
                  }}
                  className="relative p-2 rounded-full hover:bg-gray-100"
                >
                  <Bell size={20} className="text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {notificationDropdownOpen && (
                  <div className="absolute right-0 z-50 w-80 mt-2 bg-white rounded-lg shadow-lg border border-gray-200">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      <p className="text-xs text-gray-500">You have 3 unread notifications</p>
                    </div>
                    <div className="py-2 max-h-96 overflow-y-auto">
                      <div className="px-4 py-3 hover:bg-gray-50">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <Bell size={14} className="text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm text-gray-900">New order received</p>
                            <p className="text-xs text-gray-500">2 minutes ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(!profileDropdownOpen);
                    setNotificationDropdownOpen(false);
                  }}
                  className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100"
                >
                  <img
                    className="w-8 h-8 rounded-full"
                    src={fullUser.avatar}
                    alt={fullUser.name}
                  />
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-900">{fullUser.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{fullUser.role}</div>
                  </div>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 z-50 w-48 mt-2 bg-white rounded-lg shadow-lg border border-gray-200">
                    <div className="p-4 border-b">
                      <p className="text-sm font-medium text-gray-900">{fullUser.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate('/dashboard/profile');
                          setProfileDropdownOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User size={16} className="mr-3" />
                        My Profile
                      </button>
                      <button
                        onClick={() => {
                          navigate('/dashboard');
                          setProfileDropdownOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LayoutDashboard size={16} className="mr-3" />
                        Dashboard Home
                      </button>
                      <div className="border-t my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <LogOut size={16} className="mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Close dropdowns on outside click */}
        {(profileDropdownOpen || notificationDropdownOpen) && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => {
              setProfileDropdownOpen(false);
              setNotificationDropdownOpen(false);
            }}
          />
        )}
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen pt-16 bg-white border-r border-gray-200 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0'
        }`}
      >
        <div className="h-full overflow-y-auto">
          {/* User Info */}
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <img
                className="w-12 h-12 rounded-full border-2 border-blue-100"
                src={fullUser.avatar}
                alt={fullUser.name}
              />
              <div>
                <h3 className="font-semibold text-gray-900">{fullUser.name}</h3>
                <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full capitalize">
                  {fullUser.role}
                </span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.href || 
                               (item.href !== '/dashboard' && currentPath.startsWith(item.href));
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        navigate(item.href);
                        if (isMobile) setSidebarOpen(false);
                      }}
                      className={`flex items-center w-full px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={18} className={`mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                      <div className="flex-1 text-left">{item.name}</div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`pt-16 min-h-screen transition-all duration-300 ${
          sidebarOpen ? 'md:pl-64' : 'pl-0'
        }`}
      >
        <div className="p-4 md:p-6">
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && isMobile && (
            <div
              className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          {/* Content Area */}
          <div className="max-w-7xl mx-auto">
            <Outlet context={{ user: fullUser }} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;