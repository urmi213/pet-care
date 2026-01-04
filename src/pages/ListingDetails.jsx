import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import { 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaEnvelope, 
  FaPhone, 
  FaTag, 
  FaHeart, 
  FaShareAlt,
  FaStar,
  FaShoppingCart,
  FaCheck,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaInfoCircle,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
  FaArrowLeft,
  FaTimes
} from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import OrderModal from '../components/OrderModal';

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [isMobileView, setIsMobileView] = useState(false);

  const API_BASE_URL = 'https://backend-10-five.vercel.app';

  // Check screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const parseListingId = (idString) => {
    if (!isNaN(idString) && idString !== '') {
      return parseInt(idString);
    }
    if (typeof idString === 'string' && idString.startsWith('fallback-')) {
      const num = parseInt(idString.replace('fallback-', ''));
      return isNaN(num) ? 1 : num;
    }
    return 1;
  };

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        setLoading(true);
        const parsedId = parseListingId(id);
        
        let response;
        let apiId = parsedId;
        
        try {
          response = await axios.get(`${API_BASE_URL}/api/listings/${apiId}`, {
            timeout: 10000,
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });
        } catch (apiError) {
          try {
            response = await axios.get(`${API_BASE_URL}/listings/${apiId}`, {
              timeout: 10000
            });
          } catch (nonApiError) {
            try {
              response = await axios.get(`${API_BASE_URL}/listings/latest/1`);
              if (response.data && response.data.length > 0) {
                response.data = response.data[0];
              }
            } catch (finalError) {
              throw new Error('All API endpoints failed');
            }
          }
        }
        
        let listingData = null;
        
        if (response.data && (response.data._id || response.data.id)) {
          listingData = response.data;
        } else if (response.data?.data && (response.data.data._id || response.data.data.id)) {
          listingData = response.data.data;
        } else if (response.data?.success && response.data.data) {
          listingData = response.data.data;
        } else if (Array.isArray(response.data) && response.data.length > 0) {
          listingData = response.data[0];
        }
        
        if (!listingData) {
          listingData = getEnhancedMockListing(apiId);
        }
        
        if (!listingData._id) {
          listingData._id = apiId.toString();
        }
        
        // Ensure all required fields exist
        listingData = {
          ...listingData,
          specifications: listingData.specifications || getDefaultSpecifications(),
          relatedItems: listingData.relatedItems || getDefaultRelatedItems(),
          reviews: listingData.reviews || getDefaultReviews(),
          features: listingData.features || getDefaultFeatures(),
          images: listingData.images || [listingData.image || 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&auto=format&fit=crop&q=80']
        };
        
        console.log('✅ Loaded listing with:', {
          hasSpecs: !!listingData.specifications,
          specsCount: Object.keys(listingData.specifications || {}).length,
          hasRelated: !!listingData.relatedItems,
          relatedCount: listingData.relatedItems?.length || 0
        });
        
        setListing(listingData);
        
      } catch (error) {
        console.error('❌ Error fetching listing:', error);
        const parsedId = parseListingId(id);
        const mockData = getEnhancedMockListing(parsedId);
        setListing(mockData);
        
        if (error.response?.status === 404) {
          toast.error('Product not found. Showing sample data.');
        } else if (error.code === 'ERR_NETWORK') {
          toast.error('Cannot connect to server. Showing sample data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchListingDetails();
  }, [id]);

  // Helper functions for default data
  const getDefaultSpecifications = () => ({
    "Category": "Pet - Cat",
    "Breed": "Persian",
    "Age": "2 months",
    "Gender": "Female",
    "Color": "Pure White",
    "Eye Color": "Blue",
    "Vaccination": "Complete (FVRCP)",
    "Dewormed": "Yes",
    "Litter Trained": "Yes",
    "Adoption Fee": "$150",
    "Health Certificate": "Provided",
    "Microchipped": "No",
    "Diet": "Royal Canin Persian Kitten",
    "Temperament": "Calm, Affectionate"
  });

  const getDefaultRelatedItems = () => [
    { 
      id: 201, 
      name: 'Cat Tree House', 
      price: 89.99, 
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1615111784767-4d7c527f32a1?w=400&auto=format&fit=crop&q=80',
      category: 'Accessories'
    },
    { 
      id: 202, 
      name: 'Premium Cat Food', 
      price: 24.99, 
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&auto=format&fit=crop&q=80',
      category: 'Food'
    },
    { 
      id: 203, 
      name: 'Litter Box Set', 
      price: 35.00, 
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&auto=format&fit=crop&q=80',
      category: 'Accessories'
    },
    { 
      id: 204, 
      name: 'Cat Toys Bundle', 
      price: 19.99, 
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&auto=format&fit=crop&q=80',
      category: 'Toys'
    }
  ];

  const getDefaultReviews = () => [
    { 
      id: 1, 
      user: "Lisa Wong", 
      rating: 5, 
      date: "2024-12-05", 
      comment: "Absolutely beautiful kitten! Very healthy and well cared for. The breeder was professional and provided all necessary documents.",
      verified: true
    },
    { 
      id: 2, 
      user: "David Park", 
      rating: 5, 
      date: "2024-11-30", 
      comment: "Professional breeder. Kitten is perfect in every way. Very responsive and helpful throughout the adoption process.",
      verified: true
    },
    { 
      id: 3, 
      user: "Emma Wilson", 
      rating: 4, 
      date: "2024-11-25", 
      comment: "Very satisfied with the adoption process. The kitten arrived healthy and happy. Would recommend!",
      verified: true
    }
  ];

  const getDefaultFeatures = () => [
    "Pure Breed Persian Kitten",
    "Litter Trained",
    "Fully Vaccinated",
    "Health Check Complete",
    "Pedigree Certificate Available",
    "Good with Children",
    "Calm Temperament"
  ];

  const getEnhancedMockListing = (listingId) => {
    const numericId = typeof listingId === 'number' ? listingId : parseInt(listingId);
    const idKey = isNaN(numericId) ? 2 : numericId;
    
    return {
      _id: idKey.toString(),
      id: idKey,
      name: 'Persian Kitten',
      title: 'Persian Kitten',
      category: 'Pets',
      price: 150,
      location: 'Chattogram',
      images: [
        'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1514888286974-6d03bdeacba8?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&auto=format&fit=crop&q=80'
      ],
      description: `
        <div class="space-y-4">
          <h3 class="text-xl font-bold text-gray-900">Beautiful Persian Kitten</h3>
          <p class="text-gray-700">This stunning pure white Persian kitten is 2 months old and looking for a loving home. She has been litter trained, vaccinated, and is in perfect health.</p>
          <p class="text-gray-700">With her beautiful blue eyes and fluffy white coat, she's an absolute sweetheart who loves cuddles and playtime.</p>
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-bold text-gray-800 mb-2">Key Details:</h4>
            <ul class="list-disc pl-5 space-y-1 text-gray-700">
              <li>Age: 2 months</li>
              <li>Breed: Pure Persian</li>
              <li>Color: Pure White</li>
              <li>Eye Color: Blue</li>
              <li>Vaccination: Complete</li>
              <li>Litter Trained: Yes</li>
            </ul>
          </div>
        </div>
      `,
      specifications: getDefaultSpecifications(),
      features: getDefaultFeatures(),
      reviews: getDefaultReviews(),
      rating: 4.9,
      totalReviews: 31,
      relatedItems: getDefaultRelatedItems(),
      email: 'catlover@example.com',
      phone: '+8801812345678',
      sellerName: 'Cat Lovers Hub',
      date: '2024-12-09',
      createdAt: '2024-12-09',
      source: 'enhanced-mock',
      inStock: true,
      stock: 1,
      brand: 'Pure Breed',
      verified: true
    };
  };

  const handleOrderClick = () => {
    if (!user) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }
    setShowOrderModal(true);
  };

  const handleContactSeller = () => {
    if (!user) {
      toast.error('Please login to contact seller');
      navigate('/login');
      return;
    }
    setContactMessage(`Hi, I'm interested in your ${listing.title || listing.name}. Could you please provide more details?`);
    setShowContactModal(true);
  };

  const handleSendMessage = async () => {
    if (!contactMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }
    try {
      const subject = `Inquiry about: ${listing.title || listing.name}`;
      const body = `Message from ${user?.email || 'User'}:\n\n${contactMessage}\n\nRegarding: ${listing.title || listing.name}\n\nProduct URL: ${window.location.href}`;
      window.location.href = `mailto:${listing.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      toast.success('Opening email client...');
      setShowContactModal(false);
      setContactMessage('');
    } catch (error) {
      toast.error('Failed to open email client');
    }
  };

  const handleAddToWishlist = () => {
    setIsInWishlist(!isInWishlist);
    toast.success(isInWishlist ? 'Removed from wishlist!' : 'Added to wishlist!');
  };

  const handleShare = () => {
    if (navigator.share && isMobileView) {
      navigator.share({
        title: listing.title || listing.name,
        text: `Check out ${listing.title || listing.name} on PetCare`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (reviewText.trim()) {
      const newReview = {
        id: Date.now(),
        user: user?.name || "You",
        rating: rating,
        date: new Date().toISOString().split('T')[0],
        comment: reviewText,
        verified: false
      };
      
      const updatedListing = {
        ...listing,
        reviews: [newReview, ...(listing.reviews || [])],
        totalReviews: (listing.totalReviews || 0) + 1,
        rating: ((listing.rating || 0) * (listing.totalReviews || 0) + rating) / ((listing.totalReviews || 0) + 1)
      };
      
      setListing(updatedListing);
      setReviewText('');
      setRating(5);
      toast.success('Review submitted successfully!');
    }
  };

  const nextImage = () => {
    if (listing.images && listing.images.length > 0) {
      setSelectedImage((prev) => (prev + 1) % listing.images.length);
    }
  };

  const prevImage = () => {
    if (listing.images && listing.images.length > 0) {
      setSelectedImage((prev) => (prev - 1 + listing.images.length) % listing.images.length);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading product details..." />;
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="text-center max-w-md mx-auto">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/pets-supplies')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Back Button */}
      {isMobileView && (
        <div className="sticky top-0 z-40 bg-white shadow-sm border-b">
          <div className="px-4 py-3 flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
            >
              <FaArrowLeft />
            </button>
            <h1 className="ml-3 text-lg font-semibold truncate flex-1">
              {listing.title || listing.name}
            </h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleAddToWishlist}
                className={`p-2 ${isInWishlist ? 'text-red-500' : 'text-gray-600'}`}
              >
                <FaHeart className={isInWishlist ? 'fill-current' : ''} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 text-gray-600"
              >
                <FaShareAlt />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Floating Action Button */}
      {isMobileView && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-white via-white to-transparent">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={handleOrderClick}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              {listing.category === 'Pets' ? '🐕 ADOPT NOW' : '🛒 ORDER NOW'}
            </button>
          </div>
        </div>
      )}

      <div className={`${isMobileView ? 'pb-24' : 'py-6'}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Breadcrumb - Desktop only */}
          {!isMobileView && (
            <nav className="mb-6 px-2" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center text-sm text-gray-600">
                <li>
                  <button onClick={() => navigate('/')} className="hover:text-blue-600 px-1">
                    Home
                  </button>
                </li>
                <li className="px-1">/</li>
                <li>
                  <button onClick={() => navigate('/pets-supplies')} className="hover:text-blue-600 px-1">
                    Products
                  </button>
                </li>
                <li className="px-1">/</li>
                <li className="text-gray-800 font-medium truncate max-w-[200px]">
                  {listing.title || listing.name}
                </li>
              </ol>
            </nav>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8">
            {/* Image Gallery */}
            <div className="space-y-3 md:space-y-4">
              <div className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden">
                <div className="relative">
                  <div className="h-[280px] sm:h-[350px] md:h-[400px] lg:h-[500px] overflow-hidden bg-gray-100">
                    <img
                      src={listing.images[selectedImage]}
                      alt={`${listing.title || listing.name} - View ${selectedImage + 1}`}
                      className="w-full h-full object-contain p-4 md:p-6"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>
                  
                  {/* Image Navigation Arrows */}
                  {listing.images && listing.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 md:p-3 rounded-full shadow-lg"
                      >
                        <FaChevronLeft className="text-gray-700" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 md:p-3 rounded-full shadow-lg"
                      >
                        <FaChevronRight className="text-gray-700" />
                      </button>
                    </>
                  )}
                </div>
                
                {/* Image Counter */}
                {listing.images && listing.images.length > 1 && (
                  <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImage + 1} / {listing.images.length}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {listing.images && listing.images.length > 1 && (
                <div className="flex space-x-2 md:space-x-3 overflow-x-auto py-2 px-1 scrollbar-hide">
                  {listing.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index 
                          ? 'border-blue-500 ring-2 ring-blue-200 scale-105' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Mobile Quick Info */}
              {isMobileView && (
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-semibold rounded-full">
                      {listing.category}
                    </span>
                    {listing.verified && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded flex items-center">
                        <FaCheck className="mr-1" /> Verified
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>{listing.location}</span>
                    </div>
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2" />
                      <span>{new Date(listing.date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Price</p>
                      <p className={`text-2xl font-bold ${listing.price === 0 ? 'text-green-600' : 'text-blue-600'}`}>
                        {listing.price === 0 ? 'FREE' : `$${listing.price}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <FaStar className="text-yellow-400 fill-current" />
                        <span className="ml-1 font-semibold">{listing.rating?.toFixed(1) || '4.9'}</span>
                        <span className="ml-1 text-gray-500 text-sm">({listing.totalReviews || 31})</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-4 md:space-y-6">
              {/* Desktop Header */}
              {!isMobileView && (
                <div className="bg-white rounded-xl md:rounded-2xl p-5 md:p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-semibold rounded-full">
                        {listing.category}
                      </span>
                      {listing.verified && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded flex items-center">
                          <FaCheck className="mr-1" /> Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleAddToWishlist}
                        className={`p-2 rounded-full ${isInWishlist ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:text-red-500 hover:bg-red-50'}`}
                      >
                        <FaHeart className={isInWishlist ? 'fill-current' : ''} />
                      </button>
                      <button
                        onClick={handleShare}
                        className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full"
                      >
                        <FaShareAlt />
                      </button>
                    </div>
                  </div>
                  
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    {listing.title || listing.name}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={i < Math.floor(listing.rating || 0) ? 'fill-current' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-gray-600">
                        {(listing.rating || 0).toFixed(1)} ({listing.totalReviews || 0} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-gray-600 mb-6">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>{listing.location}</span>
                    </div>
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2" />
                      <span>Listed: {new Date(listing.date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Price - Desktop */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-5 md:p-6 rounded-xl mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <p className={`text-3xl md:text-4xl font-bold ${listing.price === 0 ? 'text-green-600' : 'text-blue-600'}`}>
                          {listing.price === 0 ? 'FREE' : `$${listing.price}`}
                        </p>
                        <p className="text-gray-600 mt-2">
                          {listing.category === 'Pets' ? 'Adoption Fee' : 'Product Price'}
                        </p>
                      </div>
                      {listing.brand && (
                        <div className="bg-white px-4 py-2 rounded-lg">
                          <p className="text-gray-600">
                            <FaTag className="inline mr-2" />
                            Brand: <span className="font-semibold">{listing.brand}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Key Features */}
              {listing.features && listing.features.length > 0 && (
                <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm">
                  <h3 className="font-semibold mb-3 text-lg">Key Features:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {listing.features.map((feature, index) => (
                      <div key={index} className="flex items-center p-2 hover:bg-gray-50 rounded">
                        <FaCheck className="text-green-500 mr-3 text-sm flex-shrink-0" />
                        <span className="text-sm md:text-base">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Desktop Order Buttons */}
              {!isMobileView && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={handleOrderClick}
                      className="w-full py-3 md:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center text-lg"
                    >
                      <FaShoppingCart className="mr-2" />
                      {listing.category === 'Pets' ? 'Adopt Now' : 'Add to Cart'}
                    </button>
                    <button
                      onClick={handleContactSeller}
                      className="w-full py-3 md:py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-colors text-lg"
                    >
                      Contact Seller
                    </button>
                  </div>
                </div>
              )}

              {/* Shipping & Guarantee */}
              <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  <div className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="text-blue-500 text-2xl mb-2">
                      <FaTruck />
                    </div>
                    <p className="text-xs md:text-sm font-medium text-gray-700">Free Shipping</p>
                    <p className="text-xs text-gray-500 mt-1">Over $50</p>
                  </div>
                  <div className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="text-green-500 text-2xl mb-2">
                      <FaShieldAlt />
                    </div>
                    <p className="text-xs md:text-sm font-medium text-gray-700">Secure Payment</p>
                    <p className="text-xs text-gray-500 mt-1">100% Safe</p>
                  </div>
                  <div className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="text-purple-500 text-2xl mb-2">
                      <FaUndo />
                    </div>
                    <p className="text-xs md:text-sm font-medium text-gray-700">30-Day Return</p>
                    <p className="text-xs text-gray-500 mt-1">Money Back</p>
                  </div>
                  <div className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="text-yellow-500 text-2xl mb-2">
                      <FaInfoCircle />
                    </div>
                    <p className="text-xs md:text-sm font-medium text-gray-700">24/7 Support</p>
                    <p className="text-xs text-gray-500 mt-1">Always Available</p>
                  </div>
                </div>
              </div>

              {/* Seller Information */}
              <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
                <h3 className="font-semibold mb-4 text-lg">Seller Information</h3>
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaUser className="text-blue-600 text-lg md:text-xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{listing.sellerName}</p>
                    <p className="text-sm text-gray-600">Verified Seller</p>
                  </div>
                  <button 
                    onClick={handleContactSeller}
                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap text-sm md:text-base"
                  >
                    Contact
                  </button>
                </div>
                <div className="mt-4 space-y-2">
                  {listing.email && (
                    <div className="flex items-center text-sm text-gray-600 p-2 rounded hover:bg-gray-50">
                      <FaEnvelope className="mr-3 flex-shrink-0" />
                      <span className="truncate">{listing.email}</span>
                    </div>
                  )}
                  {listing.phone && (
                    <div className="flex items-center text-sm text-gray-600 p-2 rounded hover:bg-gray-50">
                      <FaPhone className="mr-3 flex-shrink-0" />
                      <span>{listing.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section - ALL FIXED */}
          <div className="mt-8 md:mt-12">
            {/* Tabs Navigation */}
            <div className="border-b border-gray-200 overflow-x-auto scrollbar-hide">
              <nav className="flex min-w-max md:min-w-0">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'specifications', label: 'Specifications' },
                  { id: 'reviews', label: 'Reviews' },
                  { id: 'related', label: 'Related Items' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-4 md:px-6 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-4 md:mt-8">
              {/* Overview Tab */}
              {/* ✅ সুন্দর Project Overview Section */}
{activeTab === 'overview' && (
  <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 md:p-8 shadow-xl border border-blue-100">
    {/* Main Header */}
    <div className="text-center mb-10">
      <div className="inline-flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
          <FaStar className="text-white text-xl" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Product Overview
        </h2>
      </div>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Discover everything you need to know about this beautiful Persian Kitten
      </p>
    </div>

    {/* Main Content Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Main Description */}
      <div className="lg:col-span-2 space-y-8">
        {/* Introduction Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold">🐱</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Introduction</h3>
          </div>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <div className="space-y-4">
              <p className="text-lg">
                Meet this stunning <span className="font-bold text-blue-600">pure white Persian kitten</span>, 
                a 2-month-old bundle of joy looking for her forever home. 
                With her captivating blue eyes and fluffy white coat, she's ready to bring warmth and happiness to your family.
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-100">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-green-600">✓</span> Perfect For:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">👪</span>
                    </div>
                    <span>Families with kids</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">🏡</span>
                    </div>
                    <span>Apartment living</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">❤️</span>
                    </div>
                    <span>First-time pet owners</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">✨</span>
                    </div>
                    <span>Luxury pet lovers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Health & Care */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white text-xl">🏥</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Health & Care</h3>
                <p className="text-sm text-gray-600">Complete medical history</p>
              </div>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCheck className="text-green-600 text-xs" />
                </div>
                <span>Full vaccination completed</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCheck className="text-green-600 text-xs" />
                </div>
                <span>Regular deworming</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCheck className="text-green-600 text-xs" />
                </div>
                <span>Vet health certificate included</span>
              </li>
            </ul>
          </div>

          {/* Training & Behavior */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white text-xl">🎓</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Training & Behavior</h3>
                <p className="text-sm text-gray-600">Well-mannered companion</p>
              </div>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <FaCheck className="text-purple-600 text-xs" />
                </div>
                <span>Litter trained from day one</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <FaCheck className="text-purple-600 text-xs" />
                </div>
                <span>Socialized with humans</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <FaCheck className="text-purple-600 text-xs" />
                </div>
                <span>Calm and affectionate temperament</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-blue-600">📖</span> Detailed Description
          </h3>
          <div className="space-y-4 text-gray-700">
            <p>
              This <span className="font-semibold text-blue-600">exquisite Persian kitten</span> represents the pinnacle 
              of feline beauty and elegance. Born from champion bloodlines, she embodies all the desirable traits 
              of the Persian breed - from her luxurious long white coat to her sweet, gentle personality.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl">
                <h4 className="font-bold text-amber-700 mb-2">Physical Attributes</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center justify-between">
                    <span>Coat Color:</span>
                    <span className="font-semibold">Pure White</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Eye Color:</span>
                    <span className="font-semibold">Deep Blue</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Coat Type:</span>
                    <span className="font-semibold">Long, Silky</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Face Structure:</span>
                    <span className="font-semibold">Doll Face</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-xl">
                <h4 className="font-bold text-cyan-700 mb-2">Personality Traits</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center justify-between">
                    <span>Temperament:</span>
                    <span className="font-semibold">Calm & Gentle</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Energy Level:</span>
                    <span className="font-semibold">Low to Moderate</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Social Needs:</span>
                    <span className="font-semibold">Affectionate</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Vocalization:</span>
                    <span className="font-semibold">Quiet</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Quick Facts */}
      <div className="space-y-8">
        {/* Quick Facts Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-blue-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">⚡</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Quick Facts</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600">📅</span>
                </div>
                <span className="text-gray-700">Age</span>
              </div>
              <span className="font-bold text-blue-600">2 Months</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600">♀️</span>
                </div>
                <span className="text-gray-700">Gender</span>
              </div>
              <span className="font-bold text-green-600">Female</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600">🏷️</span>
                </div>
                <span className="text-gray-700">Breed</span>
              </div>
              <span className="font-bold text-purple-600">Persian</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600">📍</span>
                </div>
                <span className="text-gray-700">Location</span>
              </div>
              <span className="font-bold text-amber-600">Chattogram</span>
            </div>
          </div>
        </div>

        {/* Included Items */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 shadow-lg border border-emerald-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🎁</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">What's Included</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <FaCheck className="text-emerald-600" />
              </div>
              <span className="text-gray-700">Vaccination Certificate</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <FaCheck className="text-emerald-600" />
              </div>
              <span className="text-gray-700">Health Record Book</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <FaCheck className="text-emerald-600" />
              </div>
              <span className="text-gray-700">Pedigree Papers</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <FaCheck className="text-emerald-600" />
              </div>
              <span className="text-gray-700">Starter Food Pack</span>
            </div>
          </div>
        </div>

        {/* Adoption Checklist */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-lg border border-amber-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">✅</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Adoption Checklist</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                <span className="text-amber-600 text-xs">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Prepare Your Home</h4>
                <p className="text-sm text-gray-600">Safe space, litter box, food bowls</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                <span className="text-amber-600 text-xs">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Schedule Vet Visit</h4>
                <p className="text-sm text-gray-600">Within first week of adoption</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                <span className="text-amber-600 text-xs">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Grooming Supplies</h4>
                <p className="text-sm text-gray-600">Brush, shampoo, nail clippers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Call to Action */}
    <div className="mt-10 pt-8 border-t border-gray-200">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-center shadow-lg">
        <h3 className="text-2xl font-bold text-white mb-3">Ready to Welcome This Beauty?</h3>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          This Persian kitten is waiting for a loving family. Don't miss the opportunity to bring home this perfect companion.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleOrderClick}
            className="px-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
          >
            Adopt Now 🐾
          </button>
          <button
            onClick={handleContactSeller}
            className="px-8 py-3 bg-blue-800/50 text-white font-bold rounded-xl hover:bg-blue-800 transition-all border border-blue-400"
          >
            Ask Questions 💬
          </button>
        </div>
      </div>
    </div>
  </div>
)}

              {/* Specifications Tab - FIXED */}
              {activeTab === 'specifications' && (
                <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
                  <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Key Information & Specifications</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(listing.specifications || {}).map(([key, value]) => (
                        <div key={key} className="flex items-start py-3 border-b border-gray-200 last:border-0">
                          <div className="w-1/2 font-medium text-gray-700 pr-4">{key}:</div>
                          <div className="w-1/2 text-gray-600">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Rating Summary */}
                    <div className="lg:border-r lg:pr-6">
                      <div className="text-center mb-6">
                        <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                          {listing.rating.toFixed(1)}
                        </div>
                        <div className="flex justify-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`text-lg md:text-xl ${
                                i < Math.floor(listing.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-600">
                          Based on {listing.totalReviews} reviews
                        </p>
                      </div>
                      
                      {/* Add Review Form */}
                      {user && (
                        <div className="border-t pt-6">
                          <h4 className="font-semibold mb-4">Add Your Review</h4>
                          <form onSubmit={handleReviewSubmit}>
                            <div className="mb-4">
                              <label className="block text-sm font-medium mb-2">Your Rating</label>
                              <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="text-xl md:text-2xl"
                                  >
                                    <FaStar
                                      className={star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="mb-4">
                              <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                                rows="3"
                                placeholder="Share your experience..."
                                required
                              />
                            </div>
                            <button
                              type="submit"
                              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Submit Review
                            </button>
                          </form>
                        </div>
                      )}
                    </div>

                    {/* Reviews List */}
                    <div className="lg:col-span-2">
                      <div className="space-y-4 md:space-y-6">
                        {listing.reviews.map((review) => (
                          <div key={review.id} className="border-b border-gray-100 pb-4 md:pb-6 last:border-0">
                            <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                              <div>
                                <h5 className="font-semibold">{review.user}</h5>
                                <div className="flex items-center">
                                  <div className="flex text-yellow-400 mr-2">
                                    {[...Array(5)].map((_, i) => (
                                      <FaStar
                                        key={i}
                                        className={i < review.rating ? 'fill-current' : 'text-gray-300'}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    {new Date(review.date).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              {review.verified && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                                  Verified
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 text-sm md:text-base">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Related Items Tab - FIXED */}
              {activeTab === 'related' && (
                <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
                  <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Related Items</h2>
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                    {listing.relatedItems.map((item) => (
                      <Link 
                        key={item.id} 
                        to={`/listing/${item.id}`}
                        className="group bg-gray-50 rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
                      >
                        <div className="h-32 sm:h-40 md:h-48 overflow-hidden bg-gray-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop&q=80';
                            }}
                          />
                        </div>
                        <div className="p-3 md:p-4">
                          <h3 className="font-semibold text-gray-800 text-sm md:text-base mb-2 group-hover:text-blue-600 line-clamp-1">
                            {item.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-base md:text-lg font-bold text-blue-600">
                                ${item.price.toFixed(2)}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <FaStar className="text-yellow-400 fill-current text-sm md:text-base" />
                              <span className="ml-1 text-xs md:text-sm text-gray-600">{item.rating}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">{item.category}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {showOrderModal && listing && (
        <OrderModal
          listing={listing}
          onClose={() => setShowOrderModal(false)}
          onSuccess={() => {
            setShowOrderModal(false);
            toast.success('Order placed successfully! 🎉');
            setTimeout(() => navigate('/my-orders'), 1500);
          }}
        />
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 md:p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-bold">Contact Seller</h3>
                <button
                  onClick={() => {
                    setShowContactModal(false);
                    setContactMessage('');
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            
            <div className="p-4 md:p-6">
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">To:</p>
                <p className="font-medium">{listing.sellerName || listing.email}</p>
                <p className="text-sm text-gray-600 mt-2 mb-1">Regarding:</p>
                <p className="font-medium">{listing.title || listing.name}</p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Your Message</label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 min-h-[120px] md:min-h-[150px] focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                  placeholder="Type your message here..."
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setShowContactModal(false);
                    setContactMessage('');
                  }}
                  className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-1"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div> 
      )}
    </div>
  );
};

export default ListingDetails;