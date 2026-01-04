import React from 'react';

function Favorites() {
  const favorites = [
    { id: 1, name: "Premium Dog Food", price: "$45.99", category: "Food", image: "🐕" },
    { id: 2, name: "Cat Scratching Post", price: "$29.99", category: "Toys", image: "🐱" },
    { id: 3, name: "Pet Carrier", price: "$59.99", category: "Accessories", image: "🎒" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Favorites</h1>
          <p className="text-lg text-gray-600 mb-8">Your saved items</p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No favorites yet</p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300">
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-4">{item.image}</span>
                  <div>
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-gray-500">{item.category}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">{item.price}</span>
                  <div className="space-x-2">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-300">
                      Buy Now
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      ❤️ Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;