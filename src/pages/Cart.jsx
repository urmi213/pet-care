import React, { useState } from 'react';
import { Link } from 'react-router';

function Cart() {
  const [cartItems, setCartItems] = useState([
    { 
      id: 1, 
      name: "Premium Dog Food", 
      price: 45.99, 
      quantity: 2, 
      image: "🐕",
      description: "High-quality dog food with essential nutrients"
    },
    { 
      id: 2, 
      name: "Cat Scratching Post", 
      price: 29.99, 
      quantity: 1, 
      image: "🐱",
      description: "Durable scratching post for cats"
    },
    { 
      id: 3, 
      name: "Pet Carrier Bag", 
      price: 59.99, 
      quantity: 1, 
      image: "🎒",
      description: "Comfortable carrier for small pets"
    },
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🛒</div>
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some products to your cart to see them here.</p>
            <Link to="/pets-supplies">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-300">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Cart Items ({cartItems.length})</h2>
                    <Link to="/pets-supplies" className="text-blue-500 hover:text-blue-600">
                      Continue Shopping
                    </Link>
                  </div>

                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center border-b border-gray-200 pb-6">
                        <div className="text-4xl mr-6">{item.image}</div>
                        
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-bold text-lg">{item.name}</h3>
                              <p className="text-gray-500 text-sm">{item.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">${item.price.toFixed(2)}</p>
                              <p className="text-sm text-gray-500">${(item.price * item.quantity).toFixed(2)} total</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 bg-gray-200 rounded-l-md flex items-center justify-center hover:bg-gray-300"
                              >
                                -
                              </button>
                              <span className="w-12 h-8 bg-gray-100 flex items-center justify-center">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 bg-gray-200 rounded-r-md flex items-center justify-center hover:bg-gray-300"
                              >
                                +
                              </button>
                            </div>
                            
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700 flex items-center"
                            >
                              <span className="mr-1">🗑️</span> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h3 className="text-lg font-bold mb-4">Promo Code</h3>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-r-lg transition duration-300">
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 mb-4">
                  Proceed to Checkout
                </button>

                <div className="text-center">
                  <p className="text-gray-500 text-sm mb-4">or</p>
                  <Link to="/pets-supplies">
                    <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-300">
                      Continue Shopping
                    </button>
                  </Link>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-bold mb-3">Accepted Payment Methods</h3>
                  <div className="flex space-x-4">
                    <span className="text-2xl">💳</span>
                    <span className="text-2xl">🏦</span>
                    <span className="text-2xl">📱</span>
                    <span className="text-2xl">💵</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-3">
                    Your payment information is secure and encrypted.
                  </p>
                </div>
              </div>

              {/* Secure Checkout Info */}
              <div className="bg-blue-50 rounded-lg p-4 mt-6">
                <div className="flex items-center">
                  <span className="text-blue-500 mr-3 text-2xl">🔒</span>
                  <div>
                    <h4 className="font-semibold">Secure Checkout</h4>
                    <p className="text-sm text-gray-600">All transactions are encrypted and secure</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recently Viewed Section */}
        {cartItems.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Recently Viewed</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { name: "Dog Toys", price: "$24.99", image: "🎾" },
                { name: "Cat Litter", price: "$19.99", image: "🐾" },
                { name: "Pet Bed", price: "$39.99", image: "🛏️" },
                { name: "Fish Food", price: "$12.99", image: "🐠" },
              ].map((product, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300">
                  <div className="text-4xl mb-3 text-center">{product.image}</div>
                  <h3 className="font-semibold text-center mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-center mb-3">{product.price}</p>
                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded transition duration-300">
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;