import React from 'react';

function Pricing() {
  const plans = [
    { name: "Basic", price: "$29", features: ["Basic Grooming", "Monthly Checkup", "Email Support"] },
    { name: "Premium", price: "$59", features: ["Full Grooming", "Weekly Checkup", "Priority Support", "Pet Training"] },
    { name: "Ultimate", price: "$99", features: ["All Premium Features", "24/7 Care", "Emergency Services", "Pet Insurance"] },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Pricing Plans</h1>
          <p className="text-lg text-gray-600 mb-8">Choose the perfect plan for your pet's needs</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {plans.map((plan, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
              <div className="text-4xl font-bold mb-6">{plan.price}<span className="text-sm text-gray-500">/month</span></div>
              <ul className="mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="mb-2">✓ {feature}</li>
                ))}
              </ul>
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-300">
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Pricing;