import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  FaDog, FaCat, FaPaw, FaHeart, FaStar, FaShoppingCart,
  FaHome, FaPlus, FaSearch, FaArrowRight, FaChevronLeft,
  FaChevronRight, FaShippingFast, FaShieldAlt, FaTag,
  FaUsers, FaAward, FaLeaf, FaRecycle, FaClock,
  FaCheckCircle, FaShoppingBag, FaGift, FaFire,
  FaTrophy, FaBolt, FaCrown, FaGem, FaRocket,
  FaTimes, FaEye, FaShoppingBasket, FaUserCheck
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Optimized Image Component with caching
const SafeImage = ({ src, alt, className, fallback }) => {
  const [imgSrc, setImgSrc] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImgSrc(src);
      setLoaded(true);
    };
    img.onerror = () => {
      setError(true);
      setImgSrc(fallback || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80');
      setLoaded(true);
    };
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallback]);
  
  return (
    <div className="relative overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-lg"></div>
      )}
      <img
        src={imgSrc || fallback}
        alt={alt}
        className={`${className} ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} transition-all duration-500`}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setImgSrc(fallback);
        }}
      />
    </div>
  );
};

// Quick View Modal Component
const QuickViewModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const navigate = useNavigate();
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Quick View</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="text-2xl text-gray-500" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-white p-6">
              <SafeImage
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover rounded-xl"
                fallback="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=60"
              />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <span className="text-gray-600">({product.rating} reviews)</span>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700">{product.description}</p>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">{product.price}</span>
                <span className="text-xl text-gray-400 line-through">{product.originalPrice}</span>
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  SAVE 20%
                </span>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={() => {
                    onAddToCart(product);
                    toast.success('Added to cart! 🛒');
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <FaShoppingBasket />
                  Add to Cart
                </button>
                
               
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ✅ 1. Animated Hero Section (Updated)
const AnimatedHeroSection = ({ searchQuery, setSearchQuery, handleSearch }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      title: "Find Your Perfect Pet Companion",
      subtitle: "Adopt, Shop & Care for Your Furry Friends",
      image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1200&auto=format&fit=crop&q=60",
      color: "from-blue-600 to-purple-600",
      buttonText: "Explore Pets",
      icon: "🐕"
    },
    {
      id: 2,
      title: "Premium Pet Supplies Delivered",
      subtitle: "Everything Your Pet Needs at Your Doorstep",
      image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=1200&auto=format&fit=crop&q=60",
      color: "from-green-600 to-emerald-600",
      buttonText: "Shop Now",
      icon: "🛍️"
    },
    {
      id: 3,
      title: "Expert Care Services",
      subtitle: "Vets, Grooming & Training Professionals",
      image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=1200&auto=format&fit=crop&q=60",
      color: "from-orange-600 to-red-600",
      buttonText: "Book Services",
      icon: "👨‍⚕️"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <SafeImage
            src={slides[currentSlide].image}
            alt="Hero Background"
            className="w-full h-full object-cover"
            fallback="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1200&auto=format&fit=crop&q=60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-4">
              <FaPaw className="text-yellow-300" />
              <span className="font-medium">Bangladesh's #1 Pet Marketplace</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">PawMart</span>
            </h1>
            
            <div className="h-20 overflow-hidden">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl md:text-2xl text-white/90 mb-6"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{slides[currentSlide].icon}</span>
                  <div>
                    <p className="font-bold">{slides[currentSlide].title}</p>
                    <p>{slides[currentSlide].subtitle}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <form onSubmit={handleSearch} className="relative max-w-xl">
              <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-xl p-1 shadow-2xl">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for pets, food, accessories..."
                    className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 bg-transparent focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className={`bg-gradient-to-r ${slides[currentSlide].color} text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity`}
                >
                  <FaSearch />
                </button>
              </div>
            </form>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              to="/pets-supplies"
              className={`px-8 py-3 bg-gradient-to-r ${slides[currentSlide].color} text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2`}
            >
              <span>{slides[currentSlide].buttonText}</span>
              <FaArrowRight />
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl border-2 border-white/30 hover:bg-white/30 transition-all duration-300"
            >
              Become Seller
            </Link>
          </motion.div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-8 bg-white' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

// 2. Featured Categories Section
const FeaturedCategories = () => {
  const categories = [
    { id: 1, name: 'Dog Adoption', icon: '🐕', count: '250+', color: 'from-blue-500 to-cyan-500', link: '/category/dogs' },
    { id: 2, name: 'Cat Adoption', icon: '🐱', count: '180+', color: 'from-purple-500 to-pink-500', link: '/category/cats' },
    { id: 3, name: 'Pet Food', icon: '🍖', count: '500+', color: 'from-green-500 to-emerald-500', link: '/category/food' },
    { id: 4, name: 'Toys & Accessories', icon: '🎮', count: '350+', color: 'from-orange-500 to-red-500', link: '/category/toys' },
    { id: 5, name: 'Health Care', icon: '💊', count: '200+', color: 'from-indigo-500 to-blue-500', link: '/category/health' },
    { id: 6, name: 'Grooming', icon: '🧼', count: '120+', color: 'from-yellow-500 to-amber-500', link: '/category/grooming' }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full mb-4"
          >
            <FaPaw />
            <span className="font-bold">Browse Categories</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Pet <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Essentials</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover everything you need for your furry friend in our carefully curated categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <Link
                to={category.link}
                className="block group"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 text-center">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${category.color} text-white text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.count} Items</p>
                  <div className="mt-3 w-8 h-1 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto group-hover:w-12 transition-all duration-300"></div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ✅ 3. Deals of the Week Section (Enhanced with Cart Functionality)
const DealsOfTheWeek = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  
  const deals = [
    {
      id: 1,
      title: "Mega Quay Cat Food",
      description: "Premium grain free cat food with natural ingredients",
      originalPrice: "BDT 1,200",
      discountedPrice: "BDT 1,074",
      discount: "10% OFF",
      image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=60",
      tag: "HOT DEAL",
      badge: "🔥",
      color: "from-red-500 to-orange-500"
    },
    {
      id: 2,
      title: "Nature Brogerione Wet Food",
      description: "180Gr Premium wet food for healthy growth",
      originalPrice: "BDT 850",
      discountedPrice: "BDT 760",
      discount: "15% OFF",
      image: "https://images.unsplash.com/photo-1596276020587-43af4926b7e4?w=800&auto=format&fit=crop&q=60",
      tag: "LIMITED",
      badge: "⚡",
      color: "from-blue-500 to-purple-500"
    },
    {
      id: 3,
      title: "Grain Free Baby Cat Food",
      description: "Special formula for growing kittens",
      originalPrice: "BDT 950",
      discountedPrice: "BDT 850",
      discount: "12% OFF",
      image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&auto=format&fit=crop&q=60",
      tag: "POPULAR",
      badge: "👑",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const [activeDeal, setActiveDeal] = useState(0);
  
  const handleAddToCart = (deal) => {
    setCartItems(prev => [...prev, deal]);
    toast.success(`${deal.title} added to cart! 🛒`, {
      duration: 3000,
      icon: '🛒',
      style: {
        background: 'linear-gradient(to right, #667eea, #764ba2)',
        color: 'white',
        fontWeight: 'bold',
      },
    });
  };
  
  const handleBuyNow = (deal) => {
    handleAddToCart(deal);
    setTimeout(() => {
      navigate('/cart');
    }, 1000);
  };
  
  const handleViewDetails = (dealId) => {
    navigate(`/product/${dealId}`);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full mb-4"
          >
            <FaFire />
            <span className="font-bold">FLASH DEALS</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Deals of <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">the Week</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Limited time offers on premium pet products. Don't miss out!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {deals.map((deal, index) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              onMouseEnter={() => setActiveDeal(index)}
              className={`relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 ${
                activeDeal === index ? 'ring-2 ring-offset-2 ring-orange-500' : ''
              }`}
            >
              {/* Badge */}
              <div className="absolute top-4 left-4 z-20">
                <div className={`bg-gradient-to-r ${deal.color} text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg`}>
                  <span>{deal.badge}</span>
                  <span>{deal.tag}</span>
                </div>
              </div>

              {/* Discount Badge */}
              <div className="absolute top-4 right-4 z-20">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full font-bold shadow-lg">
                  {deal.discount}
                </div>
              </div>

              {/* Product Image */}
              <div className="h-48 overflow-hidden">
                <SafeImage
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  fallback="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>

              {/* Product Info */}
              <div className="bg-white p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{deal.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{deal.description}</p>
                
                {/* Price */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl font-bold text-gray-900">{deal.discountedPrice}</div>
                  <div className="text-lg text-gray-400 line-through">{deal.originalPrice}</div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Sold: {Math.floor(Math.random() * 50) + 20}</span>
                    <span>Available: {Math.floor(Math.random() * 30) + 10}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${deal.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${Math.random() * 40 + 60}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleBuyNow(deal)}
                    className={`flex-1 bg-gradient-to-r ${deal.color} text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-all duration-300`}
                  >
                    Buy Now
                  </button>
                  <button 
                    onClick={() => handleAddToCart(deal)}
                    className="px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors hover:bg-gray-50"
                  >
                    <FaShoppingCart />
                  </button>
                  <button 
                    onClick={() => handleViewDetails(deal.id)}
                    className="px-4 py-3 border-2 border-blue-300 text-blue-600 rounded-lg hover:border-blue-400 transition-colors hover:bg-blue-50"
                  >
                    <FaEye />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white text-center max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <FaClock className="text-2xl" />
            <h3 className="text-2xl font-bold">Offer Ends In:</h3>
          </div>
          <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
            {['03', '18', '42', '15'].map((time, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl py-4 mb-2">
                  <div className="text-3xl font-bold">{time}</div>
                </div>
                <div className="text-sm opacity-90">
                  {['Days', 'Hours', 'Minutes', 'Seconds'][index]}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm opacity-90">Hurry! Limited stock available at discounted prices</p>
        </motion.div>
      </div>
    </section>
  );
};

// 4. Why Choose Us Section
const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      title: "Verified Sellers",
      description: "All sellers undergo strict verification and background checks",
      icon: <FaShieldAlt className="text-3xl" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      title: "Quality Assurance",
      description: "100% authentic products with quality guarantee",
      icon: <FaAward className="text-3xl" />,
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 3,
      title: "Fast Delivery",
      description: "Same-day delivery available in major cities",
      icon: <FaShippingFast className="text-3xl" />,
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 4,
      title: "24/7 Support",
      description: "Round-the-clock customer support and vet consultation",
      icon: <FaUsers className="text-3xl" />,
      color: "from-orange-500 to-red-500"
    },
    {
      id: 5,
      title: "Eco-Friendly",
      description: "Sustainable and eco-friendly pet products",
      icon: <FaLeaf className="text-3xl" />,
      color: "from-yellow-500 to-amber-500"
    },
    {
      id: 6,
      title: "Best Prices",
      description: "Competitive prices with regular discounts and offers",
      icon: <FaTag className="text-3xl" />,
      color: "from-indigo-500 to-blue-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full mb-4"
          >
            <FaStar />
            <span className="font-bold">WHY CHOOSE US</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Experience the <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">PawMart Difference</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're not just a marketplace, we're a community dedicated to pets and their owners
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 h-full">
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
                <div className="mt-6 pt-6 border-t border-gray-100 group-hover:border-transparent transition-colors">
                  <div className="flex items-center text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                    <span className="mr-2">→</span>
                    <span>Learn more about this feature</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ✅ 5. Featured Products Slider (Enhanced with Modal)
const FeaturedProducts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const navigate = useNavigate();
  
  const products = [
    {
      id: 1,
      name: "Premium Dog Food 10kg",
      category: "Dry Food",
      price: "BDT 2,500",
      originalPrice: "BDT 3,000",
      rating: 4.8,
      description: "Premium quality dog food with natural ingredients, vitamins and minerals for optimal health",
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&auto=format&fit=crop&q=60",
      tag: "BESTSELLER"
    },
    {
      id: 2,
      name: "Cat Scratching Post",
      category: "Accessories",
      price: "BDT 1,200",
      originalPrice: "BDT 1,500",
      rating: 4.6,
      description: "Durable scratching post with sisal rope and plush top for your cat's comfort",
      image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800&auto=format&fit=crop&q=60",
      tag: "NEW"
    },
    {
      id: 3,
      name: "Pet Carrier Bag",
      category: "Travel",
      price: "BDT 1,800",
      originalPrice: "BDT 2,200",
      rating: 4.9,
      description: "Portable pet carrier with ventilation and safety features for comfortable travel",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=60",
      tag: "POPULAR"
    },
    {
      id: 4,
      name: "Automatic Pet Feeder",
      category: "Smart Products",
      price: "BDT 3,500",
      originalPrice: "BDT 4,000",
      rating: 4.7,
      description: "Smart automatic feeder with timer and portion control for your pet's feeding schedule",
      image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=60",
      tag: "SMART"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const handleAddToCart = (product) => {
    toast.success(`${product.name} added to cart! 🛒`, {
      duration: 3000,
      style: {
        background: 'linear-gradient(to right, #667eea, #764ba2)',
        color: 'white',
        fontWeight: 'bold',
      },
    });
  };

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full mb-4"
              >
                <FaGem />
                <span className="font-bold">FEATURED PRODUCTS</span>
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold">
                Editor's <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Picks</span>
              </h2>
              <p className="text-gray-600 mt-2">Handpicked quality products for your pets</p>
            </div>
            
            <div className="flex gap-4 mt-6 md:mt-0">
              <button
                onClick={prevSlide}
                className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow hover:scale-110"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={nextSlide}
                className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow hover:scale-110"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              >
                {/* Product Image */}
                <div className="relative">
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-2xl">
                    <div className="aspect-square rounded-2xl overflow-hidden">
                      <SafeImage
                        src={products[currentIndex].image}
                        alt={products[currentIndex].name}
                        className="w-full h-full object-cover"
                        fallback="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=60"
                      />
                    </div>
                    <div className="absolute top-8 left-8">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-bold">
                        {products[currentIndex].tag}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  <div>
                    <span className="text-sm text-purple-600 font-semibold">
                      {products[currentIndex].category}
                    </span>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2 mb-3">
                      {products[currentIndex].name}
                    </h3>
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400" />
                      ))}
                      <span className="ml-2 text-gray-600">({products[currentIndex].rating})</span>
                    </div>
                    <p className="text-gray-600">
                      {products[currentIndex].description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold text-gray-900">
                      {products[currentIndex].price}
                    </div>
                    <div className="text-xl text-gray-400 line-through">
                      {products[currentIndex].originalPrice}
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      SAVE 20%
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleAddToCart(products[currentIndex])}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity hover:scale-105"
                    >
                      Add to Cart
                    </button>
                    <button 
                      onClick={() => setQuickViewProduct(products[currentIndex])}
                      className="border-2 border-purple-500 text-purple-600 font-semibold py-3 rounded-lg hover:bg-purple-50 transition-colors hover:scale-105"
                    >
                      Quick View
                    </button>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-gray-900">🚚</div>
                        <div className="text-sm text-gray-600">Free Shipping</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">🔒</div>
                        <div className="text-sm text-gray-600">Secure Payment</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">🔄</div>
                        <div className="text-sm text-gray-600">30-Day Return</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Product Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'w-8 bg-gradient-to-r from-purple-500 to-pink-500' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />
    </>
  );
};

// ✅ 6. Enhanced Statistics Counter (Interactive)
const StatisticsCounter = () => {
  const stats = [
    { id: 1, value: 5000, label: 'Happy Pets Adopted', suffix: '+', color: 'text-blue-600', icon: '🐕' },
    { id: 2, value: 12000, label: 'Products Available', suffix: '+', color: 'text-green-600', icon: '🛍️' },
    { id: 3, value: 250, label: 'Verified Sellers', suffix: '+', color: 'text-purple-600', icon: '✅' },
    { id: 4, value: 98, label: 'Customer Satisfaction', suffix: '%', color: 'text-orange-600', icon: '😊' }
  ];

  const [counters, setCounters] = useState(stats.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            
            stats.forEach((stat, index) => {
              const duration = 2000;
              const steps = 60;
              const increment = stat.value / steps;
              let currentStep = 0;
              
              const interval = setInterval(() => {
                setCounters(prev => {
                  const newCounters = [...prev];
                  const newValue = Math.min(
                    newCounters[index] + increment,
                    stat.value
                  );
                  newCounters[index] = Math.round(newValue);
                  return newCounters;
                });
                
                currentStep++;
                if (currentStep >= steps) {
                  clearInterval(interval);
                }
              }, duration / steps);
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById('stats-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section id="stats-section" className="py-20 bg-gradient-to-r from-gray-900 to-black text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-full mb-4"
          >
            <FaTrophy />
            <span className="font-bold">OUR ACHIEVEMENTS</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Numbers That <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Speak</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Trusted by thousands of pet lovers across Bangladesh
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center group"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {stat.icon}
              </div>
              <div className="text-5xl md:text-6xl font-bold mb-2">
                <span className={stat.color}>{counters[index]}</span>
                <span className={stat.color}>{stat.suffix}</span>
              </div>
              <div className="text-lg text-gray-300">{stat.label}</div>
              <div className="mt-4 h-1 w-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto group-hover:w-16 transition-all duration-300"></div>
            </motion.div>
          ))}
        </div>

        {/* Live Counter Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span className="font-bold">Live Counter • Updates Real-time</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ✅ 7. Enhanced Recent Listings (With Functional Buttons)
const RecentListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(true);
  const navigate = useNavigate();

  const mockListings = [
    {
      id: 1,
      title: "Golden Retriever Puppy",
      category: "Pets",
      price: 0,
      location: "Dhaka",
      image: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=800&auto=format&fit=crop&q=60",
      description: "Friendly 2-month-old puppy available for adoption. Vaccinated and dewormed.",
      seller: "Pet Care Center",
      rating: 4.9,
      tags: ["Adoption", "Vaccinated", "Trained"]
    },
    {
      id: 2,
      title: "Persian Kitten",
      category: "Pets",
      price: 150,
      location: "Chattogram",
      image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&auto=format&fit=crop&q=60",
      description: "Beautiful white Persian kitten, 2 months old. Litter trained.",
      seller: "Cat Lovers Hub",
      rating: 4.8,
      tags: ["Pure Breed", "Vaccinated", "Litter Trained"]
    },
    {
      id: 3,
      title: "Premium Dog Food 5kg",
      category: "Food",
      price: 25,
      location: "Sylhet",
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&auto=format&fit=crop&q=60",
      description: "High-quality dog food with natural ingredients. Grain-free formula.",
      seller: "Pet Food Store",
      rating: 4.7,
      tags: ["Organic", "Grain-Free", "Natural"]
    },
    {
      id: 4,
      title: "Pet First Aid Kit",
      category: "Care",
      price: 30,
      location: "Dhaka",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&auto=format&fit=crop&q=60",
      description: "Complete pet first aid kit with bandages, antiseptic, and emergency tools.",
      seller: "Pet Safety First",
      rating: 4.9,
      tags: ["Essential", "Emergency", "Complete Kit"]
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setListings(mockListings);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleViewDetails = (listingId) => {
    navigate(`/listing/${listingId}`);
  };

  const handleAddToCart = (listing) => {
    if (listing.price === 0) {
      toast.success('Adoption request added! We will contact you soon. 🐾', {
        duration: 4000,
      });
    } else {
      toast.success(`${listing.title} added to cart! 🛒`, {
        duration: 3000,
      });
    }
  };

  const handleContactSeller = (seller) => {
    toast.success(`Connecting you with ${seller}... 📞`, {
      duration: 3000,
    });
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-full mb-4"
            >
              <FaRocket />
              <span className="font-bold">NEW ARRIVALS</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Listings</span>
            </h2>
            <p className="text-gray-600 mt-2">Freshly added pets and products</p>
          </div>
          
          <Link
            to="/pets-supplies"
            className="mt-6 md:mt-0 px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2 group"
          >
            <span>View All</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Status Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl ${isBackendConnected ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
            <div className={`w-3 h-3 rounded-full ${isBackendConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
            <span className="font-bold">
              {isBackendConnected ? '🎯 Live Data Connected' : '🔄 Demo Mode Active'}
            </span>
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading latest listings...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {listings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 h-full flex flex-col">
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden">
                    <SafeImage
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      fallback="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=60"
                    />
                    
                    {/* Price Badge */}
                    <div className="absolute top-4 right-4">
                      <div className={`px-4 py-2 rounded-full font-bold shadow-lg ${
                        listing.price === 0 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                          : 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                      }`}>
                        {listing.price === 0 ? 'FREE' : `$${listing.price}`}
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="px-3 py-1.5 bg-black/70 text-white text-sm font-bold rounded-full">
                        {listing.category}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <FaStar className="text-yellow-400" />
                        <span className="font-bold text-gray-900">{listing.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                      {listing.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                      {listing.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {listing.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Seller & Location */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
                          <FaUserCheck className="text-blue-600" />
                        </div>
                        <span>{listing.seller}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                          <span>📍</span>
                        </div>
                        <span>{listing.location}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 mt-auto">
                      <button 
                        onClick={() => handleViewDetails(listing.id)}
                        className="w-full bg-gradient-to-r from-gray-900 to-black text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all duration-300 hover:shadow-lg"
                      >
                        View Details
                      </button>
                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => handleAddToCart(listing)}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                        >
                          {listing.price === 0 ? 'Adopt Now' : 'Add to Cart'}
                        </button>
                        <button 
                          onClick={() => handleContactSeller(listing.seller)}
                          className="px-4 py-2 border-2 border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
                        >
                          Contact Seller
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* View More */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/pets-supplies"
            className="inline-flex items-center gap-3 px-8 py-4 border-2 border-gray-900 text-gray-900 font-bold rounded-xl hover:bg-gray-900 hover:text-white transition-all duration-300 group"
          >
            <span>Browse All Listings</span>
            <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// ✅ 8. Enhanced Testimonials (Auto-Sliding Carousel)
const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Pet Owner",
      content: "Found my perfect Labrador through PawMart. The adoption process was smooth and the team was incredibly helpful!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&auto=format&fit=crop&q=60",
      pet: "Golden Retriever"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Breeder",
      content: "As a verified seller, I appreciate the platform's transparency and support. Great community for pet lovers!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60",
      pet: "Persian Cat Breeder"
    },
    {
      id: 3,
      name: "Emma Wilson",
      role: "Veterinarian",
      content: "Quality products and responsible pet adoption practices. Highly recommend PawMart to my clients.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60",
      pet: "Pet Care Expert"
    },
    {
      id: 4,
      name: "David Park",
      role: "Pet Trainer",
      content: "The training resources and products available here are top-notch. My clients love the recommendations!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60",
      pet: "Dog Trainer"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-2 rounded-full mb-4"
          >
            <FaStar />
            <span className="font-bold">TESTIMONIALS</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-yellow-600">Pet Owners</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear what our community has to say about their PawMart experience
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl transition-shadow z-10"
          >
            <FaChevronLeft />
          </button>
          
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl transition-shadow z-10"
          >
            <FaChevronRight />
          </button>

          {/* Testimonial Carousel */}
          <div className="overflow-hidden">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Author Image */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                    <SafeImage
                      src={testimonials[currentIndex].image}
                      alt={testimonials[currentIndex].name}
                      className="w-full h-full object-cover"
                      fallback="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-3 rounded-full shadow-lg">
                    <FaPaw className="text-xl" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-xl" />
                    ))}
                  </div>

                  <p className="text-gray-700 text-lg md:text-xl italic mb-8">
                    "{testimonials[currentIndex].content}"
                  </p>

                  <div>
                    <h4 className="font-bold text-gray-900 text-xl">{testimonials[currentIndex].name}</h4>
                    <p className="text-gray-600">{testimonials[currentIndex].role}</p>
                    <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-full">
                      <FaDog className="text-orange-500" />
                      <span className="text-sm text-gray-700">{testimonials[currentIndex].pet}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote Icon */}
              <div className="text-8xl text-orange-100 absolute top-8 right-8">
                "
              </div>
            </motion.div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-8 bg-gradient-to-r from-orange-500 to-yellow-500' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ✅ 9. Enhanced How It Works (Interactive Steps)
const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(1);
  
  const steps = [
    {
      id: 1,
      title: "Browse & Search",
      description: "Explore thousands of pets and products with advanced filters",
      icon: "🔍",
      color: "from-blue-500 to-cyan-500",
      details: ["Search by category", "Filter by price range", "Sort by popularity"]
    },
    {
      id: 2,
      title: "Connect & Verify",
      description: "Message sellers directly and verify all details",
      icon: "💬",
      color: "from-purple-500 to-pink-500",
      details: ["Direct chat with sellers", "Verify health certificates", "Schedule meetings"]
    },
    {
      id: 3,
      title: "Secure Payment",
      description: "Safe and secure payment with multiple options",
      icon: "💳",
      color: "from-green-500 to-emerald-500",
      details: ["SSL secured payments", "Multiple payment methods", "Escrow protection"]
    },
    {
      id: 4,
      title: "Receive & Enjoy",
      description: "Get delivery or pickup and enjoy your new companion",
      icon: "🎉",
      color: "from-orange-500 to-red-500",
      details: ["Free delivery option", "Pet care guidance", "After-sales support"]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full mb-4"
          >
            <FaBolt />
            <span className="font-bold">HOW IT WORKS</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">4-Step</span> Process
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Getting your perfect pet has never been easier. Follow these simple steps:
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Steps Visualization */}
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 via-green-500 to-orange-500 -translate-y-1/2 rounded-full"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 relative z-10">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative"
                  onMouseEnter={() => setActiveStep(step.id)}
                  onClick={() => setActiveStep(step.id)}
                >
                  <div className={`bg-white rounded-2xl p-6 shadow-xl border-2 transition-all duration-300 cursor-pointer ${
                    activeStep === step.id 
                      ? `border-${step.color.split(' ')[1].replace('from-', '')} shadow-2xl scale-105` 
                      : 'border-gray-100'
                  }`}>
                    {/* Step Number */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg ${
                        activeStep === step.id 
                          ? `bg-gradient-to-r ${step.color} text-white` 
                          : 'bg-gray-900 text-white'
                      }`}>
                        {step.id}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className={`inline-flex p-6 rounded-2xl mb-6 mt-4 transition-all duration-300 ${
                      activeStep === step.id 
                        ? `bg-gradient-to-r ${step.color} text-white scale-110` 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <span className="text-3xl">{step.icon}</span>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>

                    {/* Arrow (for mobile) */}
                    {index < steps.length - 1 && (
                      <div className="lg:hidden mt-6 text-center">
                        <div className="text-gray-300 text-2xl">↓</div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Active Step Details */}
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-xl"
          >
            <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${steps[activeStep - 1].color} text-white text-2xl mb-6`}>
              {steps[activeStep - 1].icon}
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Step {activeStep}: {steps[activeStep - 1].title}
            </h3>
            
            <p className="text-gray-600 mb-6">{steps[activeStep - 1].description}</p>
            
            <div className="space-y-3">
              {steps[activeStep - 1].details.map((detail, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${steps[activeStep - 1].color} flex items-center justify-center`}>
                    <FaCheckCircle className="text-white text-xs" />
                  </div>
                  <span className="text-gray-700">{detail}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link
                to={activeStep === 1 ? "/pets-supplies" : 
                     activeStep === 2 ? "/contact" : 
                     activeStep === 3 ? "/pets-supplies" : "/events"}
                className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${steps[activeStep - 1].color} text-white font-semibold rounded-xl hover:shadow-lg transition-shadow`}
              >
                <span>Get Started</span>
                <FaArrowRight />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ✅ 10. Enhanced Newsletter (With GIF and Animation)
const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('🎉 Successfully subscribed to PawMart newsletter!', {
        duration: 4000,
        style: {
          background: 'linear-gradient(to right, #667eea, #764ba2)',
          color: 'white',
          fontWeight: 'bold',
        },
      });
      setSubscribed(true);
      setLoading(false);
      setEmail('');
      
      // Reset after 5 seconds
      setTimeout(() => setSubscribed(false), 5000);
    }, 1500);
  };

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-6">
                <FaGift className="text-xl" />
                <span className="font-bold">EXCLUSIVE OFFERS</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">Pet Perks</span> & Updates
              </h2>
              
              <p className="text-xl opacity-90 mb-8">
                Subscribe to our newsletter and be the first to know about new pets, 
                special discounts, pet care tips, and exclusive member-only offers.
              </p>

              {/* Benefits */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🎁</span>
                  </div>
                  <div>
                    <div className="font-bold">Welcome Gift</div>
                    <div className="text-sm opacity-80">Free pet toy</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-lg">💎</span>
                  </div>
                  <div>
                    <div className="font-bold">Exclusive Deals</div>
                    <div className="text-sm opacity-80">Members-only discounts</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-lg">📰</span>
                  </div>
                  <div>
                    <div className="font-bold">Pet Care Tips</div>
                    <div className="text-sm opacity-80">Expert advice weekly</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🏆</span>
                  </div>
                  <div>
                    <div className="font-bold">Early Access</div>
                    <div className="text-sm opacity-80">New arrivals first</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Subscription Form */}
            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20"
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCheckCircle className="text-3xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Welcome to the Pack! 🎉</h3>
                  <p className="opacity-90 mb-4">
                    Check your email for a special welcome gift and exclusive offers!
                  </p>
                  <button
                    onClick={() => setSubscribed(false)}
                    className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                  >
                    Subscribe Another Email
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-6 py-4 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/50"
                    required
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 min-w-[180px]"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Subscribing...</span>
                      </>
                    ) : (
                      <>
                        <FaGift />
                        <span>Subscribe Now</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm opacity-75">
                  By subscribing, you agree to our Privacy Policy. No spam, unsubscribe anytime.
                  <span className="block mt-1">📧 15,000+ pet lovers already subscribed!</span>
                </p>
              </motion.form>
            )}
          </div>

          {/* Right Side - Animated Pet */}
          <div className="relative">
            <div className="relative h-96 lg:h-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-3xl"
              ></motion.div>
              
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <div className="text-9xl">🐶</div>
              </motion.div>
              
              {/* Floating Elements */}
              <motion.div
                animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.2 }}
                className="absolute top-10 left-10 text-3xl"
              >
                🎁
              </motion.div>
              <motion.div
                animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.4 }}
                className="absolute bottom-10 right-10 text-3xl"
              >
                🐾
              </motion.div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute top-20 right-20 text-2xl"
              >
                ⭐
              </motion.div>
            </div>
            
            {/* Stats Badge */}
            <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold">98%</div>
                <div className="text-sm opacity-90">Happy Subscribers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ✅ 11. Enhanced CTA Section (With Parallax Effect)
const CTA = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 20;
    const y = (clientY / window.innerHeight - 0.5) * 20;
    setMousePosition({ x, y });
  };

  return (
    <section 
      className="relative py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-48 -right-48 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full"
        ></motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-48 -left-48 w-96 h-96 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-full"
        ></motion.div>
        
        {/* Floating Pets */}
        <motion.div
          animate={{ x: mousePosition.x, y: mousePosition.y }}
          className="absolute top-1/4 left-1/4 text-4xl"
        >
          🐕
        </motion.div>
        <motion.div
          animate={{ x: -mousePosition.x, y: -mousePosition.y }}
          className="absolute bottom-1/4 right-1/4 text-4xl"
        >
          🐱
        </motion.div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-full mb-6"
          >
            <FaCrown />
            <span className="font-bold">JOIN OUR COMMUNITY</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Ready to Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Perfect Pet</span>?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl opacity-90 mb-8 max-w-2xl mx-auto"
          >
            Join thousands of happy pet owners who found their furry family members through PawMart
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg group"
            >
              <span className="flex items-center justify-center gap-3">
                Get Started Free
                <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
              </span>
            </button>
            <button
              onClick={() => navigate('/pets-supplies')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300 group"
            >
              <span className="flex items-center justify-center gap-3">
                Browse Pets
                <FaPaw className="group-hover:scale-110 transition-transform" />
              </span>
            </button>
          </motion.div>

          {/* Interactive Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          >
            {[
              { icon: '🐾', label: 'Pet Adoption', count: '5K+' },
              { icon: '🛒', label: 'Pet Supplies', count: '12K+' },
              { icon: '👨‍⚕️', label: 'Vet Services', count: '200+' },
              { icon: '🏆', label: 'Happy Community', count: '50K+' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold mb-1">{stat.count}</div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Floating CTA */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-12"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-full border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">🚀 Start your pet journey today!</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent"></div>
    </section>
  );
};

// Main Home Component
const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      toast.error('Please enter search keyword');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Animated Hero Section */}
      <AnimatedHeroSection 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />

      {/* 2. Featured Categories */}
      <FeaturedCategories />

      {/* 3. Deals of the Week */}
      <DealsOfTheWeek />

      {/* 4. Why Choose Us */}
      <WhyChooseUs />

      {/* 5. Featured Products */}
      <FeaturedProducts />

      {/* 6. Enhanced Statistics Counter */}
      <StatisticsCounter />

      {/* 7. Enhanced Recent Listings */}
      <RecentListings />

      {/* 8. Enhanced Testimonials */}
      <Testimonials />

      {/* 9. Enhanced How It Works */}
      <HowItWorks />

      {/* 10. Enhanced Newsletter */}
      <Newsletter />

      {/* 11. Enhanced CTA Section */}
      <CTA />
    </div>
  );
};

export default Home;