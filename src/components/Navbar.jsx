import { useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaUser, FaPaw, FaBars, FaTimes, FaCaretDown, 
  FaHome, FaPlusSquare, FaClipboardList, FaShoppingBag, FaInfoCircle, FaEnvelope,
  FaQuestionCircle, FaHeart, FaDollarSign, FaQuestion, FaStar, FaCog,
  FaCalendarAlt, FaUsers, FaLifeRing, FaPen, FaSearch, FaUserShield,
  FaShoppingBasket, FaTags, FaGraduationCap, FaChevronRight
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isCommunityDropdownOpen, setIsCommunityDropdownOpen] = useState(false);
  const [isDashboardDropdownOpen, setIsDashboardDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success('Logged out successfully!');
      navigate('/');
      setIsUserDropdownOpen(false);
      setIsMenuOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Primary Navigation Links
  const primaryNavLinks = [
    { path: '/', name: 'Home', icon: <FaHome /> },
    { path: '/pets-supplies', name: 'Shop', icon: <FaPaw /> },
    { path: '/about', name: 'About', icon: <FaInfoCircle /> },
  ];

  // Services Dropdown Links
  const servicesLinks = [
    { path: '/services', name: 'Our Services', icon: <FaCog /> },
    { path: '/testimonials', name: 'Testimonials', icon: <FaStar /> },
    { path: '/pricing', name: 'Pricing', icon: <FaDollarSign /> },
    { path: '/faqs', name: 'FAQs', icon: <FaQuestionCircle /> },
    { path: '/help-center', name: 'Help Center', icon: <FaLifeRing /> },
  ];

  // Community Dropdown Links
  const communityLinks = [
    { path: '/community', name: 'Community', icon: <FaUsers /> },
    { path: '/events', name: 'Events', icon: <FaCalendarAlt /> },
    { path: '/blog', name: 'Blog', icon: <FaPen /> },
    { path: '/contact', name: 'Contact', icon: <FaEnvelope /> },
  ];

  // Dashboard links for logged in users
  const getDashboardLinks = () => {
    if (!user) return [];
    
    const baseLinks = [
      { path: '/dashboard', name: 'Dashboard Home', icon: <FaHome /> },
      { path: '/dashboard/profile', name: 'My Profile', icon: <FaUser /> },
    ];

    if (user.role === 'admin') {
      return [
        ...baseLinks,
        { path: '/dashboard/users', name: 'User Management', icon: <FaUserShield /> },
        { path: '/dashboard/listings', name: 'All Listings', icon: <FaTags /> },
        { path: '/dashboard/orders', name: 'All Orders', icon: <FaShoppingBasket /> },
        { path: '/dashboard/analytics', name: 'Analytics', icon: <FaGraduationCap /> },
        { path: '/dashboard/reports', name: 'Reports', icon: <FaClipboardList /> },
        { path: '/dashboard/settings', name: 'Settings', icon: <FaCog /> },
      ];
    } else {
      return [
        ...baseLinks,
        { path: '/dashboard/my-orders', name: 'My Orders', icon: <FaShoppingBag /> },
        { path: '/dashboard/my-listings', name: 'My Listings', icon: <FaClipboardList /> },
        { path: '/dashboard/add-listing', name: 'Add Listing', icon: <FaPlusSquare /> },
        { path: '/dashboard/favorites', name: 'Favorites', icon: <FaHeart /> },
        { path: '/dashboard/support', name: 'Support', icon: <FaLifeRing /> },
      ];
    }
  };

  const dashboardLinks = getDashboardLinks();

  // All mobile navigation links (organized by category)
  const mobileNavLinks = [
    { category: 'Main', links: primaryNavLinks },
    { category: 'Services', links: servicesLinks },
    { category: 'Community', links: communityLinks },
    ...(user ? [{ category: 'Dashboard', links: dashboardLinks }] : []),
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <motion.nav 
      className="sticky top-0 z-50 bg-white shadow-md border-b"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <FaPaw className="text-3xl text-blue-600" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold">
                Paw<span className="text-blue-600">Mart</span>
              </span>
              <span className="text-xs text-gray-600">Pet Paradise</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Primary Links */}
            {primaryNavLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <span className="text-sm">{link.icon}</span>
                <span>{link.name}</span>
              </NavLink>
            ))}

            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsServicesDropdownOpen(!isServicesDropdownOpen);
                  setIsCommunityDropdownOpen(false);
                  setIsDashboardDropdownOpen(false);
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isServicesDropdownOpen
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaCog className="text-sm" />
                <span>Services</span>
                <FaCaretDown className={`transition-transform ${isServicesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isServicesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-50"
                  >
                    {servicesLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 group"
                        onClick={() => setIsServicesDropdownOpen(false)}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-blue-500">{link.icon}</span>
                          <span>{link.name}</span>
                        </div>
                        <FaChevronRight className="text-xs text-gray-400 group-hover:text-blue-600" />
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Community Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsCommunityDropdownOpen(!isCommunityDropdownOpen);
                  setIsServicesDropdownOpen(false);
                  setIsDashboardDropdownOpen(false);
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isCommunityDropdownOpen
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaUsers className="text-sm" />
                <span>Community</span>
                <FaCaretDown className={`transition-transform ${isCommunityDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isCommunityDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-50"
                  >
                    {communityLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 group"
                        onClick={() => setIsCommunityDropdownOpen(false)}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-green-500">{link.icon}</span>
                          <span>{link.name}</span>
                        </div>
                        <FaChevronRight className="text-xs text-gray-400 group-hover:text-blue-600" />
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dashboard Dropdown (if logged in) */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => {
                    setIsDashboardDropdownOpen(!isDashboardDropdownOpen);
                    setIsServicesDropdownOpen(false);
                    setIsCommunityDropdownOpen(false);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isDashboardDropdownOpen || window.location.pathname.includes('/dashboard')
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaHome className="text-sm" />
                  <span>Dashboard</span>
                  <FaCaretDown className={`transition-transform ${isDashboardDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isDashboardDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-50"
                    >
                      {dashboardLinks.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 group"
                          onClick={() => setIsDashboardDropdownOpen(false)}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-purple-500">{link.icon}</span>
                            <span>{link.name}</span>
                          </div>
                          <FaChevronRight className="text-xs text-gray-400 group-hover:text-blue-600" />
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
            </form>

            {/* User Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setIsUserDropdownOpen(!isUserDropdownOpen);
                    setIsServicesDropdownOpen(false);
                    setIsCommunityDropdownOpen(false);
                    setIsDashboardDropdownOpen(false);
                  }}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : <FaUser className="text-blue-600" />}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium">
                      {user.displayName?.split(' ')[0] || user.name?.split(' ')[0] || 'User'}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">{user.role || 'user'}</div>
                  </div>
                  <FaCaretDown className={`transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border"
                    >
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium">
                          {user.displayName || user.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            setIsMenuOpen(false);
                          }}
                        >
                          <FaHome className="mr-3" />
                          Dashboard
                        </Link>
                        <Link
                          to="/dashboard/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            setIsMenuOpen(false);
                          }}
                        >
                          <FaUser className="mr-3" />
                          My Profile
                        </Link>
                        <div className="border-t my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <FaTimes className="mr-3" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <FaTimes className="text-2xl text-gray-700" />
            ) : (
              <FaBars className="text-2xl text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t"
          >
            <div className="container mx-auto px-4 py-4">
              {/* Search in mobile */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </form>

              {/* Mobile Links by Category */}
              <div className="space-y-6">
                {mobileNavLinks.map((category) => (
                  <div key={category.category}>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      {category.category}
                    </h3>
                    <div className="space-y-1">
                      {category.links.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-blue-500">{link.icon}</span>
                            <span className="font-medium">{link.name}</span>
                          </div>
                          <FaChevronRight className="text-xs text-gray-400" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Auth buttons for mobile */}
              {!user ? (
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-3 border border-blue-600 text-blue-600 rounded-lg text-center hover:bg-blue-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      {user.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt={user.displayName} 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : <FaUser className="text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {user.displayName || user.name || 'User'}
                      </p>
                      <p className="text-sm text-gray-600 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full capitalize">
                        {user.role || 'user'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close dropdowns on outside click */}
      {(isUserDropdownOpen || isServicesDropdownOpen || isCommunityDropdownOpen || isDashboardDropdownOpen) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setIsUserDropdownOpen(false);
            setIsServicesDropdownOpen(false);
            setIsCommunityDropdownOpen(false);
            setIsDashboardDropdownOpen(false);
          }}
        />
      )}
    </motion.nav>
  );
};

export default Navbar;