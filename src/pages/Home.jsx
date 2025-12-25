import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  FaDog, FaPaw, FaHeart, FaShieldAlt, FaUsers, FaStar, FaMapMarkerAlt, 
  FaChevronLeft, FaChevronRight, FaBone, FaFirstAid, FaShoppingBasket
} from 'react-icons/fa';
import toast from 'react-hot-toast';
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

const Home = () => {
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

 const API_URL = 'https://backend-10-five.vercel.app';
  const defaultPetImage = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80';
  const defaultPersonImage = 'https://www.lucypetproducts.com/wp-content/uploads/2021/04/Brandon_McMillan.jpg';

  useEffect(() => {
    fetchRecentListings();

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bannerSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchRecentListings = async () => {
    try {
      setLoading(true);
      
      try {
      // FIX: Remove timeout or use AbortController
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const testResponse = await fetch(`${API_URL}/health`, { 
        signal: controller.signal 
      });
      
      clearTimeout(timeoutId);
      
      if (testResponse.ok) {
        setIsBackendConnected(true);
        console.log('✅ Server is connected');
      }
      } catch (serverError) {
        setIsBackendConnected(false);
        console.log('🌐 Server not connected, using mock data');
      }
      
      const mockData = getMockListings().slice(0, 6);
      setRecentListings(mockData);
      
      toast.success('Loaded 6 listings successfully!', {
        icon: '✅',
        duration: 3000,
      });
      
    } catch (error) {
      console.error('❌ Error:', error);
      const mockData = getMockListings().slice(0, 6);
      setRecentListings(mockData);
      toast('Using demo listings data', {
        icon: 'ℹ️',
        duration: 3000,
      });
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
      date: '2025-10-27'
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
      date: '2025-10-28'
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
      date: '2025-10-29'
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
        email: 'petsafety@example.com'
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
      date: '2025-10-31'
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
      date: '2025-11-01'
    },
    { 
      _id: '7', 
      name: 'German Shepherd Puppy', 
      category: 'Pets', 
      price: 200, 
      location: 'Dhaka', 
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80', 
      description: 'Healthy German Shepherd puppy, 3 months old.', 
      sellerName: 'Dog Breeders Association',
      email: 'breeders@example.com',
      date: '2025-11-02'
    },
    { 
      _id: '8', 
      name: 'Bird Cage with Accessories', 
      category: 'Accessories', 
      price: 85, 
      location: 'Sylhet', 
      image: 'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=800&auto=format&fit=crop&q=80', 
      description: 'Large bird cage with feeders and toys.', 
      sellerName: 'Bird Paradise',
      email: 'birds@example.com',
      date: '2025-11-03'
    }
  ]);

  const formatPrice = (price) => price === 0 ? 'Free Adoption' : `$${parseFloat(price).toFixed(2)}`;

  // --- Categories ---
  const categories = [
    { id: 1, name: 'Pets (Adoption)', icon: <FaDog className="text-4xl" />, color:'from-blue-400 to-blue-600', bgColor:'bg-blue-50', textColor:'text-blue-600', route:'/category-filtered-product/Pets', description:'Find loving pets for adoption' },
    { id: 2, name: 'Pet Food', icon: <FaBone className="text-4xl" />, color:'from-green-400 to-green-600', bgColor:'bg-green-50', textColor:'text-green-600', route:'/category-filtered-product/Food', description:'Quality nutrition for pets' },
    { id: 3, name: 'Accessories', icon: <FaShoppingBasket className="text-4xl" />, color:'from-purple-400 to-purple-600', bgColor:'bg-purple-50', textColor:'text-purple-600', route:'/category-filtered-product/Accessories', description:'Toys, beds & essentials' },
    { id: 4, name: 'Pet Care Products', icon: <FaFirstAid className="text-4xl" />, color:'from-red-400 to-red-600', bgColor:'bg-red-50', textColor:'text-red-600', route:'/category-filtered-product/Care Products', description:'Health & wellness products' }
  ];

  // --- Banner Slides ---
  const bannerSlides = [
    { 
      id: 1, 
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1920&auto=format&fit=crop&q=80', 
      title:'Find Your Furry Friend Today!', 
      description:'Connect with loving pets waiting for their forever home' 
    },
    { 
      id: 2, 
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=1920&auto=format&fit=crop&q=80', 
      title:'Adopt, Don\'t Shop — Give a Pet a Home', 
      description:'Make a difference in an animal\'s life through adoption' 
    },
    { 
      id: 3, 
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1920&auto=format&fit=crop&q=80', 
      title:'Because Every Pet Deserves Love and Care', 
      description:'Quality supplies and loving homes for all pets' 
    }
  ];

  const petHeroes = [
    { 
      id:1, 
      name:'Sarah Johnson', 
      role:'Pet Rescue Volunteer', 
      image:'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&auto=format&fit=crop&q=80', 
      story:'Rescued over 50 animals in the past 2 years', 
      achievement:'Helped 30+ pets find forever homes' 
    },
    { 
      id:2, 
      name:'Michael Chen', 
      role:'Foster Parent', 
      image:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', 
      story:'Provides temporary homes for abandoned pets', 
      achievement:'Fostered 25+ puppies and kittens' 
    },
    { 
      id:3, 
      name:'Emma Rodriguez', 
      role:'Animal Shelter Director', 
      image:'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&auto=format&fit=crop&q=80', 
      story:'Runs a no-kill shelter for stray animals', 
      achievement:'Saved 200+ animals from euthanasia' 
    },
    { 
      id:4, 
      name:'David Kim', 
      role:'Pet Care Advocate', 
      image:'https://images.unsplash.com/photo-1507591064344-4c6ce005-128?w=400&auto=format&fit=crop&q=80', 
      story:'Educates communities about responsible pet ownership', 
      achievement:'Organized 15+ pet care workshops' 
    }
  ];

  const adoptionBenefits = [
    { icon:<FaHeart className="text-3xl" />, title:'Save a Life', description:'You give a second chance to an animal in need' },
    { icon:<FaShieldAlt className="text-3xl" />, title:'Combat Puppy Mills', description:'Adoption discourages unethical breeding practices' },
    { icon:<FaPaw className="text-3xl" />, title:'Get a Vetted Pet', description:'Shelter pets are often vaccinated and spayed/neutered' },
    { icon:<FaUsers className="text-3xl" />, title:'Support Community', description:'Your adoption fee helps other animals in need' }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  const goToSlide = (index) => setCurrentSlide(index);

  return (
    <div className="min-h-screen bg-white">
      {/* Backend Status Banner */}
      {!isBackendConnected && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-yellow-700">
                  <span className="font-medium">Demo Mode:</span> Using demo data. 
                  <button onClick={fetchRecentListings} className="ml-2 text-yellow-700 underline hover:text-yellow-600">
                    Retry Server Connection
                  </button>
                </p>
              </div>
              <div className="text-xs text-yellow-600 hidden md:block">
                Server URL: {API_URL}
              </div>
            </div>
          </div>
        </div>
      )}

      
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        {bannerSlides.map((slide, index) => (
          <div key={slide.id} className={`absolute inset-0 transition-opacity duration-700 ${index===currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <SafeImage
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover"
              fallback={defaultPetImage}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 flex items-center">
              <div className="container mx-auto px-4 max-w-2xl text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{slide.title}</h1>
                <p className="text-xl md:text-2xl mb-8 opacity-90">{slide.description}</p>
                <Link to="/pets-supplies" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105">
                  <FaPaw /> Browse Listings
                </Link>
              </div>
            </div>
          </div>
        ))}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full z-20 transition-all duration-300">
          <FaChevronLeft className="w-6 h-6"/>
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full z-20 transition-all duration-300">
          <FaChevronRight className="w-6 h-6"/>
        </button>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          {bannerSlides.map((_, i) => (
            <button key={i} onClick={()=>goToSlide(i)} className={`w-3 h-3 rounded-full transition-all duration-300 ${i===currentSlide ? 'bg-white w-8':'bg-white/50'}`}/>
          ))}
        </div>
      </section>

    
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Browse Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Find everything your pet needs in one place</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map(cat => (
              <Link key={cat.id} to={cat.route} className="group">
                <div className={`h-full ${cat.bgColor} rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}>
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`p-4 rounded-full bg-gradient-to-r ${cat.color} text-white`}>{cat.icon}</div>
                    <h3 className={`text-xl font-bold ${cat.textColor}`}>{cat.name}</h3>
                    <p className="text-gray-600">{cat.description}</p>
                    <div className="w-12 h-1 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full"></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

     
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Recent Listings</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Check out the latest pets and products added to our platform</p>
          </div>
          
          {loading ? (
            <div className="text-center py-20">
              <LoadingSpinner />
              <p className="mt-4 text-gray-600">Loading recent listings...</p>
            </div>
          ) : (
            <>
              
              <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full">
                  <span className="font-medium">Showing {recentListings.length} listings</span>
                  {!isBackendConnected && (
                    <span className="text-sm opacity-75">(Demo Data)</span>
                  )}
                </div>
              </div>
              
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentListings.slice(0, 6).map(listing => (
                  <div key={listing._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
                    <div className="h-56 overflow-hidden">
                      <SafeImage
                        src={listing.image}
                        alt={listing.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        fallback={getDefaultImage(listing.category)}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{listing.name}</h3>
                          <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                            listing.category==='Pets'?'bg-blue-100 text-blue-600':
                            listing.category==='Food'?'bg-green-100 text-green-600':
                            listing.category==='Accessories'?'bg-purple-100 text-purple-600':
                            'bg-red-100 text-red-600'
                          }`}>
                            {listing.category}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">{formatPrice(listing.price)}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2 h-12">{listing.description}</p>
                      <div className="flex items-center justify-between text-gray-500 mb-6">
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="mr-2" />
                          <span className="text-sm">{listing.location}</span>
                        </div>
                        <div className="text-sm text-gray-400">Seller: {listing.sellerName}</div>
                      </div>
                      <Link 
                        to={`/listing/${listing._id}`} 
                        className="block w-full text-center bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg"
                      >
                        See Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              
             
              <div className="text-center mt-12">
                <Link 
                  to="/pets-supplies" 
                  className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold text-lg"
                >
                  View All Listings
                  <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

     
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Adopt from PawMart?</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">Choosing adoption is more than just getting a pet - it's about making a compassionate choice</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {adoptionBenefits.map((benefit,i)=>(
              <div key={i} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center transform hover:-translate-y-1">
                <div className="inline-flex p-4 rounded-full bg-blue-100 text-blue-600 mb-6">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Meet Our Pet Heroes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Inspiring stories from our community members who make a difference</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {petHeroes.map(hero=>(
              <div key={hero.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="h-56 overflow-hidden">
                  <SafeImage
                    src={hero.image}
                    alt={hero.name}
                    className="w-full h-full object-cover"
                    fallback={defaultPersonImage}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{hero.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{hero.role}</p>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-3">{hero.story}</p>
                  <p className="text-gray-400 text-xs">{hero.achievement}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Find Your Perfect Pet Companion?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of happy pet owners who found their furry family members through PawMart
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-orange-600 bg-white rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </Link>
            <Link
              to="/pets-supplies"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-lg hover:bg-white/10 transform hover:scale-105 transition-all duration-300"
            >
              Browse All Listings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;