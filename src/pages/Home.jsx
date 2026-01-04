import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  FaDog, FaPaw, FaHeart, FaShieldAlt, FaUsers, FaMapMarkerAlt, 
  FaChevronLeft, FaChevronRight, FaBone, FaFirstAid, FaShoppingBasket,
  FaStar, FaTrophy, FaCalendarAlt, FaPhoneAlt, FaEnvelope, 
  FaFacebook, FaTwitter, FaInstagram, FaCheckCircle, FaQuestionCircle,
  FaTag, FaShippingFast, FaHeadset, FaHandHoldingHeart, FaChartLine,
  FaAward, FaLeaf, FaRecycle, FaShieldVirus, FaUserCheck, FaClipboardCheck,
  FaMobileAlt, FaDesktop, FaTabletAlt, FaBell, FaNewspaper,
  FaSearch, FaFilter, FaArrowRight
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';

const SafeImage = ({ src, alt, className, fallback }) => {
  const [imgSrc, setImgSrc] = useState(src);
  
  useEffect(() => {
    setImgSrc(src);
  }, [src]);
  
  const handleError = () => {
    console.log(`Image failed to load: ${src}`);
    setImgSrc(fallback || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80');
  };
  
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

// DealsOfTheWeek Component
const DealsOfTheWeek = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const intervalRef = useRef(null);

  const deals = [
    {
      id: 1,
      title: "Mega Quay Cat Food",
      subtitle: "Premium grain free cat food",
      originalPrice: "BDT 1200",
      discountedPrice: "BDT 1074",
      discount: "10.53% OFF",
      image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80",
      tag: "MEGA DEAL",
      description: "Premium quality cat food with all essential nutrients"
    },
    {
      id: 2,
      title: "Nature Brogerione Wet Food",
      subtitle: "180Gr Premium wet food",
      originalPrice: "BDT 850",
      discountedPrice: "BDT 760",
      discount: "10.59% OFF",
      image: "https://images.unsplash.com/photo-1596276020587-43af4926b7e4?w=800&auto=format&fit=crop&q=80",
      tag: "WET FOOD",
      description: "Natural ingredients for healthy growth"
    },
    {
      id: 3,
      title: "Grain Free Baby Cat Food",
      subtitle: "Special formula for kittens",
      originalPrice: "BDT 950",
      discountedPrice: "BDT 850",
      discount: "10.53% OFF",
      image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&auto=format&fit=crop&q=80",
      tag: "BABY CAT",
      description: "Specially formulated for growing kittens"
    }
  ];

  useEffect(() => {
    if (autoPlay) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % deals.length);
      }, 4000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlay, deals.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 5000);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-white to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full shadow-lg mb-6">
            <span className="text-xl">🔥</span>
            <span className="text-lg font-bold">Deals of this week</span>
            <span className="text-xl">🔥</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Mega <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Discounts</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Limited time offers on premium pet products. Don't miss out!
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative mb-12">
          {/* Main Slider */}
          <div className="overflow-hidden rounded-3xl shadow-2xl bg-white">
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {deals.map((deal) => (
                <div key={deal.id} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    {/* Left Side - Product Image */}
                    <div className="relative h-96 lg:h-auto">
                      <img
                        src={deal.image}
                        alt={deal.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-6 left-6">
                        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                          {deal.tag}
                        </div>
                      </div>
                      <div className="absolute bottom-6 right-6">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-full shadow-lg transform rotate-12">
                          <div className="text-2xl font-bold">{deal.discount}</div>
                          <div className="text-xs opacity-90">DISCOUNT</div>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Product Details */}
                    <div className="bg-gradient-to-br from-gray-50 to-white p-8 lg:p-12">
                      <div className="h-full flex flex-col justify-center">
                        <div className="mb-8">
                          <h3 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">{deal.title}</h3>
                          <p className="text-xl text-gray-700 mb-2">{deal.subtitle}</p>
                          <p className="text-gray-600">{deal.description}</p>
                        </div>

                        {/* Price Section */}
                        <div className="mb-8">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="text-5xl font-bold text-gray-900">{deal.discountedPrice}</div>
                            <div className="text-2xl text-gray-400 line-through">{deal.originalPrice}</div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${Math.random() * 30 + 70}%` }}
                            ></div>
                          </div>
                          <div className="text-sm text-gray-500 mt-2">Limited stock available</div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-4">
                          <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                            Buy Now
                          </button>
                          <button className="bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 font-bold py-4 px-6 rounded-xl transition-all duration-300 border border-gray-300">
                            Add to Cart
                          </button>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                              <div className="text-2xl">🚚</div>
                              <div className="text-sm text-gray-600">Free Shipping</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl">🔒</div>
                              <div className="text-sm text-gray-600">Secure Payment</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl">🔄</div>
                              <div className="text-sm text-gray-600">7 Day Return</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
            {deals.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Timer */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-xl mb-4 text-gray-700">⏰ Offer ends in:</div>
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
              {['03', '18', '42', '15'].map((value, index) => (
                <div key={index} className="text-center">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-3xl font-bold py-4 rounded-lg mb-2">
                    {value}
                  </div>
                  <div className="text-sm text-gray-600">
                    {['Days', 'Hours', 'Minutes', 'Seconds'][index]}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-gray-500 text-sm">
              Hurry up! These deals won't last long. Limited stock available.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Regular Products Section Component
const RegularProductsSection = () => {
  const products = [
    {
      id: 1,
      title: "Kitty Cholche Pure Natural Bentonite cat litter",
      price: "BDT 600",
      image: "https://images.unsplash.com/photo-1576568684254-7b4b6c76d4c1?w=800&auto=format&fit=crop&q=80",
      badge: "NEW",
      category: "Cat Litter",
      stock: "In stock"
    },
    {
      id: 2,
      title: "Gibo all life stage grain free cat dry food 500g",
      price: "BDT 350",
      image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80",
      badge: "POPULAR",
      category: "Dry Food",
      stock: "In stock"
    },
    {
      id: 3,
      title: "Gibo Cat Puree Creamy Treats Creamy treat for cat",
      price: "BDT 220",
      image: "https://images.unsplash.com/photo-1514888286974-6d03bdeacba8?w=800&auto=format&fit=crop&q=80",
      badge: "TREATS",
      category: "Treats",
      stock: "In stock"
    },
    {
      id: 4,
      title: "Gerry Pet Bentonite Cat litter Coffee 5L",
      price: "BDT 350",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&auto=format&fit=crop&q=80",
      badge: "BEST SELLER",
      category: "Cat Litter",
      stock: "In stock"
    },
    {
      id: 5,
      title: "Bioline Cat Treats Meat Paste Chicken Flavor 6x15",
      price: "BDT 265",
      image: "https://images.unsplash.com/photo-1596276020587-43af4926b7e4?w=800&auto=format&fit=crop&q=80",
      badge: "CHICKEN",
      category: "Treats",
      stock: "In stock"
    },
    {
      id: 6,
      title: "Whiskas Cat Wet Food Chicken & Liver 85g",
      price: "BDT 180",
      image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&auto=format&fit=crop&q=80",
      badge: "WET FOOD",
      category: "Wet Food",
      stock: "In stock"
    },
    {
      id: 7,
      title: "Premium Cat Scratching Post with Feather Toy",
      price: "BDT 850",
      image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800&auto=format&fit=crop&q=80",
      badge: "ACCESSORY",
      category: "Accessories",
      stock: "In stock"
    },
    {
      id: 8,
      title: "Cat Dental Care Kit Toothbrush & Toothpaste",
      price: "BDT 420",
      image: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800&auto=format&fit=crop&q=80",
      badge: "HEALTH",
      category: "Health",
      stock: "In stock"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Regular Products
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Premium quality pet products at competitive prices. All items are in stock and ready for delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 4).map(product => (
            <div key={product.id} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-2">
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white ${
                  product.badge === 'NEW' ? 'bg-gradient-to-r from-blue-500 to-purple-500' :
                  product.badge === 'POPULAR' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                  product.badge === 'TREATS' ? 'bg-gradient-to-r from-pink-500 to-rose-500' :
                  'bg-gradient-to-r from-yellow-500 to-amber-500'
                }`}>
                  {product.badge}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 h-14">
                  {product.title}
                </h3>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-gray-900">{product.price}</div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">{product.stock}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div className="text-center bg-green-50 py-2 rounded-lg">
                    <div className="text-xs text-gray-500">Available</div>
                    <div className="text-sm font-bold text-green-600">In stock</div>
                  </div>
                  <div className="text-center bg-blue-50 py-2 rounded-lg">
                    <div className="text-xs text-gray-500">Category</div>
                    <div className="text-sm font-bold text-blue-600">{product.category}</div>
                  </div>
                  <div className="text-center bg-purple-50 py-2 rounded-lg">
                    <div className="text-xs text-gray-500">Quality</div>
                    <div className="text-sm font-bold text-purple-600">Premium</div>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
          {products.slice(4, 8).map(product => (
            <div key={product.id} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-2">
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white ${
                  product.badge === 'CHICKEN' ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                  product.badge === 'WET FOOD' ? 'bg-gradient-to-r from-teal-500 to-cyan-500' :
                  product.badge === 'ACCESSORY' ? 'bg-gradient-to-r from-indigo-500 to-blue-500' :
                  'bg-gradient-to-r from-emerald-500 to-green-500'
                }`}>
                  {product.badge}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 h-14">
                  {product.title}
                </h3>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-gray-900">{product.price}</div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">{product.stock}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div className="text-center bg-green-50 py-2 rounded-lg">
                    <div className="text-xs text-gray-500">Available</div>
                    <div className="text-sm font-bold text-green-600">In stock</div>
                  </div>
                  <div className="text-center bg-blue-50 py-2 rounded-lg">
                    <div className="text-xs text-gray-500">Category</div>
                    <div className="text-sm font-bold text-blue-600">{product.category}</div>
                  </div>
                  <div className="text-center bg-purple-50 py-2 rounded-lg">
                    <div className="text-xs text-gray-500">Quality</div>
                    <div className="text-sm font-bold text-purple-600">Premium</div>
                  </div>
                </div>

                <button className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg ${
                  product.badge === 'CHICKEN' ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white' :
                  product.badge === 'WET FOOD' ? 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white' :
                  product.badge === 'ACCESSORY' ? 'bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white' :
                  'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white'
                }`}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-3 bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 text-white font-bold py-4 px-12 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <span>View All Products</span>
            <span className="text-xl">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

// Animated Hero Section Component
const AnimatedHeroSection = ({ searchQuery, setSearchQuery, handleSearch, heroOffers, heroCategories, defaultPetImage }) => {
  const [heroTextIndex, setHeroTextIndex] = useState(0);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [heroTextVisible, setHeroTextVisible] = useState(true);

  const heroTexts = [
    "Find Your Perfect Furry Friend",
    "Adopt Your Dream Pet Today",
    "Premium Pet Supplies Delivered"
  ];

  const heroSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1200&auto=format&fit=crop&q=80",
      title: "Loving Pets Waiting",
      subtitle: "Find your perfect companion"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=1200&auto=format&fit=crop&q=80",
      title: "Premium Pet Supplies",
      subtitle: "Everything your pet needs"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=1200&auto=format&fit=crop&q=80",
      title: "Expert Pet Care",
      subtitle: "Vets and trainers available"
    }
  ];

  useEffect(() => {
    const textInterval = setInterval(() => {
      setHeroTextVisible(false);
      setTimeout(() => {
        setHeroTextIndex((prev) => (prev + 1) % heroTexts.length);
        setHeroTextVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(textInterval);
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-white via-blue-50 to-purple-50 py-12 md:py-24 overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-x-36 -translate-y-36 opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-orange-100 to-pink-100 rounded-full translate-x-48 translate-y-48 opacity-50"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content - Animated Text */}
          <div>
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full px-4 py-2 mb-6">
                <span className="text-yellow-300">🎯</span>
                <span className="text-sm font-medium">Bangladesh's #1 Pet Marketplace</span>
              </div>
              
              {/* Animated Main Title */}
              <div className="h-24 md:h-32 overflow-hidden">
                <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900 transition-all duration-500 transform ${
                  heroTextVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
                }`}>
                  <span className="block text-3xl md:text-4xl text-gray-600 mb-2">Welcome to PawMart</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                    {heroTexts[heroTextIndex]}
                  </span>
                </h1>
              </div>
              
              {/* Animated Dots */}
              <div className="flex gap-2 mb-8">
                {heroTexts.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-500 ${
                      index === heroTextIndex 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 w-8' 
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
                Discover thousands of pets for adoption, premium pet supplies, and expert services 
                from verified sellers across Bangladesh.
              </p>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="relative max-w-2xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500">🔍</span>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for pets, food, accessories..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Search
                </button>
              </div>
            </form>
            
            {/* Hero Offers */}
            <div className="flex flex-wrap gap-4 mb-8">
              {heroOffers.map(offer => (
                <div key={offer.id} className={`${offer.bgColor} rounded-lg px-4 py-2 flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}>
                  <span className="font-bold text-white">✨</span>
                  <span className="font-bold text-white">{offer.title}</span>
                  <span className="text-sm text-white/90">{offer.subtitle}</span>
                </div>
              ))}
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/pets-supplies"
                className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden"
              >
                <span className="relative z-10">Browse Pets</span>
                <span className="relative z-10 text-xl group-hover:translate-x-2 transition-transform duration-300">→</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link 
                to="/register"
                className="group relative inline-flex items-center justify-center gap-3 border-2 border-blue-500 text-blue-500 hover:text-white font-bold py-3 px-8 rounded-xl text-lg transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">Become Seller</span>
                <div className="absolute inset-0 bg-blue-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              </Link>
            </div>
          </div>
          
          {/* Right Content - Animated Image Slider */}
          <div className="relative">
            {/* Main Slider Container */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              {/* Slides */}
              <div className="relative h-[500px] overflow-hidden">
                {heroSlides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-all duration-1000 ${
                      index === heroSlideIndex
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-105'
                    }`}
                  >
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    {/* Slide Content */}
                    <div className={`absolute bottom-0 left-0 right-0 p-8 text-white transition-all duration-700 delay-300 ${
                      index === heroSlideIndex
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'
                    }`}>
                      <h3 className="text-3xl font-bold mb-2">{slide.title}</h3>
                      <p className="text-lg opacity-90">{slide.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Slide Indicators */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setHeroSlideIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === heroSlideIndex 
                        ? 'bg-gradient-to-r from-blue-400 to-purple-400 w-8' 
                        : 'bg-white/50 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Floating Categories - Animated */}
            <div className="mt-8 grid grid-cols-4 gap-4">
              {heroCategories.map((cat, index) => (
                <div
                  key={cat.id}
                  className="bg-white/90 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-white transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="text-2xl mb-1">{cat.icon}</div>
                  <div className="font-semibold text-gray-900">{cat.name}</div>
                  <div className="text-xs text-gray-600">{cat.count} Available</div>
                </div>
              ))}
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  );
};

const Home = () => {
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [activeBlogIndex, setActiveBlogIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const API_URL = 'https://backend-10-five.vercel.app';
  const defaultPetImage = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80';
  const defaultPersonImage = 'https://www.lucypetproducts.com/wp-content/uploads/2021/04/Brandon_McMillan.jpg';

  // Bigmarket-style Hero Data
  const heroOffers = [
    { id: 1, title: 'Save 35% OFF', subtitle: 'All Pet Supplies', bgColor: 'bg-red-500' },
    { id: 2, title: 'Free Delivery', subtitle: 'On First Order', bgColor: 'bg-blue-500' },
    { id: 3, title: 'Pet Adoption', subtitle: 'Free Consultation', bgColor: 'bg-green-500' },
  ];

  const heroCategories = [
    { id: 1, name: 'Dogs', icon: '🐕', count: '120+', color: 'from-blue-400 to-blue-600' },
    { id: 2, name: 'Cats', icon: '🐱', count: '80+', color: 'from-purple-400 to-purple-600' },
    { id: 3, name: 'Birds', icon: '🦜', count: '45+', color: 'from-green-400 to-green-600' },
    { id: 4, name: 'Small Pets', icon: '🐰', count: '60+', color: 'from-pink-400 to-pink-600' },
  ];

  // Statistics Data
  const statistics = [
    { id: 1, value: '500+', label: 'Pets Adopted', icon: '🐾' },
    { id: 2, value: '1,200+', label: 'Happy Customers', icon: '😊' },
    { id: 3, value: '50+', label: 'Verified Sellers', icon: '✓' },
    { id: 4, value: '24/7', label: 'Customer Support', icon: '📞' }
  ];

  // Features Data
  const features = [
    {
      id: 1,
      title: 'Verified Sellers',
      description: 'All sellers undergo strict verification process',
      icon: '✓'
    },
    {
      id: 2,
      title: 'Safe Adoption',
      description: 'Secure and transparent adoption process',
      icon: '🛡️'
    },
    {
      id: 3,
      title: 'Quality Products',
      description: '100% authentic and premium quality products',
      icon: '⭐'
    },
    {
      id: 4,
      title: 'Fast Delivery',
      description: 'Quick and safe delivery across Bangladesh',
      icon: '🚚'
    }
  ];

  // Services Data
  const services = [
    {
      id: 1,
      title: 'Pet Adoption',
      description: 'Find your perfect furry companion from verified adopters',
      icon: '🏠',
      color: 'from-pink-400 to-pink-600'
    },
    {
      id: 2,
      title: 'Vet Consultation',
      description: 'Online veterinary consultation services',
      icon: '👨‍⚕️',
      color: 'from-green-400 to-green-600'
    },
    {
      id: 3,
      title: 'Pet Training',
      description: 'Professional training programs for pets',
      icon: '🎓',
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 4,
      title: 'Grooming Services',
      description: 'Professional grooming at your doorstep',
      icon: '✂️',
      color: 'from-purple-400 to-purple-600'
    }
  ];

  // Process Steps
  const processSteps = [
    { step: 1, title: 'Browse Listings', description: 'Explore pets and products', icon: '🔍' },
    { step: 2, title: 'Connect with Seller', description: 'Message directly or call', icon: '💬' },
    { step: 3, title: 'Secure Payment', description: 'Safe transaction methods', icon: '💳' },
    { step: 4, title: 'Receive Delivery', description: 'Get your pet/products safely', icon: '📦' }
  ];

  const categories = [
    { id: 1, name: 'Pets (Adoption)', icon: '🐕', color:'from-blue-400 to-blue-600', bgColor:'bg-blue-50', textColor:'text-blue-600', route:'/category-filtered-product/Pets', description:'Find loving pets for adoption' },
    { id: 2, name: 'Pet Food', icon: '🍖', color:'from-green-400 to-green-600', bgColor:'bg-green-50', textColor:'text-green-600', route:'/category-filtered-product/Food', description:'Quality nutrition for pets' },
    { id: 3, name: 'Accessories', icon: '🛍️', color:'from-purple-400 to-purple-600', bgColor:'bg-purple-50', textColor:'text-purple-600', route:'/category-filtered-product/Accessories', description:'Toys, beds & essentials' },
    { id: 4, name: 'Care Products', icon: '🧴', color:'from-red-400 to-red-600', bgColor:'bg-red-50', textColor:'text-red-600', route:'/category-filtered-product/Care Products', description:'Health & wellness products' }
  ];

  const adoptionBenefits = [
    { icon:'💖', title:'Save a Life', description:'You give a second chance to an animal in need' },
    { icon:'🛡️', title:'Combat Puppy Mills', description:'Adoption discourages unethical breeding practices' },
    { icon:'🐾', title:'Get a Vetted Pet', description:'Shelter pets are often vaccinated and spayed/neutered' },
    { icon:'👥', title:'Support Community', description:'Your adoption fee helps other animals in need' }
  ];

  useEffect(() => {
    fetchRecentListings();
  }, []);

  const fetchRecentListings = async () => {
    try {
      setLoading(true);
      
      const workingEndpoint = `${API_URL}/listings/latest/6`;
      
      try {
        const response = await fetch(workingEndpoint, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          let listingsArray = [];
          
          if (Array.isArray(data)) {
            listingsArray = data;
          } else if (data && data.listings && Array.isArray(data.listings)) {
            listingsArray = data.listings;
          }
          
          if (listingsArray.length > 0) {
            const backendListings = listingsArray.map(item => ({
              _id: item._id || `listing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              id: item.id || item._id || 'unknown',
              name: item.name || item.title || 'Unnamed Listing',
              category: item.category || 'General',
              price: item.price || 0,
              location: item.location || 'Unknown',
              image: item.image || (item.imageUrls && item.imageUrls[0]) || getDefaultImage(item.category),
              description: item.description || 'No description available',
              sellerName: item.sellerName || item.user?.name || 'Anonymous',
              email: item.email || item.user?.email || 'N/A',
              date: item.date || (item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
              source: 'backend'
            }));
            
            if (backendListings.length < 6) {
              const mockListings = getMockListings();
              const combinedListings = [...backendListings];
              
              for (let i = 0; i < mockListings.length && combinedListings.length < 6; i++) {
                const mockItem = mockListings[i];
                const exists = combinedListings.some(item => 
                  item.name === mockItem.name || 
                  item._id === mockItem._id
                );
                
                if (!exists) {
                  combinedListings.push({
                    ...mockItem,
                    source: 'mock-completion'
                  });
                }
              }
              
              setRecentListings(combinedListings.slice(0, 6));
              setIsBackendConnected(true);
              
            } else {
              setRecentListings(backendListings.slice(0, 6));
              setIsBackendConnected(true);
            }
            
            return;
          }
        }
      } catch (error) {
        console.log('⚠️ Working endpoint failed:', error.message);
      }
      
      const endpoints = [
        `${API_URL}/api/listings/latest/6`,
        `${API_URL}/listings`,
        `${API_URL}/api/listings`
      ];
      
      for (const endpoint of endpoints) {
        try {
          const response = await axios.get(endpoint, { timeout: 3000 });
          
          let listingsData = [];
          
          if (Array.isArray(response.data)) {
            listingsData = response.data;
          } else if (response.data && response.data.listings && Array.isArray(response.data.listings)) {
            listingsData = response.data.listings;
          } else if (response.data && Array.isArray(response.data)) {
            listingsData = response.data;
          }
          
          if (listingsData.length > 0) {
            const backendListings = listingsData.slice(0, 6).map(item => ({
              _id: item._id || `listing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              id: item.id || item._id || 'unknown',
              name: item.name || item.title || 'Unnamed Listing',
              category: item.category || 'General',
              price: item.price || 0,
              location: item.location || 'Unknown',
              image: item.image || (item.imageUrls && item.imageUrls[0]) || getDefaultImage(item.category),
              description: item.description || 'No description available',
              sellerName: item.sellerName || item.user?.name || 'Anonymous',
              email: item.email || item.user?.email || 'N/A',
              date: item.date || (item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
              source: 'backend-fallback'
            }));
            
            if (backendListings.length < 6) {
              const mockListings = getMockListings();
              const combinedListings = [...backendListings];
              
              for (let i = 0; i < mockListings.length && combinedListings.length < 6; i++) {
                const mockItem = mockListings[i];
                const exists = combinedListings.some(item => 
                  item.name === mockItem.name
                );
                
                if (!exists) {
                  combinedListings.push({
                    ...mockItem,
                    source: 'mock-fallback'
                  });
                }
              }
              
              setRecentListings(combinedListings.slice(0, 6));
            } else {
              setRecentListings(backendListings.slice(0, 6));
            }
            
            setIsBackendConnected(true);
            
            return;
          }
        } catch (endpointError) {
          continue;
        }
      }
      
      setIsBackendConnected(false);
      
      const mockData = getMockListings().slice(0, 6);
      setRecentListings(mockData);
      
    } catch (error) {
      console.error('❌ Error in fetchRecentListings:', error);
      setIsBackendConnected(false);
      
      const mockData = getMockListings().slice(0, 6);
      setRecentListings(mockData);
      
    } finally {
      setLoading(false);
    }
  };

  const getDefaultImage = (category) => {
    switch(category) {
      case 'Pets': return 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=800&auto=format&fit=crop&q=80';
      case 'Food': return 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&auto=format&fit=crop&q=80';
      case 'Accessories': return 'https://images.unsplash.com/photo-1514888286974-6d03bdeacba8?w=800&auto=format&fit=crop&q=80';
      case 'Care Products': return 'https://images.unsplash.com/photo-1560743641-3914f2c45636?w=800&auto=format&fit=crop&q=80';
      default: return defaultPetImage;
    }
  };

  const getMockListings = () => ([
    { 
      _id: '1', 
      name: 'Golden Retriever Puppy', 
      category: 'Pets', 
      price: 0, 
      location: 'Dhaka', 
      image: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=800&auto=format&fit=crop&q=80', 
      description: 'Friendly 2-month-old puppy available for adoption.', 
      sellerName: 'Pet Care Center',
      email: 'petcare@example.com',
      date: '2025-10-27',
      source: 'demo'
    },
    { 
      _id: '2', 
      name: 'Persian Kitten', 
      category: 'Pets', 
      price: 150, 
      location: 'Chattogram', 
      image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&auto=format&fit=crop&q=80', 
      description: 'Beautiful white Persian kitten, 2 months old.', 
      sellerName: 'Cat Lovers Hub',
      email: 'catlover@example.com',
      date: '2025-10-28',
      source: 'demo'
    },
    { 
      _id: '3', 
      name: 'Premium Dog Food 5kg', 
      category: 'Food', 
      price: 25, 
      location: 'Sylhet', 
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&auto=format&fit=crop&q=80', 
      description: 'High-quality dog food with natural ingredients.', 
      sellerName: 'Pet Food Store',
      email: 'petfood@example.com',
      date: '2025-10-29',
      source: 'demo'
    },
    {
      _id: '4',
      name: 'Pet First Aid Kit',
      category: 'Care Products',
      price: 30,
      location: 'Dhaka',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=1167&auto=format&fit=crop',
      description: 'Complete pet first aid kit with bandages, antiseptic, and emergency guide.',
      sellerName: 'Pet Safety First',
      email: 'petsafety@example.com',
      date: '2025-10-30',
      source: 'demo'
    },
    { 
      _id: '5', 
      name: 'Organic Pet Shampoo', 
      category: 'Care Products', 
      price: 15, 
      location: 'Rajshahi', 
      image: 'https://images.unsplash.com/photo-1560743641-3914f2c45636?w=800&auto=format&fit=crop&q=80', 
      description: 'Gentle shampoo for sensitive skin pets.', 
      sellerName: 'Pet Care Mart',
      email: 'caremart@example.com',
      date: '2025-10-31',
      source: 'demo'
    },
    { 
      _id: '6', 
      name: 'Rabbit Hutch with Run', 
      category: 'Accessories', 
      price: 120, 
      location: 'Barishal', 
      image: 'https://images.unsplash.com/photo-1504595403659-9088ce801e29?w=800&auto=format&fit=crop&q=80', 
      description: 'Spacious wooden rabbit hutch with exercise run.', 
      sellerName: 'Small Pet World',
      email: 'smallpets@example.com',
      date: '2025-11-01',
      source: 'demo'
    }
  ]);

  const formatPrice = (price) => price === 0 ? 'Free Adoption' : `$${parseFloat(price).toFixed(2)}`;

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      toast.success('Thank you for subscribing to our newsletter!', {
        icon: '✅',
        duration: 3000,
      });
      setIsSubscribed(true);
      setEmail('');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      

      {/* 1. Animated Hero Section */}
      <AnimatedHeroSection 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        heroOffers={heroOffers}
        heroCategories={heroCategories}
        defaultPetImage={defaultPetImage}
      />

      {/* 2. Statistics Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-100 to-transparent rounded-full -translate-y-32 translate-x-32 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-orange-100 to-transparent rounded-full translate-y-48 -translate-x-48 opacity-50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold rounded-full mb-6 shadow-lg">
              📊 OUR ACHIEVEMENTS
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              We're Making a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Difference</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied pet lovers who trust PawMart for their pet needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <div key={stat.id} className="group relative">
                <div className={`bg-gradient-to-br ${
                  index === 0 ? 'from-blue-50 to-white' :
                  index === 1 ? 'from-purple-50 to-white' :
                  index === 2 ? 'from-green-50 to-white' :
                  'from-orange-50 to-white'
                } rounded-2xl p-8 shadow-xl border ${
                  index === 0 ? 'border-blue-100' :
                  index === 1 ? 'border-purple-100' :
                  index === 2 ? 'border-green-100' :
                  'border-orange-100'
                } transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2`}>
                  <div className="absolute -top-5 left-8">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transform ${
                      index % 2 === 0 ? 'rotate-12' : '-rotate-12'
                    } group-hover:rotate-0 transition-transform duration-500 ${
                      index === 0 ? 'bg-gradient-to-r from-blue-500 to-cyan-400' :
                      index === 1 ? 'bg-gradient-to-r from-purple-500 to-pink-400' :
                      index === 2 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                      'bg-gradient-to-r from-orange-500 to-yellow-400'
                    }`}>
                      <span className="text-2xl text-white">{stat.icon}</span>
                    </div>
                  </div>
                  
                  <div className="pt-6">
                    <div className="text-5xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-gray-700 font-semibold text-lg">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Bottom decorative line */}
          <div className="mt-16 flex justify-center">
            <div className="w-32 h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* 3. Deals of the Week Section */}
      <DealsOfTheWeek />

      {/* 4. Categories Section */}
      <section className="py-20 bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Browse <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Categories</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Find everything your pet needs in one place</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map(cat => (
              <Link key={cat.id} to={cat.route} className="group">
                <div className={`h-full ${cat.bgColor} rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3`}>
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`p-4 rounded-full bg-gradient-to-r ${cat.color} text-white transform group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-4xl">{cat.icon}</span>
                    </div>
                    <h3 className={`text-2xl font-bold ${cat.textColor}`}>{cat.name}</h3>
                    <p className="text-gray-600">{cat.description}</p>
                    <div className="w-12 h-1 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full"></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">PawMart?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">We ensure the best experience for both pets and pet lovers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={feature.id} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 text-center transform hover:-translate-y-2">
                <div className={`inline-flex p-4 rounded-full ${
                  index === 0 ? 'bg-blue-100 text-blue-600' :
                  index === 1 ? 'bg-purple-100 text-purple-600' :
                  index === 2 ? 'bg-yellow-100 text-yellow-600' :
                  'bg-green-100 text-green-600'
                } mb-6`}>
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Recent Listings Section */}
      <section className="py-20 bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16">
            <div className="mb-8 md:mb-0">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-4">
                <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-bold text-blue-600">FRESH ARRIVALS</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Pet Listings</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                Discover the newest additions to our pet marketplace. Each listing is carefully verified for quality.
              </p>
            </div>
            <Link 
              to="/pets-supplies" 
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="text-lg">Browse All</span>
              <span className="text-xl group-hover:translate-x-2 transition-transform duration-300">→</span>
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-20">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                <div className="mt-6">
                  <div className="text-xl font-semibold text-gray-700 mb-2">Loading Listings</div>
                  <p className="text-gray-500">Fetching the latest pet listings...</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Status Indicator */}
              <div className="mb-12">
                <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl shadow-md ${isBackendConnected ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100' : 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100'}`}>
                  <div className={`w-3 h-3 rounded-full ${isBackendConnected ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></div>
                  <div className="flex items-center gap-4">
                    <span className={`font-bold ${isBackendConnected ? 'text-green-700' : 'text-amber-700'}`}>
                      {isBackendConnected ? '🎯 Live Data' : '🔄 Demo Mode'}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {isBackendConnected ? 'Connected to database' : 'Using sample data'}
                    </span>
                  </div>
                  {!isBackendConnected && (
                    <button 
                      onClick={fetchRecentListings}
                      className="ml-4 text-sm bg-amber-100 hover:bg-amber-200 text-amber-700 px-4 py-1 rounded-lg transition-colors"
                    >
                      Retry Connection
                    </button>
                  )}
                </div>
              </div>
              
              {recentListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {recentListings.map(listing => (
                    <div key={listing._id} className="group relative">
                      {/* Card Container */}
                      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                        
                        {/* Image Section */}
                        <div className="relative h-64 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                          <SafeImage
                            src={listing.image}
                            alt={listing.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            fallback={getDefaultImage(listing.category)}
                          />
                          
                          {/* Price Badge */}
                          <div className="absolute top-4 right-4 z-20">
                            <div className={`px-4 py-2 rounded-full shadow-lg font-bold text-sm ${
                              listing.price === 0 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                                : 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white'
                            }`}>
                              {formatPrice(listing.price)}
                            </div>
                          </div>
                          
                          {/* Category Badge */}
                          <div className="absolute top-4 left-4 z-20">
                            <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                              listing.category === 'Pets' ? 'bg-blue-500/90 text-white' :
                              listing.category === 'Food' ? 'bg-green-500/90 text-white' :
                              listing.category === 'Accessories' ? 'bg-purple-500/90 text-white' :
                              'bg-red-500/90 text-white'
                            }`}>
                              {listing.category}
                            </div>
                          </div>
                          
                          {/* Floating Action Button */}
                          <div className="absolute bottom-4 right-4 z-20">
                            <Link 
                              to={`/listing/${listing._id}`}
                              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
                            >
                              <span className="text-gray-700 text-lg">👁️</span>
                            </Link>
                          </div>
                        </div>
                        
                        {/* Content Section */}
                        <div className="p-6">
                          {/* Title and Seller */}
                          <div className="mb-4">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                              {listing.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-gray-600 text-sm">👤</span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-700">{listing.sellerName}</div>
                                <div className="text-xs text-gray-500">{listing.date}</div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Description */}
                          <p className="text-gray-600 mb-6 line-clamp-2 min-h-[48px]">
                            {listing.description}
                          </p>
                          
                          {/* Location and Status */}
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 text-xs">📍</span>
                              </div>
                              <span className="text-sm font-medium text-gray-700">{listing.location}</span>
                            </div>
                            <div className={`px-3 py-1 rounded-lg text-xs font-bold ${
                              listing.source.includes('backend') ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {listing.source.includes('backend') ? 'Verified' : 'Demo'}
                            </div>
                          </div>
                          
                          {/* Action Button */}
                          <Link 
                            to={`/listing/${listing._id}`}
                            className="block w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                          >
                            <span>View Details</span>
                            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="inline-flex p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl shadow-lg mb-6">
                    <span className="text-4xl">😿</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">No Listings Found</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    We couldn't find any pet listings at the moment. Please check back soon or try refreshing.
                  </p>
                  <button 
                    onClick={fetchRecentListings}
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <span>🔄 Refresh Listings</span>
                    <span>Try Again</span>
                  </button>
                </div>
              )}
              
              {/* Grid Pattern Background */}
              <div className="mt-20 pt-12 border-t border-gray-100">
                <div className="grid grid-cols-4 gap-6">
                  {['Pet Adoption', 'Pet Food', 'Accessories', 'Care Products'].map((category, index) => (
                    <div key={index} className="text-center">
                      <div className={`inline-flex p-3 rounded-xl mb-3 ${
                        index === 0 ? 'bg-blue-100 text-blue-600' :
                        index === 1 ? 'bg-green-100 text-green-600' :
                        index === 2 ? 'bg-purple-100 text-purple-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        <span className="text-xl">
                          {index === 0 ? '🐕' : index === 1 ? '🍖' : index === 2 ? '🛍️' : '🧴'}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-700">{category}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {index === 0 ? 'Find your friend' : 
                         index === 1 ? 'Quality nutrition' : 
                         index === 2 ? 'Toys & essentials' : 
                         'Health products'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 7. How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">PawMart</span> Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Simple steps to find your perfect pet or product</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={step.step} className="relative">
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full text-white text-3xl font-bold mb-6">
                    {step.step}
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                      <span className="text-xl">{step.icon}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-3/4 w-full h-0.5 bg-gradient-to-r from-orange-200 to-blue-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Adoption Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Adopt from <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">PawMart?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Choosing adoption is more than just getting a pet - it's about making a compassionate choice</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {adoptionBenefits.map((benefit, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 text-center transform hover:-translate-y-2 border border-gray-100">
                <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 mb-6">
                  <span className="text-3xl">{benefit.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Services Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Services</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Comprehensive pet care solutions for your furry friends</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(service => (
              <div key={service.id} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2">
                <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${service.color} text-white mb-6`}>
                  <span className="text-3xl">{service.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                  Learn more
                  <span>→</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Regular Products Section */}
      <RegularProductsSection />

      {/* 11. How It Works Section (Duplicate removed) */}

      {/* 12. Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex p-4 rounded-full bg-white/20 mb-6">
              <span className="text-3xl">📧</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Stay Updated</h2>
            <p className="text-xl mb-8 opacity-90">
              Subscribe to our newsletter for the latest pet care tips, adoption stories, and exclusive offers
            </p>
            
            {isSubscribed ? (
              <div className="bg-white/20 p-8 rounded-2xl">
                <span className="text-4xl mb-4 text-green-300">✓</span>
                <h3 className="text-2xl font-bold mb-2">Thank You for Subscribing!</h3>
                <p className="opacity-90">You'll receive our next newsletter soon.</p>
                <button
                  onClick={() => setIsSubscribed(false)}
                  className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Subscribe Another Email
                </button>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-6 py-4 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50"
                    required
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Subscribe
                  </button>
                </div>
                <p className="text-sm opacity-75">
                  By subscribing, you agree to our Privacy Policy. No spam, unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 13. FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Questions</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Find answers to common questions about pet adoption and services</p>
          </div>
          <div className="max-w-3xl mx-auto">
            {[
              {
                id: 1,
                question: 'How does the adoption process work?',
                answer: 'Browse available pets, submit an application, attend a virtual meet-and-greet, complete a home verification, and finalize adoption with our support team.'
              },
              {
                id: 2,
                question: 'Are the pets vaccinated and healthy?',
                answer: 'Yes, all pets are vaccinated, dewormed, and undergo health checkups before listing. We provide complete medical records.'
              },
              {
                id: 3,
                question: 'What is your return policy?',
                answer: 'We offer a 7-day trial period for adoption. For products, you can return within 3 days if unopened and in original packaging.'
              },
              {
                id: 4,
                question: 'Do you offer delivery services?',
                answer: 'Yes, we offer delivery across major cities in Bangladesh. Delivery charges vary based on location and pet size.'
              },
              {
                id: 5,
                question: 'How can I become a verified seller?',
                answer: 'Submit your documents, complete our verification process, and attend a brief orientation session.'
              }
            ].map((faq, index) => (
              <div key={faq.id} className="mb-4">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full text-left bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex justify-between items-center border border-gray-100"
                >
                  <span className="text-lg font-semibold text-gray-800">{faq.question}</span>
                  <span className={`text-gray-500 transition-transform duration-300 ${openFaqIndex === index ? 'transform rotate-90' : ''}`}>▶</span>
                </button>
                {openFaqIndex === index && (
                  <div className="bg-white mt-1 p-6 rounded-b-xl shadow-lg border border-gray-100">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/faq" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold">
              <span>❓</span> View All FAQs
            </Link>
          </div>
        </div>
      </section>

      {/* 14. CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Find Your Perfect Pet Companion?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of happy pet owners who found their furry family members through PawMart
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-900 bg-white rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </Link>
            <Link
              to="/pets-supplies"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-xl hover:bg-white/10 transform hover:scale-105 transition-all duration-300"
            >
              Browse All Listings
            </Link>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex justify-center space-x-6 mb-6">
              <a href="#" className="text-white hover:text-blue-400 transition-colors">
                <span className="text-2xl">📘</span>
              </a>
              <a href="#" className="text-white hover:text-blue-400 transition-colors">
                <span className="text-2xl">🐦</span>
              </a>
              <a href="#" className="text-white hover:text-blue-400 transition-colors">
                <span className="text-2xl">📷</span>
              </a>
            </div>
            <p className="text-gray-400">© 2025 PawMart. All rights reserved.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;