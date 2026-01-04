import React from 'react';

function About() {
  const teamMembers = [
    { name: "Dr. Sarah Johnson", role: "Head Veterinarian", bio: "15+ years of experience in pet care", img: "👩‍⚕️" },
    { name: "Mike Rodriguez", role: "Pet Trainer", bio: "Specialized in behavioral training", img: "🧑‍🏫" },
    { name: "Lisa Chen", role: "Grooming Specialist", bio: "Certified pet groomer with 8 years experience", img: "💇‍♀️" },
    { name: "David Wilson", role: "Pet Nutritionist", bio: "Expert in pet diet and nutrition", img: "👨‍🔬" },
  ];

  const milestones = [
    { year: "2015", event: "Founded PetCare with a small clinic" },
    { year: "2017", event: "Expanded to include grooming services" },
    { year: "2019", event: "Opened second location downtown" },
    { year: "2021", event: "Launched online pet supply store" },
    { year: "2023", event: "Served over 10,000 happy pets" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About PetCare</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are passionate about providing exceptional care for your furry family members.
            Our mission is to ensure every pet receives the love and attention they deserve.
          </p>
        </div>

        {/* Our Story */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-700 mb-4">
                Founded in 2015, PetCare started as a small veterinary clinic with a simple goal:
                to provide affordable, high-quality pet care for our community.
              </p>
              <p className="text-gray-700 mb-4">
                Over the years, we've grown into a comprehensive pet care center offering veterinary
                services, grooming, training, and a wide range of pet supplies.
              </p>
              <p className="text-gray-700">
                Today, we're proud to serve thousands of pets and their owners, building lasting
                relationships based on trust and exceptional service.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-center">Our Mission</h3>
              <p className="text-gray-700 text-center italic">
                "To enhance the lives of pets and their owners through compassionate care,
                expert knowledge, and a commitment to excellence in every service we provide."
              </p>
            </div>
          </div>
        </div>

        {/* Our Team */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition duration-300">
                <div className="text-5xl mb-4">{member.img}</div>
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <p className="text-blue-500 font-semibold mb-2">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Journey</h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 transform -translate-y-1/2"></div>
            
            <div className="relative flex justify-between">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-6 h-6 bg-blue-500 rounded-full mb-4 relative z-10"></div>
                  <div className="text-center px-2">
                    <div className="font-bold text-lg mb-1">{milestone.year}</div>
                    <p className="text-gray-600 text-sm">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">❤️</div>
            <h3 className="text-xl font-bold mb-3">Compassion</h3>
            <p className="text-gray-600">We treat every pet with the same love and care we'd give our own.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">⭐</div>
            <h3 className="text-xl font-bold mb-3">Excellence</h3>
            <p className="text-gray-600">We strive for the highest standards in all our services.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🤝</div>
            <h3 className="text-xl font-bold mb-3">Community</h3>
            <p className="text-gray-600">We believe in building strong relationships with pet owners.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;