import React from 'react';

function Events() {
  const events = [
    { title: "Pet Adoption Day", date: "March 15, 2024", location: "Central Park" },
    { title: "Dog Training Workshop", date: "March 22, 2024", location: "Community Center" },
    { title: "Pet Health Seminar", date: "April 5, 2024", location: "Online" },
    { title: "Cat Care Workshop", date: "April 12, 2024", location: "Pet Store" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h1>
          <p className="text-lg text-gray-600 mb-8">Join our community events</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {events.map((event, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              <div className="flex items-center text-gray-600 mb-3">
                <span className="mr-4">📅 {event.date}</span>
                <span>📍 {event.location}</span>
              </div>
              <p className="text-gray-700 mb-4">Join us for this exciting event!</p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300">
                Register Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Events;