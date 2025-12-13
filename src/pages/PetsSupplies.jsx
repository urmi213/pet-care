import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { FaFilter, FaSearch, FaTimes, FaPaw, FaBone, FaTshirt, FaMedkit } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const PetsAndSupplies = () => {
  const [allListings, setAllListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Default images for fallback
  const defaultPetImage = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop&q=80';
  const defaultFoodImage = 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&auto=format&fit=crop&q=80';
  const defaultAccessoriesImage = 'https://images.unsplash.com/photo-1514888286974-6d03bdeacba8?w=400&auto=format&fit=crop&q=80';
  const defaultCareImage = 'https://images.unsplash.com/photo-1560743641-3914f2c45636?w=400&auto=format&fit=crop&q=80';

  // Safe image URL getter
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
    fetchListings();
  }, []);

  useEffect(() => {
    filterListings();
  }, [searchTerm, selectedCategory, allListings]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching all listings...');
      
      
      const endpoints = [
        'http://localhost:5000/listings',
        'http://localhost:5000/api/listings',
        'https://your-server.vercel.app/listings'
      ];
      
      let response = null;
      let listingsData = [];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          const res = await fetch(endpoint);
          if (res.ok) {
            response = res;
            break;
          }
        } catch (err) {
          console.log(`Endpoint ${endpoint} failed`);
          continue;
        }
      }
      
      if (!response) {
        console.log('🌐 All endpoints failed, using mock data');
        useMockData();
        toast('Using demo data. Start backend server for real data.', {
          icon: '⚠️',
          duration: 4000,
        });
        return;
      }
      
      const data = await response.json();
      
      
      if (Array.isArray(data)) {
        listingsData = data;
      } else if (data && data.data && Array.isArray(data.data)) {
        listingsData = data.data;
      } else if (data && Array.isArray(data.listings)) {
        listingsData = data.listings;
      }
      
      if (!Array.isArray(listingsData) || listingsData.length === 0) {
        console.warn('⚠️ No listings from server, using mock data');
        useMockData();
        return;
      }
      
     
      const processedListings = listingsData.map(listing => ({
        _id: listing._id || listing.id || `temp-${Date.now()}-${Math.random()}`,
        name: listing.name || listing.title || 'Unnamed Listing',
        category: listing.category || 'Pets',
        price: listing.price || listing.Price || 0,
        location: listing.location || 'Unknown',
        image: getSafeImageUrl(listing.image || listing.imageUrl, listing.category),
        description: listing.description || 'No description available',
        sellerName: listing.sellerName || 'Pet Owner',
        email: listing.email || 'owner@example.com'
      })).filter(listing => {
       
        const sellerName = (listing.sellerName || '').toLowerCase();
        const email = (listing.email || '').toLowerCase();
        
        return !sellerName.includes('urmi') &&
               !sellerName.includes('chakraborty') &&
               !email.includes('urmi') &&
               !email.includes('chakraborty');
      });
      
      console.log('✅ Loaded listings from server:', processedListings.length);
      setAllListings(processedListings);
      setFilteredListings(processedListings);
      toast.success('Listings loaded successfully!');
      
    } catch (error) {
      console.error('❌ Error fetching listings:', error);
      useMockData();
      toast.error('Failed to load listings. Using demo data.');
    } finally {
      setLoading(false);
    }
  };

const useMockData = () => {
  console.log('🔄 Loading NEW mock data WITHOUT Cat Scratching Post');
  
  const mockData = [
    // Pets
    {
      _id: 'pet1',
      name: 'Golden Retriever Puppy',
      category: 'Pets',
      price: 0,
      location: 'Dhaka',
      image: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?q=80&w=764&auto=format&fit=crop',
      description: 'Friendly puppy looking for loving home.',
      sellerName: 'Dhaka Pet Center',
      email: 'dhakapetcenter@example.com'
    },
    {
      _id: 'pet2',
      name: 'Persian Kitten',
      category: 'Pets',
      price: 150,
      location: 'Khulna',
      image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=870&auto=format&fit=crop',
      description: 'Beautiful vaccinated Persian kitten.',
      sellerName: 'Cat Lovers Club',
      email: 'catlovers@example.com'
    },
    {
        _id: '3',
        name: 'Pet First Aid Kit',
        category: 'Care Products',
        price: 30,
        location: 'Dhaka',
        image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=1167&auto=format&fit=crop',
        description: 'Complete pet first aid kit with bandages, antiseptic, and emergency guide.',
        sellerName: 'Pet Safety First',
        email: 'petsafety@example.com'
      },
    // Food
    {
      _id: 'food1',
      name: 'Premium Dog Food 5kg',
      category: 'Food',
      price: 25,
      location: 'Chattogram',
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?q=80&w=870&auto=format&fit=crop',
      description: 'High-quality dog food.',
      sellerName: 'Pet Food Store',
      email: 'petfoodstore@example.com'
    },
    {
      _id: 'food2',
      name: 'Cat Dry Food 3kg',
      category: 'Food',
      price: 20,
      location: 'Sylhet',
      image: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=870&auto=format&fit=crop',
      description: 'Premium cat food.',
      sellerName: 'Healthy Pet Foods',
      email: 'healthyfoods@example.com'
    },
    // Accessories (NO CAT SCRATCHING POST!)
    {
      _id: 'acc1',
      name: 'Dog Leash Set',
      category: 'Accessories',
      price: 18,
      location: 'Dhaka',
      image: 'https://images.unsplash.com/photo-1554456854-55a089fd4cb2?q=80&w=870&auto=format&fit=crop',
      description: 'Premium leather dog leash with collar.',
      sellerName: 'Pet Gear BD',
      email: 'petgear@example.com'
    },
    {
      _id: 'acc2',
      name: 'Rabbit Hutch',
      category: 'Accessories',
      price: 120,
      location: 'Barishal',
      image: 'https://images.unsplash.com/photo-1504595403659-9088ce801e29?q=80&w=987&auto=format&fit=crop',
      description: 'Spacious wooden rabbit hutch.',
      sellerName: 'Small Pet World',
      email: 'smallpetworld@example.com'
    },
    {
      _id: 'acc3',
      name: 'Fish Tank 20L',
      category: 'Accessories',
      price: 75,
      location: 'Sylhet',
      image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?q=80&w=870&auto=format&fit=crop',
      description: 'Complete fish tank setup.',
      sellerName: 'Aqua Pet Shop',
      email: 'aquapetshop@example.com'
    },
    // Care Products
    {
      _id: 'care1',
      name: 'Pet Shampoo',
      category: 'Care Products',
      price: 12,
      location: 'Rajshahi',
      image: 'https://images.unsplash.com/photo-1560743641-3914f2c45636?q=80&w=870&auto=format&fit=crop',
      description: 'Organic pet shampoo.',
      sellerName: 'Pet Care Mart',
      email: 'petcaremart@example.com'
    },
    {
      _id: 'care2',
      name: 'Flea & Tick Spray',
      category: 'Care Products',
      price: 22,
      location: 'Khulna',
      image: 'https://images.unsplash.com/photo-1583336663277-620dc1996580?q=80&w=870&auto=format&fit=crop',
      description: 'Effective flea protection spray.',
      sellerName: 'Pet Healthcare BD',
      email: 'pethealthcare@example.com'
    },
    {
      _id: 'care3',
      name: 'Pet First Aid Kit',
      category: 'Care Products',
      price: 30,
      location: 'Dhaka',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=870&auto=format&fit=crop',
      description: 'Complete pet first aid kit.',
      sellerName: 'Pet Safety First',
      email: 'petsafety@example.com'
    }
  ];
  
  // Verify NO Cat Scratching Post
  const hasCatScratching = mockData.some(item => 
    item.name.toLowerCase().includes('cat scratching') || 
    item.name.toLowerCase().includes('scratching post')
  );
  
  console.log('✅ Has Cat Scratching Post?', hasCatScratching);
  console.log('📊 Total items:', mockData.length);
  
  setAllListings(mockData);
  setFilteredListings(mockData);
};

  const filterListings = () => {
    let filtered = allListings;

    // Filter by category
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

  const refreshData = () => {
    fetchListings();
  };

  const categories = [
    { id: 'all', name: 'All', icon: '📦' },
    { id: 'pets', name: 'Pets', icon: '🐶' },
    { id: 'supplies', name: 'Supplies', icon: '🛒' },
    { id: 'food', name: 'Food', icon: '🍖' },
    { id: 'accessories', name: 'Accessories', icon: '🧸' },
    { id: 'care', name: 'Care Products', icon: '💊' }
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

  // Safe image component
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Pets & Supplies Marketplace</h1>
            <p className="text-xl opacity-90 mb-8">
              Find your perfect pet companion or shop for quality pet supplies all in one place
            </p>
            
           
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
              <Link to="/category-filtered-product/Pets" className="btn btn-outline btn-white btn-lg hover:scale-105 transition-transform">
                Browse Pets
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search pets, food, accessories, care products..."
              value={searchTerm}
              onChange={handleSearch}
              className="input input-bordered w-full pl-10 pr-10 py-3 text-lg"
              disabled={loading}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={loading}
              >
                <FaTimes className="text-gray-400 hover:text-gray-600 text-lg" />
              </button>
            )}
          </div>

         
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-outline btn-sm md:hidden mb-4"
                disabled={loading}
              >
                <FaFilter className="mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              <div className={`${showFilters ? 'block' : 'hidden'} md:block mt-4 md:mt-0`}>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.name)}
                      disabled={loading}
                      className={`btn ${selectedCategory === cat.name ? 'btn-primary' : 'btn-outline'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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

            <div className="flex items-center space-x-4">
              <span className="text-gray-600 font-medium">
                Showing {filteredListings.length} of {allListings.length} listings
              </span>
              {(searchTerm || selectedCategory !== 'All') && (
                <button
                  onClick={clearFilters}
                  className="btn btn-ghost text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
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

        {/* Results */}
        {loading ? (
          <div className="text-center py-16">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">Loading listings from server...</p>
          </div>
        ) : filteredListings.length === 0 ? (
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
                Try Again
              </button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing, index) => (
                <motion.div
                  key={listing._id || `listing-${index}`}
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
                  </figure>
                  <div className="card-body">
                    <h3 className="card-title text-lg font-bold line-clamp-1">
                      {listing.name || 'Unnamed Item'}
                    </h3>
                    <p className="text-gray-600 line-clamp-2">
                      {listing.description || 'No description available'}
                    </p>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="line-clamp-1">{listing.location || 'Location not specified'}</span>
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
                            `$${listing.price || 0}`
                          )}
                        </p>
                      </div>
                      <Link
                        to={`/listing/${listing._id}`}
                        className="btn btn-primary"
                      >
                        View Details
                      </Link>
                    </div>
                    
                    {/* Seller info - DIFFERENT SELLERS ONLY */}
                    {listing.sellerName && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          Seller: <span className="text-gray-700">{listing.sellerName}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Category Sections */}
            {selectedCategory === 'All' && !searchTerm && (
              <div className="mt-16 space-y-12">
                {/* Pets Section */}
                {stats.Pets > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-2xl border border-blue-100"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <FaPaw className="text-3xl text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-blue-700">Featured Pets</h3>
                        <p className="text-gray-600">Find your perfect furry companion</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {allListings
                        .filter(l => l.category === 'Pets')
                        .slice(0, 3)
                        .map((pet) => (
                          <div key={pet._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100">
                            <SafeImage 
                              src={pet.image} 
                              alt={pet.name} 
                              className="w-full h-48 object-cover"
                              category="Pets"
                            />
                            <div className="p-4">
                              <h4 className="font-bold text-lg">{pet.name}</h4>
                              <p className="text-gray-600 text-sm line-clamp-2">{pet.description}</p>
                              <div className="mt-4 flex justify-between items-center">
                                <span className={`font-bold ${pet.price === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                                  {pet.price === 0 ? 'Free Adoption' : `$${pet.price}`}
                                </span>
                                <span className="text-sm text-gray-500">📍 {pet.location}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    {stats.Pets > 3 && (
                      <div className="text-center mt-6">
                        <Link to="/category-filtered-product/Pets" className="btn btn-outline btn-primary">
                          View All Pets ({stats.Pets})
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Food Section */}
                {stats.Food > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-r from-green-50 to-white p-6 rounded-2xl border border-green-100"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-green-100 rounded-xl">
                        <FaBone className="text-3xl text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-green-700">Premium Pet Food</h3>
                        <p className="text-gray-600">Nutritious meals for healthy pets</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {allListings
                        .filter(l => l.category === 'Food')
                        .slice(0, 3)
                        .map((food) => (
                          <div key={food._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-green-100">
                            <SafeImage 
                              src={food.image} 
                              alt={food.name} 
                              className="w-full h-48 object-cover"
                              category="Food"
                            />
                            <div className="p-4">
                              <h4 className="font-bold text-lg">{food.name}</h4>
                              <p className="text-gray-600 text-sm line-clamp-2">{food.description}</p>
                              <div className="mt-4 flex justify-between items-center">
                                <span className="text-green-600 font-bold">${food.price}</span>
                                <span className="text-sm text-gray-500">📍 {food.location}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    {stats.Food > 3 && (
                      <div className="text-center mt-6">
                        <Link to="/category-filtered-product/Food" className="btn btn-outline btn-success">
                          View All Food ({stats.Food})
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}

                
                {stats.Accessories > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-r from-purple-50 to-white p-6 rounded-2xl border border-purple-100"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-purple-100 rounded-xl">
                        <FaTshirt className="text-3xl text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-purple-700">Pet Accessories</h3>
                        <p className="text-gray-600">Toys, beds, and essentials for comfort</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {allListings
                        .filter(l => l.category === 'Accessories')
                        .slice(0, 3)
                        .map((item) => (
                          <div key={item._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-purple-100">
                            <SafeImage 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-48 object-cover"
                              category="Accessories"
                            />
                            <div className="p-4">
                              <h4 className="font-bold text-lg">{item.name}</h4>
                              <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                              <div className="mt-4 flex justify-between items-center">
                                <span className="text-purple-600 font-bold">${item.price}</span>
                                <span className="text-sm text-gray-500">📍 {item.location}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    {stats.Accessories > 3 && (
                      <div className="text-center mt-6">
                        <Link to="/category-filtered-product/Accessories" className="btn btn-outline btn-secondary">
                          View All Accessories ({stats.Accessories})
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}

                
                {stats['Care Products'] > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-r from-red-50 to-white p-6 rounded-2xl border border-red-100"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-red-100 rounded-xl">
                        <FaMedkit className="text-3xl text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-red-700">Care & Health Products</h3>
                        <p className="text-gray-600">Keep your pet healthy and happy</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {allListings
                        .filter(l => l.category === 'Care Products')
                        .slice(0, 3)
                        .map((product) => (
                          <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-red-100">
                            <SafeImage 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-48 object-cover"
                              category="Care Products"
                            />
                            <div className="p-4">
                              <h4 className="font-bold text-lg">{product.name}</h4>
                              <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                              <div className="mt-4 flex justify-between items-center">
                                <span className="text-red-600 font-bold">${product.price}</span>
                                <span className="text-sm text-gray-500">📍 {product.location}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    {stats['Care Products'] > 3 && (
                      <div className="text-center mt-6">
                        <Link to="/category-filtered-product/Care Products" className="btn btn-outline btn-error">
                          View All Care Products ({stats['Care Products']})
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            )}
          </>
        )}

        {/* Call to Action */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Have a pet or supplies to list?</h2>
              <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
                Join our community of pet lovers and reach thousands of potential adopters and buyers
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Link 
                  to="/add-listing" 
                  className="btn btn-white btn-lg hover:scale-105 transition-transform"
                >
                  Add Your Listing
                </Link>
                <button 
                  onClick={refreshData}
                  className="btn btn-outline btn-white btn-lg hover:scale-105 transition-transform"
                >
                  Refresh Listings
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PetsAndSupplies;