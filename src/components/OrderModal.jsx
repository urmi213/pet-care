import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const OrderModal = ({ listing, onClose, onSuccess }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
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

    console.log('🔄 OrderModal received listing:', listing);
    console.log('👤 Current user:', user);

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
      quantity: 1,
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
    console.log('Form data:', formData);

    if (!formData.address.trim()) {
      toast.error('Please enter delivery address');
      return;
    }
    
    if (!formData.phone.trim()) {
      toast.error('Please enter phone number');
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
      status: 'pending'
    };
    
    console.log('🚀 Sending order to backend:', orderPayload);
    console.log('📡 API URL: https://backend-10-five.vercel.app/orders');

    setLoading(true);
    
    try {
      // ✅ CORRECTED URL - removed /api prefix
      const response = await axios.post(
        'https://backend-10-five.vercel.app/orders',  // শুধু /orders
        orderPayload,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );
      
      console.log('✅ Backend response:', response.data);
      
      if (response.data.success) {
        const successMessage = listing?.category === 'Pets' 
          ? '🎉 Adoption request submitted successfully!' 
          : '🎉 Order placed successfully!';
        
        toast.success(successMessage);
        
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }
      
    } catch (error) {
      console.error('❌ Order submission error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Detailed error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 404) {
          toast.error('API endpoint not found. Check backend URL.');
        } else if (error.response.status === 400) {
          toast.error(error.response.data?.message || 'Invalid request data');
        } else {
          toast.error(error.response.data?.message || 'Server error');
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received. Check if backend is running.');
        toast.error('Cannot connect to server. Make sure backend is running.');
        
        // Quick test: Check if backend is accessible
        try {
          const healthCheck = await axios.get('https://backend-10-five.vercel.app/health', { timeout: 3000 });
          console.log('Health check response:', healthCheck.data);
        } catch (healthError) {
          console.error('Backend health check failed:', healthError.message);
          toast.error('Backend server is not running. Start server first.');
        }
      } else {
        // Something happened in setting up the request
        toast.error('Failed to place order: ' + error.message);
      }
      
    } finally {
      setLoading(false);
    }
  };

  if (!listing || !user) {
    console.log('❌ OrderModal: Missing listing or user');
    return null;
  }

  console.log('🎯 OrderModal RENDERING with listing:', listing);

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
            <p className="text-xs text-blue-600 mt-1">
              API: https://backend-10-five.vercel.app/orders
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                name="buyerName"
                value={formData.buyerName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Email *
              </label>
              <input
                type="email"
                value={formData.email}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                readOnly
              />
            </div>
          </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                Preferred Date *
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              max={isPet ? 1 : 10}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isPet || loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes (Optional)
            </label>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              placeholder="Any special instructions..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20"
              disabled={loading}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">Order Summary</p>
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

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-bold text-lg ${
                isPet 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Processing...
                </>
              ) : isPet ? (
                'Submit Adoption Request'
              ) : (
                'Place Order'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;