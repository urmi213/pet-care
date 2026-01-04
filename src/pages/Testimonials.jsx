import React from 'react';

function Testimonials() {
  const testimonials = [
    { name: "John D.", text: "Amazing service! My dog loves coming here.", rating: 5 },
    { name: "Sarah M.", text: "Best pet care in town. Highly recommended!", rating: 5 },
    { name: "Mike R.", text: "Professional staff and excellent facilities.", rating: 4 },
    { name: "Lisa K.", text: "My cat always comes home happy and healthy.", rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Customer Reviews</h1>
          <p className="text-lg text-gray-600 mb-8">What our customers say about us</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < testimonial.rating ? '★' : '☆'}</span>
                  ))}
                </div>
                <span className="ml-2 font-semibold">{testimonial.name}</span>
              </div>
              <p className="text-gray-700 italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Testimonials;