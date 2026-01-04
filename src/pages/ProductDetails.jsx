import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { 
  FaStar, 
  FaShoppingCart, 
  FaHeart, 
  FaShareAlt, 
  FaTruck, 
  FaShieldAlt, 
  FaUndo,
  FaTag,
  FaCheck,
  FaShoppingBag,
  FaCreditCard,
  FaShippingFast,
  FaLeaf,
  FaSeedling,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);

  const API_BASE_URL = 'https://backend-10-five.vercel.app';

  // Fetch product details that matches Home.js listings
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        
        // First try to get the specific product
        try {
          const response = await axios.get(`${API_BASE_URL}/api/listings/${id}`, {
            timeout: 10000,
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });
          
          if (response.data) {
            let productData = null;
            
            // Handle different response formats
            if (response.data._id || response.data.id) {
              productData = response.data;
            } else if (response.data?.data) {
              productData = response.data.data;
            } else if (response.data?.success && response.data.data) {
              productData = response.data.data;
            }
            
            if (productData) {
              console.log('✅ Product data from API:', productData);
              // Enrich the data with additional fields for product details page
              const enrichedData = enrichProductData(productData);
              setProduct(enrichedData);
              return;
            }
          }
        } catch (apiError) {
          console.log('❌ API failed, using enriched mock data');
        }
        
        // If API fails, try to get from recent listings endpoint
        try {
          const response = await axios.get(`${API_BASE_URL}/listings/latest/20`, {
            timeout: 5000
          });
          
          if (response.data && Array.isArray(response.data)) {
            const foundProduct = response.data.find(item => 
              item._id === id || item.id === id || item.id?.toString() === id
            );
            
            if (foundProduct) {
              const enrichedData = enrichProductData(foundProduct);
              setProduct(enrichedData);
              return;
            }
          }
        } catch (secondError) {
          console.log('❌ Second API attempt failed');
        }
        
        // Fallback to enhanced mock data based on ID
        const mockData = getEnhancedProductData(id);
        setProduct(mockData);
        toast.success('Using sample product data');
        
      } catch (error) {
        console.error('❌ Error fetching product:', error);
        const mockData = getEnhancedProductData(id);
        setProduct(mockData);
        toast.error('Showing sample product data');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  // Enrich product data with additional fields for product details page
  const enrichProductData = (basicData) => {
    // Get category-specific enhancements
    const categoryEnhancements = getCategoryEnhancements(basicData.category);
    
    return {
      // Basic data from Home.js listings
      _id: basicData._id || basicData.id || id,
      id: basicData.id || basicData._id || id,
      title: basicData.name || basicData.title || 'Product',
      name: basicData.name || basicData.title || 'Product',
      category: basicData.category || 'General',
      brand: basicData.brand || 'PetCare Brand',
      sku: basicData.sku || `PC-${id}`,
      price: basicData.price || 0,
      originalPrice: basicData.originalPrice || (basicData.price ? basicData.price * 1.3 : 0),
      discount: basicData.discount || 0,
      rating: basicData.rating || 4.5,
      totalReviews: basicData.totalReviews || Math.floor(Math.random() * 100) + 20,
      inStock: basicData.inStock !== undefined ? basicData.inStock : true,
      stock: basicData.stock || Math.floor(Math.random() * 50) + 10,
      
      // Multiple images as per requirements
      images: basicData.images || basicData.imageUrls || [
        basicData.image || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1591946743032-88d6c8d0bf6d?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=800&auto=format&fit=crop&q=80'
      ],
      
      // Overview/Description section
      description: basicData.description || `<p>Premium quality product with excellent features. ${basicData.name || 'This product'} is designed for your pet's comfort and health.</p>`,
      
      // Key Information/Specs section
      specifications: {
        "Condition": "Brand New",
        "Location": basicData.location || 'Dhaka',
        "Seller": basicData.sellerName || 'Verified Seller',
        "Date Listed": basicData.date || new Date().toISOString().split('T')[0],
        ...categoryEnhancements.specifications
      },
      
      // Features
      features: categoryEnhancements.features,
      
      // Reviews/Ratings section
      reviews: categoryEnhancements.reviews,
      
      // Related/Suggested Items section
      relatedProducts: categoryEnhancements.relatedProducts,
      
      // Shipping info
      shippingInfo: {
        freeShipping: basicData.price > 50,
        deliveryTime: "2-5 business days",
        returnPolicy: "30-day money back guarantee",
        shipsFrom: basicData.location || 'Dhaka'
      },
      
      // Additional info from Home.js
      location: basicData.location,
      sellerName: basicData.sellerName,
      email: basicData.email,
      phone: basicData.phone,
      date: basicData.date,
      
      tags: [basicData.category, 'Premium', 'Verified']
    };
  };

  // Get category-specific enhancements
  const getCategoryEnhancements = (category) => {
    const baseFeatures = [
      "Premium Quality",
      "Safe for Pets",
      "Easy to Use",
      "Value for Money"
    ];
    
    const baseReviews = [
      { 
        id: 1, 
        user: "John D.", 
        rating: 5, 
        date: "2024-03-15", 
        comment: "Excellent product! My pet loves it.",
        verified: true
      },
      { 
        id: 2, 
        user: "Sarah M.", 
        rating: 4, 
        date: "2024-03-10", 
        comment: "Good quality and fast delivery.",
        verified: true
      }
    ];
    
    const baseSpecifications = {
      "Material": "Premium Materials",
      "Color": "Various",
      "Size": "Standard"
    };
    
    const baseRelatedProducts = [
      { 
        id: 101, 
        name: "Similar Product", 
        price: 49.99, 
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&auto=format&fit=crop&q=80",
        category: "Similar"
      }
    ];
    
    switch(category) {
      case 'Pets':
        return {
          features: [...baseFeatures, "Healthy & Vaccinated", "Family Friendly", "Trained"],
          reviews: baseReviews,
          specifications: {
            ...baseSpecifications,
            "Age": "2-6 months",
            "Vaccination": "Complete",
            "Breed": "Mixed",
            "Gender": "Male/Female"
          },
          relatedProducts: [
            { 
              id: 201, 
              name: "Pet Food", 
              price: 29.99, 
              rating: 4.5,
              image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&auto=format&fit=crop&q=80",
              category: "Food"
            },
            { 
              id: 202, 
              name: "Pet Bed", 
              price: 39.99, 
              rating: 4.8,
              image: "https://images.unsplash.com/photo-1559131397-f94da358a2c5?w=400&auto=format&fit=crop&q=80",
              category: "Accessories"
            }
          ]
        };
        
      case 'Food':
        return {
          features: [...baseFeatures, "Organic Ingredients", "Nutritionally Balanced", "Vet Recommended"],
          reviews: baseReviews,
          specifications: {
            ...baseSpecifications,
            "Weight": "5kg",
            "Flavor": "Chicken",
            "Life Stage": "All Stages",
            "Ingredients": "Natural"
          },
          relatedProducts: [
            { 
              id: 301, 
              name: "Food Bowl", 
              price: 19.99, 
              rating: 4.3,
              image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&auto=format&fit=crop&q=80",
              category: "Accessories"
            }
          ]
        };
        
      default:
        return {
          features: baseFeatures,
          reviews: baseReviews,
          specifications: baseSpecifications,
          relatedProducts: baseRelatedProducts
        };
    }
  };

  // Fallback enhanced mock data
  const getEnhancedProductData = (productId) => {
    // This matches Home.js mock data IDs
    const products = {
      '1': {
        _id: '1',
        id: 1,
        title: "Golden Retriever Puppy",
        name: "Golden Retriever Puppy",
        category: "Pets",
        price: 0,
        location: "Dhaka",
        description: "Friendly 2-month-old puppy available for adoption.",
        sellerName: "Pet Care Center",
        email: "petcare@example.com",
        date: "2025-10-27",
        // Enriched data
        images: [
          "https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80"
        ],
        brand: "PetCare",
        rating: 4.8,
        totalReviews: 42,
        inStock: true,
        stock: 1
      },
      '2': {
        _id: '2',
        id: 2,
        title: "Persian Kitten",
        name: "Persian Kitten",
        category: "Pets",
        price: 150,
        location: "Chattogram",
        description: "Beautiful white Persian kitten, 2 months old.",
        sellerName: "Cat Lovers Hub",
        email: "catlover@example.com",
        date: "2025-10-28",
        images: [
          "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1514888286974-6d03bdeacba8?w=800&auto=format&fit=crop&q=80"
        ],
        brand: "Pure Breed",
        rating: 4.6,
        totalReviews: 31,
        inStock: true,
        stock: 2
      },
      '3': {
        _id: '3',
        id: 3,
        title: "Premium Dog Food 5kg",
        name: "Premium Dog Food 5kg",
        category: "Food",
        price: 25,
        location: "Sylhet",
        description: "High-quality dog food with natural ingredients.",
        sellerName: "Pet Food Store",
        email: "petfood@example.com",
        date: "2025-10-29",
        images: [
          "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80"
        ],
        brand: "Organic Pets",
        rating: 4.5,
        totalReviews: 128,
        inStock: true,
        stock: 42
      }
    };

    const baseProduct = products[productId] || {
      _id: productId,
      id: productId,
      title: "Sample Product",
      name: "Sample Product",
      category: "General",
      price: 49.99,
      location: "Dhaka",
      description: "This is a sample product description.",
      sellerName: "Sample Seller",
      email: "seller@example.com",
      date: new Date().toISOString().split('T')[0],
      images: [
        "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80"
      ],
      brand: "Sample Brand",
      rating: 4.0,
      totalReviews: 25,
      inStock: true,
      stock: 10
    };

    return enrichProductData(baseProduct);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    const cartItem = {
      productId: product.id,
      name: product.title,
      price: product.price,
      quantity: quantity,
      image: product.images[0]
    };
    
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = existingCart.findIndex(item => item.productId === product.id);
    
    if (existingIndex >= 0) {
      existingCart[existingIndex].quantity += quantity;
    } else {
      existingCart.push(cartItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    toast.success(`Added ${quantity} ${product.title} to cart!`);
    navigate('/cart');
  };

  const handleAddToWishlist = () => {
    setIsInWishlist(!isInWishlist);
    toast.success(isInWishlist ? 'Removed from wishlist!' : 'Added to wishlist!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} on PetCare`,
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
        user: "You",
        rating: rating,
        date: new Date().toISOString().split('T')[0],
        comment: reviewText,
        verified: false
      };
      
      const updatedProduct = {
        ...product,
        reviews: [newReview, ...product.reviews],
        totalReviews: product.totalReviews + 1,
        rating: ((product.rating * product.totalReviews) + rating) / (product.totalReviews + 1)
      };
      
      setProduct(updatedProduct);
      setReviewText('');
      setRating(5);
      toast.success('Review submitted successfully!');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading product details..." />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">😔</div>
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Link to="/products" className="btn btn-primary mt-4">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="text-gray-500 hover:text-blue-600">Home</Link>
            </li>
            <li>
              <span className="mx-2 text-gray-400">/</span>
              <Link to="/products" className="text-gray-500 hover:text-blue-600">Products</Link>
            </li>
            <li>
              <span className="mx-2 text-gray-400">/</span>
              <Link to={`/category/${product.category}`} className="text-gray-500 hover:text-blue-600">
                {product.category}
              </Link>
            </li>
            <li aria-current="page">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-800 font-medium">{product.title}</span>
            </li>
          </ol>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Multiple Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-[500px] overflow-hidden bg-gray-100 flex items-center justify-center">
                <img
                  src={product.images[selectedImage]}
                  alt={`${product.title} - View ${selectedImage + 1}`}
                  className="max-h-full max-w-full object-contain p-4"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80';
                  }}
                />
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto py-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === index 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-semibold rounded-full">
                    {product.category}
                  </span>
                  {product.tags?.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleAddToWishlist}
                    className={`p-2 rounded-full ${
                      isInWishlist 
                        ? 'text-red-500 bg-red-50' 
                        : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
                    }`}
                    aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <FaHeart className={isInWishlist ? 'fill-current' : ''} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full"
                    aria-label="Share product"
                  >
                    <FaShareAlt />
                  </button>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {product.title}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    {product.rating.toFixed(1)} ({product.totalReviews} reviews)
                  </span>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  {product.inStock ? `In Stock • ${product.stock} left` : 'Out of Stock'}
                </span>
              </div>

              {/* Location & Date */}
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{product.location}</span>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  <span>Listed: {product.date}</span>
                </div>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  {product.originalPrice > product.price && (
                    <p className="text-lg text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </p>
                  )}
                  <p className={`text-4xl font-bold ${
                    product.price === 0 ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {product.price === 0 ? 'FREE' : `$${product.price.toFixed(2)}`}
                  </p>
                  {product.discount > 0 && (
                    <span className="inline-block mt-2 px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full">
                      Save {product.discount}%
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <FaTag className="inline mr-2" />
                    Brand: <span className="font-semibold">{product.brand}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    SKU: <span className="font-mono">{product.sku}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-3">Key Features:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <FaCheck className="text-green-500 mr-2 text-sm" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              {product.category !== 'Pets' && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 w-16 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    {product.inStock ? `Only ${product.stock} items left!` : 'Currently unavailable'}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || product.category === 'Pets'}
                  className={`w-full py-3 text-white font-semibold rounded-lg transition-colors flex items-center justify-center ${
                    product.inStock && product.category !== 'Pets'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  aria-label={`Add ${product.title} to cart`}
                >
                  <FaShoppingCart className="mr-2" />
                  {product.category === 'Pets' ? 'Adopt Now' : 'Add to Cart'}
                </button>
                <button className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-colors">
                  {product.category === 'Pets' ? 'Contact Seller' : 'Buy Now'}
                </button>
              </div>
            </div>

            {/* Seller Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-4">Seller Information</h3>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaUser className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold">{product.sellerName}</p>
                  <p className="text-sm text-gray-600">Verified Seller</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Contact
                </button>
              </div>
              <div className="mt-4 space-y-2">
                {product.email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <FaEnvelope className="mr-2" />
                    <span>{product.email}</span>
                  </div>
                )}
                {product.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <FaPhone className="mr-2" />
                    <span>{product.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-12">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8" aria-label="Product details tabs">
              {['overview', 'specifications', 'reviews', 'related'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  aria-current={activeTab === tab ? 'page' : undefined}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Product Overview</h2>
                <div 
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specifications' && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Product Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex py-3 border-b border-gray-100">
                      <div className="w-1/2 font-medium text-gray-700">{key}</div>
                      <div className="w-1/2 text-gray-600">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Rating Summary */}
                  <div>
                    <div className="text-center mb-6">
                      <div className="text-5xl font-bold text-gray-900 mb-2">
                        {product.rating.toFixed(1)}
                      </div>
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600">
                        Based on {product.totalReviews} reviews
                      </p>
                    </div>
                    
                    {/* Add Review Form */}
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
                                className="text-2xl"
                                aria-label={`Rate ${star} stars`}
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
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows="3"
                            placeholder="Share your experience with this product..."
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
                  </div>

                  {/* Reviews List */}
                  <div className="lg:col-span-2">
                    <div className="space-y-6">
                      {product.reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                          <div className="flex justify-between items-start mb-2">
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
                                  {new Date(review.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                            </div>
                            {review.verified && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Related Items Tab */}
            {activeTab === 'related' && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Related Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {product.relatedProducts.map((related) => (
                    <Link 
                      key={related.id} 
                      to={`/product/${related.id}`}
                      className="group bg-gray-50 rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
                    >
                      <div className="h-48 overflow-hidden bg-gray-100">
                        <img
                          src={related.image}
                          alt={related.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600">
                          {related.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-bold text-blue-600">
                              ${related.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <FaStar className="text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm text-gray-600">{related.rating}</span>
                          </div>
                        </div>
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
  );
};

export default ProductDetails;