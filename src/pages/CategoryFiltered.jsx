import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { FaArrowLeft, FaMapMarkerAlt, FaTag, FaSpinner, FaFilter, FaSearch, FaHeart, FaShoppingCart, FaHome } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const CategoryFilteredProducts = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('newest');
  const [favorites, setFavorites] = useState([]);

  // Category display names
  const categoryDisplayNames = {
    'pets': 'Pets (Adoption)',
    'food': 'Pet Food',
    'accessories': 'Accessories',
    'care': 'Pet Care Products',
    'pets-adoption': 'Pets (Adoption)',
    'pet-food': 'Pet Food',
    'pet-care': 'Pet Care Products'
  };

  // Category icons
  const categoryIcons = {
    'pets': '🐶',
    'food': '🍖',
    'accessories': '🧸',
    'care': '💊',
    'pets-adoption': '🐶',
    'pet-food': '🍖',
    'pet-care': '💊'
  };

  useEffect(() => {
    fetchCategoryListings();
  }, [categoryName]);

  useEffect(() => {
    filterAndSortListings();
  }, [listings, searchQuery, priceRange, sortBy]);

  const fetchCategoryListings = async () => {
    try {
      setLoading(true);
      
      // ✅ FIXED: Use correct Vercel backend URL
      const API_URL = 'https://backend-10-five.vercel.app';
      
      // First try category-specific endpoint
      try {
        const response = await axios.get(`${API_URL}/api/listings/category/${categoryName}`);
        
        if (Array.isArray(response.data) && response.data.length > 0) {
          // Success: Got category data from backend
          setListings(response.data);
          toast.success(`Found ${response.data.length} ${categoryDisplayNames[categoryName] || categoryName} products`);
          return;
        }
      } catch (categoryError) {
        console.log('Category endpoint not found, trying all listings:', categoryError.message);
      }
      
      // Fallback: Get all listings and filter locally
      try {
        const response = await axios.get(`${API_URL}/api/listings`);
        
        if (Array.isArray(response.data)) {
          const categoryList = filterByCategory(response.data, categoryName);
          setListings(categoryList);
          
          if (categoryList.length > 0) {
            toast.success(`Found ${categoryList.length} products`);
          } else {
            toast.info(`No ${categoryName} products found, showing mock data`);
            useMockCategoryData();
          }
        } else {
          useMockCategoryData();
        }
      } catch (apiError) {
        console.log('API failed, using mock data:', apiError.message);
        useMockCategoryData();
      }
      
    } catch (error) {
      console.error('Error:', error);
      useMockCategoryData();
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = (listings, category) => {
    const categoryMapping = {
      'pets': ['pets', 'pet', 'dog', 'cat', 'puppy', 'kitten', 'adoption', 'animal'],
      'pets-adoption': ['pets', 'pet', 'dog', 'cat', 'puppy', 'kitten', 'adoption', 'animal'],
      'food': ['food', 'feed', 'nutrition', 'meal', 'treat', 'snack'],
      'pet-food': ['food', 'feed', 'nutrition', 'meal', 'treat', 'snack'],
      'accessories': ['accessories', 'accessory', 'toy', 'leash', 'collar', 'bed', 'scratch', 'carrier', 'hutch', 'run'],
      'care': ['care', 'shampoo', 'medicine', 'health', 'grooming', 'vitamin', 'first aid', 'treatment'],
      'pet-care': ['care', 'shampoo', 'medicine', 'health', 'grooming', 'vitamin', 'first aid', 'treatment']
    };

    const keywords = categoryMapping[category.toLowerCase()] || [category.toLowerCase()];
    
    return listings.filter(listing => {
      if (!listing) return false;
      
      const searchText = `${listing.name || ''} ${listing.description || ''} ${listing.category || ''}`.toLowerCase();
      const listingCategory = (listing.category || '').toLowerCase();
      
      // Direct category match
      if (listingCategory && keywords.some(keyword => listingCategory.includes(keyword))) {
        return true;
      }
      
      // Text search in name/description
      return keywords.some(keyword => searchText.includes(keyword));
    });
  };

  const useMockCategoryData = () => {
    // Comprehensive mock data for all categories
    const allMockData = [
      // Pets (Adoption)
      {
        _id: '1',
        name: 'Golden Retriever Puppy',
        category: 'Pets',
        price: 0,
        location: 'Dhaka',
        image: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=800&auto=format&fit=crop&q=80',
        description: 'Friendly 3-month-old puppy looking for a forever home.',
        createdAt: '2024-01-15',
        tags: ['dog', 'puppy', 'adoption']
      },
      {
        _id: '2',
        name: 'Persian Kitten',
        category: 'Pets',
        price: 150,
        location: 'Chattogram',
        image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&auto=format&fit=crop&q=80',
        description: 'Beautiful white Persian kitten, 2 months old.',
        createdAt: '2024-01-10',
        tags: ['cat', 'kitten', 'persian']
      },
      {
        _id: '9',
        name: 'Rabbit for Adoption',
        category: 'Pets',
        price: 0,
        location: 'Khulna',
        image: 'https://images.unsplash.com/photo-1556838803-cc94986cb631?w=800&auto=format&fit=crop&q=80',
        description: 'Friendly rabbit needs a new home.',
        createdAt: '2024-01-05',
        tags: ['rabbit', 'adoption']
      },

      // Pet Food
      {
        _id: '3',
        name: 'Premium Dog Food 5kg',
        category: 'Food',
        price: 25,
        location: 'Sylhet',
        image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&auto=format&fit=crop&q=80',
        description: 'High-quality nutritious dog food.',
        createdAt: '2024-01-12',
        tags: ['dog food', 'nutrition']
      },
      {
        _id: '10',
        name: 'Cat Food - Salmon Flavor',
        category: 'Food',
        price: 18,
        location: 'Rajshahi',
        image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&auto=format&fit=crop&q=80',
        description: 'Grain-free cat food with real salmon.',
        createdAt: '2024-01-08',
        tags: ['cat food', 'salmon']
      },
      {
        _id: '11',
        name: 'Bird Seeds Mix',
        category: 'Food',
        price: 8,
        location: 'Dhaka',
        image: 'https://images.unsplash.com/photo-1551085254-e96b210db58a?w=800&auto=format&fit=crop&q=80',
        description: 'Nutritious seed mix for all birds.',
        createdAt: '2024-01-03',
        tags: ['bird food', 'seeds']
      },

      // Accessories
      {
        _id: '4',
        name: 'Cat Scratching Post',
        category: 'Accessories',
        price: 35,
        location: 'Khulna',
        image: 'https://images.unsplash.com/photo-1514888286974-6d03bdeacba8?w=800&auto=format&fit=crop&q=80',
        description: 'Durable scratching post with toys.',
        createdAt: '2024-01-14',
        tags: ['cat', 'scratch', 'toy']
      },
      {
        _id: '6',
        name: 'Rabbit Hutch with Run',
        category: 'Accessories',
        price: 120,
        location: 'Barishal',
        image: 'https://images.unsplash.com/photo-1504595403659-9088ce801e29?w=800&auto=format&fit=crop&q=80',
        description: 'Spacious wooden rabbit hutch.',
        createdAt: '2024-01-07',
        tags: ['rabbit', 'hutch', 'accessory']
      },
      {
        _id: '12',
        name: 'Dog Leash Set',
        category: 'Accessories',
        price: 22,
        location: 'Dhaka',
        image: 'https://images.unsplash.com/photo-1558602600-93b1184c79c2?w=800&auto=format&fit=crop&q=80',
        description: 'Premium leather dog leash and collar.',
        createdAt: '2024-01-11',
        tags: ['dog', 'leash', 'collar']
      },
      {
        _id: '13',
        name: 'Pet Carrier Bag',
        category: 'Accessories',
        price: 45,
        location: 'Rajshahi',
        image: 'https://images.unsplash.com/photo-1560743173-567a3b5658b1?w=800&auto=format&fit=crop&q=80',
        description: 'Comfortable and secure pet carrier.',
        createdAt: '2024-01-09',
        tags: ['carrier', 'travel', 'accessory']
      },

      // Pet Care Products
      {
        _id: '5',
        name: 'Organic Pet Shampoo',
        category: 'Care Products',
        price: 15,
        location: 'Rajshahi',
        image: 'https://images.unsplash.com/photo-1560743641-3914f2c45636?w=800&auto=format&fit=crop&q=80',
        description: 'Gentle organic shampoo for pets.',
        createdAt: '2024-01-13',
        tags: ['shampoo', 'organic', 'care']
      },
      {
        _id: '14',
        name: 'Pet First Aid Kit',
        category: 'Care Products',
        price: 28,
        location: 'Sylhet',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbLm-axSwlzQS2Q7TDt6f3ulkHkMOsnHw_Yw&s',
        description: 'Complete first aid kit for pets.',
        createdAt: '2024-01-06',
        tags: ['first aid', 'emergency', 'care']
      },
      {
        _id: '15',
        name: 'Flea & Tick Treatment',
        category: 'Care Products',
        price: 19,
        location: 'Chattogram',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuTWXv0qXGzhIeW51o0kjzzq747jRbwmxNQ&s',
        description: 'Effective flea and tick treatment.',
        createdAt: '2024-01-04',
        tags: ['flea', 'tick', 'treatment']
      }
    ];

    const categoryData = filterByCategory(allMockData, categoryName);
    setListings(categoryData);
    
    if (categoryData.length === 0) {
      toast.info('No products found in this category');
    } else {
      toast.success(`Found ${categoryData.length} products (mock data)`);
    }
  };

  const filterAndSortListings = () => {
    let result = [...listings];

    // Search filter
    if (searchQuery) {
      result = result.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    result = result.filter(item =>
      item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setFilteredListings(result);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleRetry = () => {
    fetchCategoryListings();
  };

  const resetFilters = () => {
    setSearchQuery('');
    setPriceRange([0, 1000]);
    setSortBy('newest');
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      if (prev.includes(productId)) {
        toast.success('Removed from favorites');
        return prev.filter(id => id !== productId);
      } else {
        toast.success('Added to favorites');
        return [...prev, productId];
      }
    });
  };

  const handleAdopt = (product) => {
    toast.success(`You've applied to adopt ${product.name}! We'll contact you within 24 hours.`);
    // In a real app, you would redirect to adoption form
    navigate(`/adopt/${product._id}`);
  };

  const handleOrder = (product) => {
    toast.success(`Added ${product.name} to cart!`);
    // In a real app, you would add to cart or redirect to checkout
    navigate(`/order/${product._id}`);
  };

  // Get button text based on category
  const getActionButtonText = (listing) => {
    if (listing.category === 'Pets') {
      return listing.price === 0 ? '🏠 Free Adoption' : '🏠 Adopt Now';
    } else if (listing.category === 'Food') {
      return '🍖 Buy Food';
    } else if (listing.category === 'Accessories') {
      return '🧸 Order Now';
    } else {
      return '💊 Get Now';
    }
  };

  // Get button color based on category
  const getActionButtonColor = (listing) => {
    if (listing.category === 'Pets') {
      return listing.price === 0 
        ? 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
        : 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700';
    } else if (listing.category === 'Food') {
      return 'from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700';
    } else if (listing.category === 'Accessories') {
      return 'from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700';
    } else {
      return 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-5xl text-orange-500 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Loading {categoryDisplayNames[categoryName] || categoryName}...
          </h3>
          <p className="text-gray-500">Fetching the best products for you</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 hover:border-orange-300 group"
              >
                <FaArrowLeft className="text-gray-600 group-hover:text-orange-500 transition-colors" />
                <span className="text-gray-700 group-hover:text-orange-600 transition-colors">Back</span>
              </button>
              
              <div className="flex items-center gap-4">
                <div className="text-5xl md:text-6xl bg-gradient-to-br from-orange-100 to-pink-100 p-4 rounded-2xl">
                  {categoryIcons[categoryName] || '📦'}
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                    {categoryDisplayNames[categoryName] || categoryName}
                  </h1>
                  <p className="text-gray-600 mt-2">
                    {filteredListings.length} {filteredListings.length === 1 ? 'product' : 'products'} available
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search in category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 w-full md:w-64 rounded-xl border border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <FaFilter className="text-orange-500 text-xl" />
                <h3 className="font-semibold text-gray-700">Filters</h3>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
                {/* Price Range */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500"
                  />
                </div>

                {/* Sort By */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>

                {/* Reset Button */}
                <div className="flex items-end">
                  <button
                    onClick={resetFilters}
                    className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid - 3 Columns */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredListings.map((listing) => (
              <div
                key={listing._id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-orange-200 relative"
              >
                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(listing._id)}
                  className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-md transition-all"
                >
                  <FaHeart 
                    className={`${favorites.includes(listing._id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} 
                  />
                </button>

                {/* Badge for Free Adoption */}
                {listing.price === 0 && listing.category === 'Pets' && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold rounded-full shadow-lg">
                      🏠 FREE ADOPTION
                    </span>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-10">
                  {listing.category === 'Pets' && listing.price === 0 && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      Adoption Available
                    </span>
                  )}
                </div>

                {/* Product Image */}
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={listing.image}
                    alt={listing.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                {/* Product Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                        {listing.name}
                      </h3>
                      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        listing.category === 'Pets' ? 'bg-blue-100 text-blue-600' :
                        listing.category === 'Food' ? 'bg-green-100 text-green-600' :
                        listing.category === 'Accessories' ? 'bg-purple-100 text-purple-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {listing.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {listing.price === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          `$${listing.price}`
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 line-clamp-2">
                    {listing.description}
                  </p>
                  
                  <div className="flex items-center text-gray-500 mb-6">
                    <FaMapMarkerAlt className="mr-2 text-orange-500" />
                    <span className="text-sm font-medium">{listing.location}</span>
                  </div>
                  
                  {/* Action Buttons - FIXED VERSION */}
                  <div className="flex gap-3">
                    {/* View Details Button */}
                    <Link
                      to={`/listing/${listing._id}`}
                      className="flex-1 text-center bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      👁️ Details
                    </Link>
                    
                    {/* Main Action Button - Adopt for Pets, Order for others */}
                    {listing.category === 'Pets' ? (
                      <button
                        onClick={() => handleAdopt(listing)}
                        className={`flex-1 text-center bg-gradient-to-r ${getActionButtonColor(listing)} text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5`}
                      >
                        {getActionButtonText(listing)}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOrder(listing)}
                        className={`flex-1 text-center bg-gradient-to-r ${getActionButtonColor(listing)} text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5`}
                      >
                        {getActionButtonText(listing)}
                      </button>
                    )}
                  </div>

                  {/* Quick Info Row */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <FaTag className="text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {listing.tags ? listing.tags.slice(0, 2).join(', ') : listing.category}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="text-7xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              No Products Found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We couldn't find any products matching your criteria in {categoryDisplayNames[categoryName] || categoryName}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetFilters}
                className="px-8 py-3 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
              >
                Clear Filters
              </button>
              <button
                onClick={handleRetry}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all font-semibold"
              >
                Refresh Products
              </button>
              <Link
                to="/"
                className="px-8 py-3 border-2 border-orange-500 text-orange-600 rounded-xl hover:bg-orange-50 transition-colors font-semibold"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        )}

        {/* Back to Categories */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <FaArrowLeft />
            <Link to="/" className="font-semibold">
              Browse All Categories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilteredProducts;