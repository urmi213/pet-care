import React from 'react';

function Services() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-lg text-gray-600 mb-8">Comprehensive pet care services tailored to your needs</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {/* Service cards */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-blue-500 text-3xl mb-4">🏥</div>
            <h3 className="text-xl font-semibold mb-2">Veterinary Care</h3>
            <p className="text-gray-600">Professional medical care for your pets with experienced veterinarians.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-blue-500 text-3xl mb-4">✂️</div>
            <h3 className="text-xl font-semibold mb-2">Grooming</h3>
            <p className="text-gray-600">Full grooming services to keep your pets clean and healthy.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-blue-500 text-3xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold mb-2">Boarding</h3>
            <p className="text-gray-600">Safe and comfortable boarding facilities for when you're away.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;