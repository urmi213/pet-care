import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const Category = () => {
  const { categoryName } = useParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categoryName) {
      fetchCategoryListings();
    }
  }, [categoryName]);

  const fetchCategoryListings = async () => {
    try {
      setLoading(true);
      
      // Use the correct API endpoint
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/listings/category/${categoryName}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      setListings(response.data);
      toast.success(`${response.data.length} ${categoryName} found`);
    } catch (error) {
      console.error('Error fetching category listings:', error);
      toast.error('Failed to load listings. Please try again.');
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  // Format category name for display
  const formatCategoryName = (name) => {
    if (!name) return '';
    
    // Handle camelCase or kebab-case
    const formatted = name
      .replace(/([A-Z])/g, ' $1')
      .replace(/-/g, ' ')
      .trim();
    
    return formatted
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Pets': '🐶',
      'Food': '🍖',
      'Accessories': '🧸',
      'Care Products': '💊'
    };
    return icons[category] || '📦';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Pets': 'bg-green-100 text-green-800 border-green-200',
      'Food': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Accessories': 'bg-blue-100 text-blue-800 border-blue-200',
      'Care Products': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="text-6xl mb-6">
            {getCategoryIcon(formatCategoryName(categoryName))}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {formatCategoryName(categoryName)}
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Find the best {formatCategoryName(categoryName).toLowerCase()} for your pets
          </p>
        </div>
      </div>

      {/* Listings Section */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to="/pets-supplies" className="text-blue-600 hover:text-blue-800">
              All Listings
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-medium">
              {formatCategoryName(categoryName)}
            </span>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white p-6 rounded-lg shadow">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Available {formatCategoryName(categoryName)}
            </h2>
            <p className="text-gray-600">
              Showing {listings.length} {listings.length === 1 ? 'listing' : 'listings'}
            </p>
          </div>
          
          <Link
            to="/add-listing"
            className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Listing
          </Link>
        </div>

        {/* Listings Grid */}
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div 
                key={listing._id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-200"
              >
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={listing.image || 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                    alt={listing.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(listing.category)} border`}>
                      {listing.category}
                    </span>
                  </div>
                </div>

                {/* Listing Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                    {listing.name}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {listing.description}
                  </p>

                  <div className="mb-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {listing.category === 'Pets' && listing.price === 0 
                        ? <span className="text-green-600">Free Adoption</span> 
                        : `$${listing.price}`}
                    </p>
                    <div className="flex items-center mt-1 text-gray-500">
                      <span className="mr-1">📍</span>
                      <span className="text-sm">{listing.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span>👤 {listing.email?.split('@')[0] || 'Owner'}</span>
                    </div>
                    
                    <Link 
                      to={`/listing/${listing._id}`}
                      className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <div className="text-6xl mb-6">😔</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              No {formatCategoryName(categoryName)} Available
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              There are currently no {formatCategoryName(categoryName).toLowerCase()} listed. 
              Check back later or add your own listing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/pets-supplies"
                className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
              >
                Browse All Categories
              </Link>
              <Link 
                to="/add-listing"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Add a Listing
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;