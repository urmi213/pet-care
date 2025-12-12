// src/pages/MyListings.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import { 
  FaTrash, 
  FaEdit, 
  FaEye, 
  FaPlus, 
  FaSearch,
  FaFilter,
  FaChevronLeft,
  FaMapMarkerAlt,
  FaTag,
  FaExclamationTriangle,
  FaShoppingCart,
  FaHeart,
  FaShareAlt,
  FaCalendarAlt
} from 'react-icons/fa';

const MyListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    sold: 0,
    views: 0
  });

  // ✅ REMOVED defaultListings array - Start empty

  useEffect(() => {
    fetchMyListings();
  }, []);

  useEffect(() => {
    // Update stats when listings change
    const total = listings.length;
    const active = listings.filter(l => l.status === 'active').length;
    const sold = listings.filter(l => l.status === 'sold').length;
    const views = listings.reduce((sum, l) => sum + (l.views || 0), 0);
    
    setStats({ total, active, sold, views });
  }, [listings]);

  const fetchMyListings = () => {
    setLoading(true);
    
    try {
      // Try to get from localStorage
      const savedListings = localStorage.getItem('myListings');
      
      if (savedListings) {
        const parsedListings = JSON.parse(savedListings);
        console.log('📦 Loaded user listings from localStorage:', parsedListings.length);
        setListings(parsedListings);
      } else {
        // ✅ Start with empty array
        console.log('📦 No listings found, starting fresh');
        setListings([]);
      }
      
    } catch (error) {
      console.error('❌ Error loading listings:', error);
      // Start with empty array on error
      setListings([]);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      const updatedListings = listings.filter(listing => listing._id !== id);
      setListings(updatedListings);
      localStorage.setItem('myListings', JSON.stringify(updatedListings));
      
      if (typeof toast === 'function') {
        toast.success('Listing deleted successfully');
      }
    }
  };

  const handleEdit = (id) => {
    if (typeof toast === 'function') {
      toast('Edit feature will be available soon!', {
        icon: '🔧',
        duration: 3000,
      });
    }
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedListings = listings.map(listing => 
      listing._id === id ? { ...listing, status: newStatus } : listing
    );
    setListings(updatedListings);
    localStorage.setItem('myListings', JSON.stringify(updatedListings));
    
    if (typeof toast === 'function') {
      toast.success(`Status changed to ${newStatus}`);
    }
  };

  const handleShare = (listing) => {
    const shareText = `Check out this ${listing.name} for $${listing.price} in ${listing.location}`;
    if (navigator.share) {
      navigator.share({
        title: listing.name,
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      if (typeof toast === 'function') {
        toast.success('Listing link copied to clipboard!');
      }
    }
  };

  // Handle image error
  const handleImageError = (e, listing) => {
    e.target.onerror = null;
    e.target.src = 'https://placehold.co/600x400/cccccc/969696?text=Pet+Image';
    e.target.style.objectFit = 'cover';
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filter === 'all' || listing.category === filter;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'Pets', 'Food', 'Accessories', 'Care Products'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Your Listings</h3>
          <p className="text-gray-500">Getting everything ready for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
              >
                <FaChevronLeft />
                <span>Back</span>
              </button>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                My Listings
              </h1>
              <p className="text-gray-600 mt-2">
                Manage all your pet listings in one place
              </p>
            </div>
            
            <Link
              to="/add-listing"
              className="hidden md:flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
            >
              <FaPlus className="text-lg" />
              <span className="font-semibold">Add New Listing</span>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Listings</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaShoppingCart className="text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <FaHeart className="text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Sold</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.sold}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FaTag className="text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Views</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.views}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <FaEye className="text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search your listings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                  />
                </div>
              </div>

              {/* Filter */}
              <div className="flex gap-4">
                <div className="flex items-center gap-3">
                  <FaFilter className="text-gray-500" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none min-w-[180px]"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Mobile Add Button */}
                <Link
                  to="/add-listing"
                  className="md:hidden flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all"
                >
                  <FaPlus />
                  <span>Add</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="mb-12">
          {filteredListings.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <div
                    key={listing._id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                  >
                    {/* Image with Status Badge */}
                    <div className="relative h-56 overflow-hidden bg-gray-100">
                      {listing.image?.trim() ? (
                        <img
                          src={listing.image}
                          alt={listing.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => handleImageError(e, listing)}
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                          <div className="text-center">
                            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                              <FaShoppingCart className="text-3xl text-gray-500" />
                            </div>
                            <p className="text-gray-500 font-medium">No Image</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                          listing.status === 'active' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-purple-500 text-white'
                        }`}>
                          {listing.status === 'active' ? 'ACTIVE' : 'SOLD'}
                        </span>
                      </div>
                      
                      {/* Views Badge */}
                      <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                        👁️ {listing.views || 0} views
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                            {listing.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              listing.category === 'Pets' ? 'bg-blue-100 text-blue-600' :
                              listing.category === 'Food' ? 'bg-green-100 text-green-600' :
                              listing.category === 'Accessories' ? 'bg-purple-100 text-purple-600' :
                              'bg-red-100 text-red-600'
                            }`}>
                              {listing.category}
                            </span>
                            {listing.price === 0 && (
                              <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-600 rounded-full">
                                🎉 FREE
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            {listing.price === 0 ? 'Free' : `$${listing.price}`}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {listing.description}
                      </p>
                      
                      <div className="flex items-center text-gray-500 mb-6">
                        <FaMapMarkerAlt className="mr-2 text-orange-500" />
                        <span className="font-medium">{listing.location}</span>
                        <span className="mx-2">•</span>
                        <FaCalendarAlt className="mr-2 text-gray-400" />
                        <span className="text-sm">
                          {new Date(listing.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(listing._id)}
                          className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                          <FaEdit />
                          Edit
                        </button>
                        <button
                          onClick={() => handleShare(listing)}
                          className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          title="Share"
                        >
                          <FaShareAlt />
                        </button>
                        <button
                          onClick={() => handleDelete(listing._id)}
                          className="px-4 py-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                      
                      {/* Status Toggle */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Status:</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatusChange(listing._id, 'active')}
                              className={`px-3 py-1 text-xs rounded-full ${listing.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                              Active
                            </button>
                            <button
                              onClick={() => handleStatusChange(listing._id, 'sold')}
                              className={`px-3 py-1 text-xs rounded-full ${listing.status === 'sold' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                              Sold
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Add More Button */}
              <div className="text-center mt-12">
                <Link
                  to="/add-listing"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl text-lg font-semibold"
                >
                  <FaPlus className="text-xl" />
                  Add More Listings
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <div className="text-7xl mb-6">📭</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                No Listings Yet
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                You haven't created any listings yet. Start by adding your first pet or product listing!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/add-listing"
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all font-medium shadow-lg hover:shadow-xl"
                >
                  Create Your First Listing
                </Link>
                <button
                  onClick={() => {
                    // Add a sample listing for testing
                    const sampleListing = {
                      _id: 'sample-' + Date.now(),
                      name: 'Sample Pet Listing',
                      category: 'Pets',
                      price: 0,
                      location: 'Your City',
                      image: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=800&auto=format&fit=crop&q=80',
                      description: 'This is a sample listing. Add your own listings!',
                      createdAt: new Date().toISOString(),
                      status: 'active',
                      views: 0
                    };
                    
                    const updatedListings = [sampleListing];
                    setListings(updatedListings);
                    localStorage.setItem('myListings', JSON.stringify(updatedListings));
                    
                    toast.success('Added a sample listing!');
                  }}
                  className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
                >
                  Add Sample Listing
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Demo Mode Notice - Only show if there are listings */}
        {listings.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FaExclamationTriangle className="text-blue-600 text-xl" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Local Storage Notice</h4>
                <p className="text-blue-700 mb-3">
                  Your listings are saved in your browser's local storage. 
                  They will persist until you clear browser data.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      localStorage.removeItem('myListings');
                      setListings([]);
                      toast.success('All listings cleared!');
                    }}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                  >
                    Clear All Listings
                  </button>
                  <button
                    onClick={fetchMyListings}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                  >
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListings;