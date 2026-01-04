import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import { 
  FaBell, 
  FaCheck, 
  FaShoppingCart, 
  FaPlus, 
  FaHeart, 
  FaComment, 
  FaStar, 
  FaTruck,
  FaEnvelope,
  FaTrash,
  FaBellSlash,
  FaFilter,
  FaCalendarAlt,
  FaTimes,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [typeFilter, setTypeFilter] = useState('all'); // all, order, listing, message, review, system
  const [loading, setLoading] = useState(true);

  // Sample notifications data - In real app, this would come from API
  const sampleNotifications = [
    {
      id: 1,
      type: 'order',
      title: 'Order Placed Successfully!',
      message: 'Your order for "Persian Kitten" has been placed. Order ID: #ORD-2024-001',
      time: '2 minutes ago',
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      read: false,
      icon: <FaShoppingCart className="text-green-600" />,
      color: 'bg-green-100 text-green-800',
      link: '/my-orders',
      action: 'ORDER_PLACED'
    },
    {
      id: 2,
      type: 'listing',
      title: 'New Listing Created!',
      message: 'Your listing "Golden Retriever Puppy" is now live on the marketplace.',
      time: '5 minutes ago',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      read: false,
      icon: <FaPlus className="text-blue-600" />,
      color: 'bg-blue-100 text-blue-800',
      link: '/my-listings',
      action: 'LISTING_CREATED'
    },
    {
      id: 3,
      type: 'message',
      title: 'New Message Received',
      message: 'John Doe sent you a message about "Persian Kitten".',
      time: '1 hour ago',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      read: true,
      icon: <FaEnvelope className="text-purple-600" />,
      color: 'bg-purple-100 text-purple-800',
      link: '/messages',
      action: 'NEW_MESSAGE'
    },
    {
      id: 4,
      type: 'review',
      title: 'New Review Received',
      message: 'Sarah Johnson gave your listing 5 stars!',
      time: '2 hours ago',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: true,
      icon: <FaStar className="text-yellow-600" />,
      color: 'bg-yellow-100 text-yellow-800',
      link: '/reviews',
      action: 'NEW_REVIEW'
    },
    {
      id: 5,
      type: 'order',
      title: 'Order Status Updated',
      message: 'Order #ORD-2024-001 has been shipped. Tracking: TRK-789012',
      time: '1 day ago',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      icon: <FaTruck className="text-orange-600" />,
      color: 'bg-orange-100 text-orange-800',
      link: '/track-order/ORD-2024-001',
      action: 'ORDER_SHIPPED'
    },
    {
      id: 6,
      type: 'system',
      title: 'System Update',
      message: 'New features added: Wishlist and Notifications',
      time: '2 days ago',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      icon: <FaBell className="text-gray-600" />,
      color: 'bg-gray-100 text-gray-800',
      link: '/announcements',
      action: 'SYSTEM_UPDATE'
    },
    {
      id: 7,
      type: 'wishlist',
      title: 'Wishlist Item Price Drop',
      message: '"Premium Dog Food" price has dropped from $30 to $25',
      time: '3 days ago',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      icon: <FaHeart className="text-red-600" />,
      color: 'bg-red-100 text-red-800',
      link: '/product/3',
      action: 'PRICE_DROP'
    }
  ];

  useEffect(() => {
    // Load notifications from localStorage or API
    const loadNotifications = async () => {
      try {
        setLoading(true);
        
        // Try to get from localStorage first
        const savedNotifications = localStorage.getItem(`notifications_${user?.email}`);
        
        if (savedNotifications) {
          setNotifications(JSON.parse(savedNotifications));
        } else {
          // Use sample data for first time
          setNotifications(sampleNotifications);
          localStorage.setItem(`notifications_${user?.email}`, JSON.stringify(sampleNotifications));
        }
        
      } catch (error) {
        console.error('Error loading notifications:', error);
        setNotifications(sampleNotifications);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadNotifications();
    } else {
      setNotifications([]);
      setLoading(false);
    }
  }, [user]);

  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    localStorage.setItem(`notifications_${user?.email}`, JSON.stringify(updatedNotifications));
    toast.success('Marked as read');
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
    localStorage.setItem(`notifications_${user?.email}`, JSON.stringify(updatedNotifications));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    setNotifications(updatedNotifications);
    localStorage.setItem(`notifications_${user?.email}`, JSON.stringify(updatedNotifications));
    toast.success('Notification deleted');
  };

  const clearAllNotifications = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([]);
      localStorage.setItem(`notifications_${user?.email}`, JSON.stringify([]));
      toast.success('All notifications cleared');
    }
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      time: 'Just now',
      ...notification
    };

    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem(`notifications_${user?.email}`, JSON.stringify(updatedNotifications));
    
    // Show toast notification
    toast.success(notification.title, {
      icon: notification.icon,
      duration: 3000
    });
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesStatus = filter === 'all' || 
      (filter === 'unread' && !notification.read) || 
      (filter === 'read' && notification.read);
    
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    
    return matchesStatus && matchesType;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const orderNotifications = notifications.filter(n => n.type === 'order').length;
  const listingNotifications = notifications.filter(n => n.type === 'listing').length;

  // Function to simulate adding notification from other components
  const simulateNotification = (type) => {
    const notificationTemplates = {
      order: {
        type: 'order',
        title: 'Order Placed Successfully!',
        message: 'Your order has been confirmed and is being processed.',
        icon: <FaShoppingCart className="text-green-600" />,
        color: 'bg-green-100 text-green-800',
        link: '/my-orders',
        action: 'ORDER_PLACED'
      },
      listing: {
        type: 'listing',
        title: 'Listing Created!',
        message: 'Your new listing is now live on the marketplace.',
        icon: <FaPlus className="text-blue-600" />,
        color: 'bg-blue-100 text-blue-800',
        link: '/my-listings',
        action: 'LISTING_CREATED'
      },
      message: {
        type: 'message',
        title: 'New Message',
        message: 'You have received a new message from a seller.',
        icon: <FaEnvelope className="text-purple-600" />,
        color: 'bg-purple-100 text-purple-800',
        link: '/messages',
        action: 'NEW_MESSAGE'
      },
      review: {
        type: 'review',
        title: 'New Review',
        message: 'Someone left a review on your product.',
        icon: <FaStar className="text-yellow-600" />,
        color: 'bg-yellow-100 text-yellow-800',
        link: '/reviews',
        action: 'NEW_REVIEW'
      }
    };

    addNotification(notificationTemplates[type]);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔔</div>
          <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view your notifications</p>
          <Link to="/login" className="btn btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-14 h-14 rounded-xl flex items-center justify-center shadow-lg">
                <FaBell className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600">Stay updated with your activities</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
                >
                  <FaCheck /> Mark all as read
                </button>
              )}
              <button
                onClick={clearAllNotifications}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
              >
                <FaTrash /> Clear All
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Notifications</p>
                  <p className="text-3xl font-bold text-gray-900">{notifications.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaBell className="text-blue-600 text-xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unread</p>
                  <p className="text-3xl font-bold text-gray-900">{unreadCount}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FaBellSlash className="text-green-600 text-xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Orders</p>
                  <p className="text-3xl font-bold text-gray-900">{orderNotifications}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <FaShoppingCart className="text-orange-600 text-xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Listings</p>
                  <p className="text-3xl font-bold text-gray-900">{listingNotifications}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <FaPlus className="text-purple-600 text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Filter by Status</label>
              <div className="flex flex-wrap gap-2">
                {['all', 'unread', 'read'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      filter === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'all' && 'All Notifications'}
                    {status === 'unread' && 'Unread Only'}
                    {status === 'read' && 'Read Only'}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Filter by Type</label>
              <div className="flex flex-wrap gap-2">
                {['all', 'order', 'listing', 'message', 'review', 'system', 'wishlist'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors flex items-center gap-1 ${
                      typeFilter === type
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type === 'all' && <FaFilter />}
                    {type === 'order' && <FaShoppingCart />}
                    {type === 'listing' && <FaPlus />}
                    {type === 'message' && <FaEnvelope />}
                    {type === 'review' && <FaStar />}
                    {type === 'system' && <FaBell />}
                    {type === 'wishlist' && <FaHeart />}
                    <span className="capitalize">{type}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Test Notifications (For Demo Only) */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 mb-6 border border-blue-200">
          <h3 className="font-bold text-gray-800 mb-3">Test Notifications (Demo)</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => simulateNotification('order')}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2"
            >
              <FaShoppingCart /> Simulate Order
            </button>
            <button
              onClick={() => simulateNotification('listing')}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
            >
              <FaPlus /> Simulate Listing
            </button>
            <button
              onClick={() => simulateNotification('message')}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2"
            >
              <FaEnvelope /> Simulate Message
            </button>
            <button
              onClick={() => simulateNotification('review')}
              className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors flex items-center gap-2"
            >
              <FaStar /> Simulate Review
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔔</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No notifications yet</h3>
              <p className="text-gray-600">Your notifications will appear here when you have activity</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${notification.color}`}>
                        {notification.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-bold ${!notification.read ? 'text-blue-700' : 'text-gray-800'}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              New
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">{notification.time}</span>
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 text-gray-400 hover:text-blue-600"
                            title={notification.read ? "Mark as unread" : "Mark as read"}
                          >
                            {notification.read ? <FaEyeSlash /> : <FaEye />}
                          </button>
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-2">{notification.message}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className={`px-2 py-1 text-xs rounded ${notification.color}`}>
                            {notification.type.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">
                            <FaCalendarAlt className="inline mr-1" />
                            {new Date(notification.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {notification.link && (
                          <Link
                            to={notification.link}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View Details →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/my-orders"
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">View Your Orders</h3>
                <p className="text-green-100">Check order status and history</p>
              </div>
              <FaShoppingCart className="text-2xl" />
            </div>
          </Link>
          
          <Link
            to="/my-listings"
            className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-6 rounded-xl hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Manage Listings</h3>
                <p className="text-blue-100">Edit or delete your listings</p>
              </div>
              <FaPlus className="text-2xl" />
            </div>
          </Link>
          
          <Link
            to="/messages"
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-xl hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Messages</h3>
                <p className="text-purple-100">Chat with buyers and sellers</p>
              </div>
              <FaEnvelope className="text-2xl" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Notifications;