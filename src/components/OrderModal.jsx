import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaTimes, FaSave, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

const OrderModal = ({ listing, onClose, onSuccess }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    buyerName: '',
    email: '',
    productId: '',
    productName: '',
    price: 0,
    quantity: 1,
    address: '',
    phone: '',
    date: '',
    additionalNotes: ''
  });

  useEffect(() => {
    if (!listing || !user) return;

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const defaultDate = tomorrow.toISOString().split('T')[0];

    setFormData({
      buyerName: user.displayName || user.email?.split('@')[0] || '',
      email: user.email || '',
      productId: listing._id || '',
      productName: listing.name || listing.title || 'Product',
      price: listing.price || 0,
      quantity: listing.category === 'Pets' ? 1 : 1,
      address: '',
      phone: '',
      date: defaultDate,
      additionalNotes: ''
    });

  }, [listing, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('📝 Form submission started...');

    // Validation
    if (!formData.address.trim()) {
      toast.error('Please enter delivery address');
      return;
    }
    
    if (!formData.phone.trim()) {
      toast.error('Please enter phone number');
      return;
    }

    if (!formData.date) {
      toast.error('Please select a date');
      return;
    }

    const orderPayload = {
      productId: formData.productId,
      productName: formData.productName,
      buyerName: formData.buyerName.trim(),
      email: formData.email.trim().toLowerCase(),
      quantity: Number(formData.quantity) || 1,
      price: Number(formData.price) || 0,
      address: formData.address.trim(),
      phone: formData.phone.replace(/\s/g, ''),
      date: formData.date,
      additionalNotes: (formData.additionalNotes || '').trim(),
      status: 'pending',
      category: listing?.category || 'General'
    };
    
    console.log('🚀 Sending order to MongoDB:', orderPayload);

    setLoading(true);
    
    try {
      // Send to MongoDB
      console.log('📡 Sending to backend API...');
      const response = await axios.post(
        'https://backend-10-five.vercel.app/orders',
        orderPayload,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 8000
        }
      );
      
      console.log('✅ MongoDB response:', response.data);
      
      if (response.data.success) {
        // Show success toast
        const successMessage = listing?.category === 'Pets' 
          ? '🎉 Adoption request submitted successfully!' 
          : '🎉 Order placed successfully!';
        
        toast.success(successMessage, {
          duration: 3000,
          icon: <FaCheckCircle className="text-green-500" />
        });

        if (onSuccess) onSuccess();
        
        // Close modal after success
        setTimeout(() => {
          if (onClose) onClose();
        }, 1500);
      } else {
        throw new Error(response.data.message || 'Failed to save order');
      }
      
    } catch (error) {
      console.error('❌ Order submission error:', error);
      
      // Show error toast
      toast.error(
        error.response?.data?.message || 
        error.message || 
        'Failed to save order. Please try again.',
        { duration: 4000 }
      );
      
    } finally {
      setLoading(false);
    }
  };

  if (!listing || !user) {
    return null;
  }

  const isPet = listing.category === 'Pets';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10">
        
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isPet ? '🐕 Place Adoption Request' : '🛒 Place Order'}
            </h2>
            <p className="text-gray-600 text-sm">
              Product: <span className="font-semibold">{formData.productName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={loading}
          >
            <FaTimes className="text-xl text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Buyer Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-3">Buyer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buyer Name *
                </label>
                <input
                  type="text"
                  value={formData.buyerName}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-3">Product Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product ID *
                </label>
                <input
                  type="text"
                  value={formData.productId}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-sm"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.productName}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <input
                  type="text"
                  value={formData.price === 0 ? 'FREE' : `$${formData.price.toFixed(2)}`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Delivery Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House No, Street, Area, City"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                required
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pickup/Delivery Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={loading}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  max={isPet ? 1 : 10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={isPet || loading}
                />
                {isPet && (
                  <p className="text-xs text-gray-500 mt-1">Only 1 pet per adoption</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes (Optional)
              </label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                placeholder="Any special instructions or notes..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20"
                disabled={loading}
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-800">Order Summary</p>
                <p className="text-sm text-gray-600 mt-1">
                  {formData.productName} × {formData.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  {formData.price === 0 ? 'FREE' : `$${(formData.price * formData.quantity).toFixed(2)}`}
                </p>
                <p className="text-sm text-gray-500">
                  {isPet ? 'Adoption Fee' : 'Total Amount'}
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-bold text-lg ${
                isPet 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2`}
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                  Saving to MongoDB...
                </>
              ) : isPet ? (
                <>
                  <FaCheckCircle /> Submit Adoption Request
                </>
              ) : (
                <>
                  <FaCheckCircle /> Place Order
                </>
              )}
            </button>
          </div>

          {/* Info Message */}
          <div className="text-center text-sm text-gray-500 pt-2">
            <p className="flex items-center justify-center gap-1">
              <span className="text-green-500">✓</span>
              Order will be saved to MongoDB database
            </p>
            <p className="flex items-center justify-center gap-1 mt-1">
              <span className="text-green-500">✓</span>
              You will receive a confirmation
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;