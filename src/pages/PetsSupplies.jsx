import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { FaFilter, FaSearch, FaTimes, FaPaw, FaRedo, FaHeart, FaShoppingCart, FaDatabase, FaExclamationTriangle } from 'react-icons/fa';
import { MdPets, MdLocalGroceryStore } from 'react-icons/md';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const PetsAndSupplies = () => {
  const { user } = useContext(AuthContext);
  const [allListings, setAllListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [dataSource, setDataSource] = useState('unknown');

  const API_BASE_URL = 'https://backend-10-five.vercel.app';

  const defaultPetImage = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop&q=80';
  const defaultFoodImage = 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&auto=format&fit=crop&q=80';
  const defaultAccessoriesImage = 'https://images.unsplash.com/photo-1514888286974-6d03bdeacba8?w=400&auto=format&fit=crop&q=80';
  const defaultCareImage = 'https://images.unsplash.com/photo-1560743641-3914f2c45636?w=400&auto=format&fit=crop&q=80';

  const getSafeImageUrl = (imageUrl, category) => {
    if (!imageUrl || imageUrl.trim() === '') {
      switch(category) {
        case 'Pets': return defaultPetImage;
        case 'Food': return defaultFoodImage;
        case 'Accessories': return defaultAccessoriesImage;
        case 'Care Products': return defaultCareImage;
        default: return defaultPetImage;
      }
    }
    return imageUrl;
  };

  useEffect(() => {
    document.title = 'Pets & Supplies | PawMart';
    initializeApp();
    
    const savedFavorites = JSON.parse(localStorage.getItem('pawmart_favorites') || '[]');
    setFavorites(savedFavorites);
  }, []);

  useEffect(() => {
    filterListings();
  }, [searchTerm, selectedCategory, allListings]);

  const toggleFavorite = (listingId) => {
    let newFavorites;
    if (favorites.includes(listingId)) {
      newFavorites = favorites.filter(id => id !== listingId);
      toast.success('Removed from favorites');
    } else {
      newFavorites = [...favorites, listingId];
      toast.success('Added to favorites');
    }
    setFavorites(newFavorites);
    localStorage.setItem('pawmart_favorites', JSON.stringify(newFavorites));
  };

  // ✅ FIXED: Simple API health check
  const checkApiHealth = async () => {
    try {
      console.log('🩺 Checking API health...');
      const response = await fetch(`${API_BASE_URL}/health`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ API Health Response:', data);
        setApiStatus('healthy');
        return true;
      } else {
        console.log('❌ API Health check failed');
        setApiStatus('unhealthy');
        return false;
      }
    } catch (error) {
      console.log('❌ API Health check error:', error.message);
      setApiStatus('unhealthy');
      return false;
    }
  };

  // ✅ FIXED: Simple fetch function without errors
  const fetchListingsFromAPI = async () => {
    try {
      console.log('📡 Fetching data from API...');
      
      const response = await fetch(`${API_BASE_URL}/listings`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 API Response received');
      
      // Extract listings from response
      let listingsData = [];
      
      if (Array.isArray(data)) {
        listingsData = data;
        console.log(`📊 Direct array: ${listingsData.length} items`);
      } else if (data && data.data && Array.isArray(data.data)) {
        listingsData = data.data;
        console.log(`📊 Data array: ${listingsData.length} items`);
      } else if (data && data.listings && Array.isArray(data.listings)) {
        listingsData = data.listings;
        console.log(`📊 Listings array: ${listingsData.length} items`);
      } else {
        console.log('⚠️ Unknown response format:', data);
        // Try to extract any array
        const values = Object.values(data || {});
        listingsData = values.filter(item => Array.isArray(item)).flat();
        if (listingsData.length > 0) {
          console.log(`📊 Extracted array: ${listingsData.length} items`);
        }
      }
      
      return listingsData;
      
    } catch (error) {
      console.error('❌ API fetch error:', error.message);
      throw error;
    }
  };

  // ✅ FIXED: Main initialization function
  const initializeApp = async () => {
    try {
      setLoading(true);
      console.log('🚀 Initializing application...');
      
      // Step 1: Check API health
      const isApiHealthy = await checkApiHealth();
      
      if (!isApiHealthy) {
        console.log('⚠️ API not available, using mock data');
        useMockData();
        setDataSource('mock');
        setLoading(false);
        return;
      }
      
      // Step 2: Try to fetch from API
      try {
        const apiData = await fetchListingsFromAPI();
        
        if (apiData && apiData.length > 0) {
          console.log(`✅ Successfully loaded ${apiData.length} listings from API`);
          processAndSetListings(apiData, 'api');
          setDataSource('api');
        } else {
          console.log('📭 API returned no data, using mock data');
          useMockData();
          setDataSource('mock');
        }
        
      } catch (fetchError) {
        console.error('❌ Failed to fetch from API:', fetchError.message);
        useMockData();
        setDataSource('mock');
      }
      
    } catch (error) {
      console.error('🔥 Initialization error:', error);
      useMockData();
      setDataSource('mock');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Process and set listings
  const processAndSetListings = (listingsData, source) => {
    if (!listingsData || !Array.isArray(listingsData)) {
      console.log('⚠️ Invalid listings data:', listingsData);
      return;
    }

    const processedListings = listingsData.map((listing, index) => ({
      _id: listing._id || listing.id || `${source}-${Date.now()}-${index}`,
      name: listing.name || listing.title || 'Unnamed Listing',
      category: listing.category || 'Pets',
      price: listing.price || listing.Price || 0,
      location: listing.location || 'Unknown',
      image: getSafeImageUrl(listing.image || listing.imageUrl, listing.category),
      description: listing.description || 'No description available',
      sellerName: listing.sellerName || listing.email?.split('@')[0] || 'Pet Owner',
      email: listing.email || 'owner@example.com',
      date: listing.date || listing.createdAt || new Date().toISOString().split('T')[0],
      source: source
    }));

    console.log(`✅ Processed ${processedListings.length} listings from ${source}`);
    setAllListings(processedListings);
    setFilteredListings(processedListings);
    
    toast.success(`Loaded ${processedListings.length} listings`, {
      icon: source === 'api' ? '🌐' : '💾',
      duration: 3000
    });
  };

  // ✅ FIXED: Seed database function
  const seedDatabase = async () => {
    try {
      toast.loading('Seeding database with sample data...', { id: 'seed' });
      
      const response = await fetch(`${API_BASE_URL}/seed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      toast.dismiss('seed');
      
      if (response.ok) {
        const data = await response.json();
        toast.success(`✅ ${data.message || 'Database seeded successfully!'}`);
        
        // Wait a moment then refresh data
        setTimeout(async () => {
          await refreshData();
        }, 2000);
        
      } else {
        toast.error('Failed to seed database');
        useMockData();
      }
      
    } catch (error) {
      toast.dismiss('seed');
      console.error('❌ Seed error:', error);
      toast.error('Seed failed: ' + (error.message || 'Unknown error'));
      useMockData();
    }
  };

  // ✅ FIXED: Mock data function
  const useMockData = () => {
    console.log('💾 Loading mock data...');
    
    const mockData = [
      {
        _id: 'pet1',
        name: 'Golden Retriever Puppy',
        category: 'Pets',
        price: 0,
        location: 'Dhaka',
        image: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?q=80&w=764&auto=format&fit=crop',
        description: 'Friendly puppy looking for loving home. Vaccinated and healthy.',
        sellerName: 'Dhaka Pet Center',
        email: 'dhakapetcenter@example.com',
        date: new Date().toISOString().split('T')[0]
      },
      {
        _id: 'pet2',
        name: 'Persian Kitten',
        category: 'Pets',
        price: 150,
        location: 'Khulna',
        image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=870&auto=format&fit=crop',
        description: 'Beautiful vaccinated Persian kitten. 2 months old.',
        sellerName: 'Cat Lovers Club',
        email: 'catlovers@example.com',
        date: new Date().toISOString().split('T')[0]
      },
      {
        _id: 'pet3',
        name: 'Parakeet Pair',
        category: 'Pets',
        price: 45,
        location: 'Sylhet',
        image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?q=80&w=725&auto=format&fit=crop',
        description: 'Colorful parakeet pair with cage. Perfect for beginners.',
        sellerName: 'Bird Paradise',
        email: 'birdparadise@example.com',
        date: new Date().toISOString().split('T')[0]
      },
      {
        _id: 'food1',
        name: 'Premium Dog Food 5kg',
        category: 'Food',
        price: 25,
        location: 'Chattogram',
        image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?q=80&w=870&auto=format&fit=crop',
        description: 'High-quality dog food with natural ingredients.',
        sellerName: 'Pet Food Store',
        email: 'petfoodstore@example.com',
        date: new Date().toISOString().split('T')[0]
      },
      {
        _id: 'food2',
        name: 'Cat Dry Food 3kg',
        category: 'Food',
        price: 20,
        location: 'Sylhet',
        image: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=870&auto=format&fit=crop',
        description: 'Premium cat food for all life stages.',
        sellerName: 'Healthy Pet Foods',
        email: 'healthyfoods@example.com',
        date: new Date().toISOString().split('T')[0]
      },
      {
        _id: 'acc1',
        name: 'Dog Leash Set',
        category: 'Accessories',
        price: 18,
        location: 'Dhaka',
        image: 'https://images.unsplash.com/photo-1554456854-55a089fd4cb2?q=80&w=870&auto=format&fit=crop',
        description: 'Premium leather dog leash with collar.',
        sellerName: 'Pet Gear BD',
        email: 'petgear@example.com',
        date: new Date().toISOString().split('T')[0]
      },
      {
        _id: 'acc2',
        name: 'Rabbit Hutch',
        category: 'Accessories',
        price: 120,
        location: 'Barishal',
        image: 'https://images.unsplash.com/photo-1504595403659-9088ce801e29?q=80&w=987&auto=format&fit=crop',
        description: 'Spacious wooden rabbit hutch with run.',
        sellerName: 'Small Pet World',
        email: 'smallpetworld@example.com',
        date: new Date().toISOString().split('T')[0]
      },
      {
        _id: 'care1',
        name: 'Pet Shampoo',
        category: 'Care Products',
        price: 12,
        location: 'Rajshahi',
        image: 'https://images.unsplash.com/photo-1560743641-3914f2c45636?q=80&w=870&auto=format&fit=crop',
        description: 'Organic pet shampoo for sensitive skin.',
        sellerName: 'Pet Care Mart',
        email: 'petcaremart@example.com',
        date: new Date().toISOString().split('T')[0]
      },
      {
        _id: 'care2',
        name: 'Pet First Aid Kit',
        category: 'Care Products',
        price: 30,
        location: 'Dhaka',
        image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=1167&auto=format&fit=crop',
        description: 'Complete pet first aid kit with emergency guide.',
        sellerName: 'Pet Safety First',
        email: 'petsafety@example.com',
        date: new Date().toISOString().split('T')[0]
      }
    ];
    
    console.log(`📊 Loaded ${mockData.length} mock listings`);
    processAndSetListings(mockData, 'mock');
    setDataSource('mock');
  };

  // ✅ FIXED: Refresh data function
  const refreshData = async () => {
    try {
      setRefreshing(true);
      toast.loading('Refreshing data...', { id: 'refresh' });
      
      await initializeApp();
      
      toast.dismiss('refresh');
      toast.success('Data refreshed successfully!');
      
    } catch (error) {
      toast.dismiss('refresh');
      toast.error('Failed to refresh data');
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // ✅ FIXED: Filter function
  const filterListings = () => {
    let filtered = allListings;

    if (selectedCategory === 'Pets') {
      filtered = filtered.filter(item => item.category === 'Pets');
    } else if (selectedCategory === 'Supplies') {
      filtered = filtered.filter(item => 
        item.category === 'Food' || 
        item.category === 'Accessories' || 
        item.category === 'Care Products'
      );
    } else if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(item => {
        const name = (item.name || '').toLowerCase();
        const description = (item.description || '').toLowerCase();
        const location = (item.location || '').toLowerCase();
        const category = (item.category || '').toLowerCase();
        const seller = (item.sellerName || '').toLowerCase();
        
        return name.includes(searchLower) ||
               description.includes(searchLower) ||
               location.includes(searchLower) ||
               category.includes(searchLower) ||
               seller.includes(searchLower);
      });
    }

    setFilteredListings(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (window.innerWidth < 768) {
      setShowFilters(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
  };

  const categories = [
    { id: 'all', name: 'All', icon: '📦', color: 'gray' },
    { id: 'pets', name: 'Pets', icon: '🐶', color: 'blue' },
    { id: 'supplies', name: 'Supplies', icon: '🛒', color: 'green' },
    { id: 'food', name: 'Food', icon: '🍖', color: 'orange' },
    { id: 'accessories', name: 'Accessories', icon: '🧸', color: 'purple' },
    { id: 'care', name: 'Care Products', icon: '💊', color: 'red' }
  ];

  const getCategoryStats = () => {
    const stats = {
      'Pets': allListings.filter(l => l.category === 'Pets').length,
      'Supplies': allListings.filter(l => 
        l.category === 'Food' || 
        l.category === 'Accessories' || 
        l.category === 'Care Products'
      ).length,
      'Food': allListings.filter(l => l.category === 'Food').length,
      'Accessories': allListings.filter(l => l.category === 'Accessories').length,
      'Care Products': allListings.filter(l => l.category === 'Care Products').length,
    };
    return stats;
  };

  const stats = getCategoryStats();

  const SafeImage = ({ src, alt, className, category = 'Pets' }) => {
    const safeSrc = getSafeImageUrl(src, category);
    
    return (
      <img
        src={safeSrc}
        alt={alt}
        className={className}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = getSafeImageUrl('', category);
        }}
      />
    );
  };

  // Debug function to test API
  const testAPIConnection = async () => {
    try {
      toast.loading('Testing API connection...', { id: 'test' });
      
      const response = await fetch(`${API_BASE_URL}/listings`);
      const data = await response.json();
      
      toast.dismiss('test');
      toast.success(`API connected! Got ${Array.isArray(data) ? data.length : 'unknown'} items`);
      console.log('API Test Data:', data);
      
    } catch (error) {
      toast.dismiss('test');
      toast.error('API test failed: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <LoadingSpinner 
          text="Loading pets & supplies..." 
          size="lg"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Your Perfect Pet Companion</h1>
            <p className="text-xl opacity-90 mb-8">
              Browse pets for adoption and shop for quality pet supplies
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {Object.entries(stats).map(([category, count]) => (
                <div key={category} className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm opacity-90">{category}</div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link to="/add-listing" className="btn btn-white btn-lg hover:scale-105 transition-transform">
                Add Your Listing
              </Link>
              {user ? (
                <Link to="/my-listings" className="btn btn-outline btn-white btn-lg hover:scale-105 transition-transform">
                  My Listings
                </Link>
              ) : (
                <Link to="/login" className="btn btn-outline btn-white btn-lg hover:scale-105 transition-transform">
                  Sign In to List
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* API Status Panel */}
        <div className="mb-6 p-4 bg-white rounded-xl shadow border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-1">Server Connection</h3>
              <p className="text-sm text-gray-600 font-mono break-all">
                Backend: {API_BASE_URL}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-gray-600">
                  Status: 
                  <span className={`ml-2 font-medium ${apiStatus === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
                    {apiStatus === 'healthy' ? 'Connected ✓' : apiStatus === 'checking' ? 'Checking...' : 'Disconnected ✗'}
                  </span>
                </p>
                <span className={`px-2 py-1 text-xs rounded ${dataSource === 'api' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {dataSource === 'api' ? 'Live Data' : dataSource === 'mock' ? 'Sample Data' : 'Unknown'}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={refreshData}
                disabled={refreshing}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center gap-2 disabled:opacity-50"
              >
                <FaRedo className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> 
                {refreshing ? 'Refreshing...' : 'Refresh Data'}
              </button>
              <button
                onClick={seedDatabase}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200 flex items-center gap-2"
              >
                <FaDatabase className="w-4 h-4" /> Seed Database
              </button>
              <button
                onClick={testAPIConnection}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition duration-200 flex items-center gap-2"
              >
                <FaExclamationTriangle /> Test API
              </button>
            </div>
          </div>
        </div>

        {/* Rest of your JSX code remains the same */}
        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search pets, food, accessories..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="input input-bordered w-full pl-10 pr-10 py-3 text-lg"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <FaTimes className="text-gray-400 hover:text-gray-600 text-lg" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium">
                {filteredListings.length} listings
              </span>
              <div className="hidden md:block text-sm text-gray-500">
                {allListings.length > 0 && (
                  <span>Source: <span className="font-medium">{dataSource === 'api' ? 'Server' : 'Local'}</span></span>
                )}
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline btn-sm md:hidden mb-4"
            >
              <FaFilter className="mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.name)}
                    className={`btn ${selectedCategory === cat.name ? 'btn-primary' : 'btn-outline'}`}
                  >
                    <span className="mr-2">{cat.icon}</span>
                    {cat.name}
                    <span className="ml-2 badge badge-sm">
                      {cat.name === 'Pets' ? stats.Pets :
                       cat.name === 'Supplies' ? stats.Supplies :
                       cat.name === 'Food' ? stats.Food :
                       cat.name === 'Accessories' ? stats.Accessories :
                       cat.name === 'Care Products' ? stats['Care Products'] :
                       allListings.length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || selectedCategory !== 'All') && (
          <div className="mb-6">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-gray-600 mr-2">Active filters:</span>
              {selectedCategory !== 'All' && (
                <div className="badge badge-lg badge-primary gap-2 px-3 py-2">
                  {selectedCategory}
                  <button 
                    onClick={() => setSelectedCategory('All')}
                    className="hover:opacity-70"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
              {searchTerm && (
                <div className="badge badge-lg badge-secondary gap-2 px-3 py-2">
                  Search: "{searchTerm}"
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="hover:opacity-70"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-bold">{filteredListings.length}</span> of{" "}
            <span className="font-bold">{allListings.length}</span> listings
            {allListings.length > 0 && (
              <span className="ml-4 text-sm">
                (<span className={dataSource === 'api' ? 'text-green-600' : 'text-yellow-600'}>
                  {dataSource === 'api' ? 'Live server data' : 'Local sample data'}
                </span>)
              </span>
            )}
          </p>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">😿</div>
            <h3 className="text-2xl font-bold mb-2">No Listings Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory !== 'All'
                ? 'Try adjusting your search or filters'
                : 'No listings available at the moment'}
            </p>
            <div className="space-x-3">
              <button
                onClick={clearFilters}
                className="btn btn-primary btn-lg"
              >
                Clear All Filters
              </button>
              <button
                onClick={refreshData}
                className="btn btn-outline btn-lg"
              >
                <FaRedo className="mr-2" /> Refresh Data
              </button>
              {dataSource === 'mock' && (
                <button
                  onClick={seedDatabase}
                  className="btn btn-success btn-lg"
                >
                  <FaDatabase className="mr-2" /> Load Server Data
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing, index) => (
              <motion.div
                key={listing._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200"
              >
                <figure className="h-48 relative overflow-hidden">
                  <SafeImage
                    src={listing.image}
                    alt={listing.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    category={listing.category}
                  />
                  <div className="absolute top-3 right-3">
                    <div className={`badge ${listing.category === 'Pets' ? 'badge-primary' : listing.category === 'Food' ? 'badge-success' : listing.category === 'Accessories' ? 'badge-secondary' : 'badge-error'}`}>
                      {listing.category || 'Other'}
                    </div>
                  </div>
                  {listing.price === 0 && listing.category === 'Pets' && (
                    <div className="absolute top-3 left-3">
                      <div className="badge badge-success gap-1 px-3 py-2">
                        <span className="font-bold">FREE ADOPTION</span>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => toggleFavorite(listing._id)}
                    className="absolute top-3 right-12 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                  >
                    <FaHeart className={`w-5 h-5 ${favorites.includes(listing._id) ? 'text-red-500 fill-red-500' : 'text-gray-500'}`} />
                  </button>
                  {listing.source === 'mock' && (
                    <div className="absolute bottom-3 left-3">
                      <div className="badge badge-warning gap-1 px-2 py-1 text-xs">
                        Sample
                      </div>
                    </div>
                  )}
                </figure>
                <div className="card-body">
                  <h3 className="card-title text-lg font-bold line-clamp-1">
                    {listing.name}
                  </h3>
                  <p className="text-gray-600 line-clamp-2">
                    {listing.description}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="line-clamp-1">{listing.location}</span>
                  </div>

                  <div className="card-actions justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className={`text-2xl font-bold ${listing.price === 0 && listing.category === 'Pets' ? 'text-green-600' : 'text-orange-500'}`}>
                        {listing.price === 0 && listing.category === 'Pets' ? (
                          <span className="flex items-center">
                            <span className="mr-2">🐾</span>
                            Free Adoption
                          </span>
                        ) : (
                          `$${listing.price}`
                        )}
                      </p>
                    </div>
                    <Link
                      to={`/listing/${listing._id}`}
                      className="btn btn-primary flex items-center gap-2"
                    >
                      <FaShoppingCart /> View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Rest of your component remains the same */}
        {/* ... (Category Highlights, Safety Tips, etc.) ... */}

      </div>
    </div>
  );
};

export default PetsAndSupplies;