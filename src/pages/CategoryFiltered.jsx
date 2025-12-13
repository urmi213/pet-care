import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { FaArrowLeft, FaMapMarkerAlt, FaTag, FaSpinner, FaFilter, FaSearch } from 'react-icons/fa';
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
      
      // Try backend API first
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${API_URL}/api/listings`);
        
        if (response.data.success) {
          const allListings = response.data.data || [];
          const categoryList = filterByCategory(allListings, categoryName);
          setListings(categoryList);
          
          if (categoryList.length > 0) {
            toast.success(`Found ${categoryList.length} products`);
          }
        }
      } catch (apiError) {
        console.log('Using mock data:', apiError.message);
        // Use mock data if API fails
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
    const categoryKeywords = {
      'pets': ['dog', 'cat', 'puppy', 'kitten', 'pet', 'adoption', 'animal'],
      'pets-adoption': ['dog', 'cat', 'puppy', 'kitten', 'pet', 'adoption'],
      'food': ['food', 'treat', 'nutrition', 'meal', 'feed'],
      'pet-food': ['food', 'treat', 'nutrition', 'meal', 'feed'],
      'accessories': ['toy', 'leash', 'collar', 'bed', 'scratch', 'carrier', 'accessory'],
      'care': ['shampoo', 'medicine', 'health', 'care', 'grooming', 'vitamin'],
      'pet-care': ['shampoo', 'medicine', 'health', 'care', 'grooming', 'vitamin']
    };

    const keywords = categoryKeywords[category.toLowerCase()] || [category.toLowerCase()];
    
    return listings.filter(listing => {
      const searchText = `${listing.name} ${listing.description} ${listing.category}`.toLowerCase();
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
        createdAt: '2024-01-15'
      },
      {
        _id: '2',
        name: 'Persian Kitten',
        category: 'Pets',
        price: 150,
        location: 'Chattogram',
        image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&auto=format&fit=crop&q=80',
        description: 'Beautiful white Persian kitten, 2 months old.',
        createdAt: '2024-01-10'
      },
      {
        _id: '9',
        name: 'Rabbit for Adoption',
        category: 'Pets',
        price: 0,
        location: 'Khulna',
        image: 'https://images.unsplash.com/photo-1556838803-cc94986cb631?w=800&auto=format&fit=crop&q=80',
        description: 'Friendly rabbit needs a new home.',
        createdAt: '2024-01-05'
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
        createdAt: '2024-01-12'
      },
      {
        _id: '10',
        name: 'Cat Food - Salmon Flavor',
        category: 'Food',
        price: 18,
        location: 'Rajshahi',
        image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&auto=format&fit=crop&q=80',
        description: 'Grain-free cat food with real salmon.',
        createdAt: '2024-01-08'
      },
      {
        _id: '11',
        name: 'Bird Seeds Mix',
        category: 'Food',
        price: 8,
        location: 'Dhaka',
        image: 'https://images.unsplash.com/photo-1551085254-e96b210db58a?w=800&auto=format&fit=crop&q=80',
        description: 'Nutritious seed mix for all birds.',
        createdAt: '2024-01-03'
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
        createdAt: '2024-01-14'
      },
      {
        _id: '6',
        name: 'Rabbit Hutch with Run',
        category: 'Accessories',
        price: 120,
        location: 'Barishal',
        image: 'https://images.unsplash.com/photo-1504595403659-9088ce801e29?w=800&auto=format&fit=crop&q=80',
        description: 'Spacious wooden rabbit hutch.',
        createdAt: '2024-01-07'
      },
      {
        _id: '12',
        name: 'Dog Leash Set',
        category: 'Accessories',
        price: 22,
        location: 'Dhaka',
        image: 'https://images.unsplash.com/photo-1558602600-93b1184c79c2?w=800&auto=format&fit=crop&q=80',
        description: 'Premium leather dog leash and collar.',
        createdAt: '2024-01-11'
      },
      {
        _id: '13',
        name: 'Pet Carrier Bag',
        category: 'Accessories',
        price: 45,
        location: 'Rajshahi',
        image: 'https://images.unsplash.com/photo-1560743173-567a3b5658b1?w=800&auto=format&fit=crop&q=80',
        description: 'Comfortable and secure pet carrier.',
        createdAt: '2024-01-09'
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
        createdAt: '2024-01-13'
      },
      {
        _id: '14',
        name: 'Pet First Aid Kit',
        category: 'Care Products',
        price: 28,
        location: 'Sylhet',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbLm-axSwlzQS2Q7TDt6f3ulkHkMOsnHw_Yw&s',
        description: 'Complete first aid kit for pets.',
        createdAt: '2024-01-06'
      },
      {
        _id: '15',
        name: 'Flea & Tick Treatment',
        category: 'Care Products',
        price: 19,
        location: 'Chattogram',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuTWXv0qXGzhIeW51o0kjzzq747jRbwmxNQ&s',
        description: 'Effective flea and tick treatment.',
        createdAt: '2024-01-04'
      }
    ];

    const categoryData = filterByCategory(allMockData, categoryName);
    setListings(categoryData);
    
    if (categoryData.length === 0) {
      toast.info('No products found in this category');
    } else {
      toast.success(`Found ${categoryData.length} products`);
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
                {/* Badge for Free Adoption */}
                {listing.price === 0 && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold rounded-full shadow-lg">
                      🏠 FREE ADOPTION
                    </span>
                  </div>
                )}

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
                  
                  <div className="flex gap-3">
                    <Link
                      to={`/listing/${listing._id}`}
                      className="flex-1 text-center bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      View Details
                    </Link>
                    <button className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors hover:border-orange-300 group">
                      <FaTag className="text-gray-500 group-hover:text-orange-500 transition-colors" />
                    </button>
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