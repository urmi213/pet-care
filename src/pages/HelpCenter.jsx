import React from 'react';

function HelpCenter() {
  const helpCategories = [
    { title: "Account & Billing", issues: ["Update account", "Payment methods", "Subscription"] },
    { title: "Services", issues: ["Book appointments", "Service cancellation", "Emergency"] },
    { title: "Technical Support", issues: ["Website issues", "App problems", "Login help"] },
    { title: "General Questions", issues: ["Contact info", "Locations", "Hours"] },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-lg text-gray-600 mb-8">How can we help you today?</p>
        </div>

        <div className="mb-8 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Need Immediate Assistance?</h2>
          <p className="mb-2">📞 Call us: <span className="font-bold">1-800-PET-HELP</span></p>
          <p>✉️ Email: <span className="font-bold">support@petcare.com</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {helpCategories.map((category, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">{category.title}</h2>
              <ul className="space-y-2">
                {category.issues.map((issue, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="text-blue-500 mr-2">→</span>
                    <a href="#" className="text-gray-700 hover:text-blue-500">{issue}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HelpCenter;