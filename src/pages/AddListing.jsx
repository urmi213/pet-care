// src/pages/AddListing.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import { 
  FaUpload, 
  FaTag, 
  FaDollarSign, 
  FaMapMarkerAlt,
  FaAlignLeft,
  FaChevronLeft,
  FaPaw,
  FaCheckCircle
} from 'react-icons/fa';

const AddListing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Pets',
    price: '',
    location: 'Dhaka',
    description: '',
    image: '',
    contactEmail: '',
    contactPhone: ''
  });

  const categories = [
    { value: 'Pets', label: '🐶 Pets (Adoption)', color: 'bg-blue-100 text-blue-600' },
    { value: 'Food', label: '🍖 Pet Food', color: 'bg-green-100 text-green-600' },
    { value: 'Accessories', label: '🧸 Accessories', color: 'bg-purple-100 text-purple-600' },
    { value: 'Care Products', label: '💊 Pet Care Products', color: 'bg-red-100 text-red-600' }
  ];

  const locations = [
    'Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategorySelect = (category) => {
    setFormData(prev => ({
      ...prev,
      category
    }));
  };

  const handleLocationSelect = (location) => {
    setFormData(prev => ({
      ...prev,
      location
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a name for your listing');
      return false;
    }
    
    if (!formData.price || isNaN(formData.price) || formData.price < 0) {
      toast.error('Please enter a valid price');
      return false;
    }
    
    if (!formData.location) {
      toast.error('Please select a location');
      return false;
    }
    
    if (!formData.description.trim()) {
      toast.error('Please add a description');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    toast.loading('Adding your listing...');

    try {
      // Generate unique ID with timestamp
      const newListing = {
        _id: `listing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: formData.name.trim(),
        category: formData.category,
        price: parseInt(formData.price),
        location: formData.location,
        description: formData.description.trim(),
        image: formData.image || getDefaultImage(formData.category),
        contactEmail: formData.contactEmail || '',
        contactPhone: formData.contactPhone || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
        views: 0,
        isFeatured: false
      };

      console.log('📦 Creating new listing:', newListing);

      // ✅ Save to localStorage (Primary Storage)
      const existingListings = JSON.parse(localStorage.getItem('myListings') || '[]');
      const updatedListings = [...existingListings, newListing];
      localStorage.setItem('myListings', JSON.stringify(updatedListings));

      // ✅ Also save to all listings for display on home page
      const allListings = JSON.parse(localStorage.getItem('allListings') || '[]');
      localStorage.setItem('allListings', JSON.stringify([...allListings, newListing]));

      console.log('💾 Saved to localStorage. Total listings:', updatedListings.length);
      
      // Success animation
      toast.dismiss();
      toast.success(
        <div className="flex items-center gap-3">
          <FaCheckCircle className="text-green-500 text-xl" />
          <div>
            <p className="font-semibold">Listing Added Successfully!</p>
            <p className="text-sm">Redirecting to your listings...</p>
          </div>
        </div>,
        { duration: 3000 }
      );

      // Reset form
      setFormData({
        name: '',
        category: 'Pets',
        price: '',
        location: 'Dhaka',
        description: '',
        image: '',
        contactEmail: '',
        contactPhone: ''
      });

      // ✅ Redirect to MyListings after 2 seconds
      setTimeout(() => {
        navigate('/my-listings');
      }, 2000);

    } catch (error) {
      console.error('❌ Error adding listing:', error);
      toast.dismiss();
      toast.error('Failed to add listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDefaultImage = (category) => {
    const images = {
      'Pets': 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop',
      'Food': 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&auto=format&fit=crop',
      'Accessories': 'https://img.freepik.com/free-psd/pet-accessory-isolated_23-2151307114.jpg?semt=ais_hybrid&w=740&q=80',
      'Care Products': 'https://images.unsplash.com/photo-1560743641-3914f2c45636?w=600&auto=format&fit=crop'
    };
    return images[category] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop';
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaChevronLeft />
              <span>Back</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Add New Listing
              </h1>
              <p className="text-gray-600">List your pet or pet product</p>
            </div>
            
            <div className="w-20"></div> {/* Spacer */}
          </div>
          
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  step >= s 
                    ? 'bg-orange-500 border-orange-500 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {step > s ? <FaCheckCircle /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-24 h-1 ${step > s ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between text-sm text-gray-600 px-4">
            <span className={step >= 1 ? 'text-orange-600 font-semibold' : ''}>Basic Info</span>
            <span className={step >= 2 ? 'text-orange-600 font-semibold' : ''}>Details</span>
            <span className={step >= 3 ? 'text-orange-600 font-semibold' : ''}>Review & Submit</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">
                    <FaPaw className="inline mr-2 text-orange-500" />
                    What are you listing? *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Golden Retriever Puppy, Premium Dog Food, Cat Scratching Post"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition text-lg"
                    required
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">
                    <FaTag className="inline mr-2 text-orange-500" />
                    Select Category *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => handleCategorySelect(cat.value)}
                        className={`p-4 rounded-xl border-2 transition-all ${formData.category === cat.value ? 'border-orange-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'} ${cat.color}`}
                      >
                        <div className="text-2xl mb-2">{cat.label.split(' ')[0]}</div>
                        <div className="text-sm font-medium">{cat.label.split(' ')[1]}</div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">
                      <FaDollarSign className="inline mr-2 text-orange-500" />
                      Price (USD) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0 for free adoption"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                        min="0"
                        required
                      />
                    </div>
                    {formData.price == 0 && (
                      <p className="text-green-600 text-sm mt-2 font-medium">🎉 This will be marked as FREE Adoption!</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">
                      <FaMapMarkerAlt className="inline mr-2 text-orange-500" />
                      Location *
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {locations.slice(0, 4).map(loc => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => handleLocationSelect(loc)}
                          className={`py-2 rounded-lg border ${formData.location === loc ? 'bg-orange-100 border-orange-500 text-orange-600' : 'bg-gray-100 border-gray-300 hover:bg-gray-200'}`}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                    >
                      {locations.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full md:w-auto float-right px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all font-semibold shadow-lg hover:shadow-xl"
                  >
                    Next: Add Details →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">
                    <FaAlignLeft className="inline mr-2 text-orange-500" />
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Describe your listing in detail. Include important information like age, breed, health status, vaccinations, behavior, etc."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none resize-none"
                    required
                  />
                  <p className="text-gray-500 text-sm mt-2">
                    Tip: Detailed descriptions get more responses!
                  </p>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">
                    <FaUpload className="inline mr-2 text-orange-500" />
                    Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                  />
                  <p className="text-gray-500 text-sm mt-2">
                    Leave empty to use a default image based on category
                  </p>
                  
                  {/* Image Preview */}
                  {formData.image && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2 font-medium">Preview:</p>
                      <div className="relative w-40 h-40 rounded-xl overflow-hidden border-2 border-gray-300">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400?text=Invalid+Image+URL';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Contact Email (Optional)
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Contact Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      placeholder="+880 1XXX XXXXXX"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                    />
                  </div>
                </div>
                
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all font-semibold shadow-lg hover:shadow-xl"
                  >
                    Next: Review & Submit →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review & Submit */}
            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" />
                    Review Your Listing
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Please review your information before submitting
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-semibold">{formData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${categories.find(c => c.value === formData.category)?.color}`}>
                          {formData.category}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span className="text-xl font-bold text-gray-800">
                          {formData.price == 0 ? (
                            <span className="text-green-600">FREE Adoption</span>
                          ) : (
                            `$${formData.price}`
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-semibold">{formData.location}</span>
                      </div>
                      <div className="border-t pt-4">
                        <span className="text-gray-600 block mb-2">Description:</span>
                        <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
                          {formData.description || 'No description provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-blue-700 text-sm">
                    📢 <strong>Note:</strong> Your listing will be saved in your browser's local storage. 
                    It will be visible only to you in "My Listings" until you connect to a backend server.
                  </p>
                </div>
                
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                  >
                    ← Edit Details
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Adding Listing...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle />
                        Submit Listing
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow border">
            <h4 className="font-semibold text-gray-800 mb-2">💡 Tips for Best Results</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Use clear, high-quality images</li>
              <li>• Be honest about condition/health</li>
              <li>• Set a fair price</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border">
            <h4 className="font-semibold text-gray-800 mb-2">🛡️ Safety Guidelines</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Meet in public places</li>
              <li>• Verify buyer/seller identity</li>
              <li>• Use secure payment methods</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border">
            <h4 className="font-semibold text-gray-800 mb-2">🚀 Get Noticed</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Add multiple photos</li>
              <li>• Write detailed descriptions</li>
              <li>• Respond quickly to inquiries</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddListing;