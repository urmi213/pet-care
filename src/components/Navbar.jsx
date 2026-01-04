import { useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "react-tooltip";
import 'react-tooltip/dist/react-tooltip.css';

import { 
  FaUser, FaPaw, FaBars, FaTimes, FaCaretDown, FaShoppingCart, FaBell,
  FaHome, FaPlusSquare, FaClipboardList, FaShoppingBag, FaInfoCircle, FaEnvelope,
  FaQuestionCircle, FaHeart, FaDollarSign, FaQuestion, FaStar, FaCog,
  FaCalendarAlt, FaUsers, FaLifeRing, FaPen
} from 'react-icons/fa';

import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const { isDarkMode, toggleDarkMode } = useTheme(); 
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success('Logged out successfully!');
      navigate('/');
      setIsUserDropdownOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const primaryNavLinks = [
    { path: '/', name: 'Home', icon: <FaHome /> },
    { path: '/pets-supplies', name: 'Shop', icon: <FaPaw /> },
    { path: '/about', name: 'About', icon: <FaInfoCircle /> },
    { path: '/contact', name: 'Contact', icon: <FaEnvelope /> },
    { path: '/blog', name: 'Blog', icon: <FaPen /> },
  ];

  const userDashboardLinks = user ? [
    { path: '/dashboard', name: 'Dashboard', icon: <FaHome /> },
    { path: '/add-listing', name: 'Add Item', icon: <FaPlusSquare /> },
    { path: '/my-listings', name: 'My Items', icon: <FaClipboardList /> },
    { path: '/my-orders', name: 'My Orders', icon: <FaShoppingBag /> },
    { path: '/favorites', name: 'Favorites', icon: <FaHeart /> },
  ] : [];

  const additionalLinks = [
    { path: '/services', name: 'Services', icon: <FaCog /> },
    { path: '/testimonials', name: 'Reviews', icon: <FaStar /> },
    { path: '/pricing', name: 'Pricing', icon: <FaDollarSign /> },
    { path: '/faqs', name: 'FAQ', icon: <FaQuestion /> },
    { path: '/events', name: 'Events', icon: <FaCalendarAlt /> },
    { path: '/community', name: 'Community', icon: <FaUsers /> },
    { path: '/help-center', name: 'Help', icon: <FaLifeRing /> },
  ];

  const mobileNavLinks = [...primaryNavLinks, ...userDashboardLinks, ...additionalLinks];

  const notifications = [
    { id: 1, text: 'New order received', time: '2 min ago' },
    { id: 2, text: 'Your listing was approved', time: '1 hour ago' },
    { id: 3, text: 'Price drop alert: Dog Food', time: '3 hours ago' },
  ];

  return (
    <motion.nav 
      className={`sticky top-0 z-50 shadow-md bg-gray-800 text-white`}
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
              <FaPaw className="text-3xl text-secondary drop-shadow-lg" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight">
                Paw<span className="text-secondary">Mart</span>
              </span>
              <span className="text-xs opacity-80">Pet Paradise</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {primaryNavLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-gray-900 shadow'
                      : 'hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <span className="text-sm">{link.icon}</span>
                <span>{link.name}</span>
              </NavLink>
            ))}

            {/* More Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/20">
                <span>More</span>
                <FaCaretDown />
              </button>
              <div className="absolute left-0 mt-2 w-56 rounded-lg shadow-lg py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-gray-800">
                {additionalLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-gray-700"
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-700">
              <FaShoppingCart className="text-xl" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Link>

            

            {/* User Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-secondary/20"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white bg-opacity-20">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName} className="w-full h-full rounded-full object-cover"/>
                    ) : <FaUser className="text-white" />}
                  </div>
                  <p className="text-sm font-medium">{user.displayName?.split(' ')[0] || 'User'}</p>
                  <FaCaretDown />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg py-2 z-50 bg-primary text-white">
                    {userDashboardLinks.map(link => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-secondary/20"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        {link.icon}<span>{link.name}</span>
                      </Link>
                    ))}
                    <button onClick={handleLogout} className="w-full text-red-500 px-4 py-3 text-left hover:bg-red-600/20">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="px-4 py-2 rounded-lg bg-secondary text-white hover:bg-secondary/80">Login</Link>
                <Link to="/register" className="px-4 py-2 rounded-lg border border-white text-white hover:bg-secondary/20">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes className="text-2xl"/> : <FaBars className="text-2xl"/>}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-primary text-white'}`}
          >
            <div className="container mx-auto px-4 py-6">
              <div className="grid grid-cols-2 gap-3 mb-6">
                {mobileNavLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg text-center hover:bg-secondary/20`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="text-xl mb-2">{link.icon}</div>
                    <span className="text-sm font-medium">{link.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close dropdowns on outside click */}
      {isUserDropdownOpen && <div className="fixed inset-0 z-40" onClick={() => setIsUserDropdownOpen(false)}/>}
      {isNotificationsOpen && <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)}/>}
    </motion.nav>
  );
};

export default Navbar;
