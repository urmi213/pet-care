import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import { FaMapMarkerAlt, FaCalendarAlt, FaEnvelope, FaPhone, FaTag, FaHeart, FaShareAlt } from 'react-icons/fa';
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

  // Fetch listing details
  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching listing ID:', id);
        
        // ✅ CORRECTED URL - removed /api prefix
        const response = await axios.get(`http://localhost:5000/listings/${id}`);
        console.log('✅ Backend response:', response.data);
        
        let listingData = null;
        
        // Handle different response formats
        if (response.data && response.data._id) {
          listingData = response.data;
        } else if (response.data?.data) {
          listingData = response.data.data;
        }
        
        // If no data from backend, use mock data
        if (!listingData) {
          console.log('⚠️ Using mock data');
          listingData = getMockListing(id);
        }
        
        setListing(listingData);
        
      } catch (error) {
        console.error('❌ Error fetching listing:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        });
        
        // Use mock data on error
        const mockData = getMockListing(id);
        setListing(mockData);
        
        if (error.response?.status === 404) {
          toast.error('Product not found on server. Showing sample data.');
        } else if (error.code === 'ERR_NETWORK') {
          toast.error('Cannot connect to server. Showing sample data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchListingDetails();
  }, [id]);

  // Mock data function (fallback)
  const getMockListing = (listingId) => {
    const mockListings = {
      '1': {
        _id: '1',
        name: 'Golden Retriever Puppy',
        title: 'Golden Retriever Puppy',
        category: 'Pets',
        price: 0,
        location: 'Dhaka',
        image: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=800&auto=format&fit=crop&q=80',
        description: 'Friendly 3-month-old Golden Retriever puppy. Vaccinated and ready for adoption. Very playful and good with kids.',
        email: 'seller@example.com',
        phone: '+8801712345678',
        sellerName: 'John Doe',
        date: '2024-12-09',
        createdAt: '2024-12-09'
      },
      '2': {
        _id: '2',
        name: 'Persian Kitten',
        title: 'Persian Kitten',
        category: 'Pets',
        price: 150,
        location: 'Chattogram',
        image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&auto=format&fit=crop&q=80',
        description: 'Beautiful white Persian kitten, 2 months old. Litter trained and very affectionate.',
        email: 'seller@example.com',
        phone: '+8801812345678',
        sellerName: 'Cat Lover',
        date: '2024-12-08',
        createdAt: '2024-12-08'
      },
      '3': {
        _id: '3',
        name: 'Premium Dog Food 5kg',
        title: 'Premium Dog Food 5kg',
        category: 'Food',
        price: 25,
        location: 'Sylhet',
        image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&auto=format&fit=crop&q=80',
        description: 'High-quality dog food with natural ingredients. Complete balanced diet for all breeds.',
        email: 'seller@example.com',
        phone: '+8801912345678',
        sellerName: 'Pet Food Store',
        date: '2024-12-07',
        createdAt: '2024-12-07'
      },
      '4': {
        _id: '4',
        name: 'Pet First Aid Kit',
        title: 'Pet First Aid Kit',
        category: 'Care Products',
        price: 30,
        location: 'Dhaka',
        image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=1167&auto=format&fit=crop',
        description: 'Complete pet first aid kit with bandages, antiseptic, and emergency guide.',
        email: 'petsafety@example.com',
        phone: '+8801612345678',
        sellerName: 'Pet Safety First',
        date: '2024-12-06',
        createdAt: '2024-12-06'
      },
      '5': {
        _id: '5',
        name: 'Organic Pet Shampoo',
        title: 'Organic Pet Shampoo',
        category: 'Care Products',
        price: 15,
        location: 'Rajshahi',
        image: 'https://images.unsplash.com/photo-1560743641-3914f2c45636?w=800&auto=format&fit=crop&q=80',
        description: 'Gentle shampoo for sensitive skin pets. Tear-free formula with natural oils.',
        email: 'organicpet@example.com',
        phone: '+8801512345678',
        sellerName: 'Organic Pet Care',
        date: '2024-12-05',
        createdAt: '2024-12-05'
      },
      '6': { 
        _id: '6', 
        name: 'Rabbit Hutch with Run', 
        title: 'Rabbit Hutch with Run',
        category: 'Accessories', 
        price: 120, 
        location: 'Barishal', 
        image: 'https://images.unsplash.com/photo-1504595403659-9088ce801e29?w=800&auto=format&fit=crop&q=80', 
        description: 'Spacious wooden rabbit hutch with exercise run.', 
        email: 'smallpets@example.com',
        phone: '+8801412345678',
        sellerName: 'Small Pet World',
        date: '2025-11-01',
        createdAt: '2025-11-01'
      }
    };

    return mockListings[listingId] || {
      _id: listingId,
      name: 'Sample Product',
      title: 'Sample Product',
      category: 'Products',
      price: 49.99,
      location: 'Dhaka',
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
      description: 'This is a sample product description.',
      email: 'seller@example.com',
      phone: '+8801712345678',
      sellerName: 'Sample Seller',
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
  };

  // Handle order button click
  const handleOrderClick = () => {
    console.log('🎯 ORDER NOW BUTTON CLICKED!');
    
    // Log debug info
    console.log('📊 Debug Info:');
    console.log('- User:', user ? 'Logged in as ' + user.email : 'Not logged in');
    console.log('- Listing:', listing);
    console.log('- API URL for orders: http://localhost:5000/orders');
    
    // Check if user is logged in
    if (!user) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }
    
    // Open modal immediately
    console.log('🚀 Opening Order Modal...');
    setShowOrderModal(true);
  };

  // Handle contact seller button click
  const handleContactSeller = () => {
    if (!user) {
      toast.error('Please login to contact seller');
      navigate('/login');
      return;
    }
    
    // Open contact modal
    setShowContactModal(true);
  };

  // Handle send message in contact modal
  const handleSendMessage = async () => {
    if (!contactMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    try {
      // Send message via email
      const subject = `Inquiry about: ${listing.title || listing.name}`;
      const body = `Message from ${user.email || 'User'}:\n\n${contactMessage}\n\nRegarding: ${listing.title || listing.name}\n\nProduct URL: ${window.location.href}`;
      
      window.location.href = `mailto:${listing.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      toast.success('Opening email client...');
      setShowContactModal(false);
      setContactMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to open email client');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading product details..." />;
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">😔</div>
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/pets-supplies')}
            className="btn btn-primary mt-4"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Debug Info Banner */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">
                Product ID: <span className="font-bold">{listing._id}</span> | 
                Category: <span className="font-bold">{listing.category}</span> | 
                Price: <span className="font-bold">${listing.price}</span>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                API: http://localhost:5000/listings/{id}
              </p>
            </div>
            <button 
              onClick={() => console.log('Listing State:', { listing, user, showOrderModal, showContactModal })}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Log State
            </button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-600 mb-8">
          <button onClick={() => navigate('/')} className="hover:text-blue-600">
            Home
          </button>
          <span className="mx-2">/</span>
          <button onClick={() => navigate('/pets-supplies')} className="hover:text-blue-600">
            Pets & Supplies
          </button>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium truncate max-w-xs">
            {listing.title || listing.name}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Product Image */}
          <div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-96 overflow-hidden bg-gray-100">
                <img
                  src={listing.image}
                  alt={listing.title || listing.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d';
                  }}
                />
              </div>
              <div className="p-4 flex justify-between items-center">
                <div className="flex gap-2">
                  <button className="p-2 text-gray-500 hover:text-red-500">
                    <FaHeart />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-blue-500">
                    <FaShareAlt />
                  </button>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  listing.category === 'Pets' ? 'bg-green-100 text-green-800' :
                  listing.category === 'Food' ? 'bg-yellow-100 text-yellow-800' :
                  listing.category === 'Accessories' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  <FaTag className="inline mr-1" />
                  {listing.category || 'General'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            {/* Product Info Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {listing.title || listing.name}
              </h1>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{listing.location || 'Location not specified'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaCalendarAlt className="mr-2" />
                  <span>
                    {listing.date 
                      ? new Date(listing.date).toLocaleDateString() 
                      : 'Date not specified'}
                  </span>
                </div>
              </div>

              {/* Price Display */}
              <div className={`p-6 rounded-lg mb-6 ${
                listing.price === 0 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
                  : 'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200'
              }`}>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">
                    {listing.category === 'Pets' ? 'Adoption Fee' : 'Product Price'}
                  </p>
                  <p className={`text-5xl font-bold ${
                    listing.price === 0 ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {listing.price === 0 ? 'FREE' : `$${listing.price}`}
                  </p>
                  {listing.price === 0 && (
                    <p className="text-green-600 text-sm mt-2">
                      🐾 This pet is looking for a loving home
                    </p>
                  )}
                </div>
              </div>

              {/* ORDER NOW BUTTON - MAIN */}
              <div className="space-y-4">
                <button
                  onClick={handleOrderClick}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-lg transition-colors shadow-lg hover:shadow-xl"
                >
                  {listing.category === 'Pets' ? '🐕 ADOPT NOW' : '🛒 ORDER NOW'}
                </button>
                
                {/* Debug Button */}
                <button 
                  onClick={() => {
                    console.log('Test: Checking user and opening modal');
                    if (!user) {
                      toast.error('Please login');
                      navigate('/login');
                      return;
                    }
                    setShowOrderModal(true);
                  }}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                >
                  Test Order Button
                </button>
                
                <p className="text-center text-sm text-gray-500">
                  Click any button above to open order form
                </p>
              </div>

              {/* User Status Info */}
              <div className="mt-6 p-3 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Status:</span>{' '}
                  {user ? `Logged in as ${user.email}` : 'Not logged in'}
                </p>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Description</h2>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {listing.description || 'No description provided.'}
              </div>
            </div>

            {/* Seller Info Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Seller Information</h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-lg">
                    {listing.sellerName ? listing.sellerName.charAt(0).toUpperCase() : 
                     listing.email ? listing.email.charAt(0).toUpperCase() : 'S'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{listing.sellerName || listing.email || 'Unknown Seller'}</p>
                  <p className="text-sm text-gray-600">Verified Seller</p>
                </div>
                <button 
                  onClick={handleContactSeller}
                  className="py-2 px-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                  <FaEnvelope />
                  Contact
                </button>
              </div>
              
              {/* Seller Contact Details */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center text-gray-700">
                    <FaEnvelope className="mr-2 text-gray-500" />
                    <span className="text-blue-600 truncate">{listing.email}</span>
                  </div>
                  {listing.phone && (
                    <div className="flex items-center text-gray-700">
                      <FaPhone className="mr-2 text-gray-500" />
                      <span className="text-blue-600">{listing.phone}</span>
                    </div>
                  )}
                </div>
                {/* Direct message button */}
                <button 
                  onClick={() => setShowContactModal(true)}
                  className="w-full mt-4 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FaEnvelope />
                  Send Direct Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ORDER MODAL */}
      {showOrderModal && listing && (
        <OrderModal
          listing={listing}
          onClose={() => {
            console.log('Modal closing');
            setShowOrderModal(false);
          }}
          onSuccess={() => {
            console.log('Order successful!');
            setShowOrderModal(false);
            toast.success('Order placed successfully! 🎉');
            setTimeout(() => {
              navigate('/my-orders');
            }, 1500);
          }}
        />
      )}

      {/* CONTACT MODAL */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold mb-4">Contact Seller</h3>
            
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
                className="w-full border border-gray-300 rounded-lg p-3 min-h-[150px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Type your message here... Example: Hi, I'm interested in your product. Can you tell me more about availability and shipping options?"
              />
              <p className="text-xs text-gray-500 mt-1">
                Your email ({user?.email}) will be included with the message
              </p>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowContactModal(false);
                  setContactMessage('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingDetails;